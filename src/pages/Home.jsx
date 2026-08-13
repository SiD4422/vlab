import { useState } from 'react';
import {
  Zap, BookOpen, Link2, Target, ArrowLeft, Loader2, CheckCircle2,
  Star, ChevronRight, Cpu, Activity, GraduationCap, Lock, Search,
} from 'lucide-react';
import { C } from '../App';
import { EXPERIMENTS } from '../data/experiments.js';
import { db } from '../services/firebase';
import { doc, getDoc, arrayUnion, writeBatch } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

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

export default function Home({ onOpen, collapsedCategories, toggleCategory, searchQuery, setSearchQuery, completed }) {
  const { user, enrolledClass, setEnrolledClass } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(null);

  const joinClass = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    try {
      const code = inviteCode.trim().toUpperCase();
      const classDocRef = doc(db, 'classes', code);
      const classDoc = await getDoc(classDocRef);

      if (!classDoc.exists()) {
        setJoinError("Invalid class code. Please double-check and try again.");
      } else {
        const batch = writeBatch(db);
        batch.update(classDocRef, { studentUids: arrayUnion(user.uid) });
        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
          enrolledTeacherUids: arrayUnion(classDoc.data().teacherUid),
          lastJoinedClassId: classDoc.id,
        });
        await batch.commit();
        setEnrolledClass({ id: classDoc.id, ...classDoc.data() });
        setInviteCode('');
        setJoinError(null);
        setJoinSuccess("Successfully joined " + classDoc.data().className + "!");
      }
    } catch (e) {
      console.error("Error joining class:", e);
      setJoinError("Failed to join class. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div style={{ background: C.canvas, minHeight: "100vh" }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: C.shell, padding: "40px", textAlign: "center",
        borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden",
        minHeight: "calc(100vh - 72px)", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
      }}>
        <video autoPlay loop muted playsInline src="/hero-bg.mp4"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, filter: "blur(4px)" }}
        />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(18, 24, 38, 0.75)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(31,122,114,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -150, right: -50, width: 500, height: 500, background: "radial-gradient(circle, rgba(193,113,47,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ background: "rgba(193, 113, 47, 0.15)", border: `1px solid rgba(193, 113, 47, 0.3)`, color: C.copper, padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <Cpu size={16} /> ELECTRICAL &amp; ELECTRONICS ENGINEERING
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
            style={{ background: C.copper, color: "#fff", border: "none", borderRadius: 8, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(193, 113, 47, 0.4)", display: "inline-flex", alignItems: "center", gap: 10, transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(193, 113, 47, 0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(193, 113, 47, 0.4)"; }}
          >
            Explore Experiments <ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} />
          </button>
        </div>

        {/* Floating sticker */}
        <div style={{ position: "absolute", bottom: "50px", right: "50px", zIndex: 10, width: "120px", height: "120px", background: "linear-gradient(135deg, #c1712f 0%, #8f5320 100%)", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.3)", transform: "rotate(-10deg)", border: "4px dashed rgba(255,255,255,0.3)", userSelect: "none" }}>
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
          { icon: Zap, title: "Circuit Sandbox", desc: "Build custom circuits with a full drag-and-drop physics simulator — resistors, capacitors, inductors, AC sources, and more." },
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

        {/* Class Join Panel */}
        <div style={{ width: '100%', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, padding: '28px 36px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: 24, border: '1px solid rgba(13, 148, 136, 0.1)', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04), inset 0 2px 0 rgba(255,255,255,0.8)', position: 'relative', overflow: 'hidden' }}>
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#ecfdf5', color: '#059669', borderRadius: 999, fontWeight: 700, fontSize: 15, border: '1px solid #a7f3d0', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)' }}>
                <CheckCircle2 size={18} /> Enrolled
              </div>
            ) : (
              <>
                <form onSubmit={joinClass} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: 6, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text" placeholder="Class Code (VLAB-...)" value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    style={{ width: 260, padding: '12px 16px 12px 42px', borderRadius: 12, border: '2px solid transparent', background: '#f8fafc', fontSize: 14, fontWeight: 600, color: '#1e293b', textTransform: 'uppercase', outline: 'none', transition: 'all 0.2s' }}
                    onFocus={e => { e.target.style.background = '#fff'; e.target.style.border = '2px solid rgba(13,148,136,0.3)'; }}
                    onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.border = '2px solid transparent'; }}
                  />
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <BookOpen size={18} />
                  </div>
                </div>
                <button type="submit" disabled={joining || !inviteCode.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: (joining || !inviteCode.trim()) ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #0f766e)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: (joining || !inviteCode.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: (joining || !inviteCode.trim()) ? 'none' : '0 4px 12px rgba(13,148,136,0.3)' }}
                  onMouseOver={e => { if (!joining && inviteCode.trim()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { if (!joining && inviteCode.trim()) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {joining ? <Loader2 className="spin" size={18} /> : <Link2 size={18} />} Join Class
                </button>
              </form>
              {joinError && (
                <div style={{ marginTop: 10, padding: '8px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
                  {joinError}
                </div>
              )}
              {joinSuccess && (
                <div style={{ marginTop: 10, padding: '8px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, color: '#065f46', fontSize: 13, fontWeight: 600 }}>
                  {joinSuccess}
                </div>
              )}
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>Available Experiments</h2>
            <div style={{ position: "relative", marginTop: 16, width: "100%", maxWidth: 400 }}>
              <Search size={18} color={C.muted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text" placeholder="Search experiments by name or tag..." value={searchQuery}
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
              { title: "Sensors & Transducers", filter: exp => exp.id !== "wheatstone-bridge" && !exp.id.includes("kelvin") && !exp.tag.startsWith("AC-") },
            ].map(category => {
              const isCollapsed = collapsedCategories[category.title];
              const categoryExps = EXPERIMENTS.filter(category.filter).filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.tag.toLowerCase().includes(searchQuery.toLowerCase()));
              if (categoryExps.length === 0) return null;
              return (
                <div key={category.title}>
                  <div onClick={() => toggleCategory(category.title)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderBottom: `2px solid var(--border)`, paddingBottom: 8, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{category.title}</h3>
                    <ChevronRight size={20} color="var(--muted)" style={{ transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.2s ease" }} />
                  </div>
                  {!isCollapsed && (() => {
                    const completedCount = categoryExps.filter(e => completed?.includes(e.id)).length;
                    const pct = categoryExps.length > 0 ? (completedCount / categoryExps.length) * 100 : 0;
                    return completedCount > 0 ? (
                      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--teal), #14b8a6)', borderRadius: 99, transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', whiteSpace: 'nowrap' }}>{completedCount}/{categoryExps.length} done</span>
                      </div>
                    ) : null;
                  })()}
                  {!isCollapsed && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                      {categoryExps.map(exp => {
                        const isLocked = false;
                        const isCompleted = completed?.includes(exp.id);
                        return (
                          <button key={exp.id} onClick={() => { if (!isLocked) onOpen(exp.id); }} className="class-card"
                            style={{ textAlign: "left", cursor: isLocked ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", gap: 12, opacity: isLocked ? 0.7 : 1, border: isCompleted ? '1.5px solid var(--teal)' : 'none', background: 'var(--card)', position: 'relative', overflow: 'hidden' }}
                          >
                            {isCompleted && (
                              <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 4px 12px rgba(31,122,114,0.4)' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                              <span className={isLocked ? "status-badge pending" : "status-badge graded"} style={{ fontSize: 12 }}>{exp.tag}</span>
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
