import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─────────────────────────────────────────────
// THEME / DESIGN TOKENS (matching your screenshots)
// ─────────────────────────────────────────────
const COLORS = {
  cream: "#F5F0E8",
  white: "#FFFFFF",
  primary: "#C0533A",      // terracotta red (SOS, buttons)
  primaryHover: "#A8432C",
  sage: "#4A5E44",         // dark green (mic button, active nav)
  sageLight: "#E8EDE7",
  border: "#E0D9CF",
  text: "#1A1A1A",
  textMuted: "#6B6B6B",
  success: "#2D7A4F",
  warning: "#E67E22",
  danger: "#C0392B",
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${COLORS.cream}; color: ${COLORS.text}; }
  
  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; position: relative; background: ${COLORS.cream}; }

  /* ── AUTH PAGES ── */
  .auth-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
  .auth-card { background:${COLORS.white}; border-radius:16px; padding:32px 28px; width:100%; max-width:420px; box-shadow:0 2px 20px rgba(0,0,0,0.08); }
  .auth-logo { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
  .auth-logo-icon { width:44px; height:44px; border-radius:12px; background:${COLORS.primary}; display:flex; align-items:center; justify-content:center; font-size:20px; }
  .auth-logo-text h2 { font-size:20px; font-weight:700; }
  .auth-logo-text p { font-size:13px; color:${COLORS.textMuted}; }

  .form-group { margin-bottom:16px; }
  .form-label { display:block; font-size:14px; font-weight:600; margin-bottom:6px; }
  .form-input { width:100%; padding:14px 16px; border:1.5px solid ${COLORS.border}; border-radius:10px; font-size:15px; outline:none; transition:border 0.2s; background:${COLORS.white}; }
  .form-input:focus { border-color:${COLORS.sage}; }

  .btn { width:100%; padding:16px; border:none; border-radius:12px; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.2s; }
  .btn-primary { background:${COLORS.primary}; color:white; }
  .btn-primary:hover { background:${COLORS.primaryHover}; }
  .btn-sage { background:${COLORS.sage}; color:white; }
  .btn-sage:hover { background:#3a4e35; }
  .btn-outline { background:transparent; border:1.5px solid ${COLORS.border}; color:${COLORS.text}; }

  .auth-link { text-align:center; margin-top:16px; font-size:14px; color:${COLORS.textMuted}; }
  .auth-link a { color:${COLORS.sage}; font-weight:600; cursor:pointer; text-decoration:none; }

  /* ── ROLE SELECT ── */
  .role-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:24px; }
  .role-title { font-size:32px; font-weight:700; margin-bottom:8px; text-align:center; }
  .role-subtitle { color:${COLORS.textMuted}; margin-bottom:32px; text-align:center; }
  .role-cards { display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; max-width:500px; }
  .role-card { background:${COLORS.white}; border:1.5px solid ${COLORS.border}; border-radius:16px; padding:28px 20px; cursor:pointer; transition:all 0.2s; }
  .role-card:hover { border-color:${COLORS.sage}; box-shadow:0 4px 16px rgba(0,0,0,0.1); transform:translateY(-2px); }
  .role-card.selected { border-color:${COLORS.sage}; background:${COLORS.sageLight}; }
  .role-icon { font-size:32px; margin-bottom:12px; }
  .role-card h3 { font-size:16px; font-weight:700; margin-bottom:6px; }
  .role-card p { font-size:13px; color:${COLORS.textMuted}; line-height:1.5; }

  /* ── LANGUAGE SELECTOR ── */
  .lang-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
  .lang-btn { padding:10px 18px; border:1.5px solid ${COLORS.border}; border-radius:20px; background:${COLORS.white}; font-size:14px; cursor:pointer; transition:all 0.2s; }
  .lang-btn.active { border-color:${COLORS.sage}; background:${COLORS.sageLight}; color:${COLORS.sage}; font-weight:600; }

  /* ── MAIN LAYOUT ── */
  .main-wrap { padding-bottom:80px; }
  .top-bar { padding:16px 20px; display:flex; justify-content:space-between; align-items:center; }
  .top-greeting { font-size:13px; color:${COLORS.textMuted}; }
  .top-greeting strong { display:block; font-size:16px; color:${COLORS.text}; }
  .logout-btn { background:none; border:none; color:${COLORS.textMuted}; cursor:pointer; font-size:14px; display:flex; align-items:center; gap:4px; }

  /* ── INVITE BANNER ── */
  .invite-banner { margin:0 16px 16px; background:#EBF3FF; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:8px; font-size:13px; color:#1a5fb4; font-weight:500; }

  /* ── HOME PAGE ── */
  .home-hero { text-align:center; padding:32px 20px 24px; }
  .home-hero h1 { font-size:28px; font-weight:700; margin-bottom:8px; }
  .home-hero p { font-size:15px; color:${COLORS.textMuted}; }
  .mic-wrap { display:flex; justify-content:center; margin:24px 0; }
  .mic-btn { width:130px; height:130px; border-radius:50%; background:${COLORS.sage}; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:white; font-size:14px; font-weight:600; transition:all 0.2s; box-shadow:0 8px 24px rgba(74,94,68,0.35); }
  .mic-btn:hover { transform:scale(1.05); }
  .mic-btn.listening { background:${COLORS.primary}; animation: pulse 1.5s infinite; }
  .mic-icon { font-size:36px; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(192,83,58,0.4)} 50%{box-shadow:0 0 0 20px rgba(192,83,58,0)} }

  .quick-actions { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px; }
  .quick-btn { background:${COLORS.sageLight}; border:1.5px solid ${COLORS.border}; border-radius:12px; padding:18px; cursor:pointer; text-align:center; font-size:15px; font-weight:600; color:${COLORS.sage}; transition:all 0.2s; }
  .quick-btn:hover { background:${COLORS.sage}; color:white; }

  /* ── AI CHAT BUBBLE ── */
  .chat-section { margin:20px 16px; }
  .chat-bubble { background:${COLORS.white}; border-radius:16px; padding:16px; border:1.5px solid ${COLORS.border}; }
  .chat-bubble.ai { border-left:4px solid ${COLORS.sage}; }
  .chat-bubble.user { border-left:4px solid ${COLORS.primary}; margin-top:10px; }
  .chat-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:${COLORS.textMuted}; margin-bottom:6px; }
  .chat-text { font-size:16px; line-height:1.6; }

  /* ── PAGE HEADERS ── */
  .page-header { padding:20px 20px 0; }
  .page-header h1 { font-size:26px; font-weight:700; }

  /* ── CARDS ── */
  .card { background:${COLORS.white}; border-radius:14px; padding:20px; border:1.5px solid ${COLORS.border}; margin:16px 16px 0; }
  .card-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:${COLORS.textMuted}; margin-bottom:16px; }

  /* ── APPOINTMENT FORM ── */
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .form-select { width:100%; padding:14px 16px; border:1.5px solid ${COLORS.border}; border-radius:10px; font-size:15px; outline:none; background:${COLORS.white}; }
  .form-select:focus { border-color:${COLORS.sage}; }

  /* ── MEDICINE ── */
  .med-item { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid ${COLORS.border}; }
  .med-item:last-child { border-bottom:none; }
  .med-name { font-weight:600; font-size:15px; }
  .med-meta { font-size:13px; color:${COLORS.textMuted}; margin-top:2px; }
  .med-delete { background:none; border:none; color:${COLORS.danger}; cursor:pointer; font-size:18px; }

  /* ── SOS ── */
  .sos-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:calc(100vh - 160px); padding:20px; }
  .sos-title { font-size:28px; font-weight:700; color:${COLORS.danger}; margin-bottom:8px; }
  .sos-sub { color:${COLORS.textMuted}; margin-bottom:40px; }
  .sos-btn { width:180px; height:180px; border-radius:50%; background:${COLORS.danger}; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:white; font-size:20px; font-weight:700; transition:all 0.2s; box-shadow:0 8px 32px rgba(192,57,43,0.45); }
  .sos-btn:hover { transform:scale(1.05); }
  .sos-btn:active { transform:scale(0.97); }
  .sos-icon { font-size:48px; }
  .sos-active { background:${COLORS.white}; border-radius:16px; padding:24px; text-align:center; border:2px solid ${COLORS.danger}; margin-top:24px; width:100%; max-width:340px; }
  .sos-active h3 { color:${COLORS.danger}; font-size:18px; margin-bottom:8px; }

  /* ── SETTINGS ── */
  .settings-section { margin:16px 16px 0; }
  .settings-item { background:${COLORS.white}; border-radius:14px; padding:20px; border:1.5px solid ${COLORS.border}; margin-bottom:12px; }
  .settings-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:${COLORS.textMuted}; margin-bottom:12px; }
  .settings-value { font-size:16px; font-weight:600; }
  .settings-sub { font-size:14px; color:${COLORS.textMuted}; }
  .invite-code { font-size:28px; font-weight:700; letter-spacing:4px; color:${COLORS.primary}; margin:8px 0; }
  .invite-copy-btn { background:${COLORS.sageLight}; border:1px solid ${COLORS.border}; border-radius:8px; padding:8px 14px; font-size:13px; cursor:pointer; color:${COLORS.sage}; font-weight:600; }

  /* ── BOTTOM NAV ── */
  .bottom-nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:${COLORS.white}; border-top:1px solid ${COLORS.border}; display:flex; z-index:100; }
  .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; padding:12px 8px; cursor:pointer; transition:all 0.2s; border:none; background:none; }
  .nav-icon { font-size:22px; margin-bottom:4px; }
  .nav-label { font-size:11px; color:${COLORS.textMuted}; }
  .nav-item.active .nav-icon { color:${COLORS.primary}; }
  .nav-item.active .nav-label { color:${COLORS.primary}; font-weight:600; }

  /* ── ALERTS ── */
  .alert { padding:12px 16px; border-radius:10px; font-size:14px; margin:8px 0; }
  .alert-success { background:#d4edda; color:#155724; border:1px solid #c3e6cb; }
  .alert-error { background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; }
  .alert-info { background:#d1ecf1; color:#0c5460; border:1px solid #bee5eb; }

  /* ── EMPTY STATE ── */
  .empty-state { text-align:center; padding:40px 20px; color:${COLORS.textMuted}; font-size:15px; }

  /* ── FAMILY DASHBOARD ── */
  .stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px; margin-top:16px; }
  .stat-card { background:${COLORS.white}; border-radius:14px; padding:16px; border:1.5px solid ${COLORS.border}; text-align:center; }
  .stat-num { font-size:28px; font-weight:700; color:${COLORS.sage}; }
  .stat-label { font-size:13px; color:${COLORS.textMuted}; margin-top:4px; }
  .alert-item { display:flex; align-items:flex-start; gap:12px; padding:14px 0; border-bottom:1px solid ${COLORS.border}; }
  .alert-item:last-child { border-bottom:none; }
  .alert-dot { width:10px; height:10px; border-radius:50%; margin-top:4px; flex-shrink:0; }
  .dot-red { background:${COLORS.danger}; }
  .dot-yellow { background:${COLORS.warning}; }
  .dot-green { background:${COLORS.success}; }
  .alert-msg { font-size:14px; font-weight:500; }
  .alert-time { font-size:12px; color:${COLORS.textMuted}; margin-top:2px; }
`;

// ─────────────────────────────────────────────
// AUTH CONTEXT
// ─────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ─────────────────────────────────────────────
// MOCK DATA STORE
// ─────────────────────────────────────────────
let mockUsers = [
  { id: "1", name: "saras", email: "kavi@gmail.com", password: "test123", role: "elder", language: "English", inviteCode: "8MI86Z" },
  { id: "2", name: "Karthik", email: "karthik@gmail.com", password: "test123", role: "family", linkedElderId: "1" },
];
let mockAppointments = [];
let mockMedicines = [];
let mockAlerts = [
  { id: 1, type: "red", msg: "SOS triggered by saras", time: "10 mins ago" },
  { id: 2, type: "yellow", msg: "Medicine BP tablet missed (2nd time)", time: "2 hours ago" },
  { id: 3, type: "green", msg: "Appointment booked — Apollo, Tomorrow 4PM", time: "Yesterday" },
];

// ─────────────────────────────────────────────
// API SERVICE (calls Claude)
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DigitalSaathi, a voice-based AI assistant for elderly Indian citizens. 
Be warm, patient, and simple. Speak in the user's language (Tamil/Hindi/English).
Help with: hospital appointments, medicines, emergency info.
Collect details ONE question at a time. 
Current date: ${new Date().toLocaleDateString('en-IN')}.
Keep responses SHORT (2-3 sentences max) for voice readability.
Always end with a clear question or confirmation.`;

async function askClaude(messages) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Sorry, I couldn't understand. Please try again.";
  } catch {
    return "Network error. Please check your connection.";
  }
}

// ─────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────

// LOGIN
function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) { login(user); }
    else { setError("Invalid email or password."); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🤝</div>
          <div className="auth-logo-text">
            <h2>DigitalSaathi</h2>
            <p>Your voice health companion</p>
          </div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>Sign in</button>
        <div className="auth-link">New here? <a onClick={() => onNavigate("signup")}>Create account</a></div>
        <div className="auth-link" style={{marginTop:8, fontSize:12, color:"#999"}}>
          Demo: kavi@gmail.com / test123 (Elder) | karthik@gmail.com / test123 (Family)
        </div>
      </div>
    </div>
  );
}

// ROLE SELECT
function RoleSelectPage({ onSelect }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="role-wrap">
      <h1 className="role-title">Who are you?</h1>
      <p className="role-subtitle">Pick the role that fits you best.</p>
      <div className="role-cards">
        <div className={`role-card ${selected === "elder" ? "selected" : ""}`} onClick={() => setSelected("elder")}>
          <div className="role-icon">🧓</div>
          <h3>I am an Elder</h3>
          <p>Voice-first help — doctor booking, medicines, SOS.</p>
        </div>
        <div className={`role-card ${selected === "family" ? "selected" : ""}`} onClick={() => setSelected("family")}>
          <div className="role-icon">👨‍👩‍👧</div>
          <h3>I am Family / Caregiver</h3>
          <p>Monitor your loved one — alerts, medicines, SOS.</p>
        </div>
      </div>
      {selected && (
        <button className="btn btn-sage" style={{maxWidth:340, marginTop:24}} onClick={() => onSelect(selected)}>
          Continue as {selected === "elder" ? "Elder" : "Family / Caregiver"} →
        </button>
      )}
      <div className="auth-link" style={{marginTop:16}}>Already have an account? <a onClick={() => onSelect(null)}>Log in</a></div>
    </div>
  );
}

// SIGNUP
function SignupPage({ role, onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", language: "English", inviteCode: "" });
  const [error, setError] = useState("");
  const langs = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "മലയാളം"];

  const handleSignup = () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill all fields."); return; }
    if (role === "family" && !form.inviteCode) { setError("Please enter the invite code from your elder."); return; }
    const newUser = {
      id: Date.now().toString(), name: form.name, email: form.email,
      password: form.password, role, language: form.language,
      inviteCode: role === "elder" ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined,
      linkedElderId: role === "family" ? mockUsers.find(u => u.inviteCode === form.inviteCode)?.id : undefined,
    };
    mockUsers.push(newUser);
    login(newUser);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{background: role === "family" ? "#4A5E44" : "#C0533A"}}>🤝</div>
          <div className="auth-logo-text">
            <h2>Create {role === "elder" ? "Elder" : "Family"} account</h2>
            <p>DigitalSaathi</p>
          </div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Your name</label>
          <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
        </div>
        {role === "elder" && (
          <div className="form-group">
            <label className="form-label">Preferred language</label>
            <div className="lang-grid">
              {langs.map(l => (
                <button key={l} className={`lang-btn ${form.language === l ? "active" : ""}`} onClick={() => setForm({...form, language: l})}>{l}</button>
              ))}
            </div>
          </div>
        )}
        {role === "family" && (
          <div className="form-group">
            <label className="form-label">Invite code from elder</label>
            <input className="form-input" value={form.inviteCode} onChange={e => setForm({...form, inviteCode: e.target.value.toUpperCase()})} placeholder="6-character code" maxLength={6} />
            <p style={{fontSize:12, color:"#999", marginTop:4}}>Ask your elder for the 6-character code shown on their profile.</p>
          </div>
        )}
        <button className="btn btn-primary" onClick={handleSignup}>Create account</button>
        <div className="auth-link">Already have an account? <a onClick={() => onNavigate("login")}>Log in</a></div>
      </div>
    </div>
  );
}

// HOME (Elder)
function HomePage() {
  const { user } = useAuth();
  const [listening, setListening] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [aiReply, setAiReply] = useState("வணக்கம்! நான் DigitalSaathi. Book appointment, medicine, or just talk — tap the mic!");
  const [userSaid, setUserSaid] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice not supported in this browser. Please use Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = user.language === "தமிழ்" ? "ta-IN" : user.language === "हिन्दी" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      setUserSaid(text);
      const newHistory = [...chatHistory, { role: "user", content: text }];
      const reply = await askClaude(newHistory);
      setAiReply(reply);
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
      speak(reply);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = user.language === "தமிழ்" ? "ta-IN" : user.language === "हिन्दी" ? "hi-IN" : "en-IN";
      utt.rate = 0.85;
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <div className="main-wrap">
      <div className="top-bar">
        <div className="top-greeting">
          <span>Hello,</span>
          <strong>{user.name}</strong>
        </div>
      </div>
      {user.inviteCode && (
        <div className="invite-banner">
          ℹ️ Share invite code with family: <strong style={{marginLeft:4}}>{user.inviteCode}</strong>
        </div>
      )}
      <div className="home-hero">
        <h1>Tap to speak</h1>
        <p>Ask me anything — book a doctor, add a medicine, or just chat.</p>
      </div>
      <div className="mic-wrap">
        <button className={`mic-btn ${listening ? "listening" : ""}`} onClick={startListening}>
          <span className="mic-icon">🎤</span>
          <span>{listening ? "Listening..." : "Tap to speak"}</span>
        </button>
      </div>
      <div className="quick-actions">
        <button className="quick-btn">📅 Book Appointment</button>
        <button className="quick-btn">💊 Add Medicine</button>
      </div>
      {(aiReply || userSaid) && (
        <div className="chat-section">
          {userSaid && (
            <div className="chat-bubble user">
              <div className="chat-label">You said</div>
              <div className="chat-text">"{userSaid}"</div>
            </div>
          )}
          <div className="chat-bubble ai" style={{marginTop: userSaid ? 10 : 0}}>
            <div className="chat-label">DigitalSaathi</div>
            <div className="chat-text">{aiReply}</div>
          </div>
          {aiReply && (
            <button onClick={() => speak(aiReply)} style={{marginTop:8, background:"none", border:"1px solid #ccc", borderRadius:8, padding:"6px 14px", fontSize:13, cursor:"pointer", color:"#4A5E44"}}>
              🔊 Play again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// DOCTOR / APPOINTMENT
function DoctorPage() {
  const [form, setForm] = useState({ name: "", age: "", problem: "", department: "General", hospital: "", date: "", time: "10:30" });
  const [success, setSuccess] = useState(false);
  const depts = ["General", "Cardiologist", "Orthopedic", "Ophthalmologist", "Endocrinologist", "Gastroenterologist", "Dermatologist"];
  const times = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","16:00","16:30","17:00"];

  const handleBook = () => {
    if (!form.name || !form.hospital || !form.date) { alert("Please fill all required fields."); return; }
    mockAppointments.push({ ...form, id: Date.now(), bookedAt: new Date().toISOString() });
    mockAlerts.unshift({ id: Date.now(), type: "green", msg: `Appointment booked — ${form.hospital}, ${form.date} at ${form.time}`, time: "Just now" });
    setSuccess(true);
    setForm({ name: "", age: "", problem: "", department: "General", hospital: "", date: "", time: "10:30" });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="main-wrap">
      <div className="page-header"><h1>Book Appointment</h1></div>
      {success && <div className="alert alert-success" style={{margin:"12px 16px"}}>✅ Appointment booked successfully! Your family has been notified.</div>}
      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Patient name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input className="form-input" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="68" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Health problem</label>
          <input className="form-input" value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} placeholder="Describe your symptoms..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-select" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Hospital *</label>
            <input className="form-input" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})} placeholder="Apollo, Fortis..." />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <select className="form-select" value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
              {times.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleBook}>Book Appointment</button>
      </div>
      {mockAppointments.length > 0 && (
        <div className="card" style={{marginTop:12}}>
          <div className="card-title">My Appointments</div>
          {mockAppointments.map(a => (
            <div key={a.id} className="med-item">
              <div>
                <div className="med-name">{a.hospital} — {a.department}</div>
                <div className="med-meta">{a.date} at {a.time} • {a.name}</div>
              </div>
              <span style={{fontSize:18}}>📅</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MEDICINE
function MedicinePage() {
  const [form, setForm] = useState({ name: "", dosage: "1 tablet", times: "08:00,20:00" });
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    if (!form.name) { alert("Please enter medicine name."); return; }
    mockMedicines.push({ ...form, id: Date.now() });
    setSuccess(true);
    setForm({ name: "", dosage: "1 tablet", times: "08:00,20:00" });
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = (id) => {
    const i = mockMedicines.findIndex(m => m.id === id);
    if (i !== -1) mockMedicines.splice(i, 1);
    // force re-render
    setForm(f => ({...f}));
  };

  return (
    <div className="main-wrap">
      <div className="page-header"><h1>Add Medicine</h1></div>
      {success && <div className="alert alert-success" style={{margin:"12px 16px"}}>✅ Medicine added! Reminders scheduled.</div>}
      <div className="card">
        <div className="form-group">
          <label className="form-label">Medicine name</label>
          <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Metformin, BP Tablet..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Dosage</label>
            <input className="form-input" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} placeholder="1 tablet" />
          </div>
          <div className="form-group">
            <label className="form-label">Times (HH:MM, comma-sep)</label>
            <input className="form-input" value={form.times} onChange={e => setForm({...form, times: e.target.value})} placeholder="08:00,20:00" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>Add Medicine</button>
      </div>
      <div className="card" style={{marginTop:12}}>
        <div className="card-title">My Medicines</div>
        {mockMedicines.length === 0
          ? <div className="empty-state">No medicines yet.</div>
          : mockMedicines.map(m => (
            <div key={m.id} className="med-item">
              <div>
                <div className="med-name">{m.name}</div>
                <div className="med-meta">{m.dosage} • {m.times}</div>
              </div>
              <button className="med-delete" onClick={() => handleDelete(m.id)}>🗑</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// SOS
function SOSPage() {
  const { user } = useAuth();
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSOS = () => {
    setTriggered(true);
    setCountdown(5);
    mockAlerts.unshift({ id: Date.now(), type: "red", msg: `🚨 SOS triggered by ${user.name}`, time: "Just now" });
    // Speak
    if ("speechSynthesis" in window) {
      const utt = new SpeechSynthesisUtterance("நான் இருக்கேன். உடனே உதவி அனுப்புறேன். I'm here. Sending help right now.");
      window.speechSynthesis.speak(utt);
    }
  };

  useEffect(() => {
    if (triggered && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [triggered, countdown]);

  return (
    <div className="main-wrap">
      <div className="sos-wrap">
        <h1 className="sos-title">EMERGENCY SOS</h1>
        <p className="sos-sub">Press to alert family</p>
        {!triggered ? (
          <button className="sos-btn" onClick={handleSOS}>
            <span className="sos-icon">⚠️</span>
            <span>SOS</span>
          </button>
        ) : (
          <div style={{textAlign:"center"}}>
            <button className="sos-btn" style={{opacity:0.7, cursor:"default"}}>
              <span className="sos-icon">🆘</span>
              <span>SENT</span>
            </button>
            <div className="sos-active">
              <h3>🚨 Help is on the way!</h3>
              <p style={{fontSize:14, color:"#555", marginBottom:8}}>Your family has been alerted with your location.</p>
              <p style={{fontSize:14, color:"#555"}}>108 ambulance call initiated.</p>
              <p style={{fontSize:13, color:"#999", marginTop:12}}>நான் இருக்கேன். பயப்படாதீங்க.</p>
              <button className="btn btn-outline" style={{marginTop:16}} onClick={() => setTriggered(false)}>Cancel SOS</button>
            </div>
          </div>
        )}
        {!triggered && (
          <p style={{fontSize:13, color:"#999", marginTop:24, textAlign:"center"}}>
            This will immediately alert all family members and call 108.
          </p>
        )}
      </div>
    </div>
  );
}

// SETTINGS (Elder)
function SettingsPage() {
  const { user, logout } = useAuth();
  const langs = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "മലയാളം"];
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(user.inviteCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="main-wrap">
      <div className="page-header"><h1>Settings</h1></div>
      <div className="settings-section">
        <div className="settings-item">
          <div className="settings-label">YOUR PROFILE</div>
          <div className="settings-value">{user.name}</div>
          <div className="settings-sub">{user.email}</div>
        </div>
        {user.inviteCode && (
          <div className="settings-item">
            <div className="settings-label">INVITE CODE FOR FAMILY</div>
            <div className="invite-code">{user.inviteCode}</div>
            <button className="invite-copy-btn" onClick={copyCode}>
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <p style={{fontSize:12, color:"#999", marginTop:8}}>Share this code with your family so they can link to your account.</p>
          </div>
        )}
        <div className="settings-item">
          <div className="settings-label">LANGUAGE</div>
          <div className="lang-grid">
            {langs.map(l => (
              <button key={l} className={`lang-btn ${user.language === l ? "active" : ""}`}>{l}</button>
            ))}
          </div>
        </div>
        <button className="btn btn-outline" style={{margin:"0 0 16px"}} onClick={logout}>
          → Log out
        </button>
      </div>
    </div>
  );
}

// FAMILY DASHBOARD
function FamilyDashboard() {
  const { user, logout } = useAuth();
  const elder = mockUsers.find(u => u.id === user.linkedElderId);
  const [tab, setTab] = useState("alerts");

  return (
    <div className="main-wrap">
      <div className="top-bar">
        <div className="top-greeting">
          <span>Family Dashboard</span>
          <strong>{user.name}</strong>
        </div>
        <button className="logout-btn" onClick={logout}>→ Log out</button>
      </div>
      {elder && (
        <div className="invite-banner">
          👤 Monitoring: <strong style={{marginLeft:4}}>{elder.name}</strong>
        </div>
      )}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{mockAppointments.length}</div>
          <div className="stat-label">Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{mockMedicines.length}</div>
          <div className="stat-label">Medicines</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:"#C0392B"}}>{mockAlerts.filter(a => a.type === "red").length}</div>
          <div className="stat-label">Urgent Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:"#2D7A4F"}}>✓</div>
          <div className="stat-label">Status: Safe</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex", gap:8, padding:"16px 16px 0"}}>
        {["alerts","appointments","medicines"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"8px 14px", borderRadius:20, border:"1.5px solid", fontSize:13, cursor:"pointer", fontWeight:600,
            borderColor: tab === t ? "#4A5E44" : "#E0D9CF",
            background: tab === t ? "#E8EDE7" : "white",
            color: tab === t ? "#4A5E44" : "#6B6B6B"
          }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "alerts" && (
        <div className="card">
          <div className="card-title">Recent Alerts</div>
          {mockAlerts.length === 0
            ? <div className="empty-state">No alerts yet.</div>
            : mockAlerts.map(a => (
              <div key={a.id} className="alert-item">
                <div className={`alert-dot dot-${a.type}`}></div>
                <div>
                  <div className="alert-msg">{a.msg}</div>
                  <div className="alert-time">{a.time}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
      {tab === "appointments" && (
        <div className="card">
          <div className="card-title">Appointments</div>
          {mockAppointments.length === 0
            ? <div className="empty-state">No appointments booked yet.</div>
            : mockAppointments.map(a => (
              <div key={a.id} className="med-item">
                <div>
                  <div className="med-name">{a.hospital} — {a.department}</div>
                  <div className="med-meta">{a.date} at {a.time} • {a.name}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
      {tab === "medicines" && (
        <div className="card">
          <div className="card-title">Medicines</div>
          {mockMedicines.length === 0
            ? <div className="empty-state">No medicines added yet.</div>
            : mockMedicines.map(m => (
              <div key={m.id} className="med-item">
                <div>
                  <div className="med-name">{m.name}</div>
                  <div className="med-meta">{m.dosage} • {m.times}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// BOTTOM NAV
function BottomNav({ active, onChange }) {
  const items = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "doctor", icon: "🩺", label: "Doctor" },
    { id: "medicine", icon: "💊", label: "Medicine" },
    { id: "sos", icon: "🆘", label: "SOS" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => onChange(item.id)}>
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
function AppContent() {
  const [authPage, setAuthPage] = useState("login"); // login | role | signup
  const [signupRole, setSignupRole] = useState(null);
  const [page, setPage] = useState("home");
  const { user, logout } = useAuth();

  if (!user) {
    if (authPage === "role") return <RoleSelectPage onSelect={role => { if (role) { setSignupRole(role); setAuthPage("signup"); } else { setAuthPage("login"); } }} />;
    if (authPage === "signup") return <SignupPage role={signupRole} onNavigate={setAuthPage} />;
    return <LoginPage onNavigate={p => { if (p === "signup") setAuthPage("role"); else setAuthPage(p); }} />;
  }

  // Family gets their own dashboard
  if (user.role === "family") return <FamilyDashboard />;

  // Elder app
  const pages = { home: <HomePage />, doctor: <DoctorPage />, medicine: <MedicinePage />, sos: <SOSPage />, settings: <SettingsPage /> };

  return (
    <div>
      {pages[page] || <HomePage />}
      <BottomNav active={page} onChange={setPage} />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <style>{css}</style>
      <div className="app">
        <AppContent />
      </div>
    </AuthContext.Provider>
  );
}
