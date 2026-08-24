import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, Globe, Zap, Users, Shield, Code, ChevronRight } from "lucide-react";
import { C } from "../App";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ background: C.ink, minHeight: "100vh", color: C.canvas, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>
      
      {/* Navbar */}
      <nav aria-label="About page navigation" style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.shellSoft}`, background: "rgba(18, 24, 38, 0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: C.copper, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={24} color="#000" aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>V-Lab</div>
            <div style={{ fontSize: 11, color: C.copper, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>About Platform</div>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
          style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.shellSoft}`, color: "#fff", padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.background = C.shellSoft; e.currentTarget.style.borderColor = C.shell; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.shellSoft; }}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Go Back
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section style={{ padding: "100px 20px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", background: `radial-gradient(circle at 50% 50%, ${C.teal}15 0%, transparent 50%)`, zIndex: 0, pointerEvents: "none" }} aria-hidden="true" />
          
          <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "inline-block", padding: "6px 16px", background: `${C.copper}20`, color: C.copper, borderRadius: 999, fontSize: 14, fontWeight: 700, letterSpacing: "1px", marginBottom: 24, border: `1px solid ${C.copper}40` }}>
              THE FUTURE OF ENGINEERING EDUCATION
            </div>
            <h1 style={{ fontSize: "4rem", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: "#fff", letterSpacing: "-1px" }}>
              Bridging the Gap Between <span style={{ color: C.copper }}>Theory</span> and <span style={{ color: C.teal }}>Practice.</span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: C.muted, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 40px" }}>
              V-Lab is a next-generation virtual laboratory platform designed for modern engineering students. We provide interactive circuit sandboxes, AI-driven viva evaluations, and seamless lab report generation.
            </p>
            <button 
              onClick={() => navigate("/")}
              style={{ background: C.teal, color: "#000", border: "none", padding: "16px 32px", borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "transform 0.2s, boxShadow 0.2s", boxShadow: `0 0 20px ${C.teal}40` }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 25px ${C.teal}60`; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 20px ${C.teal}40`; }}
            >
              Get Started <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section aria-label="Platform features" style={{ padding: "80px 20px", background: C.shell, borderTop: `1px solid ${C.shellSoft}`, borderBottom: `1px solid ${C.shellSoft}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2 style={{ fontSize: "2.5rem", color: "#fff", fontWeight: 800, marginBottom: 16 }}>Built for Modern Learning</h2>
              <p style={{ color: C.muted, fontSize: "1.1rem" }}>Everything you need to master electronics, right in your browser.</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
              <FeatureCard 
                icon={<Zap size={32} color={C.copper} aria-hidden="true" />}
                title="Interactive Circuit Sandbox"
                description="Design, simulate, and analyze circuits in real-time. A completely safe environment to test theories without burning physical components."
              />
              <FeatureCard 
                icon={<Globe size={32} color={C.teal} aria-hidden="true" />}
                title="AI-Powered Viva Voce"
                description="An intelligent examiner that dynamically quizzes you based on your actions, ensuring deep conceptual understanding."
              />
              <FeatureCard 
                icon={<Code size={32} color="#8b5cf6" aria-hidden="true" />}
                title="Automated Lab Reports"
                description="Focus on learning, not formatting. V-Lab automatically compiles your observations, circuits, and answers into a professional PDF report."
              />
              <FeatureCard 
                icon={<Shield size={32} color="#10b981" aria-hidden="true" />}
                title="Role-Based Security"
                description="Granular access controls ensure students have the tools they need while teachers retain full control over assignments and grading."
              />
              <FeatureCard 
                icon={<Users size={32} color="#f59e0b" aria-hidden="true" />}
                title="Classroom Integration"
                description="Teachers can easily monitor progress, review submitted reports, and track individual student performance across all experiments."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: C.shellSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Cpu size={24} color={C.copper} aria-hidden="true" />
        </div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>V-Lab Platform</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>© {new Date().getFullYear()} V-Lab Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}


function FeatureCard({ icon, title, description }) {
  return (
    <div 
      style={{ background: C.ink, border: `1px solid ${C.shellSoft}`, borderRadius: 16, padding: 32, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default" }}
      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = C.copper; e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5)`; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = C.shellSoft; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 16, background: C.shell, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.25rem", color: "#fff", fontWeight: 700, marginBottom: 12 }}>{title}</h3>
      <p style={{ color: C.muted, lineHeight: 1.6, fontSize: "0.95rem" }}>{description}</p>
    </div>
  );
}
