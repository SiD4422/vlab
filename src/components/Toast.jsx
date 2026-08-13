/**
 * Toast.jsx — Slide-in notification component.
 * Usage: <Toast toasts={toasts} />
 * Pair with useToast() hook from src/hooks/useToast.js
 */
export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 12,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? '#1a0a0a' : t.type === 'success' ? '#0a1a0f' : '#0a1020',
          border: `1px solid ${t.type === 'error' ? '#ef4444' : t.type === 'success' ? '#22c55e' : '#3b82f6'}`,
          borderRadius: 14, padding: '14px 18px',
          minWidth: 320, maxWidth: 400,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          animation: 'toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          pointerEvents: 'all',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: t.type === 'error' ? 'rgba(239,68,68,0.15)'
              : t.type === 'success' ? 'rgba(34,197,94,0.15)'
              : 'rgba(59,130,246,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 16,
          }}>
            {t.type === 'error' ? '⛔' : t.type === 'success' ? '✅' : 'ℹ️'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4 }}>
              {t.title}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              {t.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
