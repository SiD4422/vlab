import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Menu, X, Globe, Lock, LogOut, User,
  Search, Check } from "lucide-react";
import Profile from "../Profile";
import { useAuth } from "../contexts/AuthContext";
import Home from "./Home";
import Team from "./Team";
import ExperimentSession from "./ExperimentSession";
import { EXPERIMENTS } from '../data/experiments.js';
import AIChatbot from "../AIChatbot";
import { C } from "../App";

export default function StudentApp() {
  const navigate = useNavigate();
  const { user, setUser, enrolledClass, setEnrolledClass, logout } = useAuth();
  const [view, setView] = useState("home");
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // bridgeState lives here — correct scope for the student session
  // (resets naturally when the user logs out/navigates away)

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
            <span style={{ color: "#c3c9d6", cursor: "pointer" }} onClick={() => navigate("/about")} onMouseOver={(e) => e.currentTarget.style.color = "#fff"} onMouseOut={(e) => e.currentTarget.style.color = "#c3c9d6"}>About</span>
            <button onClick={() => setUnlocked(!unlocked)} style={{ display: "none" }}>Toggle</button>
          </div>
        </div>
      </div>

      {view === "home" ? (
        <Home onOpen={openExperiment} unlocked={unlocked} collapsedCategories={collapsedCategories} toggleCategory={toggleCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} completed={completed} />

      ) : view === "detail" && active ? (
        <ExperimentSession
          exp={active}
          tab={tab}
          setTab={setTab}
          onBack={() => setView("home")}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          markCompleted={() => markCompleted(active.id)}
          bridgeSims={bridgeSims}
          setBridgeSims={setBridgeSims}
        />
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
        </div>

        {/* Copyright */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 40px", textAlign: "center", fontSize: 13, color: "#8891a3" }}>
          © {new Date().getFullYear()} State University, Department of Electrical &amp; Electronics Engineering. All rights reserved.
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
            <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "var(--shellSoft)" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
        </div>
      </div>
      
      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.card, padding: 32, borderRadius: 16, width: "90%", maxWidth: 400, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", border: `1px solid ${C.border}` }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 800, color: C.ink }}>Sign Out</h3>
            <p style={{ margin: "0 0 24px", color: C.muted, fontSize: 15, lineHeight: 1.6 }}>Are you sure you want to sign out of your account?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.ink, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { setShowLogoutModal(false); logout(); }} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Global AI Chatbot Widget */}
      <AIChatbot currentExperiment={active?.title} />
    </div>
  );
}
