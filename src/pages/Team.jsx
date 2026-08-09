import { Users } from 'lucide-react';
import { C } from '../App';

export default function Team() {
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
