import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceRequestModal from './InvoiceRequestModal';

const PLANS = [
  {
    id: 'pilot',
    name: 'Pilot',
    price: '₹0',
    period: '45 days',
    tagline: 'For individuals getting started.',
    accent: '#3b82f6', // Blue
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
    ),
    features: [
      '1 Teacher account',
      '1 Class (up to 20 students max)',
      '2 Circuit Experiments (1 AC, 1 DC)',
      'Basic analytics dashboard',
      'Email support',
    ],
    cta: 'Get Started',
    ctaStyle: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
    note: 'No credit card required',
  },
  {
    id: 'pro_teacher',
    name: 'Pro Teacher',
    price: '₹4,999',
    period: '/ semester',
    tagline: 'For growing classrooms.',
    accent: '#8b5cf6', // Purple
    popular: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
    ),
    features: [
      '1 Teacher account',
      'Unlimited classes & students',
      'All 1st-Year experiments',
      'Full analytics & submission reports',
      'AI Viva & Lab Report generation',
      'Export PDF reports for NBA/NAAC',
    ],
    cta: 'Start Free Trial',
    ctaStyle: { background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: 'none', color: '#fff' },
    note: 'Perfect for petty cash or out-of-pocket.',
  },
  {
    id: 'department',
    name: 'Department',
    price: '₹35,000',
    period: '/ year',
    tagline: 'For a single department.',
    accent: '#10b981', // Green
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    ),
    features: [
      'Up to 10 Teacher accounts',
      'Everything in Pro Teacher',
      'HOD Overview Dashboard',
      'Centralized Student Roster',
      'Priority email support',
    ],
    cta: 'Request Invoice',
    ctaStyle: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
    note: 'Includes annual renewal reminder',
  },
  {
    id: 'campus',
    name: 'Campus',
    price: 'Custom',
    period: '',
    tagline: 'For large institutions.',
    accent: '#f59e0b', // Amber/Yellow
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
    ),
    features: [
      'Everything in Department',
      'Unlimited teachers & departments',
      'Your college logo & branding',
      'Custom domain (vlab.college.edu)',
      'Dedicated onboarding & training',
      'Quarterly NAAC/NBA reports',
      'SLA-backed 99.5% uptime',
    ],
    cta: 'Contact Sales',
    ctaStyle: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
    note: 'White-label setup included',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#08080c', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Nav */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          V-Lab
        </button>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
          Log in
        </button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
          PRICING
        </div>
        <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Choose the plan that<br />
          fits <span style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your institution</span>
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
          Simple, transparent pricing. Upgrade, downgrade or cancel anytime.
        </p>
      </div>

      {/* Plans Container */}
      <div style={{ display: 'flex', gap: 20, maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
        {PLANS.map(plan => {
          // The gradient border wrapper for the popular plan
          const isPopular = plan.popular;
          return (
            <div key={plan.id} style={{
              flex: '1 1 260px', maxWidth: 300,
              background: isPopular ? 'linear-gradient(180deg, #8b5cf6, rgba(59,130,246,0.2))' : 'transparent',
              padding: isPopular ? '1px' : '0', // The 1px padding creates the gradient border effect
              borderRadius: 20,
              position: 'relative',
              display: 'flex', flexDirection: 'column'
            }}>
              
              {isPopular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', borderRadius: 999, padding: '4px 12px', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 10 }}>
                  MOST POPULAR
                </div>
              )}

              {/* Actual Card Inside */}
              <div style={{
                background: '#12121a',
                border: isPopular ? 'none' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: isPopular ? 19 : 20,
                padding: '32px 24px',
                flex: 1,
                display: 'flex', flexDirection: 'column'
              }}>
                
                {/* Header (Icon + Text) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${hexToRgb(plan.accent)}, 0.1)`, color: plan.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 22, height: 22 }}>{plan.icon}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{plan.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.3 }}>{plan.tagline}</div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{plan.period}</span>
                </div>

                {/* Features */}
                <div style={{ flex: 1, marginBottom: 32 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, fontSize: 13, color: '#cbd5e1' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={plan.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span style={{ marginTop: 1 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => setSelectedPlan(plan)}
                  style={{ ...plan.ctaStyle, width: '100%', padding: '12px 0', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 16, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  {plan.cta}
                </button>
                <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>{plan.note}</div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trust signals bottom bar */}
      <div style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', background: '#12121a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '32px 40px', display: 'flex', gap: 20, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>, label: '14-day free trial', sub: 'Test all features. No risk.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, label: 'Secure & Compliant', sub: 'Firebase Mumbai Data Region.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 3.84-10.56l-3.33 2.01"></path></svg>, label: 'PO & NEFT Accepted', sub: 'No credit card required.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>, label: '24/7 Support', sub: 'We\'re here to help.' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: 14, marginBottom: 2 }}>{t.label}</div>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPlan && (
        <InvoiceRequestModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}

// Helper to convert hex to rgb for rgba() usage
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255,255,255';
}
