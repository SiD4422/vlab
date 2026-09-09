import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Loader2, CheckCircle2, XCircle, ShieldAlert, User, Check } from 'lucide-react';

export function AuthManager({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('status', '==', 'pending'));
      const snap = await getDocs(q);
      const users = [];
      snap.forEach(doc => {
        // Exclude current user just in case
        if (doc.id !== user.uid) {
          users.push({ id: doc.id, ...doc.data() });
        }
      });
      setPendingUsers(users);
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [user.uid]);

  const handleApprove = async (u) => {
    setProcessingId(u.id);
    try {
      await updateDoc(doc(db, 'users', u.id), { status: 'active' });
      setPendingUsers(prev => prev.filter(p => p.id !== u.id));
    } catch (err) {
      console.error('Failed to approve user', err);
      alert('Failed to approve user.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (u) => {
    if (!window.confirm(`Are you sure you want to reject ${u.name}?`)) return;
    setProcessingId(u.id);
    try {
      await updateDoc(doc(db, 'users', u.id), { status: 'rejected' });
      setPendingUsers(prev => prev.filter(p => p.id !== u.id));
    } catch (err) {
      console.error('Failed to reject user', err);
      alert('Failed to reject user.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div style={{ display:'flex',justifyContent:'center',padding:80 }}><Loader2 className="spin" size={36} color="#6366f1" /></div>;
  }

  return (
    <div style={{ background:'#fff',borderRadius:20,border:'1px solid rgba(99,102,241,0.08)',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
      <div style={{ padding:'24px 28px',borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ fontWeight:800,fontSize:20,color:'#1e1b4b',display:'flex',alignItems:'center',gap:12 }}>
          <ShieldAlert size={24} color="#f59e0b" />
          Pending Approvals
        </div>
        <div style={{ color:'#64748b',fontSize:14,marginTop:4 }}>Approve or reject new teachers and students waiting to join the platform.</div>
      </div>
      
      {pendingUsers.length === 0 ? (
        <div style={{ textAlign:'center',padding:'80px 0',color:'#94a3b8' }}>
          <CheckCircle2 size={48} style={{ margin:'0 auto 16px',display:'block',opacity:0.3,color:'#10b981' }}/>
          <div style={{ fontWeight:700,fontSize:18,color:'#1e1b4b' }}>All caught up!</div>
          <div style={{ color:'#64748b',fontSize:14,marginTop:4 }}>There are no users waiting for approval.</div>
        </div>
      ) : (
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:14 }}>
          <thead>
            <tr style={{ background:'linear-gradient(90deg,#f8f7ff,#f0f9ff)' }}>
              {['Name / Email','Role','Department','Action'].map((h,i)=>(
                <th key={h} style={{ padding:'14px 20px',textAlign:i===3?'right':'left',fontSize:12,fontWeight:800,color:'#4f46e5',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap',borderBottom:'1px solid rgba(99,102,241,0.1)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(u => (
              <tr key={u.id} className="table-row-hover" style={{ borderTop:'1px solid #f1f5f9',background:'#fff',transition:'all 0.2s' }}>
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:36,height:36,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #e2e8f0' }}>
                      {u.avatar?<img src={u.avatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={16} color="#94a3b8"/>}
                    </div>
                    <div>
                      <div style={{ fontWeight:700,color:'#1e1b4b',fontSize:14 }}>{u.name||'Unknown'}</div>
                      <div style={{ fontSize:12,color:'#64748b' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'14px 20px',color:'#475569',fontWeight:700,textTransform:'capitalize' }}>
                  {u.role}
                </td>
                <td style={{ padding:'14px 20px',color:'#475569',fontWeight:500 }}>
                  {u.department || 'N/A'} {u.role === 'student' && u.section ? `(${u.section})` : ''}
                </td>
                <td style={{ padding:'14px 20px',textAlign:'right' }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'flex-end',gap:8 }}>
                    <button 
                      onClick={() => handleApprove(u)}
                      disabled={processingId === u.id}
                      style={{ display:'inline-flex',alignItems:'center',gap:6,background:'#10b981',color:'#fff',border:'none',padding:'7px 16px',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer',opacity:processingId===u.id?0.5:1,transition:'all 0.2s' }}
                    >
                      {processingId===u.id ? <Loader2 size={14} className="spin"/> : <Check size={14}/>} Approve
                    </button>
                    <button 
                      onClick={() => handleReject(u)}
                      disabled={processingId === u.id}
                      style={{ display:'inline-flex',alignItems:'center',gap:6,background:'transparent',border:'1px solid #ef4444',color:'#ef4444',padding:'7px 14px',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer',opacity:processingId===u.id?0.5:1,transition:'all 0.2s' }}
                    >
                      <XCircle size={14}/> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
