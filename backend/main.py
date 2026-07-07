from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import anthropic
import os
from gtts import gTTS
import whisper
import base64
import json
from pathlib import Path
from twilio.rest import Client
from datetime import datetime

app = FastAPI(title="DigitalSaathi API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── CLIENTS ──
claude_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
whisper_model = whisper.load_model("base")

SYSTEM_PROMPT = Path("../prompts/digitalsaathi_system_prompt.md").read_text()

# ── IN-MEMORY DB (replace with Firebase/PostgreSQL in prod) ──
users_db = {}
appointments_db = []
medicines_db = []
alerts_db = []
sessions_db = {}  # conversation history per user

# ── MODELS ──
class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "English"

class AppointmentModel(BaseModel):
    user_id: str
    patient_name: str
    age: int
    problem: str
    department: str
    hospital: str
    date: str
    time: str

class MedicineModel(BaseModel):
    user_id: str
    name: str
    dosage: str
    times: str  # "08:00,20:00"

class SOSModel(BaseModel):
    user_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserModel(BaseModel):
    name: str
    email: str
    password: str
    role: str  # elder | family
    language: str = "English"
    invite_code: Optional[str] = None  # for family signup

# ── AUTH ──
@app.post("/auth/signup")
def signup(user: UserModel):
    if any(u["email"] == user.email for u in users_db.values()):
        raise HTTPException(400, "Email already registered")
    user_id = str(len(users_db) + 1)
    invite_code = None
    linked_elder_id = None
    if user.role == "elder":
        import random, string
        invite_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    elif user.role == "family" and user.invite_code:
        elder = next((u for u in users_db.values() if u.get("invite_code") == user.invite_code), None)
        if not elder:
            raise HTTPException(400, "Invalid invite code")
        linked_elder_id = elder["id"]
    new_user = {
        "id": user_id, "name": user.name, "email": user.email,
        "password": user.password, "role": user.role,
        "language": user.language, "invite_code": invite_code,
        "linked_elder_id": linked_elder_id
    }
    users_db[user_id] = new_user
    return {k: v for k, v in new_user.items() if k != "password"}

@app.post("/auth/login")
def login(email: str, password: str):
    user = next((u for u in users_db.values() if u["email"] == email and u["password"] == password), None)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    return {k: v for k, v in user.items() if k != "password"}

# ── VOICE CHAT ──
@app.post("/voice/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    """Transcribe voice to text using Whisper"""
    contents = await audio.read()
    with open("/tmp/voice_input.wav", "wb") as f:
        f.write(contents)
    result = whisper_model.transcribe("/tmp/voice_input.wav")
    return {"text": result["text"], "language": result.get("language", "en")}

@app.post("/voice/chat")
async def voice_chat(req: ChatRequest):
    """Send message to Claude, get response, convert to speech"""
    # Get or create conversation history
    if req.user_id not in sessions_db:
        sessions_db[req.user_id] = []
    history = sessions_db[req.user_id]

    # Check for SOS trigger words
    sos_words = ["help", "உதவி", "காப்பாத்துங்க", "emergency", "मदद", "bachao"]
    if any(word in req.message.lower() for word in sos_words):
        return {
            "reply": "நான் இருக்கேன். உடனே உதவி அனுப்புறேன். I'm here. Sending help now!",
            "action": "SOS_TRIGGERED",
            "audio_base64": _text_to_speech_base64("நான் இருக்கேன். பயப்படாதீங்க.", req.language)
        }

    history.append({"role": "user", "content": req.message})
    response = claude_client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=SYSTEM_PROMPT,
        messages=history
    )
    reply = response.content[0].text
    history.append({"role": "assistant", "content": reply})
    sessions_db[req.user_id] = history[-20:]  # keep last 20 messages

    audio_b64 = _text_to_speech_base64(reply, req.language)
    return {"reply": reply, "audio_base64": audio_b64, "action": None}

def _text_to_speech_base64(text: str, language: str) -> str:
    lang_map = {"தமிழ்": "ta", "हिन्दी": "hi", "తెలుగు": "te", "മലയാളം": "ml"}
    lang_code = lang_map.get(language, "en")
    tts = gTTS(text=text, lang=lang_code, slow=True)
    tts.save("/tmp/response.mp3")
    with open("/tmp/response.mp3", "rb") as f:
        return base64.b64encode(f.read()).decode()

# ── APPOINTMENTS ──
@app.get("/appointments/slots")
def get_slots(hospital: str, department: str, date: str):
    """Get available appointment slots (mock data — replace with real API)"""
    mock_slots = {
        "Apollo": {
            "General": ["10:00", "11:30", "14:00", "16:00"],
            "Cardiologist": ["10:30", "14:30"],
            "Orthopedic": ["09:00", "11:00", "15:00"],
        }
    }
    slots = mock_slots.get(hospital, {}).get(department, ["10:00", "14:00", "16:00"])
    return {"hospital": hospital, "department": department, "date": date, "slots": slots}

@app.post("/appointments/book")
def book_appointment(appt: AppointmentModel):
    appt_dict = appt.dict()
    appt_dict["id"] = len(appointments_db) + 1
    appt_dict["booked_at"] = datetime.now().isoformat()
    appointments_db.append(appt_dict)

    # Notify caregiver
    _notify_caregiver(
        appt.user_id,
        f"📅 Appointment booked for {appt.patient_name} at {appt.hospital} — {appt.date} {appt.time}",
        "ROUTINE"
    )
    alerts_db.append({"type": "green", "msg": f"Appointment booked — {appt.hospital}", "time": "Just now"})
    return {"status": "booked", "appointment": appt_dict}

@app.get("/appointments/{user_id}")
def get_appointments(user_id: str):
    return [a for a in appointments_db if a["user_id"] == user_id]

# ── MEDICINES ──
@app.post("/medicines/add")
def add_medicine(med: MedicineModel):
    med_dict = med.dict()
    med_dict["id"] = len(medicines_db) + 1
    medicines_db.append(med_dict)
    return {"status": "added", "medicine": med_dict}

@app.get("/medicines/{user_id}")
def get_medicines(user_id: str):
    return [m for m in medicines_db if m["user_id"] == user_id]

@app.delete("/medicines/{medicine_id}")
def delete_medicine(medicine_id: int):
    global medicines_db
    medicines_db = [m for m in medicines_db if m["id"] != medicine_id]
    return {"status": "deleted"}

# ── EMERGENCY ──
@app.post("/emergency/sos")
def trigger_sos(sos: SOSModel):
    location_str = f"({sos.latitude}, {sos.longitude})" if sos.latitude else "Unknown"
    user = users_db.get(sos.user_id, {})

    # Alert caregiver IMMEDIATELY
    _notify_caregiver(
        sos.user_id,
        f"🚨 URGENT SOS from {user.get('name', 'Elder')} at {location_str}. Call them now!",
        "URGENT"
    )

    # Log alert
    alerts_db.insert(0, {
        "type": "red",
        "msg": f"SOS triggered by {user.get('name', 'Elder')}",
        "time": "Just now",
        "location": location_str
    })

    return {"status": "SOS triggered", "message": "Help is on the way. Family notified."}

@app.post("/emergency/fall")
def fall_detected(user_id: str):
    user = users_db.get(user_id, {})
    _notify_caregiver(
        user_id,
        f"⚠️ Fall detected for {user.get('name', 'Elder')}. Please check on them.",
        "URGENT"
    )
    return {"status": "Fall alert sent"}

# ── CAREGIVER ──
@app.get("/caregiver/alerts/{user_id}")
def get_alerts(user_id: str):
    return alerts_db

@app.get("/caregiver/dashboard/{user_id}")
def get_dashboard(user_id: str):
    user = users_db.get(user_id, {})
    elder_id = user.get("linked_elder_id")
    elder = users_db.get(elder_id, {}) if elder_id else {}
    return {
        "elder": {k: v for k, v in elder.items() if k != "password"} if elder else None,
        "appointments": [a for a in appointments_db if a["user_id"] == elder_id],
        "medicines": [m for m in medicines_db if m["user_id"] == elder_id],
        "alerts": alerts_db,
    }

def _notify_caregiver(user_id: str, message: str, alert_type: str):
    """Send WhatsApp/SMS via Twilio"""
    try:
        caregiver_number = os.getenv("CAREGIVER_PHONE", "")
        if caregiver_number and os.getenv("TWILIO_ACCOUNT_SID"):
            twilio_client.messages.create(
                body=f"[DigitalSaathi {alert_type}] {message}",
                from_=os.getenv("TWILIO_PHONE_NUMBER"),
                to=caregiver_number
            )
    except Exception as e:
        print(f"Twilio notification failed: {e}")

@app.get("/")
def root():
    return {"message": "DigitalSaathi API v2.0 running 🤝", "docs": "/docs"}
