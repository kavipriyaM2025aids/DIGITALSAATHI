# 🤝 DigitalSaathi

## AI-Powered Multilingual Voice Assistant for Elderly Citizens

> **"பேசினால் போதும், நாங்கள் இருக்கோம்"**  
> *"Just Speak. We're Here."*

---

## 📖 About the Project

DigitalSaathi is an AI-powered multilingual voice assistant designed to help elderly citizens access essential digital services through simple voice conversations in their preferred language.

The application reduces digital barriers by allowing senior citizens to perform daily tasks like booking hospital appointments, setting medicine reminders, sending emergency SOS alerts, and communicating with family members using natural speech.

This project was developed as a hackathon solution to improve digital accessibility and healthcare support for elderly people across India.

---

# ✨ Features

- 🎙️ Voice-first user interface
- 🌍 Multilingual support
  - Tamil
  - English
  - Hindi
  - Telugu
  - Malayalam
- 🏥 Hospital Appointment Booking
- 💊 Medicine Reminder System
- 🚨 One-Tap Emergency SOS
- 👨‍👩‍👧 Caregiver Dashboard
- 🛡️ AI Scam & Fraud Detection
- 🔐 Secure Role-Based Login
- 🤖 AI Voice Assistant
- 📱 Elder-Friendly Interface

---

# 🖥️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 |
| Backend | FastAPI (Python) |
| Database | MySQL |
| AI Model | Claude Sonnet 4.6 |
| Speech-to-Text | OpenAI Whisper |
| Text-to-Speech | Google gTTS |
| Notifications | Twilio SMS & WhatsApp |
| Future Automation | Playwright |

---

# 📂 Project Structure

```
DIGITALSAATHI
│
├── backend
│   ├── main.py
│   ├── requirements.txt
│   ├── routes
│   ├── models
│   └── ...
│
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/kavipriyaM2025aids/DIGITALSAATHI.git

cd DIGITALSAATHI
```

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# ⚙️ Backend Setup

```bash
cd backend

pip install -r requirements.txt

cp ../.env.example ../.env
```

Fill your API Keys inside `.env`

Start the server

```bash
uvicorn main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

# 🔑 Demo Login Credentials

## 👴 Elder Account

Email

```
kavi@gmail.com
```

Password

```
test123
```

---

## 👨‍👩‍👧 Family Account

Email

```
karthik@gmail.com
```

Password

```
test123
```

---

# 🎯 Problem Statement

Millions of elderly citizens struggle to use modern digital services due to

- Language barriers
- Complex mobile applications
- Limited digital literacy
- Difficulty accessing healthcare
- Emergency communication challenges

DigitalSaathi solves these problems through a simple AI-powered voice interface.

---

# 💡 Solution

DigitalSaathi enables elderly citizens to

- Speak naturally in their preferred language
- Book appointments
- Receive medicine reminders
- Contact caregivers instantly
- Detect scams and fraud
- Access important services without navigating complex applications

---

# 🚀 Future Enhancements

- 📹 Video Doctor Consultation
- 🏦 Banking Assistance
- 🧾 Government Scheme Support
- ❤️ Health Monitoring Dashboard
- 📍 Live GPS Tracking
- 🧠 Personalized AI Health Recommendations
- 📞 Voice Calling Integration

---

## 📸 Screenshots

### 🏠 Home Page

![Home Page](screenshots/home.png)

---

### 🔐 Login Page

![Login Page](screenshots/login.png)

---

### 👴 Elder Dashboard

![Elder Dashboard](screenshots/dashboard.png)

---

### 🎤 Voice Assistant

![Voice Assistant](screenshots/voice-assistant.png)

---

### 💊 Medicine Reminder

![Medicine Reminder](screenshots/reminder.png)
