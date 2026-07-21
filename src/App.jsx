import { useState, useEffect } from "react";
import {
  Zap, BookOpen, ClipboardCheck, ListOrdered, Sparkles, MessageSquare,
  Link2, Target, ArrowLeft, Loader2, CheckCircle2, XCircle, Star,
  ChevronRight, Cpu, Menu, X, Activity,
  GraduationCap, Mail, Phone, MapPin, Shield, Globe, Users, Lock
} from "lucide-react";

import StrainGaugeSim from "./simulations/StrainGaugeSim";
import BridgeCircuitsSim from "./simulations/BridgeCircuitsSim";
import InteractiveWiringSim from "./simulations/InteractiveWiringSim";

/* ---------------------------------------------------------------
   DESIGN TOKENS — circuit-board palette: ink navy shell, copper
   accent (component/trace color), teal secondary, warm paper canvas
--------------------------------------------------------------- */
const C = {
  shell: "#121826",      // header / sidebar ink
  shellSoft: "#1c2436",
  canvas: "#eef1ee",     // page background
  card: "#ffffff",
  copper: "#c1712f",
  copperDark: "#8f5320",
  teal: "#1f7a72",
  ink: "#1b2430",
  muted: "#68707c",
  border: "#dfe3df",
  border2: "#2a3346",
};

/* ---------------------------------------------------------------
   EXPERIMENT DATA
--------------------------------------------------------------- */
import { EXPERIMENTS } from './data/experiments.js';

const RATINGS = {
  "strain-gauge": 4.5, "lvdt": 4, "wheatstone-bridge": 4.5, "thermocouple": 3.5,
  "rtd": 4, "thermistor": 3.5, "photodiode-ldr": 4, "piezoelectric": 3.5,
  "hall-effect": 4, "load-cell": 4.5, "capacitive-displacement": 3.5, "op-amp": 4,
};

function StarRating({ rating, size = 15 }) {
  return (
    <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const pct = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span key={i} style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
            <Star size={size} color={C.border} style={{ position: "absolute", top: 0, left: 0 }} />
            <span style={{ position: "absolute", top: 0, left: 0, width: `${pct}%`, overflow: "hidden" }}>
              <Star size={size} color={C.copper} fill={C.copper} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const TABS = [
  { id: "aim", label: "Aim", icon: Target },
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "simulation", label: "Simulation", icon: Activity, badge: "BETA" },
  { id: "pretest", label: "Pretest", icon: ClipboardCheck },
  { id: "procedure", label: "Procedure", icon: ListOrdered },
  { id: "viva", label: "AI Viva Prep", icon: Sparkles, badge: "NEW" },
  { id: "posttest", label: "Posttest", icon: ClipboardCheck },
  { id: "references", label: "References", icon: Link2 },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

/* ---------------------------------------------------------------
   QUIZ
--------------------------------------------------------------- */
function Quiz({ questions }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div style={{ color: C.muted, fontSize: 14, padding: "24px 0" }}>
        Quiz for this experiment is being added — check back soon.
      </div>
    );
  }

  const score = questions.reduce((s, q, i) => s + (picked[i] === q.answer ? 1 : 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {questions.map((q, i) => (
        <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, background: C.card }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: C.ink }}>{i + 1}. {q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, oi) => {
              const isPicked = picked[i] === oi;
              const showResult = checked;
              const isCorrect = oi === q.answer;
              let border = C.border, bg = "transparent";
              if (showResult && isCorrect) { border = C.teal; bg = "#e8f5f3"; }
              else if (showResult && isPicked && !isCorrect) { border = "#c0392b"; bg = "#fbeae8"; }
              else if (isPicked) { border = C.copper; }
              return (
                <button
                  key={oi}
                  onClick={() => !checked && setPicked(p => ({ ...p, [i]: oi }))}
                  style={{
                    textAlign: "left", padding: "9px 12px", borderRadius: 8,
                    border: `1.5px solid ${border}`, background: bg, cursor: checked ? "default" : "pointer",
                    fontSize: 14, color: C.ink, display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {showResult && isCorrect && <CheckCircle2 size={15} color={C.teal} />}
                  {showResult && isPicked && !isCorrect && <XCircle size={15} color="#c0392b" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => setChecked(true)}
          disabled={Object.keys(picked).length < questions.length}
          style={{
            background: C.copper, color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            opacity: Object.keys(picked).length < questions.length ? 0.5 : 1,
          }}
        >
          Check answers
        </button>
        {checked && <span style={{ fontSize: 14, color: C.muted }}>Score: <b style={{ color: C.ink }}>{score}/{questions.length}</b></span>}
        {checked && (
          <button onClick={() => { setPicked({}); setChecked(false); }} style={{ background: "none", border: "none", color: C.teal, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   AI VIVA PREP
--------------------------------------------------------------- */
function VivaPrep({ exp }) {
  const [state, setState] = useState({ status: "idle" }); // idle | loading | done | error
  const [data, setData] = useState(null);

  async function generate() {
    setState({ status: "loading" });
    try {
      const prompt = `You are an engineering professor. Generate 6 viva-voce questions with concise (2-3 sentence) answers for an undergraduate Electrical Engineering lab experiment titled "${exp.title}". Also list 4 key concepts students must know, one short phrase each.
Return ONLY valid JSON, no markdown, no preamble, in this exact shape:
{"questions":[{"q":"...","a":"..."}],"concepts":["...","...","...","..."]}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await res.json();
      const text = (json.content || []).find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setData(parsed);
      setState({ status: "done" });
    } catch (e) {
      setState({ status: "error" });
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "#f4ece0", color: C.copperDark, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={13} /> AI-GENERATED
        </div>
        <span style={{ fontSize: 13, color: C.muted }}>Fresh viva questions for "{exp.title}", generated on demand.</span>
      </div>

      {state.status !== "done" && (
        <button
          onClick={generate}
          disabled={state.status === "loading"}
          style={{
            background: C.shell, color: "#fff", border: "none", borderRadius: 8,
            padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {state.status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {state.status === "loading" ? "Generating…" : "Generate viva questions"}
        </button>
      )}

      {state.status === "error" && (
        <div style={{ marginTop: 14, color: "#c0392b", fontSize: 14 }}>
          Couldn't generate questions right now. Please try again.
        </div>
      )}

      {state.status === "done" && data && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.copperDark, marginBottom: 8, letterSpacing: 0.4 }}>KEY CONCEPTS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(data.concepts || []).map((c, i) => (
                <span key={i} style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 13, color: C.ink }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(data.questions || []).map((qa, i) => (
              <details key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", background: C.card }}>
                <summary style={{ fontWeight: 600, cursor: "pointer", color: C.ink }}>{i + 1}. {qa.q}</summary>
                <p style={{ marginTop: 8, color: C.muted, fontSize: 14, lineHeight: 1.5 }}>{qa.a}</p>
              </details>
            ))}
          </div>
          <button onClick={generate} style={{ alignSelf: "flex-start", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.ink, cursor: "pointer" }}>
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   HOME
--------------------------------------------------------------- */
function Home({ onOpen, unlocked }) {
  return (
    <div style={{ background: C.canvas, minHeight: "100vh" }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: C.shell,
        padding: "40px",
        textAlign: "center",
        borderBottom: `1px solid ${C.border2}`,
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 72px)", // 72px is roughly the height of the top navbar
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/hero-bg.mp4" 
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, filter: "blur(4px)" }}
        />
        {/* Dark Overlay for Text Readability */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(18, 24, 38, 0.75)", zIndex: 1 }}></div>
        
        {/* Content Container */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Abstract background decorative elements */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(31,122,114,0.15) 0%, transparent 70%)", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", bottom: -150, right: -50, width: 500, height: 500, background: "radial-gradient(circle, rgba(193,113,47,0.1) 0%, transparent 70%)", borderRadius: "50%" }}></div>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ background: "rgba(193, 113, 47, 0.15)", border: `1px solid rgba(193, 113, 47, 0.3)`, color: C.copper, padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <Cpu size={16} /> ELECTRICAL & ELECTRONICS ENGINEERING
          </div>
        </div>
        
        <h1 style={{ fontSize: 56, fontWeight: 800, color: "#fff", margin: "0 auto 24px", lineHeight: 1.1, maxWidth: 900, letterSpacing: "-0.5px" }}>
          Sensors Modeling &amp; <span style={{ color: C.teal }}>Simulation Lab</span>
        </h1>
        
        <p style={{ color: "#a0abc0", fontSize: 18, lineHeight: 1.6, maxWidth: 650, margin: "0 auto 40px" }}>
          A premium virtual environment to explore the working principles, governing equations, and characteristics of physical sensors through interactive simulations.
        </p>
        
        <button 
          onClick={() => { document.getElementById("experiments-grid").scrollIntoView({ behavior: "smooth" }); }}
          style={{
            background: C.copper, color: "#fff", border: "none", borderRadius: 8,
            padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(193, 113, 47, 0.4)", display: "inline-flex", alignItems: "center", gap: 10,
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(193, 113, 47, 0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(193, 113, 47, 0.4)"; }}
        >
          Explore Experiments <ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} />
        </button>
        </div>

        {/* Floating Cover Sticker */}
        <div style={{
          position: "absolute", bottom: "50px", right: "50px", zIndex: 10,
          width: "120px", height: "120px", 
          background: "linear-gradient(135deg, #c1712f 0%, #8f5320 100%)", 
          borderRadius: "50%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.3)",
          transform: "rotate(-10deg)",
          border: "4px dashed rgba(255,255,255,0.3)",
          userSelect: "none"
        }}>
          <Zap size={32} style={{ marginBottom: 4 }} color="#fff" />
          <span style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "1px" }}>V-LAB</span>
          <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.9 }}>CERTIFIED</span>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 32, padding: "60px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {[
          { icon: Target, title: "Objective-Driven", desc: "Understand real-world deviations by plotting static and dynamic characteristics of ideal sensors." },
          { icon: Activity, title: "Interactive Simulations", desc: "Tweak physical parameters in real-time and observe immediate graph responses on virtual instruments." },
          { icon: Sparkles, title: "AI Viva Prep", desc: "Prepare for your practical exams with dynamically generated viva-voce questions and key concepts." }
        ].map((feature, i) => (
          <div key={i} style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#e8f5f3", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <feature.icon size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: "0 0 12px" }}>{feature.title}</h3>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Experiments Grid */}
      <div id="experiments-grid" className="reveal" style={{ padding: "20px 40px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>Available Experiments</h2>
            <p style={{ color: C.muted, fontSize: 16, margin: 0 }}>Select an experiment to begin the virtual lab session.</p>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.copperDark, background: "#f4ece0", padding: "6px 12px", borderRadius: 999 }}>
            {EXPERIMENTS.length} MODULES
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            { title: "DC Bridges", filter: exp => exp.id === "wheatstone-bridge" || exp.id.includes("kelvin") },
            { title: "AC Bridges", filter: exp => exp.tag.startsWith("AC-") },
            { title: "Sensors & Transducers", filter: exp => exp.id !== "wheatstone-bridge" && !exp.id.includes("kelvin") && !exp.tag.startsWith("AC-") }
          ].map(category => (
            <div key={category.title}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 16, borderBottom: `2px solid ${C.border}`, paddingBottom: 8 }}>{category.title}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                {EXPERIMENTS.filter(category.filter).map(exp => {
                  const isLocked = false;
                  return (
            <button
              key={exp.id}
              onClick={() => { if(!isLocked) onOpen(exp.id); }}
              style={{
                textAlign: "left", background: isLocked ? "rgba(240, 242, 245, 0.8)" : "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)",
                border: `1px solid rgba(255, 255, 255, 0.8)`, borderRadius: 16, padding: "24px",
                cursor: isLocked ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", gap: 12,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)", transition: "all 0.25s ease",
                opacity: isLocked ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if(isLocked) return;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.background = "#ffffff";
                const arrow = e.currentTarget.querySelector('.exp-arrow');
                if(arrow) {
                  arrow.style.transform = "translateX(4px)";
                  arrow.style.color = C.copper;
                }
              }}
              onMouseLeave={e => {
                if(isLocked) return;
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.03)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
                const arrow = e.currentTarget.querySelector('.exp-arrow');
                if(arrow) {
                  arrow.style.transform = "none";
                  arrow.style.color = C.muted;
                }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <span style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, fontWeight: 700,
                  color: isLocked ? C.muted : C.teal, background: isLocked ? "#e2e8f0" : "#e8f5f3", padding: "4px 10px", borderRadius: 6,
                }}>{exp.tag}</span>
                {!isLocked && <StarRating rating={RATINGS[exp.id] ?? 4} size={14} />}
                {isLocked && <Lock size={16} color={C.muted} />}
              </div>
              <div style={{ fontWeight: 800, color: C.ink, fontSize: 18, lineHeight: 1.3, marginTop: 4 }}>{exp.title}</div>
              <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{exp.aim}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 16, width: "100%" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: isLocked ? C.muted : C.ink }}>
                  {isLocked ? "Module Locked" : "Launch lab module"}
                </span>
                {!isLocked && <ArrowLeft className="exp-arrow" size={16} color={C.muted} style={{ transform: "rotate(180deg)", transition: "all 0.2s ease" }} />}
              </div>
            </button>
          );
        })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Section */}
      <div className="reveal" style={{ background: "#f8f9fa", padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.ink, margin: "0 0 16px" }}>Faculty In-Charge</h2>
            <p style={{ color: C.muted, fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
              Our dedicated instructors ensure a rigorous and industry-aligned practical curriculum.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
            {[
              { name: "Dr. Sowmmiya U", role: "Faculty In-Charge", specialty: "Power Electronics" },
              { name: "Dr. Usha S", role: "Faculty In-Charge", specialty: "Electrical & Electronics Engineering" }
            ].map((faculty, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 32, width: 300, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#e8f5f3", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Users size={40} />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 20, color: C.ink }}>{faculty.name}</h3>
                <div style={{ color: C.copper, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{faculty.role}</div>
                <div style={{ color: C.muted, fontSize: 14 }}>Specialty: {faculty.specialty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   EXPERIMENT DETAIL
--------------------------------------------------------------- */
function Detail({ exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen }) {
  return (
    <div>
      {/* Top Breadcrumb Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "20px 60px", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: C.muted }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: 0 }}>
          <ArrowLeft size={16} /> Course Overview
        </button>
        <span>/</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>Module {exp.id === "strain-gauge" ? "1" : "X"}: {exp.title}</span>
      </div>

      <div style={{ display: "flex", gap: 40, padding: "40px 60px 80px", alignItems: "flex-start", maxWidth: 1400, margin: "0 auto" }}>
        {/* sidebar */}
        <div style={{
          width: sidebarOpen ? 240 : 0, overflow: "hidden", flexShrink: 0, transition: "width 0.15s",
          position: "sticky", top: 116,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, paddingLeft: 16, marginBottom: 12 }}>
              Module Contents
            </div>
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8,
                    background: isActive ? "#f0fdfa" : "transparent", 
                    color: isActive ? "#0f766e" : "#64748b",
                    border: "none", cursor: "pointer", fontSize: 15, fontWeight: isActive ? 700 : 500, textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={18} style={{ color: isActive ? "#0d9488" : "#94a3b8" }} />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {t.badge && !isActive && <span style={{ fontSize: 10, background: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>{t.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        {/* content */}
        <div style={{ flex: 1, minWidth: 0, background: "#fff", border: `1px solid #e2e8f0`, borderRadius: 16, padding: "56px 64px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, fontWeight: 700, color: "#475569", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: 6 }}>{exp.tag}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Required Module</span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 32px", letterSpacing: -0.5 }}>{exp.title}</h2>

          {tab === "aim" && (
            <div>
              <Section title="Aim">{exp.aim}</Section>
              <Section title="Objectives">
                <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.8 }}>
                  {exp.objectives.map((o, i) => <li key={i}>{o}</li>)}
                </ol>
              </Section>
            </div>
          )}

          {tab === "theory" && (
            <Section title="Theory">
              <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.theory.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              {exp.id === "bridge-circuits" && (
                <div style={{ marginTop: 24, padding: "20px", background: "#f8fafc", borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: C.ink, marginBottom: 4 }}>Original Lab Manual</div>
                    <div style={{ fontSize: 13, color: C.muted }}>View the source documentation and reference diagrams.</div>
                  </div>
                  <a 
                    href="/experiment_2_manual.pdf" 
                    target="_blank"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, color: C.primary, fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
                  >
                    <BookOpen size={18} />
                    Read PDF
                  </a>
                </div>
              )}
            </Section>
          )}

          {tab === "simulation" && (
            <Section title="Interactive Simulation">
              {exp.id === "strain-gauge" ? (
                <StrainGaugeSim />
              ) : exp.id === "maxwell-lc-bridge" ? (
                <InteractiveWiringSim type="maxwell" />
              ) : exp.id === "schering-bridge" ? (
                <InteractiveWiringSim type="schering" />
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted, background: "#f8f9fa", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <Activity size={32} color={C.border} style={{ marginBottom: 12 }} />
                  <div>The interactive simulation for {exp.title} is currently under development.</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Check back soon!</div>
                </div>
              )}
            </Section>
          )}

          {tab === "pretest" && <Section title="Pretest"><Quiz questions={exp.pretest} /></Section>}
          {tab === "posttest" && <Section title="Posttest"><Quiz questions={exp.posttest} /></Section>}

          {tab === "procedure" && (
            <Section title="Procedure">
              <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.procedure.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </Section>
          )}

          {tab === "viva" && <Section title="AI Viva Prep"><VivaPrep exp={exp} /></Section>}

          {tab === "references" && (
            <Section title="References">
              <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9 }}>
                {exp.references.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>
          )}

          {tab === "feedback" && <Section title="Feedback"><Feedback /></Section>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>{title}</div>
      <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function BridgeSimWrapper() {
  const [type, setType] = useState("maxwell");
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button 
          onClick={() => setType("maxwell")} 
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, background: type === "maxwell" ? C.teal : "#f1f5f9", color: type === "maxwell" ? "#fff" : "#64748b" }}
        >
          Maxwell's Bridge
        </button>
        <button 
          onClick={() => setType("schering")} 
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, background: type === "schering" ? C.teal : "#f1f5f9", color: type === "schering" ? "#fff" : "#64748b" }}
        >
          Schering's Bridge
        </button>
      </div>
      {/* We use a key so it completely unmounts and remounts the simulator, resetting wires when switched */}
      <InteractiveWiringSim key={type} bridgeType={type} />
    </div>
  );
}

function Feedback() {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  if (sent) return <div style={{ color: C.teal, fontWeight: 600 }}>Thanks — your feedback helps improve this lab.</div>;
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Star size={22} fill={n <= rating ? C.copper : "none"} color={n <= rating ? C.copper : C.border} />
          </button>
        ))}
      </div>
      <textarea
        placeholder="Any comments about this experiment?"
        style={{ width: "100%", minHeight: 90, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
      />
      <button
        onClick={() => setSent(true)}
        style={{ marginTop: 12, background: C.copper, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
      >
        Submit feedback
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   APP SHELL
--------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState("home");
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("aim");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    const observerTimeout = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearTimeout(observerTimeout);
    };
  }, [view]);

  const active = EXPERIMENTS.find(e => e.id === activeId);

  function openExperiment(id) {
    setActiveId(id);
    setTab("aim");
    setView("detail");
  }

  return (
    <div style={{ background: C.canvas, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* Sticky Navbar */}
      <div style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: (scrolled || view !== "home") ? "rgba(18, 24, 38, 0.85)" : "transparent",
        backdropFilter: (scrolled || view !== "home") ? "blur(12px)" : "none",
        borderBottom: (scrolled || view !== "home") ? `3px solid ${C.copper}` : "3px solid transparent",
        transition: "all 0.3s ease"
      }}>
        <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <Menu size={28} />
            </button>
            <button onClick={() => setView("home")} style={{ display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: C.copper, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={24} color="#fff" />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>State University</div>
              <div style={{ color: "#c3c9d6", fontSize: 12, fontWeight: 600 }}>Dept. of Electrical Engineering</div>
            </div>
          </button>
          </div>
          <div style={{ display: "flex", gap: 28, fontSize: 14, color: "#c3c9d6", fontWeight: 600 }}>
            <span style={{ color: view === "home" ? "#fff" : "#c3c9d6", cursor: "pointer" }} onClick={() => setView("home")}>Home</span>
            <span style={{ cursor: "pointer" }}>About Lab</span>
            <span style={{ cursor: "pointer" }}>Faculty</span>
            <span style={{ cursor: "pointer" }}>Contact</span>
          </div>
        </div>
      </div>

      {view === "home" && <Home onOpen={openExperiment} unlocked={unlocked} />}
      {view === "detail" && active && (
        <div style={{ paddingTop: 76 }}>
          <Detail exp={active} tab={tab} setTab={setTab} onBack={() => setView("home")} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* Official Footer */}
      <div style={{ background: C.shell, color: "#c3c9d6", borderTop: `4px solid ${C.copper}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px", display: "flex", flexWrap: "wrap", gap: 60, justifyContent: "space-between" }}>
          
          {/* Branding & Contact */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.copper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Globe size={18} color="#fff" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>State University</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24, maxWidth: 280 }}>
              Empowering the next generation of engineers through cutting-edge practical education.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><MapPin size={16} color={C.copper} /> 123 University Road, Tech Campus</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Phone size={16} color={C.copper} /> +1 (555) 123-4567</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Mail size={16} color={C.copper} /> eeedepartment@state.edu</div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Admissions</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Academic Calendar</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Department Faculty</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Student Portal</a>
            </div>
          </div>

          {/* Legal */}
          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>Legal & Resources</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Shield size={14} /> Privacy Policy</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Terms of Service</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Accessibility Statement</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Lab Safety Guidelines</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: `1px solid ${C.border2}`, padding: "20px 40px", textAlign: "center", fontSize: 13, color: "#8891a3" }}>
          © {new Date().getFullYear()} State University, Department of Electrical & Electronics Engineering. All rights reserved.
        </div>
      </div>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Sidebar Menu */}
      <div style={{
        position: "fixed", top: 0, left: menuOpen ? 0 : "-350px", width: "350px", height: "100vh",
        background: "rgba(18, 24, 38, 0.75)", backdropFilter: "blur(24px)", zIndex: 1000, transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        boxShadow: menuOpen ? "20px 0 40px rgba(0,0,0,0.5)" : "none",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        <div style={{ padding: "32px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #c1712f 0%, #8f5320 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={18} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>V-Lab</span>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}><X size={18} /></button>
        </div>
        

        <div style={{ padding: "24px" }}>
          <h4 style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>Curriculum</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { title: "DC Bridges", filter: exp => exp.id === "wheatstone-bridge" || exp.id.includes("kelvin") },
              { title: "AC Bridges", filter: exp => exp.tag.startsWith("AC-") },
              { title: "Sensors & Transducers", filter: exp => exp.id !== "wheatstone-bridge" && !exp.id.includes("kelvin") && !exp.tag.startsWith("AC-") }
            ].map(category => {
              const exps = EXPERIMENTS.filter(category.filter);
              if (exps.length === 0) return null;
              return (
                <div key={category.title}>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>{category.title}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {exps.map((exp, i) => {
                      const isLocked = false;
                      return (
                <button
                  key={exp.id}
                  onClick={() => {
                    if (!isLocked) {
                      openExperiment(exp.id);
                      setMenuOpen(false);
                    }
                  }}
                  style={{
                    background: isLocked ? "transparent" : "rgba(255,255,255,0.04)", 
                    border: isLocked ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: 12, textAlign: "left", padding: "12px",
                    display: "flex", alignItems: "center", gap: 14, cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.4 : 1, transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ 
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: isLocked ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)", 
                    color: isLocked ? "rgba(255,255,255,0.4)" : "#fff", 
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 
                  }}>
                    {isLocked ? <Lock size={14} /> : i + 1}
                  </div>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
      </div>
    </div>
  );
}
