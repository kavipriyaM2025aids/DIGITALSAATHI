# 🤝 DigitalSaathi
**A Multilingual Voice-Based AI Action Agent for Elderly Citizens**

> *"பேசினால் போதும், நாங்கள் இருக்கோம்" — Just Speak. We're Here.*

---

## Features
- 🗣️ Voice-first interaction (Tamil, Hindi, English, Telugu, Malayalam)
- 🏥 Hospital appointment booking
- 💊 Medicine reminders
- 🚨 SOS emergency alert
- 👨‍👩‍👧 Caregiver family dashboard
- 🕵️ Scam/fraud detection
- 🤝 Role-based login (Elder / Family)

---

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env  # fill in your API keys
uvicorn main:app --reload
```

### Demo Credentials
- **Elder:** kavi@gmail.com / test123
- **Family:** karthik@gmail.com / test123

---

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18 |
| Backend | FastAPI (Python) |
| AI | Claude claude-sonnet-4-6 (Anthropic) |
| STT | OpenAI Whisper |
| TTS | Google TTS (gTTS) |
| Notifications | Twilio SMS/WhatsApp |
| Browser Automation | Playwright (future) |

---

*Built for Hackathon — Solving digital exclusion for 140M+ elderly Indians*
