import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { CheckCircle2, XCircle, Loader2, GraduationCap, Clock, AlertTriangle } from 'lucide-react';

const C = {
  ink: '#1e293b', muted: '#64748b', border: '#e2e8f0', card: '#fff',
  canvas: '#f8fafc', teal: '#0d9488', danger: '#ef4444',
};

export default function TeacherRequests() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');
  const [confirmReject, setConfirmReject] = useState(null); // teacher object awaiting confirmation

  const fetchPending = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'teacher'), where('status', '==', 'pending'));
      const snap = await getDocs(q);
      setPending(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Error fetching pending teachers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (teacher) => {
    setActionLoading(teacher.id);
    try {
      await updateDoc(doc(db, 'users', teacher.id), { status: 'active', approvedAt: new Date().toISOString() });
      setMsg(`✅ ${teacher.name} approved successfully.`);
      setPending(p => p.filter(t => t.id !== teacher.id));
    } catch (e) {
      setMsg('❌ Failed to approve. Please try again.');
    } finally {
      setActionLoading(null);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const reject = async (teacher) => {
    setConfirmReject(null);
    setActionLoading(teacher.id);
    try {
      await updateDoc(doc(db, 'users', teacher.id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
      });
      setMsg(`❌ ${teacher.name}'s registration has been declined.`);
      setPending(p => p.filter(t => t.id !== teacher.id));
    } catch (e) {
      setMsg('❌ Failed to decline. Please try again.');
    } finally {
      setActionLoading(null);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.ink }}>Teacher Registration Requests</h2>
          <div style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Review and approve pending teacher accounts</div>
        </div>
        <div style={{ marginLeft: 'auto', background: pending.length > 0 ? '#fef3c7' : '#f0fdf4', color: pending.length > 0 ? '#92400e' : '#166534', border: `1px solid ${pending.length > 0 ? '#fcd34d' : '#a7f3d0'}`, borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
          {pending.length} pending
        </div>
      </div>

      {msg && (
        <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 10, background: msg.startsWith('✅') ? '#f0fdf4' : msg.startsWith('❌') ? '#fef2f2' : '#fef3c7', border: `1px solid ${msg.startsWith('✅') ? '#a7f3d0' : msg.startsWith('❌') ? '#fca5a5' : '#fcd34d'}`, color: msg.startsWith('✅') ? '#166534' : msg.startsWith('❌') ? '#991b1b' : '#92400e', fontWeight: 600, fontSize: 14 }}>
          {msg}
        </div>
      )}

      {/* Inline reject confirmation */}
      {confirmReject && (
        <div style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 12, background: '#fff7ed', border: '1px solid #fdba74', color: '#9a3412' }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Decline this registration?</div>
          <div style={{ fontSize: 14, marginBottom: 12 }}>
            This will mark <b>{confirmReject.name}</b>'s account as declined. They will be informed on their next login and will not be able to access the teacher dashboard.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => reject(confirmReject)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Yes, Decline</button>
            <button onClick={() => setConfirmReject(null)} style={{ background: 'transparent', border: '1px solid #dc2626', color: '#dc2626', padding: '8px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.muted, padding: '40px 0' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading pending requests...
        </div>
      ) : pending.length === 0 ? (
        <div style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center', color: C.muted }}>
          <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 6 }}>All clear!</div>
          <div style={{ fontSize: 14 }}>No pending teacher registration requests at the moment.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pending.map(teacher => (
            <div key={teacher.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.email}`}
                alt="avatar"
                style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${C.border}`, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.ink, marginBottom: 2 }}>{teacher.name}</div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>{teacher.email}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {teacher.department && <span style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{teacher.department}</span>}
                  <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> Pending since {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'recently'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <button
                  onClick={() => approve(teacher)}
                  disabled={actionLoading === teacher.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#059669', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: actionLoading === teacher.id ? 'not-allowed' : 'pointer', opacity: actionLoading === teacher.id ? 0.7 : 1, transition: 'all 0.15s' }}
                >
                  {actionLoading === teacher.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />}
                  Approve
                </button>
                <button
                  onClick={() => setConfirmReject(teacher)}
                  disabled={actionLoading === teacher.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: C.danger, border: `1px solid ${C.danger}`, padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: actionLoading === teacher.id ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                >
                  <XCircle size={14} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
