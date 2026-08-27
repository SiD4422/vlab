import React from 'react';
import { User, Users, BookOpen, Plus, Loader2, CheckCircle2, X, ChevronRight, Clock, FileText, Edit3, LayoutDashboard, GraduationCap, ClipboardList, LogOut, Search, Trash2, UserPlus, Sparkles, AlertTriangle, UploadCloud, Trophy, BarChart2, ShieldAlert } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { EXPERIMENTS } from '../../data/experiments';

const GRADIENTS = [
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
  'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)',
];

function getGradient(str) {
  let h = 0;
  for (let i=0;i<str.length;i++) h = str.charCodeAt(i)+((h<<5)-h);
  return GRADIENTS[Math.abs(h)%GRADIENTS.length];
}

export function ClassList({
  classes, submissions, showCreateForm, setShowCreateForm, createClass, 
  newClassName, setNewClassName, creating, searchQ, filtCls, 
  openManageStudents, managingClass, setManagingClass, deleteClass, 
  deletingClass, loadingStudents, classStudents, removeStudent, 
  removingStudentId, broadcastExpId, setBroadcastExpId, setClasses, user
}) {
  return (
    <>
                <div>
                  {showCreateForm && (
                    <div style={{ marginBottom:32,background:'#fff',borderRadius:20,padding:'24px 28px',boxShadow:'0 8px 40px rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.08)' }}>
                      <div style={{ fontWeight:800,fontSize:18,color:'#1e1b4b',marginBottom:16 }}>Create a New Class</div>
                      <form onSubmit={createClass} style={{ display:'flex',gap:14 }}>
                        <input type="text" placeholder="Class name (e.g. EEE-101 Fall 2026)" value={newClassName} onChange={e=>setNewClassName(e.target.value)} style={{ flex:1,padding:'12px 16px',borderRadius:12,border:'1px solid #cbd5e1',fontSize:15,color:'#1e1b4b',outline:'none',fontFamily:'inherit',transition:'all 0.2s' }} onFocus={e=>e.target.style.outline='2px solid #818cf8'} onBlur={e=>e.target.style.outline='none'} />
                        <button type="submit" disabled={creating} style={{ display:'flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',padding:'0 24px',borderRadius:12,fontWeight:700,fontSize:14,cursor:creating?'not-allowed':'pointer',opacity:creating?0.7:1,boxShadow:'0 4px 12px rgba(99,102,241,0.3)' }}>
                          {creating?<Loader2 className="spin" size={16}/>:<Plus size={16}/>} Create
                        </button>
                        <button type="button" onClick={()=>setShowCreateForm(false)} style={{ background:'#f1f5f9',border:'none',color:'#64748b',padding:'0 20px',borderRadius:12,fontWeight:600,fontSize:14,cursor:'pointer',transition:'background 0.2s' }} onMouseEnter={e=>e.target.style.background='#e2e8f0'} onMouseLeave={e=>e.target.style.background='#f1f5f9'}>Cancel</button>
                      </form>
                    </div>
                  )}
                  {classes.slice(0,2).length>0 && (
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(380px,1fr))',gap:24,marginBottom:40 }}>
                      {classes.slice(0,2).map(c=><FeaturedCard key={c.id} cls={c} subs={submissions} onManage={openManageStudents}/>)}
                    </div>
                  )}
                  {classes.length>0 && (
                    <>
                      <div style={{ fontWeight:800,fontSize:20,color:'#1e1b4b',marginBottom:20 }}>All Classes</div>
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:20 }}>
                        {(searchQ?filtCls:classes).map(c=><SmallCard key={c.id} cls={c} subs={submissions} onManage={openManageStudents}/>)}
                      </div>
                    </>
                  )}
                  {classes.length===0 && (
                    <div style={{ textAlign:'center',padding:'80px 0',color:'#94a3b8' }}>
                      <BookOpen size={56} style={{ margin:'0 auto 20px',display:'block',opacity:0.3,color:'#6366f1' }}/>
                      <div style={{ fontWeight:800,fontSize:22,color:'#1e1b4b',marginBottom:8 }}>No Classes Yet</div>
                      <div style={{ fontSize:15 }}>Click Create Class to get started.</div>
                    </div>
                  )}
                </div>
      {managingClass && (
        <div style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
          <div style={{ background:'#fff',width:'100%',maxWidth:720,maxHeight:'85vh',borderRadius:24,border:'1px solid rgba(99,102,241,0.1)',display:'flex',flexDirection:'column',boxShadow:'0 32px 64px rgba(0,0,0,0.4)' }}>
            <div style={{ padding:'24px 32px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(to right, #ffffff, #f8fafc)',borderRadius:'24px 24px 0 0' }}>
              <div>
                <div style={{ fontWeight:900,fontSize:20,color:'#1e1b4b' }}>Manage Students</div>
                <div style={{ color:'#64748b',fontSize:14,marginTop:4,fontWeight:500 }}>{managingClass.className} · Invite Code: <strong style={{ color:'#4f46e5',background:'#e0e7ff',padding:'2px 8px',borderRadius:6,fontFamily:'monospace',fontSize:15 }}>{managingClass.inviteCode}</strong></div>
              </div>
              <div style={{ display:'flex',gap:12, alignItems:'center' }}>
                <label style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }} onMouseEnter={e=>e.target.style.background='#f1f5f9'} onMouseLeave={e=>e.target.style.background='#f8fafc'}>
                  <UploadCloud size={16} /> Bulk Import
                  <input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                      const text = evt.target.result;
                      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                      if (lines.length < 2) return alert('CSV must have a header row and data.');
                      // Assuming header: Name, Email, RegNo
                      const newRoster = [];
                      for (let i = 1; i < lines.length; i++) {
                        const cols = lines[i].split(',');
                        if (cols.length >= 2) {
                          newRoster.push({ name: cols[0].trim(), email: cols[1].trim(), regNo: cols[2] ? cols[2].trim() : '', status: 'Pending Invite' });
                        }
                      }
                      // Save to class doc
                      const classRef = doc(db, 'classes', managingClass.id);
                      const updatedRoster = [...(managingClass.roster || []), ...newRoster];
                      const newEmails = newRoster.map(s => s.email.toLowerCase());
                      const updatedPendingEmails = [...(managingClass.pendingEmails || []), ...newEmails];
                      
                      await updateDoc(classRef, { 
                        roster: updatedRoster,
                        pendingEmails: updatedPendingEmails 
                      });
                      setManagingClass({ 
                        ...managingClass, 
                        roster: updatedRoster,
                        pendingEmails: updatedPendingEmails
                      });
                      alert(`Successfully added ${newRoster.length} students to the pending roster.`);
                    };
                    reader.readAsText(file);
                  }} />
                </label>
                <select 
                  value={broadcastExpId} 
                  onChange={e=>setBroadcastExpId(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 600, color: '#1e1b4b', background: '#fff', outline: 'none' }}
                >
                  <option value="">Select Experiment to Broadcast...</option>
                  {EXPERIMENTS.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
                <button 
                  disabled={!broadcastExpId}
                  onClick={() => window.location.href = `/teacher?broadcast=true&expId=${broadcastExpId}&classId=${managingClass.id}`}
                  style={{ background: broadcastExpId ? '#10b981' : '#e2e8f0', color: broadcastExpId ? '#fff' : '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: broadcastExpId ? 'pointer' : 'not-allowed', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                >
                  🔴 Go Live
                </button>
                <button onClick={deleteClass} disabled={deletingClass} style={{ background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',padding:'8px 16px',borderRadius:10,fontSize:13,fontWeight:800,cursor:deletingClass?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,opacity:deletingClass?0.5:1,transition:'all 0.2s' }} onMouseEnter={e=>{if(!deletingClass){e.target.style.background='#fee2e2'}}} onMouseLeave={e=>e.target.style.background='#fef2f2'}>
                  {deletingClass?<Loader2 className="spin" size={15}/>:null} Delete Class
                </button>
                <button onClick={()=>setManagingClass(null)} style={{ background:'#f1f5f9',border:'none',color:'#1e1b4b',width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'background 0.2s' }} onMouseEnter={e=>e.target.style.background='#e2e8f0'} onMouseLeave={e=>e.target.style.background='#f1f5f9'}><X size={18} strokeWidth={2.5}/></button>
              </div>
            </div>
            <div style={{ padding:32,overflowY:'auto',flex:1 }}>
              {loadingStudents?(
                <div style={{ textAlign:'center',padding:60 }}><Loader2 className="spin" size={32} color="#6366f1"/></div>
              ):classStudents.length===0?(
                <div style={{ textAlign:'center',padding:60,color:'#94a3b8',fontSize:16,fontWeight:600 }}>No students enrolled yet.</div>
              ):(
                <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                  {classStudents.map(st=>(
                    <div key={st.id} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,boxShadow:'0 2px 12px rgba(0,0,0,0.03)' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                        <div style={{ width:48,height:48,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #e2e8f0' }}>
                          {st.avatar?<img src={st.avatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={24} color="#94a3b8"/>}
                        </div>
                        <div>
                          <div style={{ fontWeight:800,fontSize:16,color:'#1e1b4b' }}>{st.name||'Unknown'}</div>
                          <div style={{ color:'#64748b',fontSize:13,marginTop:4,fontWeight:500 }}>{st.email}{st.registrationNo&&` · Reg: ${st.registrationNo}`}{st.department&&` · ${st.department}`}</div>
                        </div>
                      </div>
                      <button onClick={()=>removeStudent(st.id)} disabled={removingStudentId===st.id} style={{ background:'transparent',border:'1px solid #fca5a5',color:'#ef4444',padding:'8px 16px',borderRadius:10,fontSize:13,fontWeight:700,cursor:removingStudentId===st.id?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,opacity:removingStudentId===st.id?0.5:1,transition:'all 0.2s' }} onMouseEnter={e=>{if(removingStudentId!==st.id){e.target.style.background='#fef2f2'}}} onMouseLeave={e=>e.target.style.background='transparent'}>
                        {removingStudentId===st.id?<Loader2 className="spin" size={15}/>:<X size={15}/>} Remove
                      </button>
                    </div>
                  ))}
                  
                  {/* Pending Roster from CSV Upload */}
                  {managingClass.roster && managingClass.roster.map((st, i) => (
                    <div key={'roster'+i} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',background:'#f8fafc',border:'1px dashed #cbd5e1',borderRadius:16 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                        <div style={{ width:48,height:48,borderRadius:'50%',background:'#e2e8f0',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <User size={24} color="#94a3b8"/>
                        </div>
                        <div>
                          <div style={{ fontWeight:800,fontSize:16,color:'#475569' }}>{st.name} <span style={{ fontSize: 11, background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: 999, marginLeft: 8 }}>Pending Invite</span></div>
                          <div style={{ color:'#94a3b8',fontSize:13,marginTop:4,fontWeight:500 }}>{st.email}{st.regNo&&` · Reg: ${st.regNo}`}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FeaturedCard({ cls, subs, onManage }) {
  const grad = getGradient(cls.className);
  const cs   = subs.filter(s=>s.classId===cls.id);
  const gr   = cs.filter(s=>s.teacherScore!=null).length;
  const ini  = cls.className.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={{ background:'#fff',borderRadius:24,border:'1px solid rgba(99,102,241,0.08)',padding:28,boxShadow:'0 8px 32px rgba(99,102,241,0.1)' }}>
      <div style={{ display:'flex',gap:20,alignItems:'flex-start',marginBottom:24 }}>
        <div style={{ width:72,height:72,borderRadius:16,background:grad,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:900,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.2)',boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>{ini}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13,color:'#64748b',marginBottom:6,fontWeight:600 }}>{cls.studentUids?.length||0} Students · {cs.length} Submissions</div>
          <div style={{ fontWeight:900,fontSize:20,color:'#1e1b4b',lineHeight:1.2 }}>{cls.className}</div>
          <div style={{ fontSize:14,color:'#475569',marginTop:8,fontWeight:500 }}>Code: <span style={{ fontWeight:800,color:'#4f46e5' }}>{cls.inviteCode}</span></div>
        </div>
        <div style={{ width:12,height:12,borderRadius:'50%',background:'#10b981',marginTop:6,flexShrink:0,boxShadow:'0 0 8px #10b981' }}/>
      </div>
      <div style={{ height:1,background:'rgba(99,102,241,0.1)',marginBottom:20 }}/>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:12,color:'#64748b',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8 }}>Grading Progress</div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:120,height:6,background:'#e2e8f0',borderRadius:999,overflow:'hidden' }}>
              <div style={{ height:'100%',width:`${cs.length?Math.round(gr/cs.length*100):0}%`,background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:999 }}/>
            </div>
            <span style={{ fontSize:13,color:'#475569',fontWeight:700 }}>{gr}/{cs.length}</span>
          </div>
        </div>
        <button onClick={()=>onManage(cls)} style={{ display:'flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',padding:'10px 20px',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 4px 12px rgba(99,102,241,0.3)',transition:'transform 0.2s' }} onMouseEnter={e=>e.target.style.transform='translateY(-2px)'} onMouseLeave={e=>e.target.style.transform='none'}>
          Manage <ChevronRight size={16}/>
        </button>
      </div>
    </div>
  );
}
function SmallCard({ cls, subs, onManage }) {
  const grad = getGradient(cls.className);
  const cs   = subs.filter(s=>s.classId===cls.id);
  const gr   = cs.filter(s=>s.teacherScore!=null).length;
  const ini  = cls.className.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div className="small-card-hover" style={{ background:'#fff',borderRadius:20,border:'1px solid #f1f5f9',padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',transition:'all 0.2s' }}>
      <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:18 }}>
        <div style={{ width:48,height:48,borderRadius:14,background:grad,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff',textShadow:'0 2px 4px rgba(0,0,0,0.2)',boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>{ini}</div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:12,color:'#64748b',fontWeight:600 }}>{cls.studentUids?.length||0} Students · {cs.length} Subs</div>
          <div style={{ fontWeight:800,fontSize:16,color:'#1e1b4b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:2 }}>{cls.className}</div>
        </div>
        <div style={{ width:10,height:10,borderRadius:'50%',background:'#10b981',flexShrink:0,boxShadow:'0 0 6px #10b981' }}/>
      </div>
      <div style={{ fontSize:12,color:'#64748b',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8 }}>Class Progress</div>
      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:18 }}>
        <div style={{ flex:1,height:6,background:'#e2e8f0',borderRadius:999,overflow:'hidden' }}>
          <div style={{ height:'100%',width:`${cs.length?Math.round(gr/cs.length*100):0}%`,background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:999 }}/>
        </div>
        <span style={{ fontSize:12,color:'#475569',fontWeight:700,whiteSpace:'nowrap' }}>{gr}/{cs.length}</span>
      </div>
      <button onClick={()=>onManage(cls)} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#f8fafc',border:'1px solid #e2e8f0',color:'#4f46e5',padding:'10px',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer',transition:'background 0.2s' }} onMouseEnter={e=>e.target.style.background='#e0e7ff'} onMouseLeave={e=>e.target.style.background='#f8fafc'}>
        Manage <ChevronRight size={15}/>
      </button>
    </div>
  );
}
