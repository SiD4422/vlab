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
  newClassName, setNewClassName, creating, createError, searchQ, filtCls, 
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
                      {createError && <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, marginBottom: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8 }}>{createError}</div>}
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
                  {classes.length===0 && !showCreateForm && (
                    <div style={{ textAlign:'center',padding:'80px 0',color:'#94a3b8' }}>
                      <BookOpen size={56} style={{ margin:'0 auto 20px',display:'block',opacity:0.3,color:'#6366f1' }}/>
                      <div style={{ fontWeight:800,fontSize:22,color:'#1e1b4b',marginBottom:8 }}>No Classes Yet</div>
                      <div style={{ fontSize:15 }}>Click Create Class to get started.</div>
                    </div>
                  )}
                </div>
      {managingClass && (
        <div style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
          <div style={{ background:'#fff',width:'100%',maxWidth:720,maxHeight:'85vh',borderRadius:24,border:'1px solid rgba(99,102,241,0.1)',display:'flex',flexDirection:'column',boxShadow:'0 32px 64px rgba(0,0,0,0.4)',overflow:'hidden' }}>
            <div style={{ padding:'20px 24px',borderBottom:'1px solid #f1f5f9',background:'linear-gradient(to right, #ffffff, #f8fafc)',borderRadius:'24px 24px 0 0',flexShrink:0 }}>
              {/* Row 1: Title + Close */}
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:900,fontSize:18,color:'#1e1b4b' }}>Manage Students</div>
                  <div style={{ color:'#64748b',fontSize:13,marginTop:3,fontWeight:500 }}>
                    {managingClass.className} &middot; Invite Code: <strong style={{ color:'#4f46e5',background:'#e0e7ff',padding:'2px 8px',borderRadius:6,fontFamily:'monospace',fontSize:13 }}>{managingClass.inviteCode}</strong>
                  </div>
                </div>
                <button onClick={()=>setManagingClass(null)} style={{ background:'#f1f5f9',border:'none',color:'#1e1b4b',width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0 }}><X size={16} strokeWidth={2.5}/></button>
              </div>
              {/* Row 2: Broadcast + Delete */}
              <div style={{ display:'flex',gap:10,flexWrap:'wrap',alignItems:'center' }}>
                <select
                  value={broadcastExpId}
                  onChange={e=>setBroadcastExpId(e.target.value)}
                  style={{ flex:'1 1 180px',minWidth:0,padding:'8px 12px',borderRadius:10,border:'1px solid #e2e8f0',fontSize:13,fontWeight:600,color:'#1e1b4b',background:'#fff',outline:'none' }}
                >
                  <option value="">Select Experiment to Broadcast...</option>
                  {EXPERIMENTS.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
                <button
                  disabled={!broadcastExpId}
                  onClick={() => window.location.href = `/teacher?broadcast=true&expId=${broadcastExpId}&classId=${managingClass.id}`}
                  style={{ background: broadcastExpId ? '#10b981' : '#e2e8f0', color: broadcastExpId ? '#fff' : '#94a3b8', border: 'none', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: broadcastExpId ? 'pointer' : 'not-allowed', whiteSpace:'nowrap',flexShrink:0 }}
                >
                  🔴 Go Live
                </button>
                <button onClick={deleteClass} disabled={deletingClass} style={{ background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',padding:'8px 14px',borderRadius:10,fontSize:13,fontWeight:800,cursor:deletingClass?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,flexShrink:0 }}>
                  {deletingClass?<Loader2 className="spin" size={14}/>:null} Delete Class
                </button>
              </div>
            </div>
            <div style={{ padding:'24px 32px',overflowY:'auto',flex:1 }}>
              {loadingStudents?(
                <div style={{ textAlign:'center',padding:60 }}><Loader2 className="spin" size={32} color="#6366f1"/></div>
              ):classStudents.length===0?(
                <div style={{ textAlign:'center',padding:60,color:'#94a3b8',fontSize:16,fontWeight:600 }}>No students enrolled yet.</div>
              ):(
                <>
                  {/* Class Average Bar */}
                  {(() => {
                    const total = EXPERIMENTS.length;
                    const avgDone = classStudents.length
                      ? Math.round(classStudents.reduce((sum,st) => sum + (st.completedExperiments?.length || 0), 0) / classStudents.length)
                      : 0;
                    const pct = total ? Math.round((avgDone / total) * 100) : 0;
                    return (
                      <div style={{ background:'linear-gradient(135deg,#f0f4ff,#e8f5e9)',borderRadius:16,padding:'16px 20px',marginBottom:20,border:'1px solid #e0e7ff' }}>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
                          <span style={{ fontWeight:800,fontSize:13,color:'#4338ca' }}>📊 Class Average — Lab Completion</span>
                          <span style={{ fontWeight:800,fontSize:13,color:'#4338ca' }}>{avgDone}/{total} experiments ({pct}%)</span>
                        </div>
                        <div style={{ height:10,background:'#e0e7ff',borderRadius:999,overflow:'hidden' }}>
                          <div style={{ height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:999,transition:'width 0.6s ease' }}/>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Per-student rows */}
                  <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                    {classStudents.map(st => {
                      const done  = st.completedExperiments?.length || 0;
                      const total = EXPERIMENTS.length;
                      const pct   = total ? Math.round((done / total) * 100) : 0;
                      const color = pct >= 75 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#6366f1';
                      return (
                        <div key={st.id} style={{ background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:'16px 20px',boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
                          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
                            <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                              <div style={{ width:44,height:44,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #e2e8f0' }}>
                                {st.avatar?<img src={st.avatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={22} color="#94a3b8"/>}
                              </div>
                              <div>
                                <div style={{ fontWeight:800,fontSize:15,color:'#1e1b4b' }}>{st.name||'Unknown'}</div>
                                <div style={{ color:'#64748b',fontSize:12,marginTop:2,fontWeight:500 }}>
                                  {st.email}{st.registrationNo&&` · ${st.registrationNo}`}{st.department&&` · ${st.department}`}
                                </div>
                              </div>
                            </div>
                            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                              <span style={{ background:pct>=75?'#d1fae5':pct>=40?'#fef3c7':'#e0e7ff',color:pct>=75?'#065f46':pct>=40?'#92400e':'#3730a3',fontSize:12,fontWeight:800,padding:'4px 10px',borderRadius:20,whiteSpace:'nowrap' }}>
                                {done}/{total} labs
                              </span>
                              <button onClick={()=>removeStudent(st.id)} disabled={removingStudentId===st.id} style={{ background:'transparent',border:'1px solid #fca5a5',color:'#ef4444',padding:'6px 12px',borderRadius:10,fontSize:12,fontWeight:700,cursor:removingStudentId===st.id?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:4,opacity:removingStudentId===st.id?0.5:1 }}>
                                {removingStudentId===st.id?<Loader2 className="spin" size={13}/>:<X size={13}/>} Remove
                              </button>
                            </div>
                          </div>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <div style={{ flex:1,height:7,background:'#f1f5f9',borderRadius:999,overflow:'hidden' }}>
                              <div style={{ height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color},${color}bb)`,borderRadius:999,transition:'width 0.6s ease' }}/>
                            </div>
                            <span style={{ fontSize:12,color:'#64748b',fontWeight:700,minWidth:36,textAlign:'right' }}>{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
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
