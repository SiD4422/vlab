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
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    features: [
      '1 Teacher account',
      '1 Class (up to 20 students max)',
      '2 Circuit Experiments (1 AC, 1 DC)',
      'Basic analytics dashboard',
      'Email support',
    ],
    cta: 'Start Free Pilot',
    ctaBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
    note: 'No credit card. No commitment.',
  },
  {
    id: 'department',
    name: 'Department',
    price: '₹35,000',
    period: 'per year',
    tagline: 'For a single department',
    color: '#0d9488',
    glow: 'rgba(13,148,136,0.3)',
    popular: true,
    features: [
      'Up to 10 Teacher accounts',
      'Unlimited classes & students',
      'All experiments (including Wheatstone Bridge)',
      'Full analytics & submission reports',
      'AI Viva & Lab Report generation',
      'Priority email support',
      'PDF lab record exports',
    ],
    cta: 'Request Invoice',
    ctaBg: 'linear-gradient(135deg,#0d9488,#0891b2)',
    note: 'Includes annual renewal reminder 30 days early.',
  },
  {
    id: 'campus',
    name: 'Campus',
    price: '₹1,20,000',
    period: 'per year',
    tagline: 'White-label for your institution',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
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
    ctaBg: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    note: 'GST invoice provided. PO & NEFT/RTGS accepted.',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', color: '#e2e8f0', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e2d45' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>
          ⚡ VLab
        </button>
        <button onClick={() => navigate('/')} style={{ background: '#1e2d45', border: 'none', color: '#94a3b8', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          ← Back to App
        </button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 40px 60px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', color: '#0d9488', borderRadius: 999, padding: '6px 18px', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
          TRANSPARENT PRICING
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
          Virtual Labs for Every<br />
          <span style={{ background: 'linear-gradient(90deg,#0d9488,#0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Engineering Department</span>
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', maxWidth: 520, margin: '0 auto 12px' }}>
          No complex procurement. No hidden fees. We accept Purchase Orders, NEFT & RTGS.
        </p>
        <p style={{ fontSize: 13, color: '#475569' }}>GST invoice provided for all paid plans. All pricing in INR.</p>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', gap: 24, maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            flex: '1 1 300px', maxWidth: 360,
            background: plan.popular ? '#111d2e' : '#0f1826',
            border: `1px solid ${plan.popular ? plan.color : '#1e2d45'}`,
            borderRadius: 20,
            padding: '32px 28px',
            position: 'relative',
            boxShadow: plan.popular ? `0 0 40px ${plan.glow}` : 'none',
            display: 'flex', flexDirection: 'column',
          }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', borderRadius: 999, padding: '4px 16px', fontSize: 11, fontWeight: 800, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: plan.color, letterSpacing: 1, marginBottom: 8 }}>{plan.name.toUpperCase()}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{plan.price}</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{plan.period}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>{plan.tagline}</div>
            </div>

            <div style={{ borderTop: '1px solid #1e2d45', paddingTop: 20, marginBottom: 24, flex: 1 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: '#cbd5e1' }}>
                  <span style={{ color: plan.color, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedPlan(plan)}
              style={{ width: '100%', padding: '14px 0', background: plan.ctaBg, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}>
              {plan.cta}
            </button>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#475569' }}>{plan.note}</div>
          </div>
        ))}
      </div>

      {/* Trust signals */}
      <div style={{ borderTop: '1px solid #1e2d45', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Built for how Indian colleges actually work</h3>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
            We know your accounts department doesn't use Stripe. We accept <strong style={{ color: '#94a3b8' }}>NEFT, RTGS, and Purchase Orders</strong>.
            After your payment clears, your Teacher invite codes are sent to your registered email automatically.
            Need a formal quotation for your Principal? Fill the form above — you'll get a PDF in under 2 minutes.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', label: 'Data stays in India', sub: 'Firebase Asia-South1 (Mumbai)' },
              { icon: '📄', label: 'GST Invoice', sub: 'Included with every plan' },
              { icon: '🏦', label: 'PO & NEFT accepted', sub: 'No credit card required' },
              { icon: '📧', label: 'Codes via email', sub: 'Auto-sent after payment' },
            ].map((t, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{t.label}</div>
                <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>{t.sub}</div>
              </div>
            ))}
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
