import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceRequestModal from './InvoiceRequestModal';

const PLANS = [
  {
    id: 'pilot',
    name: 'Pilot',
    price: '₹0',
    period: '45 days',
    tagline: 'Try before you commit',
    color: '#94a3b8',
    glow: 'rgba(255,255,255,0.05)',
    features: [
      '1 Teacher account',
      '1 Class (up to 20 students max)',
      '2 Circuit Experiments (1 AC, 1 DC)',
      'Basic analytics dashboard',
      'Email support',
    ],
    cta: 'Start Free Pilot',
    ctaStyle: { background: 'transparent', border: '1px solid #cbd5e1', color: '#fff' },
    note: 'No credit card. No commitment.',
  },
  {
    id: 'pro_teacher',
    name: 'Pro Teacher',
    price: '₹4,999',
    period: 'per semester',
    tagline: 'For individual faculty',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.2)',
    popular: true,
    features: [
      '1 Teacher account',
      'Unlimited classes & students',
      'All 1st-Year experiments',
      'Full analytics & submission reports',
      'AI Viva & Lab Report generation',
      'Export PDF reports for NBA/NAAC',
    ],
    cta: 'Get Pro Teacher',
    ctaStyle: { background: 'linear-gradient(135deg, #38bdf8, #818cf8)', border: 'none', color: '#fff', boxShadow: '0 4px 14px rgba(56,189,248,0.3)' },
    note: 'Perfect for petty cash or out-of-pocket.',
  },
  {
    id: 'department',
    name: 'Department',
    price: '₹35,000',
    period: 'per year',
    tagline: 'For a single department',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.1)',
    features: [
      'Up to 10 Teacher accounts',
      'Everything in Pro Teacher',
      'HOD Overview Dashboard',
      'Centralized Student Roster',
      'Priority email support',
    ],
    cta: 'Request Invoice',
    ctaStyle: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
    note: 'Includes annual renewal reminder 30 days early.',
  },
  {
    id: 'campus',
    name: 'Campus',
    price: '₹1,20,000',
    period: 'per year',
    tagline: 'White-label for your institution',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.1)',
    features: [
      'Everything in Department',
      'Unlimited teachers across ALL departments',
      'Your college logo & name on every screen',
      'Custom domain (vlab.yourcollege.edu.in)',
      'Dedicated onboarding & training session',
      'Quarterly usage reports for NAAC/NBA',
      'SLA-backed 99.5% uptime',
    ],
    cta: 'Request Invoice',
    ctaStyle: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
    note: 'GST invoice provided. PO & NEFT/RTGS accepted.',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Grids & Glows */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.4, zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '-10%', left: '20%', width: '60%', height: '50%',
        background: 'radial-gradient(ellipse at top, rgba(56,189,248,0.15) 0%, transparent 60%)',
        filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Nav */}
        <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 900, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            V-Lab Enterprise
          </button>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }} onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,0.1)'}} onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,0.05)'}}>
            ← Back to App
          </button>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '80px 40px 60px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', borderRadius: 999, padding: '6px 18px', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
            TRANSPARENT PRICING
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Virtual Labs for Every<br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Engineering Department</span>
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto 12px', lineHeight: 1.6 }}>
            No complex procurement. No hidden fees. We accept Purchase Orders, NEFT & RTGS for seamless onboarding.
          </p>
          <p style={{ fontSize: 13, color: '#64748b' }}>GST invoice provided for all paid plans. All pricing in INR.</p>
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              flex: '1 1 280px', maxWidth: 320,
              background: plan.popular ? 'linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.8) 100%)' : 'rgba(15,23,42,0.5)',
              border: plan.popular ? `1px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '36px 28px',
              position: 'relative',
              boxShadow: plan.popular ? `0 24px 48px -12px ${plan.glow}` : 'none',
              display: 'flex', flexDirection: 'column',
              backdropFilter: 'blur(12px)',
              transform: plan.popular ? 'translateY(-8px)' : 'none',
            }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', borderRadius: 999, padding: '6px 20px', fontSize: 11, fontWeight: 800, letterSpacing: 1, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(56,189,248,0.3)' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: plan.popular ? plan.color : '#cbd5e1', letterSpacing: 1, marginBottom: 12 }}>{plan.name.toUpperCase()}</div>
                <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{plan.price}</div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 8, fontWeight: 500 }}>{plan.period}</div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 12, lineHeight: 1.5 }}>{plan.tagline}</div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, marginBottom: 32, flex: 1 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={plan.popular ? plan.color : '#64748b'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                style={{ ...plan.ctaStyle, width: '100%', padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 12, transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                {plan.cta}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>{plan.note}</div>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(15,23,42,0.8))' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h3 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>Built for how Indian colleges actually work</h3>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, maxWidth: 650, margin: '0 auto' }}>
              We know your accounts department doesn't use Stripe. We accept <strong style={{ color: '#fff' }}>NEFT, RTGS, and Purchase Orders</strong>.
              After your payment clears, your Teacher invite codes are sent to your registered email automatically.
              Need a formal quotation for your Principal? Fill the form above — you'll get a PDF in under 2 minutes.
            </p>
            <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 50, flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', label: 'Data stays in India', sub: 'Firebase Asia-South1 (Mumbai)' },
                { icon: '📄', label: 'GST Invoice', sub: 'Included with every plan' },
                { icon: '🏦', label: 'PO & NEFT accepted', sub: 'No credit card required' },
                { icon: '📧', label: 'Codes via email', sub: 'Auto-sent after payment' },
              ].map((t, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icon}</div>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>{t.label}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPlan && (
        <InvoiceRequestModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}
