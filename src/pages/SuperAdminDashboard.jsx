import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, updateDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
// Add your Firebase UID here to protect this page.
// Find it in Firebase Console → Authentication → Users → your email → copy the "User UID"
const SUPER_ADMIN_UIDS = ['1jxQ32su82ZXGLB0qSHQny0QSl42'];

const TIERS = ['pilot', 'department', 'campus'];
const ROLES = ['student', 'teacher'];

// Generates a cryptographically secure 16-character invite code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => chars[b % chars.length])
    .join('');
}

function ttlDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight: '100vh', background: '#0b1120', color: '#e2e8f0', fontFamily: 'ui-sans-serif, system-ui, sans-serif', padding: '40px 32px' },
  heading: { fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 },
  sub: { fontSize: 14, color: '#64748b', marginBottom: 40 },
  grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, alignItems: 'start' },
  card: { background: '#131e30', border: '1px solid #1e2d45', borderRadius: 16, padding: 28 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#94a3b8', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, marginTop: 16 },
  input: { width: '100%', boxSizing: 'border-box', background: '#0d1626', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' },
  select: { width: '100%', boxSizing: 'border-box', background: '#0d1626', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' },
  btn: { width: '100%', marginTop: 20, padding: '12px 0', background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  badge: (color) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: color + '22', color }),
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', color: '#475569', fontWeight: 600, borderBottom: '1px solid #1e2d45' },
  td: { padding: '10px 12px', borderBottom: '1px solid #131e30', color: '#cbd5e1', verticalAlign: 'middle' },
  code: { fontFamily: 'monospace', background: '#0d1626', padding: '3px 8px', borderRadius: 6, letterSpacing: 2, fontSize: 13, color: '#0ff' },
  err: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12 },
  ok: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12 },
};

const TIER_COLORS = { pilot: '#f59e0b', department: '#0d9488', campus: '#8b5cf6' };

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Auth Guard ──
  const isAuthorized = user && SUPER_ADMIN_UIDS.includes(user.uid);

  // ── State ──
  const [orgs, setOrgs] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orgs'); // 'orgs' | 'codes'

  // New Org form
  const [orgId, setOrgId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [tier, setTier] = useState('pilot');
  const [orgMsg, setOrgMsg] = useState(null);

  // New Code form
  const [codeOrgId, setCodeOrgId] = useState('');
  const [codeRole, setCodeRole] = useState('student');
  const [codeDays, setCodeDays] = useState(45);
  const [codeMaxUses, setCodeMaxUses] = useState(100);
  const [codeMsg, setCodeMsg] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);

  useEffect(() => {
    if (!isAuthorized) return;
    fetchData();
  }, [isAuthorized]);

  async function fetchData() {
    setLoading(true);
    const [orgSnap, codeSnap] = await Promise.all([
      getDocs(collection(db, 'organizations')),
      getDocs(query(collection(db, 'invite_codes'), orderBy('created_at', 'desc'))),
    ]);
    setOrgs(orgSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setCodes(codeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  async function handleCreateOrg(e) {
    e.preventDefault();
    setOrgMsg(null);
    const id = orgId.trim().toLowerCase().replace(/\s+/g, '_');
    if (!id) return setOrgMsg({ type: 'err', text: 'org_id is required.' });
    const ref = doc(db, 'organizations', id);
    const existing = await getDoc(ref);
    if (existing.exists()) return setOrgMsg({ type: 'err', text: `org_id "${id}" already exists.` });
    await setDoc(ref, {
      org_id: id, org_name: orgName.trim(), dept_name: deptName.trim(),
      logo_url: logoUrl.trim() || '/srm-logo-final.webp',
      subscription_tier: tier, pilot_expires_at: tier === 'pilot' ? ttlDate(45) : null,
      created_at: new Date(),
    });
    setOrgMsg({ type: 'ok', text: `Organization "${orgName}" created!` });
    setOrgId(''); setOrgName(''); setDeptName(''); setLogoUrl('');
    fetchData();
  }

  async function handleGenerateCode(e) {
    e.preventDefault();
    setCodeMsg(null); setGeneratedCode(null);
    if (!codeOrgId) return setCodeMsg({ type: 'err', text: 'Select an organization first.' });
    const code = generateCode();
    const codeRef = doc(db, 'invite_codes', code);
    await setDoc(codeRef, {
      code,
      org_id: codeOrgId,
      role: codeRole,
      expires_at: ttlDate(Number(codeDays)),
      max_uses: Number(codeMaxUses),
      used_count: 0,
      created_at: new Date(),
      revoked: false,
    });
    setGeneratedCode(code);
    setCodeMsg({ type: 'ok', text: 'Code generated! Share this with the college HOD.' });
    fetchData();
  }

  async function revokeCode(code) {
    await updateDoc(doc(db, 'invite_codes', code), { revoked: true });
    fetchData();
  }

  // ── Not authorized ──
  if (!isAuthorized) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444' }}>Unauthorized</div>
        <div style={{ color: '#64748b', fontSize: 14 }}>
          {user ? `Your UID (${user.uid}) is not in SUPER_ADMIN_UIDS.` : 'You are not logged in.'}
        </div>
        <button onClick={() => navigate('/')} style={{ marginTop: 8, padding: '10px 24px', background: '#1e2d45', border: 'none', borderRadius: 8, color: '#e2e8f0', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const tabStyle = (t) => ({
    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
    background: activeTab === t ? '#0d9488' : 'transparent',
    color: activeTab === t ? '#fff' : '#64748b',
  });

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <div style={S.heading}>⚙️ Super Admin Dashboard</div>
          <div style={S.sub}>Manage organizations and generate invite codes for HODs</div>
        </div>
        <button onClick={() => navigate('/student')} style={{ padding: '10px 20px', background: '#1e2d45', border: 'none', borderRadius: 10, color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>← Back to App</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, background: '#131e30', padding: 6, borderRadius: 12, width: 'fit-content', border: '1px solid #1e2d45' }}>
        <button style={tabStyle('orgs')} onClick={() => setActiveTab('orgs')}>🏫 Organizations ({orgs.length})</button>
        <button style={tabStyle('codes')} onClick={() => setActiveTab('codes')}>🔑 Invite Codes ({codes.length})</button>
      </div>

      {loading ? (
        <div style={{ color: '#475569', textAlign: 'center', padding: 60 }}>Loading…</div>
      ) : activeTab === 'orgs' ? (
        <div style={S.grid}>
          {/* Create Org Form */}
          <div style={S.card}>
            <div style={S.cardTitle}>New Organization</div>
            <form onSubmit={handleCreateOrg}>
              <label style={S.label}>org_id (slug, e.g. vit_chennai)</label>
              <input style={S.input} value={orgId} onChange={e => setOrgId(e.target.value)} placeholder="vit_chennai" required />
              <label style={S.label}>College Name</label>
              <input style={S.input} value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="VIT University" required />
              <label style={S.label}>Department Name</label>
              <input style={S.input} value={deptName} onChange={e => setDeptName(e.target.value)} placeholder="Dept. of Electrical Engineering" required />
              <label style={S.label}>Logo URL (optional)</label>
              <input style={S.input} value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." />
              <label style={S.label}>Subscription Tier</label>
              <select style={S.select} value={tier} onChange={e => setTier(e.target.value)}>
                {TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
              <button type="submit" style={S.btn}>Create Organization</button>
              {orgMsg && <div style={orgMsg.type === 'ok' ? S.ok : S.err}>{orgMsg.text}</div>}
            </form>
          </div>

          {/* Org List */}
          <div style={S.card}>
            <div style={S.cardTitle}>All Organizations</div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Org</th>
                  <th style={S.th}>Tier</th>
                  <th style={S.th}>Dept</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map(o => (
                  <tr key={o.id}>
                    <td style={S.td}>
                      <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{o.org_name}</div>
                      <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{o.org_id}</div>
                    </td>
                    <td style={S.td}><span style={S.badge(TIER_COLORS[o.subscription_tier] || '#64748b')}>{o.subscription_tier}</span></td>
                    <td style={S.td} ><span style={{ fontSize: 12, color: '#64748b' }}>{o.dept_name}</span></td>
                  </tr>
                ))}
                {orgs.length === 0 && <tr><td colSpan={3} style={{ ...S.td, color: '#475569', textAlign: 'center', padding: 40 }}>No organizations yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={S.grid}>
          {/* Generate Code Form */}
          <div style={S.card}>
            <div style={S.cardTitle}>Generate Invite Code</div>
            <form onSubmit={handleGenerateCode}>
              <label style={S.label}>Organization</label>
              <select style={S.select} value={codeOrgId} onChange={e => setCodeOrgId(e.target.value)} required>
                <option value="">-- Select --</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.org_name} ({o.id})</option>)}
              </select>
              <label style={S.label}>Role this code grants</label>
              <select style={S.select} value={codeRole} onChange={e => setCodeRole(e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              <label style={S.label}>Expires in (days)</label>
              <input style={S.input} type="number" min={1} max={365} value={codeDays} onChange={e => setCodeDays(e.target.value)} />
              <label style={S.label}>Max Uses</label>
              <input style={S.input} type="number" min={1} max={5000} value={codeMaxUses} onChange={e => setCodeMaxUses(e.target.value)} />
              <button type="submit" style={S.btn}>⚡ Generate Code</button>
              {codeMsg && <div style={codeMsg.type === 'ok' ? S.ok : S.err}>{codeMsg.text}</div>}
              {generatedCode && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Share this code with the HOD:</div>
                  <div style={{ ...S.code, padding: '12px 20px', fontSize: 20, borderRadius: 10, cursor: 'pointer', border: '1px dashed #0ff4' }}
                    onClick={() => navigator.clipboard.writeText(generatedCode)} title="Click to copy">
                    {generatedCode}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>Click to copy</div>
                </div>
              )}
            </form>
          </div>

          {/* Code List */}
          <div style={S.card}>
            <div style={S.cardTitle}>All Invite Codes</div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Code</th>
                  <th style={S.th}>Org</th>
                  <th style={S.th}>Role</th>
                  <th style={S.th}>Uses</th>
                  <th style={S.th}>Expires</th>
                  <th style={S.th}></th>
                </tr>
              </thead>
              <tbody>
                {codes.map(c => {
                  const expired = c.expires_at?.toDate ? c.expires_at.toDate() < new Date() : new Date(c.expires_at?.seconds * 1000) < new Date();
                  const exhausted = c.used_count >= c.max_uses;
                  const statusColor = c.revoked ? '#ef4444' : expired || exhausted ? '#f59e0b' : '#10b981';
                  return (
                    <tr key={c.id}>
                      <td style={S.td}><span style={S.code}>{c.code}</span></td>
                      <td style={S.td}><span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>{c.org_id}</span></td>
                      <td style={S.td}><span style={S.badge(c.role === 'teacher' ? '#8b5cf6' : '#0d9488')}>{c.role}</span></td>
                      <td style={S.td}>{c.used_count} / {c.max_uses}</td>
                      <td style={S.td} style={{ fontSize: 11, color: statusColor }}>
                        {c.revoked ? 'Revoked' : expired ? 'Expired' : exhausted ? 'Exhausted' :
                          (c.expires_at?.toDate ? c.expires_at.toDate() : new Date(c.expires_at?.seconds * 1000)).toLocaleDateString()}
                      </td>
                      <td style={S.td}>
                        {!c.revoked && !expired && (
                          <button onClick={() => revokeCode(c.code)} style={{ background: '#ef44441a', border: '1px solid #ef444433', color: '#ef4444', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Revoke</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {codes.length === 0 && <tr><td colSpan={6} style={{ ...S.td, color: '#475569', textAlign: 'center', padding: 40 }}>No codes yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
