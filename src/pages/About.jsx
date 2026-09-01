import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Brand Tokens ────────────────────────────────────────── */
const B = {
  bg:       "#0a0a12",
  bgCard:   "#0f0f1a",
  bgCard2:  "#12121f",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(56,189,248,0.4)",
  sky:      "#38bdf8",
  indigo:   "#818cf8",
  muted:    "#94a3b8",
  subtle:   "#475569",
  white:    "#f8fafc",
};

/* ─── Keyframe injection (runs once) ─────────────────────── */
function injectStyles() {
  if (document.getElementById("vlab-about-styles")) return;
  const style = document.createElement("style");
  style.id = "vlab-about-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }
    @keyframes dash {
      from { stroke-dashoffset: 200; }
      to   { stroke-dashoffset: 0; }
    }
    .vlab-fadeup { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
    .vlab-fadeup-1 { animation-delay: 0.05s; }
    .vlab-fadeup-2 { animation-delay: 0.15s; }
    .vlab-fadeup-3 { animation-delay: 0.25s; }
    .vlab-fadeup-4 { animation-delay: 0.35s; }

    .feat-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 28px;
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
      cursor: default;
    }
    .feat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(56,189,248,0.35);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.1);
    }

    .step-card {
      background: #0f0f1a;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 32px 28px;
      flex: 1;
      min-width: 240px;
      transition: border-color 0.25s;
    }
    .step-card:hover { border-color: rgba(129,140,248,0.4); }

    .cta-btn-primary {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .cta-btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(56,189,248,0.35);
    }

    .cta-btn-outline {
      background: transparent;
      color: ${B.white};
      border: 1px solid rgba(255,255,255,0.18);
      padding: 14px 32px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .cta-btn-outline:hover {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.35);
    }

    .nav-link {
      background: none;
      border: none;
      color: ${B.muted};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .nav-link:hover { color: ${B.white}; }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 0 32px;
    }
    .stat-item + .stat-item {
      border-left: 1px solid rgba(255,255,255,0.08);
    }
  `;
  document.head.appendChild(style);
}

/* ─── Feature data ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    iconBg: "rgba(56,189,248,0.1)",
    title: "Circuit Simulation",
    desc: "High-fidelity AC/DC circuit sandboxes. Build, probe, and analyse in real-time—no breadboard required.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    iconBg: "rgba(129,140,248,0.1)",
    title: "AI Viva Grading",
    desc: "Gemini AI dynamically questions each student, scores conceptual depth, and flags rote answers automatically.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    iconBg: "rgba(52,211,153,0.1)",
    title: "PDF Lab Records",
    desc: "One-click generation of NBA/NAAC-ready PDF lab records, complete with observations, diagrams, and viva answers.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    iconBg: "rgba(245,158,11,0.1)",
    title: "Anti-Cheat Analytics",
    desc: "Tab-switch detection, clipboard monitoring, and behavioural heatmaps surface academic dishonesty in real time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ),
    iconBg: "rgba(244,114,182,0.1)",
    title: "Teacher Dashboard",
    desc: "Manage classes, monitor live lab sessions, review submissions, and export grade reports—all from one panel.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.69 5.69l.77-.77a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
        <path d="M14.5 17.5 18 21l4-4"/>
      </svg>
    ),
    iconBg: "rgba(167,139,250,0.1)",
    title: "Real-time Broadcast",
    desc: "Teachers push experiment config, hints, and announcements live to every connected student simultaneously.",
  },
];

/* ─── Steps data ─────────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Institution signs up",
    desc: "Admin onboards via Google SSO. Department structure, teacher accounts, and invite codes are configured in minutes.",
    color: B.sky,
  },
  {
    num: "02",
    title: "Teacher creates class",
    desc: "Assign experiments, set deadlines, and customise viva question banks. Students receive a secure invite code.",
    color: B.indigo,
  },
  {
    num: "03",
    title: "Students join & learn",
    desc: "Students run simulations, complete AI viva sessions, and download their signed lab records—all in-browser.",
    color: "#34d399",
  },
];

/* ─── Stats data ─────────────────────────────────────────── */
const STATS = [
  { value: "12+",         label: "Lab Experiments" },
  { value: "Gemini AI",   label: "Powered" },
  { value: "NBA/NAAC",    label: "Ready" },
  { value: "PDF Export",  label: "One Click" },
];

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
export default function About() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    injectStyles();
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: B.bg,
        minHeight: "100vh",
        color: B.white,
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 48px",
          height: 64,
          background: scrolled
            ? "rgba(10,10,18,0.92)"
            : "rgba(10,10,18,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(56,189,248,0.3)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: B.white,
            }}
          >
            V-Lab
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: B.sky,
              background: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.25)",
              borderRadius: 4,
              padding: "2px 6px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Enterprise
          </span>
        </button>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.25)",
              color: B.sky,
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s, box-shadow 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(56,189,248,0.18)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(56,189,248,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(56,189,248,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "120px 24px 100px",
          overflow: "hidden",
        }}
      >
        {/* Background radial glows */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 500,
            background:
              "radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, rgba(129,140,248,0.06) 45%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(1px)",
          }}
        />
        {/* Grid texture */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto" }}>
          {/* Badge */}
          <div
            className="vlab-fadeup vlab-fadeup-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.25)",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: B.indigo,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: B.indigo,
                display: "inline-block",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            India's First AI-Powered Virtual Lab
          </div>

          {/* Headline */}
          <h1
            className="vlab-fadeup vlab-fadeup-2"
            style={{
              fontSize: "clamp(40px, 6vw, 68px)",
              fontWeight: 900,
              lineHeight: 1.07,
              letterSpacing: "-0.03em",
              color: B.white,
              margin: "0 0 24px",
            }}
          >
            Built for India's
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Engineering Colleges.
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="vlab-fadeup vlab-fadeup-3"
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: B.muted,
              lineHeight: 1.65,
              maxWidth: 580,
              margin: "0 auto 44px",
              fontWeight: 400,
            }}
          >
            V-Lab replaces physical lab benches with AI-powered circuit simulations, intelligent viva examiners, and one-click NBA/NAAC-ready PDF records—accessible from any browser.
          </p>

          {/* CTA Buttons */}
          <div
            className="vlab-fadeup vlab-fadeup-4"
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button className="cta-btn-primary" onClick={() => navigate("/")}>
              Sign in to V-Lab
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div
                style={{
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: B.subtle, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY V-LAB: FEATURE GRID ─────────────────────────── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: B.sky,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Why V-Lab
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: B.white,
                margin: "0 0 16px",
                lineHeight: 1.15,
              }}
            >
              Everything a modern lab needs,
              <br />
              <span style={{ color: B.muted, fontWeight: 600 }}>
                none of the physical overhead.
              </span>
            </h2>
            <p style={{ color: B.muted, fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
              Designed from the ground up for engineering departments across India.
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section
        style={{
          padding: "96px 24px",
          background: "rgba(255,255,255,0.015)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: B.indigo,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              How it works
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: B.white,
                margin: "0 0 16px",
                lineHeight: 1.15,
              }}
            >
              Up and running in
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #818cf8, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                three simple steps.
              </span>
            </h2>
          </div>

          {/* Steps row */}
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            {STEPS.map((step, i) => (
              <StepCard key={i} {...step} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {/* Gradient border card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.25))",
              borderRadius: 24,
              padding: "2px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0f0f1e 0%, #12121f 100%)",
                borderRadius: 22,
                padding: "64px 48px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Inner glow */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  height: 300,
                  background:
                    "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: B.sky,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  Get Started Today
                </div>
                <h2
                  style={{
                    fontSize: "clamp(28px, 4.5vw, 50px)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: B.white,
                    margin: "0 0 16px",
                    lineHeight: 1.1,
                  }}
                >
                  Ready to upgrade
                  <br />
                  your lab?
                </h2>
                <p
                  style={{
                    color: B.muted,
                    fontSize: 16,
                    maxWidth: 440,
                    margin: "0 auto 36px",
                    lineHeight: 1.6,
                  }}
                >
                  Join institutions across India already running AI-powered virtual labs with V-Lab Enterprise.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="cta-btn-primary"
                    onClick={() => navigate("/")}
                    style={{ padding: "15px 36px", fontSize: 15 }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {/* Logo wordmark */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(56,189,248,0.2)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span
            style={{ fontSize: 16, fontWeight: 800, color: B.white, letterSpacing: "-0.02em" }}
          >
            V-Lab
          </span>
        </button>

        {/* Footer nav */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button className="nav-link" onClick={() => navigate("/about")}>
            About
          </button>
          <button className="nav-link" onClick={() => navigate("/")}>
            Login
          </button>
        </div>

        {/* Copyright */}
        <div style={{ fontSize: 13, color: B.subtle }}>
          © {new Date().getFullYear()} V-Lab Enterprise. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════════ */

function FeatureCard({ icon, iconBg, title, desc }) {
  return (
    <div className="feat-card">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#f8fafc",
          margin: "0 0 10px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#94a3b8",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function StepCard({ num, title, desc, color, isLast }) {
  return (
    <div className="step-card" style={{ position: "relative" }}>
      {/* Connector line (not on last) */}
      {!isLast && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 40,
            right: -12,
            width: 24,
            height: 2,
            background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)",
            display: "none", // hidden on mobile; handled by flex layout
          }}
        />
      )}

      {/* Step number */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: `2px ${color}`,
          marginBottom: 20,
          lineHeight: 1,
          opacity: 0.85,
        }}
      >
        {num}
      </div>

      {/* Dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 12px ${color}60`,
          marginBottom: 14,
        }}
      />

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#f8fafc",
          margin: "0 0 10px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#94a3b8",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}
