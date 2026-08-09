import { useState, useEffect, useRef, useMemo } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  Zap, BookOpen, ClipboardCheck, ListOrdered, Sparkles, MessageSquare,
  Link2, Target, ArrowLeft, Loader2, CheckCircle2, XCircle, Star,
  ChevronRight, ChevronDown, Cpu, Menu, X, Activity,
  GraduationCap, Mail, Phone, MapPin, Shield, Globe, Users, Lock, LogOut, User,
  Search, Sun, Moon, Check, BarChart2, Download, Eye, Camera, FileText, Bot,
  Calculator, Trophy, AlertTriangle, HelpCircle, Building, IdCard, Printer } from "lucide-react";
import StrainGaugeSim from "./simulations/StrainGaugeSim";
import UnifiedBridgeSim, { BridgeProcedurePanel, BRIDGES, initBridgeState, CircuitSVG } from "./simulations/UnifiedBridgeSim";
import LoginScreen from "./LoginScreen";
import TeacherDashboard from "./TeacherDashboard";
import Profile from "./Profile";
import AIChatbot from "./AIChatbot";
import { auth, db } from "./services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, setDoc, writeBatch } from "firebase/firestore";

/* ---------------------------------------------------------------
   DESIGN TOKENS — circuit-board palette: ink navy shell, copper
   accent (component/trace color), teal secondary, warm paper canvas
--------------------------------------------------------------- */
export const C = {
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
function CircuitSandbox({ expId, bridgeState, setBridgeSims }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.origin || e.origin !== window.location.origin) return; // Security check
      const data = e.data;
      if (!data) return;

      if (data.type === 'SNAPSHOT_RESULT') {
        setBridgeSims(prev => ({
          ...prev,
          [expId]: {
            ...prev[expId],
            labActivity: {
              ...prev[expId]?.labActivity,
              circuitImg: data.svgDataUrl,
              scopeImg: data.graphDataUrl,
              analysisData: data.analysisData,
            }
          }
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [expId, setBridgeSims]);

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

function Home({ user, enrolledClass, setEnrolledClass, onOpen, unlocked, collapsedCategories, toggleCategory, searchQuery, setSearchQuery, completed }) {
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);

  const joinClass = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    try {
      const code = inviteCode.trim().toUpperCase();
      const classDocRef = doc(db, 'classes', code);
      const classDoc = await getDoc(classDocRef);
      
      if (!classDoc.exists()) {
        alert("Invalid invite code.");
      } else {
        const batch = writeBatch(db);
        
        // 1. Add student to class
        batch.update(classDocRef, {
          studentUids: arrayUnion(user.uid)
        });
        
        // 2. Add teacher to student's enrolledTeacherUids
        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
          enrolledTeacherUids: arrayUnion(classDoc.data().teacherUid),
          lastJoinedClassId: classDoc.id
        });
        
        await batch.commit();
        
        setEnrolledClass({ id: classDoc.id, ...classDoc.data() });
        setInviteCode('');
        alert("Successfully joined " + classDoc.data().className + "!");
      }
    } catch (e) {
      console.error("Error joining class:", e);
      alert("Failed to join class.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div style={{ background: C.canvas, minHeight: "100vh" }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: C.shell,
        padding: "40px",
        textAlign: "center",
        borderBottom: `1px solid ${C.border}`,
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
        
        {/* LMS Class Join UI - Premium Redesign */}
        <div 
          style={{ 
            width: '100%', 
            marginBottom: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 20, 
            padding: '28px 36px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 24,
            border: '1px solid rgba(13, 148, 136, 0.1)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04), inset 0 2px 0 rgba(255,255,255,0.8)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background element */}
          <div style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #0f766e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(13, 148, 136, 0.25)' }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>Student Portal</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
                {enrolledClass ? `You are currently enrolled in ${enrolledClass.className}.` : "Enter your class code below to join and submit lab records."}
              </div>
            </div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {enrolledClass ? (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '10px 20px', 
                background: '#ecfdf5', 
                color: '#059669', 
                borderRadius: 999, 
                fontWeight: 700, 
                fontSize: 15,
                border: '1px solid #a7f3d0',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)'
              }}>
                <CheckCircle2 size={18} /> Enrolled
              </div>
            ) : (
              <form onSubmit={joinClass} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: 6, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Class Code (VLAB-...)"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    style={{ 
                      width: 260, 
                      padding: '12px 16px 12px 42px', 
                      borderRadius: 12, 
                      border: '2px solid transparent', 
                      background: '#f8fafc',
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: '#1e293b',
                      textTransform: 'uppercase',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.border = '2px solid rgba(13,148,136,0.3)'; }}
                    onBlur={(e) => { e.target.style.background = '#f8fafc'; e.target.style.border = '2px solid transparent'; }}
                  />
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <BookOpen size={18} />
                  </div>
                </div>
                <button type="submit" disabled={joining || !inviteCode.trim()} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  background: (joining || !inviteCode.trim()) ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #0f766e)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: 12, 
                  fontWeight: 700, 
                  fontSize: 14, 
                  cursor: (joining || !inviteCode.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: (joining || !inviteCode.trim()) ? 'none' : '0 4px 12px rgba(13,148,136,0.3)'
                }}
                onMouseOver={(e) => { if(!joining && inviteCode.trim()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={(e) => { if(!joining && inviteCode.trim()) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {joining ? <Loader2 className="spin" size={18} /> : <Link2 size={18} />} Join Class
                </button>
              </form>
            )}
          </div>
        </div>

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
          {EXPERIMENTS.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.tag.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
            <div className="empty-state" style={{ borderRadius: 16 }}>
              <div className="empty-icon-wrap"><Search size={32} /></div>
              <h4>No matching modules</h4>
              <p>Try adjusting your search terms.</p>
            </div>
          ) : (
            [
              { title: "DC Bridges", filter: exp => exp.id === "wheatstone-bridge" || exp.id.includes("kelvin") },
              { title: "AC Bridges", filter: exp => exp.tag.startsWith("AC-") },
              { title: "Sensors & Transducers", filter: exp => exp.id !== "wheatstone-bridge" && !exp.id.includes("kelvin") && !exp.tag.startsWith("AC-") }
            ].map(category => {
              const isCollapsed = collapsedCategories[category.title];
              const categoryExps = EXPERIMENTS.filter(category.filter).filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.tag.toLowerCase().includes(searchQuery.toLowerCase()));
              
              if (categoryExps.length === 0) return null;
              
              return (
              <div key={category.title}>
                <div 
                  onClick={() => toggleCategory(category.title)}
                  style={{ 
                    display: "flex", alignItems: "center", justifyContent: "space-between", 
                    cursor: "pointer", borderBottom: `2px solid var(--border)`, paddingBottom: 8, marginBottom: 16 
                  }}
                >
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{category.title}</h3>
                  <ChevronRight 
                    size={20} 
                    color="var(--muted)" 
                    style={{ 
                      transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)", 
                      transition: "transform 0.2s ease" 
                    }} 
                  />
                </div>
                {!isCollapsed && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                  {categoryExps.map(exp => {
                    const isLocked = false;
                  return (
            <button
              key={exp.id}
              onClick={() => { if(!isLocked) onOpen(exp.id); }}
              className="class-card"
              style={{
                textAlign: "left",
                cursor: isLocked ? "not-allowed" : "pointer",
                display: "flex", flexDirection: "column", gap: 12,
                opacity: isLocked ? 0.7 : 1,
                border: 'none', // Override button defaults
                background: 'var(--card)'
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <span className={isLocked ? "status-badge pending" : "status-badge graded"} style={{ fontSize: 12 }}>
                  {exp.tag}
                </span>
                {!isLocked && <StarRating rating={RATINGS[exp.id] ?? 4} size={14} />}
                {isLocked && <Lock size={16} color="var(--muted)" />}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 18, lineHeight: 1.3, marginTop: 4 }}>{exp.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, flex: 1 }}>{exp.aim}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTop: `1px solid var(--border)`, paddingTop: 16, width: "100%" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: isLocked ? 'var(--muted)' : 'var(--ink)' }}>
                  {isLocked ? "Module Locked" : "Launch lab module"}
                </span>
                {!isLocked && <ArrowLeft className="exp-arrow" size={16} color="var(--muted)" style={{ transform: "rotate(180deg)", transition: "all 0.2s ease" }} />}
              </div>
            </button>
          );
        })}
              </div>
              )}
            </div>
          );
        })
      )}
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
function Detail({ user, enrolledClass, exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen, markCompleted, bridgeSims, setBridgeSims }) {
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
      <div className="no-print" style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "20px 60px", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: C.muted }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: 0 }}>
          <ArrowLeft size={16} /> Course Overview
        </button>
        <span>/</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>Module {exp.id === "strain-gauge" ? "1" : "X"}: {exp.title}</span>
      </div>

      <div style={{ display: "flex", gap: 40, padding: "40px 60px 80px", alignItems: "flex-start", maxWidth: 1400, margin: "0 auto" }}>
        {/* sidebar */}
        <div className="app-sidebar" style={{
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
                    background: isActive ? "var(--teal-soft)" : "transparent", 
                    color: isActive ? "var(--teal)" : "var(--ink-soft)",
                    border: "none", cursor: "pointer", fontSize: 15, fontWeight: isActive ? 700 : 500, textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = "var(--bg)"; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={18} style={{ color: isActive ? "var(--teal)" : "var(--ink-soft)" }} />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {t.badge && !isActive && <span style={{ fontSize: 10, background: "var(--copper-soft)", color: "var(--copper)", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>{t.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        {/* content */}
        <div className="premium-panel" style={{ flex: 1, minWidth: 0, padding: "56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span className="status-badge pending" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", padding: "4px 10px", borderRadius: 6 }}>{exp.tag}</span>
            <span className="text-muted" style={{ fontSize: 13, fontWeight: 600 }}>Required Module</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", margin: "0 0 32px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: -0.5 }}>{exp.title}</h2>
            {tab === "simulation" && exp.id !== "strain-gauge" && (
              <button
                onClick={startTour}
                className="manage-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                  fontSize: 14
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
                      <CircuitSandbox expId={exp.id} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />
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
              <VivaPrep exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />
            </Section>
          )}
          {tab === "report" && <LabReportTab user={user} enrolledClass={enrolledClass} exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />}

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
  const [enrolledClass, setEnrolledClass] = useState(null);

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
          uid: firebaseUser.uid,
          role: 'student' // temporary default
        });

        // Fetch role and other profile data asynchronously
        getDoc(doc(db, 'users', firebaseUser.uid)).then(userDoc => {
          let role = 'student';
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || 'student';
            setUser(prev => prev ? { 
              ...prev, 
              role,
              name: data.name || prev.name,
              avatar: data.avatar || prev.avatar
            } : null);
          }
          if (role === 'student') {
            const classQ = query(collection(db, 'classes'), where('studentUids', 'array-contains', firebaseUser.uid));
            getDocs(classQ).then(classSnap => {
              if (!classSnap.empty) {
                setEnrolledClass({ id: classSnap.docs[0].id, ...classSnap.docs[0].data() });
              }
            }).catch(e => console.error("Error fetching class:", e));
          }
        }).catch(e => console.error("Error fetching user data:", e));

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
  }, [view, user]);

  const active = EXPERIMENTS.find(e => e.id === activeId);

  function openExperiment(id) {
    setActiveId(id);
    setTab("aim");
    setView("detail");
  }

  if (!authInitialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <Loader2 className="spin" size={32} color="var(--teal)" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard user={user} onLogout={() => signOut(auth)} onUpdate={(updatedUser) => setUser(updatedUser)} />;
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
            <a href="#" onClick={(e) => { e.preventDefault(); setView("team"); }} style={{ color: view === "team" ? "#fff" : "#c3c9d6", cursor: "pointer", textDecoration: "none" }}>Developers</a>
            <button onClick={() => setUnlocked(!unlocked)} style={{ display: "none" }}>Toggle</button>
          </div>
        </div>
      </div>

      {view === "home" ? (
        <Home user={user} enrolledClass={enrolledClass} setEnrolledClass={setEnrolledClass} onOpen={openExperiment} unlocked={unlocked} collapsedCategories={collapsedCategories} toggleCategory={toggleCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} completed={completed} />
      ) : view === "detail" && active ? (
        <div style={{ paddingTop: 76 }}>
          <Detail user={user} enrolledClass={enrolledClass} exp={active} tab={tab} setTab={setTab} onBack={() => setView("home")} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} markCompleted={() => markCompleted(active.id)} bridgeSims={bridgeSims} setBridgeSims={setBridgeSims} />
        </div>
      ) : view === "team" ? (
        <Team />
      ) : view === "profile" ? (
        <div style={{ paddingTop: 76 }}>
          <Profile user={user} onUpdate={(updatedUser) => setUser(updatedUser)} />
        </div>
      ) : null}

      {/* Official Footer */}
      <div className="no-print" style={{ background: C.shell, color: "#c3c9d6", borderTop: `4px solid ${C.copper}` }}>
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
        display: "flex", flexDirection: "column"
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
                <div className="sidebar-scroll" style={{ padding: "24px", flex: 1, overflowY: "auto", minHeight: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <button 
              onClick={() => { setView("profile"); setMenuOpen(false); }} 
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: view === "profile" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
            >
              <User size={18} color={C.teal} />
              My Profile
            </button>
          </div>
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
                          className="sidebar-item"
                          onClick={() => { if(!isLocked) { setActiveId(exp.id); setView("detail"); if(window.innerWidth < 1024) setSidebarOpen(false); } }}
                          style={{
                            textAlign: "left", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)",
                            background: activeId === exp.id ? "rgba(255, 255, 255, 0.1)" : "transparent",
                            cursor: isLocked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 12,
                            opacity: isLocked ? 0.5 : 1, transition: "all 0.2s ease",
                            transform: "translateX(0)"
                          }}
                        >
                          <div className="sidebar-icon" style={{ 
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
      
      {/* Global AI Chatbot Widget */}
      {view === 'detail' && active && <AIChatbot currentExperiment={active.title} />}
    </div>
  );
}


/* ---------------------------------------------------------------
   LAB REPORT TAB
--------------------------------------------------------------- */
function AccordionSection({ title, icon: Icon, color, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Use a class "print-force-open" which we will define in CSS to force display:block during print
  return (
    <div className="report-accordion" style={{ border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, overflow: 'hidden', background: C.card }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="no-print"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{title}</span>
        </div>
        <ChevronDown size={20} color={C.muted} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      
      {/* Print-only header since the button is hidden during print */}
      <div className="print-only" style={{ display: 'none', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{title}</span>
      </div>

      <div className={`accordion-content ${isOpen ? 'open' : ''} print-force-open`} style={{ display: isOpen ? 'block' : 'none', borderTop: isOpen ? `1px solid ${C.border}` : 'none' }}>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}


function LabReportTab({ user, enrolledClass, exp, bridgeState, setBridgeSims }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiConclusion, setAiConclusion] = useState('');
  const [generatingConclusion, setGeneratingConclusion] = useState(false);


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
  
  const submitToTeacher = async () => {
    if (!enrolledClass) {
      alert("You must join a class first from the Home dashboard to submit your report.");
      return;
    }
    if (exp.viva && (!bridgeState?.vivaSubmitted)) {
      if (!window.confirm("You have not submitted the Viva Quiz yet. Do you want to submit your lab report anyway? (Your Viva score will be recorded as 0).")) {
        return;
      }
    }
    
    setSubmitting(true);
    
    // Pull real viva score from bridgeState
    const vivaScore = bridgeState?.vivaScore || 0;
    const vivaResponses = bridgeState?.vivaResponses || {};
    
    const submissionId = `${user.uid}_${exp.id}`;
    const payload = {
      studentUid: user.uid,
      studentName: user.name,
      studentAvatar: user.avatar,
      classId: enrolledClass.id,
      teacherUid: enrolledClass.teacherUid,
      experimentId: exp.id,
      experimentName: exp.title,
      vivaScore: vivaScore,
      vivaResponses: vivaResponses,
      teacherScore: null,
      labData: bridgeState || {},
      submittedAt: new Date().toISOString(),
      status: 'completed'
    };

    try {
      const submissionRef = doc(db, 'submissions', submissionId);
      const existingDoc = await getDoc(submissionRef);
      
      if (existingDoc.exists()) {
        const data = existingDoc.data();
        if (data.teacherScore !== null && data.teacherScore !== undefined) {
          alert("This lab report has already been graded by your teacher. You cannot overwrite it.");
          setSubmitting(false);
          return;
        }
        if (!window.confirm("You have already submitted this lab report. Do you want to overwrite your previous submission?")) {
          setSubmitting(false);
          return;
        }
      }

      await setDoc(submissionRef, payload);
      setSubmitted(true);
      alert("Lab report successfully submitted to " + enrolledClass.className + "!");
    } catch (e) {
      console.error("Submission error:", e);
      alert("Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateAIConclusion = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      alert("Please configure your Gemini API Key in the Strict Examiner AI Chatbot (bottom right) first.");
      return;
    }
    
    if (!bridgeState?.rows || bridgeState.rows.length === 0) {
      alert("Please add some readings to your observation table first!");
      return;
    }

    setGeneratingConclusion(true);
    try {
      const readings = JSON.stringify(bridgeState.rows);
      const prompt = `You are a helpful lab assistant. The student just finished the experiment "${exp.title}". Here are their observation table readings: ${readings}. Write a professional, concise 1-2 paragraph conclusion that summarizes these specific findings and the underlying principle. Return ONLY the conclusion text.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 300 }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);
      
      setAiConclusion(data.candidates[0].content.parts[0].text);
    } catch (e) {
      console.error(e);
      alert("Failed to generate conclusion: " + e.message);
    } finally {
      setGeneratingConclusion(false);
    }
  };

  return (
    <div className="print-report-container" style={{ padding: "40px", fontFamily: "var(--sans)", color: C.ink, background: C.card, borderRadius: 12, minHeight: "100vh", position: "relative" }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#dcfce7', color: '#166534', padding: '12px 20px', borderRadius: 12, minWidth: 120 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>DC-02</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Required Module</div>
        </div>
        
        <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
          <h1 style={{ margin: "0 0 4px 0", fontSize: 28, fontWeight: 800, color: C.ink }}>{exp.title}</h1>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#059669' }}>LABORATORY RECORD</h2>
          <div style={{ fontSize: 15, color: C.muted }}>Experiment: {exp.title}</div>
        </div>
        
        <div className="no-print" style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: `1px solid ${C.border}`, borderRadius: 8, background: 'transparent', color: C.ink, fontWeight: 600, cursor: 'pointer' }}>
            <Printer size={16} /> Print
          </button>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#059669', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Student Details Row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: '24px 32px', border: `1px solid ${C.border}`, borderRadius: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
            <User size={16} color={C.muted} /> Name
          </div>
          <input type="text" defaultValue={user?.name || ""} style={{ width: '100%', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '4px 0', outline: 'none', background: 'transparent', fontSize: 15, color: C.ink }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
            <GraduationCap size={16} color={C.muted} /> Class
          </div>
          <input type="text" defaultValue={user?.class || ""} style={{ width: '100%', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '4px 0', outline: 'none', background: 'transparent', fontSize: 15, color: C.ink }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
            <Building size={16} color={C.muted} /> Department
          </div>
          <input type="text" defaultValue={user?.department || ""} style={{ width: '100%', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '4px 0', outline: 'none', background: 'transparent', fontSize: 15, color: C.ink }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
            <IdCard size={16} color={C.muted} /> Registration No.
          </div>
          <input type="text" defaultValue={user?.regNo || ""} style={{ width: '100%', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '4px 0', outline: 'none', background: 'transparent', fontSize: 15, color: C.ink }} />
        </div>
      </div>

      <AccordionSection title="1. Aim" icon={Target} color="#10b981" defaultOpen={false}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: C.ink }}>{exp.aim}</p>
      </AccordionSection>

      <AccordionSection title="2. Theory" icon={BookOpen} color="#3b82f6" defaultOpen={false}>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6, color: C.ink }}>
          {exp.theory.map((p, i) => <li key={i} style={{ marginBottom: 8 }}>{p}</li>)}
        </ul>
      </AccordionSection>

      {bridge && (
        <>
          <AccordionSection title="3. Circuit Diagram" icon={Zap} color="#a855f7" defaultOpen={false}>
             <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <CircuitSVG cfg={{ ...bridge.svg, detector: bridge.detector, source: bridge.source }} />
             </div>
          </AccordionSection>

          <AccordionSection title="4. Formula" icon={Sparkles} color="#f59e0b" defaultOpen={false}>
             <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
               <div dangerouslySetInnerHTML={{ __html: bridge.formula }} style={{ fontSize: 24, padding: 20, background: '#fff', borderRadius: 8, border: `1px solid ${C.border}` }} />
               <div style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: 20, color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
                 {(bridge.fixed || []).map((fx, i) => (
                   <div key={i}>{fx.k} = {fx.label}</div>
                 ))}
                 {bridge.tabCols.map((c, i) => (
                   <div key={`c${i}`}>{c.k} = {c.label || c.k}</div>
                 ))}
               </div>
             </div>
          </AccordionSection>
        </>
      )}

      {/* 5. Lab Activity */}
      <AccordionSection title="5. Lab Activity" icon={Activity} color="#3b82f6" defaultOpen={true}>
        {bridgeState && bridgeState.labActivity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Snapshot & Scope Images */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {bridgeState.labActivity.circuitImg && (
                <div style={{ flex: '1 1 400px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: C.ink }}>Circuit Snapshot</h4>
                  <img src={bridgeState.labActivity.circuitImg} alt="Circuit" style={{ width: '100%', borderRadius: 8, border: `1px solid ${C.border}`, background: '#ffffff' }} />
                </div>
              )}
              {bridgeState.labActivity.scopeImg && (
                <div style={{ flex: '1 1 300px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: C.ink }}>Oscilloscope Trace</h4>
                  <img src={bridgeState.labActivity.scopeImg} alt="Scope" style={{ width: '100%', borderRadius: 8, border: `1px solid ${C.border}`, background: '#050d1a' }} />
                </div>
              )}
            </div>

            {/* Analysis Structured Data */}
            {bridgeState.labActivity.analysisData && bridgeState.labActivity.analysisData.components && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: C.ink }}>Live Analysis (Structured)</h4>
                {!bridgeState.labActivity.analysisData.readings || Object.keys(bridgeState.labActivity.analysisData.readings).length === 0 ? (
                  <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: 14 }}>
                    Circuit was incomplete or unsolved at the time of capture.
                  </div>
                ) : (
                  <div style={{ padding: 16, background: 'var(--canvas)', borderRadius: 8, border: `1px solid var(--border)` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: 12, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sources (V, I)</strong>
                        {bridgeState.labActivity.analysisData.components.filter(c => ['battery', 'acsource'].includes(c.type)).map(s => {
                          const r = bridgeState.labActivity.analysisData.readings[s.id] || {};
                          return <div key={s.id} style={{ fontSize: 13, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}><span>{s.type} ({s.value}V)</span> <span style={{ fontWeight: 600 }}>{r.I ? Math.abs(r.I).toFixed(3) + 'A' : '0A'}</span></div>;
                        })}
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: 12, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passive Components (V, I)</strong>
                        {bridgeState.labActivity.analysisData.components.filter(c => !['ground', 'junction', 'switch', 'battery', 'acsource'].includes(c.type)).map(c => {
                          const r = bridgeState.labActivity.analysisData.readings[c.id] || {};
                          return (
                            <div key={c.id} style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '4px 0' }}>
                              <span>{c.type}</span>
                              <div style={{ display: 'flex', gap: 16 }}>
                                <span style={{ color: C.teal }}>{r.V ? Math.abs(r.V).toFixed(2) + 'V' : '-'}</span>
                                <span style={{ color: C.copper }}>{r.I ? (Math.abs(r.I)*1000).toFixed(1) + 'mA' : '-'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>
            No lab activity captured yet. Build your circuit in the Simulation tab and click Capture.
          </div>
        )}
      </AccordionSection>

      {/* 6. Calculations */}
      <AccordionSection title="6. Calculations" icon={Calculator} color="#10b981" defaultOpen={false}>
        {bridgeState && bridgeState.rows && bridgeState.rows.length > 0 && bridge ? (
          <>
            <div style={{ fontSize: 15, marginBottom: 16 }}>Using the formula: <span dangerouslySetInnerHTML={{ __html: bridge.formula }} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }} /></div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {bridgeState.rows.map((row, i) => {
                return (
                  <div key={i} style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Trial {i + 1}:</div>
                    <div style={{ color: C.muted, lineHeight: 1.6 }}>
                      {bridge.tabCols.map(c => `${c.k} = ${row[c.k] || 0}`).join(', ')}<br/>
                      Result: {row.result ? row.result : 'Recorded in table'}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>
            No calculations available. Perform trials in the Simulation tab first.
          </div>
        )}
      </AccordionSection>

      {/* 7. Observation Table */}
      <AccordionSection title="7. Observation Table" icon={BarChart2} color="#ec4899" defaultOpen={false}>
        {bridgeState && bridgeState.rows && bridgeState.rows.length > 0 && bridge ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Trial Readings Sub-section */}
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: 'center' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ border: `1px solid ${C.border}`, padding: '12px 16px', color: C.muted, fontWeight: 600 }}>Trial No.</th>
                      {bridge.tabCols.map(c => (
                        <th key={c.k} style={{ border: `1px solid ${C.border}`, padding: '12px 16px', color: C.ink, fontWeight: 600 }}>
                          {c.label || `${c.k} (${c.u || ''})`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bridgeState.rows.map((row, i) => (
                      <tr key={row.id || i}>
                        <td style={{ border: `1px solid ${C.border}`, padding: '12px 16px', fontWeight: 600 }}>{i + 1}.</td>
                        {bridge.tabCols.map(c => (
                          <td key={c.k} style={{ border: `1px solid ${C.border}`, padding: '12px 16px' }}>
                            <input 
                              type="text" 
                              value={row[c.k] !== undefined ? row[c.k] : ""} 
                              onChange={(e) => updateRow(i, c.k, e.target.value)}
                              style={{ width: "100%", background: "transparent", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit", textAlign: "center", outline: "none" }} 
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>
            No readings recorded. Use the Record button in the Simulation tab to populate this table.
          </div>
        )}
      </AccordionSection>

      {/* 8. Result */}
      <AccordionSection title="8. Result" icon={Trophy} color="#14b8a6" defaultOpen={false}>
        {bridgeState && bridgeState.rows && bridgeState.rows.length > 0 && bridge ? (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 16, borderRadius: 8, color: '#065f46', fontSize: 15 }}>
            The calculated values have been recorded. Averages can be derived from the table above.
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>
            Result is pending completion of the lab trials.
          </div>
        )}
      </AccordionSection>

      <AccordionSection title="9. Viva Questions" icon={HelpCircle} color="#ec4899" defaultOpen={false}>
        {!bridgeState?.vivaSubmitted ? (
          <VivaPrep hideTitle={true} exp={exp} bridgeState={bridgeState} setBridgeSims={setBridgeSims} />
        ) : (
          exp.viva && exp.viva[0].options ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontWeight: 600, color: C.ink, marginBottom: 8 }}>
                Score: {bridgeState.vivaCorrectCount} / {exp.viva.length}
              </div>
              {exp.viva.map((q, i) => {
                const selectedIdx = bridgeState?.vivaResponses?.[q.id];
                const isCorrect = selectedIdx === q.correctIndex;
                const hasAnswered = selectedIdx !== undefined;

                return (
                  <div key={q.id} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                    <div style={{ fontWeight: 600, color: C.ink, fontSize: 14, marginBottom: 8 }}>
                      Q{i+1}. {q.question}
                    </div>
                    {hasAnswered ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: isCorrect ? '#059669' : '#dc2626' }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        <span>{q.options[selectedIdx]}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic' }}>No answer recorded.</div>
                    )}
                    {hasAnswered && !isCorrect && (
                      <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                        Correct Answer: {q.options[q.correctIndex]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6, color: C.ink }}>
              {exp.viva ? exp.viva.map((v, i) => <li key={i} style={{ marginBottom: 8 }}>{v.question}</li>) : (
                <li>Refer to the manual for viva questions.</li>
              )}
            </ul>
          )
        )}
      </AccordionSection>
      
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        {enrolledClass && (
          <button 
            onClick={submitToTeacher} 
            disabled={submitting || submitted}
            className="create-btn"
            style={{ opacity: submitted ? 0.6 : 1, cursor: submitted ? 'default' : 'pointer', padding: '12px 32px', fontSize: 16, borderRadius: 999 }}
          >
            {submitting ? <Loader2 className="spin" size={16} /> : <CheckCircle2 size={16} />} 
            {submitted ? 'Report Submitted' : 'Submit Lab Report to Teacher'}
          </button>
        )}
      </div>
    </div>
  );
}


/* ---------------------------------------------------------------
   VIVA PREP (SELF-ASSESSMENT)
--------------------------------------------------------------- */
function VivaPrep({ exp, bridgeState, setBridgeSims, hideTitle = false }) {
  const [revealed, setRevealed] = useState({});
  const questions = exp.viva;
  if (!questions || questions.length === 0) return null;

  const isMCQ = questions[0].options !== undefined;

  if (!isMCQ) {
    return (
      <div style={hideTitle ? {} : { marginTop: 40, borderTop: `1px dashed var(--border)`, paddingTop: 32 }}>
        {!hideTitle && <h3 style={{ margin: "0 0 8px 0", fontSize: 20, color: "var(--ink)" }}>Viva Prep (Self-Assessment)</h3>}
        {!hideTitle && <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Test your conceptual understanding before your lab viva. Try to answer out loud before revealing the answer.</p>}
        
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

  return <VivaMCQ questions={questions} exp={exp} bridgeState={bridgeState} setBridgeSims={setBridgeSims} hideTitle={hideTitle} />;
}

/* One-question-at-a-time MCQ with timer + shuffled options */
function VivaMCQ({ questions, exp, bridgeState, setBridgeSims, hideTitle }) {
  const TIMER_SECONDS = 30;
  const QUESTIONS_PER_SESSION = 5;

  // Load question pool (30 Qs) lazily; fall back to base 5 if not ready
  const [pool, setPool] = useState(null);
  useEffect(() => {
    import('./data/vivaPool.js').then(m => {
      const p = m.default?.[exp.id];
      setPool(p && p.length >= QUESTIONS_PER_SESSION ? p : null);
    }).catch(() => setPool(null));
  }, [exp.id]);

  // Pick 5 random questions from the pool each session (stable per mount)
  const sessionQuestions = useMemo(() => {
    const src = pool || questions;
    if (src.length <= QUESTIONS_PER_SESSION) return src;
    // Seeded shuffle using current minute so it changes every minute but is stable during the test
    const seed = Math.floor(Date.now() / 60000);
    const arr = [...src];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = ((seed * 9301 + 49297) % 233280 + i * 1299709) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, QUESTIONS_PER_SESSION);
  }, [pool, questions]);

  // Shuffle options once per session (per question)
  const shuffled = useMemo(() => sessionQuestions.map(q => {
    const indices = q.options.map((_, i) => i);
    const seed2 = (q.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = (seed2 * 7 + i * 13) % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return { ...q, shuffledOptions: indices.map(idx => q.options[idx]), shuffledToOriginal: indices };
  }), [sessionQuestions]);

  // ─── State ───────────────────────────────────────────────────────────────
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [done, setDone] = useState(false); // all questions answered/timed out

  const responses = bridgeState?.vivaResponses || {};
  const submitted = bridgeState?.vivaSubmitted || false;
  const answeredCount = Object.keys(responses).length;

  const q = shuffled[current] || shuffled[0];

  // ─── Per-question countdown (only runs after started) ────────────────────
  useEffect(() => {
    if (!started || submitted || done) return;
    setTimeLeft(TIMER_SECONDS);
    setTimedOut(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimedOut(true);
          // Mark as timed-out (-1 sentinel) if not answered
          if (responses[q.id] === undefined) {
            setBridgeSims && setBridgeSims(prev2 => {
              const cur = prev2[exp.id] || {};
              return { ...prev2, [exp.id]: { ...cur, vivaResponses: { ...(cur.vivaResponses || {}), [q.id]: -1 } } };
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [current, started, submitted, done]);

  // Auto-advance after timeout
  useEffect(() => {
    if (!timedOut || submitted) return;
    const t = setTimeout(() => {
      if (current < shuffled.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setDone(true);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [timedOut]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleSelect = (shuffledIdx) => {
    if (submitted || responses[q.id] !== undefined || timedOut) return;
    const originalIdx = q.shuffledToOriginal[shuffledIdx];
    setBridgeSims && setBridgeSims(prev => {
      const cur = prev[exp.id] || {};
      return { ...prev, [exp.id]: { ...cur, vivaResponses: { ...(cur.vivaResponses || {}), [q.id]: originalIdx } } };
    });
    // Auto-advance
    setTimeout(() => {
      if (current < shuffled.length - 1) setCurrent(c => c + 1);
      else setDone(true);
    }, 700);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    shuffled.forEach(q => { if (responses[q.id] === q.correctIndex) correctCount++; });
    const finalScore = Math.round((correctCount / shuffled.length) * 3);
    setBridgeSims && setBridgeSims(prev => {
      const cur = prev[exp.id] || {};
      return { ...prev, [exp.id]: { ...cur, vivaSubmitted: true, vivaScore: finalScore, vivaCorrectCount: correctCount } };
    });
  };

  if (submitted) return null;

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 7 ? '#f59e0b' : '#ef4444';

  // ─── START SCREEN ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🎯</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>Viva Quiz</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 420, lineHeight: 1.7 }}>
          You will be shown <strong>{QUESTIONS_PER_SESSION} questions</strong> randomly selected from a large pool.<br/>
          Each question has a <strong style={{ color: '#ef4444' }}>⏱ {TIMER_SECONDS}-second timer</strong>. The timer starts the moment you press Start and runs until the last question. Unanswered questions are marked wrong.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 320, background: 'var(--canvas)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--border)', textAlign: 'left' }}>
          {[
            '📚 Questions sampled fresh each session',
            '⏱ 30 seconds per question',
            '🔀 Answer options are shuffled',
            '⚡ Auto-advances on timeout',
          ].map((t, i) => <div key={i} style={{ fontSize: 13, color: 'var(--muted)' }}>{t}</div>)}
        </div>
        <button onClick={() => setStarted(true)} style={{ marginTop: 8, padding: '13px 40px', borderRadius: 999, border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 18px rgba(20,184,166,0.35)', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.target.style.transform='scale(1.05)'} onMouseLeave={e => e.target.style.transform='scale(1)'}>
          🚀 Start Test
        </button>
      </div>
    );
  }

  // ─── DONE SCREEN ──────────────────────────────────────────────────────────
  if (done) {
    const correct = shuffled.filter(q => responses[q.id] === q.correctIndex).length;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>{correct >= 4 ? '🏆' : correct >= 2 ? '👍' : '📖'}</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>Quiz Complete!</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--teal)' }}>{correct} / {shuffled.length}</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>
          {correct === shuffled.length ? 'Perfect score! Excellent preparation.' : correct >= 3 ? 'Good understanding. Review the missed concepts.' : 'Review the theory and try again during your next session.'}
        </div>
        {/* Quick review */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {shuffled.map((sq, i) => {
            const ans = responses[sq.id];
            const isCorrect = ans === sq.correctIndex;
            const timedout = ans === -1;
            return (
              <div key={i} style={{ background: isCorrect ? '#ecfdf5' : '#fef2f2', border: `1px solid ${isCorrect ? '#a7f3d0' : '#fca5a5'}`, borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 6 }}>Q{i + 1}. {sq.question}</div>
                <div style={{ fontSize: 12, color: isCorrect ? '#065f46' : '#991b1b' }}>
                  {timedout ? '⏱ Timed out' : isCorrect ? `✓ ${sq.shuffledOptions[sq.shuffledToOriginal.indexOf(ans)]}` : `✗ Your answer: ${ans >= 0 ? sq.shuffledOptions[sq.shuffledToOriginal.indexOf(ans)] : '-'}`}
                </div>
                {!isCorrect && <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>✓ Correct: {sq.options[sq.correctIndex]}</div>}
              </div>
            );
          })}
        </div>
        <button onClick={handleSubmit} style={{ padding: '12px 36px', borderRadius: 999, border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
          ✓ Save Score &amp; Close
        </button>
      </div>
    );
  }

  // ─── QUESTION SCREEN ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${(answeredCount / shuffled.length) * 100}%`, height: '100%', background: 'var(--teal)', borderRadius: 99, transition: 'width 0.4s' }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{answeredCount} / {shuffled.length} answered</span>
      </div>

      {/* Card */}
      <div style={{ background: 'var(--card)', border: `1px solid var(--border)`, borderRadius: 14, padding: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Timer stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: `${timerPct}%`, height: '100%', background: timerColor, transition: 'width 1s linear, background 0.3s' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Question {current + 1} of {shuffled.length}
          </span>
          <span style={{ fontSize: 14, fontWeight: 900, color: timerColor, fontFamily: 'monospace' }}>
            ⏱ {timeLeft}s {timedOut && <span style={{ color: '#ef4444', fontSize: 11 }}> — Time Up!</span>}
          </span>
        </div>

        {/* Question */}
        <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15, lineHeight: 1.65, marginBottom: 22 }}>
          {q.question}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.shuffledOptions.map((opt, si) => {
            const originalIdx = q.shuffledToOriginal[si];
            const isSelected = responses[q.id] === originalIdx;
            const alreadyAnswered = responses[q.id] !== undefined;
            const locked = alreadyAnswered || timedOut;
            return (
              <label key={si} onClick={() => !locked && handleSelect(si)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                border: `1.5px solid ${isSelected ? '#10b981' : 'var(--border)'}`,
                borderRadius: 9, background: isSelected ? '#ecfdf5' : 'transparent',
                color: isSelected ? '#065f46' : locked ? 'var(--muted)' : 'var(--ink)',
                cursor: locked ? 'not-allowed' : 'pointer',
                opacity: locked && !isSelected ? 0.5 : 1,
                transition: 'all 0.18s',
              }}>
                <input type="radio" name={q.id} checked={isSelected} readOnly disabled={locked} style={{ margin: 0, accentColor: 'var(--teal)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14 }}>{opt}</span>
                {isSelected && <CheckCircle2 size={16} color="#10b981" />}
              </label>
            );
          })}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.4 : 1, fontWeight: 600, fontSize: 13 }}>
            ← Back
          </button>
          {current < shuffled.length - 1
            ? <button onClick={() => setCurrent(c => c + 1)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--teal)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Next →</button>
            : <button onClick={() => setDone(true)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Finish →</button>
          }
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, justifyContent: 'center' }}>
        {shuffled.map((sq, i) => {
          const ans = responses[sq.id];
          const done = ans !== undefined;
          return (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${i === current ? 'var(--teal)' : done ? '#10b981' : 'var(--border)'}`, background: done ? '#ecfdf5' : i === current ? 'var(--canvas)' : 'transparent', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: i === current ? 'var(--teal)' : done ? '#065f46' : 'var(--muted)' }}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}


