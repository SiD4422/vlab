/**
 * Section.jsx — Reusable section wrapper used throughout experiment tabs.
 * Renders a title + children inside a consistent layout.
 */
export default function Section({ title, children, id }) {
  return (
    <div style={{ marginBottom: 40 }} id={id}>
      <div style={{
        fontSize: 16, fontWeight: 800, color: 'var(--ink)',
        letterSpacing: 0.5, textTransform: 'uppercase',
        marginBottom: 16, paddingBottom: 12,
        borderBottom: '2px solid var(--border)',
      }}>
        {title}
      </div>
      <div style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}
