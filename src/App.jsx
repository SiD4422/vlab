import { useState, useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  Zap, BookOpen, ClipboardCheck, ListOrdered, Sparkles, MessageSquare,
  Link2, Target, ArrowLeft, Loader2, CheckCircle2, XCircle, Star,
  ChevronRight, Cpu, Menu, X, Activity,
  GraduationCap, Mail, Phone, MapPin, Shield, Globe, Users, Lock, LogOut,
  Search, Sun, Moon, Check, BarChart2, Download, Eye, Camera, FileText } from "lucide-react";

import StrainGaugeSim from "./simulations/StrainGaugeSim";
import UnifiedBridgeSim, { BridgeProcedurePanel, BRIDGES, initBridgeState, CircuitSVG } from "./simulations/UnifiedBridgeSim";
import LoginScreen from "./LoginScreen";
import { auth } from "./services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

/* ---------------------------------------------------------------
   DESIGN TOKENS — circuit-board palette: ink navy shell, copper
   accent (component/trace color), teal secondary, warm paper canvas
--------------------------------------------------------------- */
const C = {
  shell: "var(--shell)",
  shellSoft: "var(--shellSoft)",
  canvas: "var(--canvas)",
  card: "var(--card)",
  copper: "var(--copper)",
  copperDark: "var(--copperDark)",
  teal: "var(--teal)",
  ink: "var(--ink)",
  muted: "var(--muted)",
  border: "var(--border)",
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
  { id: "posttest", label: "Posttest", icon: ClipboardCheck },
  { id: "report", label: "Lab Report", icon: FileText },
  { id: "references", label: "References", icon: Link2 },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

/* ---------------------------------------------------------------
   QUIZ
--------------------------------------------------------------- */
function Quiz({ questions, onComplete }) {
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
          onClick={() => { setChecked(true); if(onComplete) onComplete(); }}
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
   CIRCUIT SANDBOX
--------------------------------------------------------------- */
function CircuitSandbox({ onCapture, onRecord }) {
  const iframeRef = useRef(null);
  
  const handleCapture = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'CAPTURE_SNAPSHOT' }, '*');
    }
  };

  const handleRecord = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'RECORD_READING' }, '*');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#e8f5f3', color: C.teal, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} /> INTERACTIVE
          </div>
          <span style={{ fontSize: 13, color: C.muted }}>Build and test real circuits with live physics simulation.</span>
        </div>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: '#0a0e14' }}>
        <div style={{ padding: '8px 14px', background: '#080b11', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: '#8a96ac', fontFamily: 'ui-monospace,monospace', fontWeight: 600 }}>
            ⚡ CIRCUIT SANDBOX — Drag components, wire them up, and watch the physics simulate live.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {onRecord && (
              <button 
                onClick={handleRecord}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 10px', borderRadius: 6, border: '1px solid #1f7a72', background: 'transparent', color: '#1f7a72', cursor: 'pointer' }}>
                <CheckCircle2 size={12} /> Add Blank Row
              </button>
            )}
            {onCapture && (
              <button 
                onClick={handleCapture}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 10px', borderRadius: 6, border: '1px solid #1f7a72', background: '#1f7a72', color: '#fff', cursor: 'pointer' }}>
                <Camera size={12} /> Capture Snapshot
              </button>
            )}
          </div>
        </div>
        <iframe
          ref={iframeRef}
          src="/circuit-sandbox.html"
          style={{ width: '100%', height: '560px', border: 'none', display: 'block' }}
          title="Circuit Sandbox"
          allow="fullscreen"
        />
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
        <b style={{ color: C.ink }}>How to use:</b> Click a component (Resistor, Battery etc.) from the left panel → click on the grid to place it → drag from a component's terminal dot to another to wire them → watch the live readings update in the Inspector panel on the right. Press <b>R</b> to rotate a selected component, <b>Delete</b> to remove it.
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   HOME
--------------------------------------------------------------- */
function Home({ onOpen, unlocked, collapsedCategories, toggleCategory, searchQuery, setSearchQuery, completed }) {
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
          { icon: Activity, title: "Live Graphing & Export", desc: "Watch a live deviation graph update as you balance the bridge. Export your readings as a CSV file for lab reports." },
          { icon: Zap, title: "Circuit Sandbox", desc: "Build custom circuits with a full drag-and-drop physics simulator — resistors, capacitors, inductors, AC sources, and more." }
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
            <div style={{ position: "relative", marginTop: 16, width: "100%", maxWidth: 400 }}>
              <Search size={18} color={C.muted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Search experiments by name or tag..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px 12px 42px", color: C.ink, fontSize: 15, boxSizing: "border-box" }}
              />
            </div>
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
          ].map(category => {
            const isCollapsed = collapsedCategories[category.title];
            return (
            <div key={category.title}>
              <div 
                onClick={() => toggleCategory(category.title)}
                style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between", 
                  cursor: "pointer", borderBottom: `2px solid ${C.border}`, paddingBottom: 8, marginBottom: 16 
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>{category.title}</h3>
                <ChevronRight 
                  size={20} 
                  color={C.muted} 
                  style={{ 
                    transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)", 
                    transition: "transform 0.2s ease" 
                  }} 
                />
              </div>
              {!isCollapsed && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                {EXPERIMENTS.filter(category.filter).filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.tag.toLowerCase().includes(searchQuery.toLowerCase())).map(exp => {
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
              )}
            </div>
          )})}
        </div>
      </div>

      
    </div>
  );
}


function Team() {
  return (
    <div style={{ paddingTop: 76, minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Faculty Section */}
      <div className="reveal" style={{ background: "var(--canvas)", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", margin: "0 0 16px" }}>Faculty In-Charge</h2>
            <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
              Our dedicated instructors ensure a rigorous and industry-aligned practical curriculum.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
            {[
              { name: "Dr. Sowmmiya U", role: "Faculty In-Charge", department: "Electrical and Electronics Engineering", institute: "SRMIST, Kattankulathur", email: "sowmmiyu@srmist.edu.in", image: "/sowmmiya.png", description: "Research interests include grid integration of renewable sources, condition monitoring, and power transfer in wind energy systems." },
              { name: "Dr. Usha S", role: "Faculty In-Charge", department: "Electrical and Electronics Engineering", institute: "SRMIST, Kattankulathur", email: "ushas@srmist.edu.in", image: "/usha.png", description: "Research focuses on Power Electronics Converters, Stability analysis of Induction motors, and Electric drive systems." }
            ].map((faculty, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: "40px 32px", width: 360, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 4px 14px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--shell)", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", overflow: "hidden" }}>
                  {faculty.image ? (
                    <img src={faculty.image} alt={faculty.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  ) : (
                    <Users size={40} />
                  )}
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 22, color: "var(--ink)", fontWeight: 700 }}>{faculty.name}</h3>
                <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "6px 16px", borderRadius: 20, fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 20 }}>
                  {faculty.role}
                </div>
                
                <div style={{ color: "var(--text)", fontSize: 16, marginBottom: 6 }}>{faculty.department}</div>
                <div style={{ color: "var(--muted)", fontSize: 15, marginBottom: 16 }}>{faculty.institute}</div>
                
                {faculty.description && (
                  <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, textAlign: "center" }}>
                    {faculty.description}
                  </div>
                )}
                
                {faculty.email && (
                  <a href={`mailto:${faculty.email}`} style={{ marginTop: "auto", background: "#3b82f6", color: "#fff", padding: "12px 24px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontWeight: 600, fontSize: 15, width: "100%", justifyContent: "center", boxSizing: "border-box" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    {faculty.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="reveal" style={{ background: "var(--canvas)", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", margin: "0 0 16px" }}>Developers</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
            {[
              { name: "Abhyudaya Singh", role: "UI/UX Designer", department: "Electrical and Electronics Engineering", institute: "SRMIST, Kattankulathur", email: "abhyudaya@srmist.edu.in", image: "/abhyudaya_pro.jpg" },
              { name: "Siddharth Kumar", role: "Developer", department: "Electrical and Electronics Engineering", institute: "SRMIST, Kattankulathur", email: "Sk6751@srmist.edu.in", image: "/siddharth_pro.jpg" }
            ].map((faculty, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: "40px 32px", width: 360, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 4px 14px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--shell)", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", overflow: "hidden" }}>
                  {faculty.image ? (
                    <img src={faculty.image} alt={faculty.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  ) : (
                    <Users size={40} />
                  )}
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 22, color: "var(--ink)", fontWeight: 700 }}>{faculty.name}</h3>
                <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "6px 16px", borderRadius: 20, fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 20 }}>
                  {faculty.role}
                </div>
                
                <div style={{ color: "var(--text)", fontSize: 16, marginBottom: 6 }}>{faculty.department}</div>
                <div style={{ color: "var(--muted)", fontSize: 15, marginBottom: 16 }}>{faculty.institute}</div>
                
                {faculty.description && (
                  <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, textAlign: "center" }}>
                    {faculty.description}
                  </div>
                )}
                
                {faculty.email && (
                  <a href={`mailto:${faculty.email}`} style={{ marginTop: "auto", background: "#3b82f6", color: "#fff", padding: "12px 24px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontWeight: 600, fontSize: 15, width: "100%", justifyContent: "center", boxSizing: "border-box" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    {faculty.email}
                  </a>
                )}
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
function Detail({ exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen, markCompleted, bridgeSims, setBridgeSims }) {
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === 'SNAPSHOT_RESULT') {
        setBridgeSims(prev => {
          const current = prev[exp.id] || { rows: [], snapshots: [] };
          return {
            ...prev,
            [exp.id]: {
              ...current,
              snapshots: [...(current.snapshots || []), { id: Date.now(), svg: e.data.svgDataUrl, graph: e.data.graphDataUrl }]
            }
          };
        });
        alert('Circuit captured and added to your Lab Report!');
      } else if (e.data.type === 'READING_RESULT') {
        // Since the sandbox is free-form, we cannot reliably map arbitrary 
        // resistors to bridge arms (P, Q, S, R). We simply add a blank row 
        // for the student to manually record their meter readings.
        let newRow = { id: Date.now() };
        setBridgeSims(prev => {
          const current = prev[exp.id] || { rows: [], snapshots: [] };
          return {
            ...prev,
            [exp.id]: { ...current, rows: [...current.rows, newRow] }
          };
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [exp.id, setBridgeSims]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#tour-tabs',
          popover: { title: 'Navigation', description: 'Use these tabs to switch between Theory, Simulation, and Procedure.', side: "right", align: 'start' }
        },
        {
          element: '#tour-reference',
          popover: { title: 'Reference Diagram', description: 'This is the exact circuit schematic you need to build for this experiment.', side: "bottom", align: 'start' }
        },
        {
          element: '#tour-sandbox',
          popover: { title: 'Circuit Sandbox', description: 'This is your workspace. Drag components from the palette, click the terminals to wire them, and manually balance the bridge.', side: "top", align: 'start' }
        },
        {
          element: '#tour-procedure-tab',
          popover: { title: 'Record Readings', description: 'Once balanced, click the Procedure tab to manually record your readings into the observation table.', side: "right", align: 'start' }
        }
      ]
    });
    driverObj.drive();
  };

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
        }} id="tour-tabs">
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
                  id={t.id === "procedure" ? "tour-procedure-tab" : undefined}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", margin: "0 0 32px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: -0.5 }}>{exp.title}</h2>
            {tab === "simulation" && exp.id !== "strain-gauge" && (
              <button
                onClick={startTour}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                  background: C.teal, color: "#fff", border: "none", borderRadius: 8,
                  fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)"
                }}
              >
                <Sparkles size={16} /> Guide Me
              </button>
            )}
          </div>

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {exp.id === "strain-gauge" ? (
                <Section title="Interactive Simulation">
                  <StrainGaugeSim />
                </Section>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div>
                    <Section title="Reference Diagram" id="tour-reference">
                      {[
                        "wheatstone-bridge", "kelvin-bridge", "kelvin-double-bridge",
                        "capacitance-comparison-bridge", "maxwell-inductance-bridge",
                        "maxwell-lc-bridge", "hays-bridge", "anderson-bridge",
                        "schering-bridge", "wiens-bridge", "transformer-ratio-bridge"
                      ].includes(exp.id) ? (
                        <UnifiedBridgeSim bridgeId={exp.id} />
                      ) : (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted, background: "var(--card)", borderRadius: 8, border: `1px solid ${C.border}` }}>
                          <Activity size={32} color={C.border} style={{ marginBottom: 12 }} />
                          <div>The reference diagram for {exp.title} is currently under development.</div>
                        </div>
                      )}
                    </Section>
                  </div>
                  
                  <div>
                    <Section title="Circuit Sandbox Workspace" id="tour-sandbox">
                      <CircuitSandbox onCapture={() => {}} onRecord={() => {}} />
                    </Section>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "pretest" && <Section title="Pretest"><Quiz questions={exp.pretest} /></Section>}
          {tab === "posttest" && (
            <Section title="Posttest">
              <Quiz questions={exp.posttest} onComplete={markCompleted} />
              <VivaPrep questions={exp.viva} />
            </Section>
          )}
          {tab === "report" && <LabReportTab exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />}

          {tab === "procedure" && (
            <Section title="Procedure">
              <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.procedure.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              {/* For bridge experiments: apparatus + formula + observation table + result */}
              {[
                "wheatstone-bridge", "kelvin-bridge", "kelvin-double-bridge",
                "capacitance-comparison-bridge", "maxwell-inductance-bridge",
                "maxwell-lc-bridge", "hays-bridge", "anderson-bridge",
                "schering-bridge", "wiens-bridge", "transformer-ratio-bridge"
              ].includes(exp.id) && (
                <BridgeProcedurePanel
                  bridgeId={exp.id}
                  bridgeState={bridgeSims[exp.id]}
                  onStateChange={newSt =>
                    setBridgeSims(prev => ({ ...prev, [exp.id]: newSt }))
                  }
                />
              )}
            </Section>
          )}

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

function Section({ title, children, id }) {
  return (
    <div style={{ marginBottom: 40 }} id={id}>
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
  const urlParams = new URLSearchParams(window.location.search);
  const initialView = urlParams.get('view') || "home";
  const [view, setView] = useState(initialView);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("aim");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [bridgeSims, setBridgeSims] = useState({});
  const [completed, setCompleted] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('vlab_theme') || 'light');
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (!auth) {
      // Fallback if firebase is broken (e.g. invalid keys)
      setAuthInitialized(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          uid: firebaseUser.uid
        });
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    localStorage.setItem('vlab_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const markCompleted = (id) => {
    if(!completed.includes(id)) setCompleted([...completed, id]);
  };


  const toggleCategory = (title) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

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

  if (!authInitialized) {
    return <div style={{ height: '100vh', width: '100vw', background: 'var(--shell)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="spin" color="var(--teal)" size={32} /></div>;
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <div style={{ background: C.canvas, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      
      
      <div id="app-ui">
      {/* Sticky Navbar */}
      <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
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
            <a href="#" onClick={(e) => { e.preventDefault(); setView("team"); }} style={{ color: view === "team" ? "#fff" : "#c3c9d6", cursor: "pointer", textDecoration: "none" }}>Developers</a>
            <button onClick={() => setUnlocked(!unlocked)} style={{ display: "none" }}>Toggle</button>
          </div>
        </div>
      </div>

      {view === "home" ? (
        <Home onOpen={openExperiment} unlocked={unlocked} collapsedCategories={collapsedCategories} toggleCategory={toggleCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} completed={completed} />
      ) : view === "detail" && active ? (
        <div style={{ paddingTop: 76 }}>
          <Detail exp={active} tab={tab} setTab={setTab} onBack={() => setView("home")} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} markCompleted={() => markCompleted(active.id)} bridgeSims={bridgeSims} setBridgeSims={setBridgeSims} />
        </div>
      ) : view === "team" ? (
        <Team />
      ) : null}

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
              <a href="?view=team" target="_blank" rel="noopener noreferrer" style={{ color: "#c3c9d6", textDecoration: "none" }}>Developers</a>
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
      <div className="no-print" style={{ position: "fixed", top: 0, left: menuOpen ? 0 : "-350px", width: "350px", height: "100vh",
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
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Curriculum</h4>
            <div style={{ position: "relative" }}>
              <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px 8px 34px", color: "#fff", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { title: "DC Bridges", filter: exp => exp.id === "wheatstone-bridge" || exp.id.includes("kelvin") },
              { title: "AC Bridges", filter: exp => exp.tag.startsWith("AC-") },
              { title: "Sensors & Transducers", filter: exp => exp.id !== "wheatstone-bridge" && !exp.id.includes("kelvin") && !exp.tag.startsWith("AC-") }
            ].map(category => {
              const exps = EXPERIMENTS.filter(category.filter).filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.tag.toLowerCase().includes(searchQuery.toLowerCase()));
              if (exps.length === 0) return null;
              const isCollapsed = collapsedCategories[category.title];
              return (
                <div key={category.title}>
                  <div 
                    onClick={() => toggleCategory(category.title)}
                    style={{ 
                      display: "flex", alignItems: "center", justifyContent: "space-between", 
                      cursor: "pointer", marginBottom: 12 
                    }}
                  >
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>{category.title}</div>
                    <ChevronRight 
                      size={14} 
                      color="rgba(255,255,255,0.4)" 
                      style={{ 
                        transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)", 
                        transition: "transform 0.2s ease" 
                      }} 
                    />
                  </div>
                  {!isCollapsed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {exps.map((exp, i) => {
                      const isLocked = false;
                      const isCompleted = completed.includes(exp.id);
                      const globalIndex = EXPERIMENTS.findIndex(e => e.id === exp.id) + 1;
                      return (
                        <button
                          key={exp.id}
                          onClick={() => { if(!isLocked) { setActiveId(exp.id); setView("detail"); if(window.innerWidth < 1024) setSidebarOpen(false); } }}
                          style={{
                            textAlign: "left", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)",
                            background: activeId === exp.id ? "rgba(255, 255, 255, 0.1)" : "transparent",
                            cursor: isLocked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 12,
                            opacity: isLocked ? 0.5 : 1, transition: "background 0.2s ease"
                          }}
                        >
                          <div style={{ 
                            width: 26, height: 26, borderRadius: 6, background: isCompleted ? C.teal : "rgba(255,255,255,0.1)", color: "#fff", 
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 
                          }}>
                            {isLocked ? <Lock size={12} /> : isCompleted ? <Check size={14} /> : globalIndex}
                  </div>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</span>
                  </button>
                );
              })}
                  </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>
        
        {/* User Profile */}
        <div style={{ marginTop: "auto", padding: "24px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={user?.avatar} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "var(--shellSoft)" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
            </div>
            <button 
              onClick={() => {
                if(window.confirm("Are you sure you want to sign out?")) {
                  if (auth) {
                    signOut(auth);
                  } else {
                    setUser(null);
                  }
                }
              }}
              title="Sign Out"
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------------
   LAB REPORT TAB
--------------------------------------------------------------- */
function LabReportTab({ exp, bridgeState, setBridgeSims }) {
  if (!exp) return null;
  const bridge = BRIDGES ? BRIDGES.find(b => b.id === exp.id) : null;
  
  const updateRow = (idx, key, val) => {
    if (!setBridgeSims) return;
    setBridgeSims(prev => {
      const current = prev[exp.id] || { rows: [], snapshots: [] };
      const newRows = [...current.rows];
      newRows[idx] = { ...newRows[idx], [key]: val };
      return { ...prev, [exp.id]: { ...current, rows: newRows } };
    });
  };

  const deleteSnapshot = (idx) => {
    if (!setBridgeSims) return;
    if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
    setBridgeSims(prev => {
      const current = prev[exp.id] || { rows: [], snapshots: [] };
      const newSnaps = current.snapshots.filter((_, i) => i !== idx);
      return { ...prev, [exp.id]: { ...current, snapshots: newSnaps } };
    });
  };
  
  return (
    <div className="print-report-container" style={{ padding: "40px", fontFamily: "var(--sans)", color: C.ink, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, minHeight: "100vh" }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: C.teal, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          <Download size={16} /> Export Lab Report
        </button>
      </div>

      <div className="print-section" style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 20, marginBottom: 30, textAlign: "center" }}>
        <h1 style={{ margin: "0 0 10px 0", fontSize: 24, fontWeight: "bold" }}>LABORATORY RECORD</h1>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: "normal", color: C.muted }}>Experiment: {exp.title}</h2>
      </div>

      <div className="print-section">
        <h3 style={{ fontSize: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 4, color: C.copper }}>1. Aim</h3>
        <p style={{ fontSize: 14 }}>{exp.aim}</p>
      </div>

      <div className="print-section">
        <h3 style={{ fontSize: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 4, color: C.copper }}>2. Theory</h3>
        <ul style={{ fontSize: 14, paddingLeft: 20 }}>
          {exp.theory.map((p, i) => <li key={i} style={{ marginBottom: 6 }}>{p}</li>)}
        </ul>
      </div>

      {bridge && (
        <div className="print-section">
          <h3 style={{ fontSize: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 4, color: C.copper }}>3. Circuit Diagram & Formula</h3>
          <div style={{ display: "flex", gap: 30, alignItems: "center", margin: "20px 0", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300, border: `1px solid ${C.border}`, padding: 20, background: C.canvas, borderRadius: 8 }}>
              <CircuitSVG cfg={{ ...bridge.svg, detector: bridge.detector, source: bridge.source }} />
            </div>
            <div style={{ flex: 1, minWidth: 300, fontSize: 14 }}>
              <strong>Balance Formula:</strong>
              <div className="formula-box" dangerouslySetInnerHTML={{ __html: bridge.formula }} style={{ marginTop: 10, padding: 10, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              {(bridge.fixed || []).map((fx, i) => (
                <div key={i} style={{ marginTop: 10, color: C.muted }}>Given: {fx.label} = {fx.value} {fx.unit}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {bridgeState && bridgeState.snapshots && bridgeState.snapshots.length > 0 && (
        <div className="print-section">
          <h3 style={{ fontSize: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 4, color: C.copper }}>4. Circuit Snapshots</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
            {bridgeState.snapshots.map((snap, i) => (
              <div key={snap.id} className="snapshot-card" style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, background: C.canvas, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 14, color: C.muted }}>Observation #{i + 1}</h4>
                  <button className="no-print" onClick={() => deleteSnapshot(i)} style={{ background: 'transparent', border: 'none', color: '#c0392b', cursor: 'pointer', padding: 4 }}>
                    <X size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {snap.svg && (
                    <div style={{ flex: 2, minWidth: 200, border: `1px solid ${C.border}`, background: '#fff' }}>
                      <img src={snap.svg} alt="Circuit" style={{ width: '100%', display: 'block' }} />
                    </div>
                  )}
                  {snap.graph && (
                    <div style={{ flex: 1, minWidth: 200, border: `1px solid ${C.border}`, background: '#050d1a' }}>
                      <img src={snap.graph} alt="Oscilloscope Graph" style={{ width: '100%', display: 'block' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bridgeState && bridgeState.rows && bridgeState.rows.length > 0 && bridge && (
        <div className="print-section">
          <h3 style={{ fontSize: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 4, color: C.copper }}>5. Observation Table</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr className="table-header">
                <th style={{ border: `1px solid ${C.border}`, padding: 12 }}>S.No.</th>
                {bridge.tabCols.map(c => (
                  <th key={c.k} style={{ border: `1px solid ${C.border}`, padding: 12 }}>{c.label || `${c.k}${c.u ? ` (${c.u})` : ''}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bridgeState.rows.map((row, i) => (
                <tr key={row.id || i}>
                  <td style={{ border: `1px solid ${C.border}`, padding: 10 }}>{i + 1}</td>
                  {bridge.tabCols.map(c => {
                    let val = row[c.k] !== undefined ? row[c.k] : "";
                    return (
                      <td key={c.k} style={{ border: `1px solid ${C.border}`, padding: 4 }}>
                        <input 
                          type="text" 
                          value={val} 
                          onChange={(e) => updateRow(i, c.k, e.target.value)}
                          style={{ 
                            width: "100%", background: "transparent", border: "none", color: "inherit",
                            fontFamily: "inherit", fontSize: "inherit", padding: 6, outline: "none"
                          }} 
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="print-section" style={{ marginTop: 60, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: C.muted }}>Date: ____________________</div>
        </div>
        <div>
          <div style={{ color: C.muted }}>Signature: ____________________</div>
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------------
   VIVA PREP (SELF-ASSESSMENT)
--------------------------------------------------------------- */
function VivaPrep({ questions }) {
  const [revealed, setRevealed] = useState({});
  if (!questions || questions.length === 0) return null;

  return (
    <div style={{ marginTop: 40, borderTop: `1px dashed var(--border)`, paddingTop: 32 }}>
      <h3 style={{ margin: "0 0 8px 0", fontSize: 20, color: "var(--ink)" }}>Viva Prep (Self-Assessment)</h3>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Test your conceptual understanding before your lab viva. Try to answer out loud before revealing the answer.</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: "var(--card)", border: `1px solid var(--border)`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 15, marginBottom: 8, display: "flex", gap: 12 }}>
              <span style={{ color: "var(--teal)" }}>Q{i+1}.</span>
              <span>{q.question}</span>
            </div>
            
            {revealed[i] ? (
              <div style={{ padding: 12, background: "var(--canvas)", borderRadius: 8, fontSize: 14, color: "var(--muted)", marginTop: 12, borderLeft: `3px solid var(--teal)` }}>
                {q.answer}
              </div>
            ) : (
              <button 
                onClick={() => setRevealed(prev => ({ ...prev, [i]: true }))}
                style={{ background: "transparent", border: `1px solid var(--border)`, color: "var(--muted)", padding: "6px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Eye size={14} /> Reveal Answer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

