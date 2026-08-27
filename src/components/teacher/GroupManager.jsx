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

export function GroupManager({
  groups, allStudents, showGroupForm, setShowGroupForm, newGroupName,
  setNewGroupName, selectedStudentIds, creatingGroup, deletingGroupId,
  createGroup, deleteGroup, toggleStudent
}) {
  return (
    <>
                <div>
                  {/* Create Group Button / Form */}
                  {!showGroupForm ? (
                    <div style={{ marginBottom:28, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontWeight:800, fontSize:22, color:'#1e1b4b' }}>Student Groups</div>
                        <div style={{ color:'#64748b', fontSize:14, marginTop:4 }}>{groups.length} group{groups.length!==1?'s':''} · {allStudents.length} students enrolled across all classes</div>
                      </div>
                      <button onClick={()=>setShowGroupForm(true)} style={{ display:'flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',color:'#fff',border:'none',padding:'10px 24px',borderRadius:999,fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 4px 14px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',transition:'transform 0.2s, box-shadow 0.2s',textShadow:'0 1px 2px rgba(0,0,0,0.1)' }} onMouseEnter={e=>{e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 6px 20px rgba(79,70,229,0.5), inset 0 1px 0 rgba(255,255,255,0.2)';}} onMouseLeave={e=>{e.target.style.transform='none'; e.target.style.boxShadow='0 4px 14px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)';}}>
                        <UserPlus size={18} strokeWidth={3}/> New Group
                      </button>
                    </div>
                  ) : (
                    <div style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(99,102,241,0.12)', padding:'28px 32px', marginBottom:32, boxShadow:'0 8px 40px rgba(99,102,241,0.12)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                        <div style={{ fontWeight:800, fontSize:18, color:'#1e1b4b' }}>Create New Group</div>
                        <button onClick={()=>{ setShowGroupForm(false); setNewGroupName(''); setSelectedStudentIds([]); }} style={{ background:'#f1f5f9', border:'none', color:'#64748b', width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={15}/></button>
                      </div>
                      <form onSubmit={createGroup}>
                        <input
                          type="text" placeholder="Group name (e.g. Lab Group A)"
                          value={newGroupName} onChange={e=>setNewGroupName(e.target.value)}
                          style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid #cbd5e1', fontSize:15, color:'#1e1b4b', outline:'none', marginBottom:20, boxSizing:'border-box', fontFamily:'inherit' }}
                          onFocus={e=>e.target.style.borderColor='#818cf8'} onBlur={e=>e.target.style.borderColor='#cbd5e1'}
                        />
                        <div style={{ fontWeight:700, fontSize:14, color:'#1e1b4b', marginBottom:12 }}>Select Students ({selectedStudentIds.length} selected)</div>
                        {allStudents.length === 0 ? (
                          <div style={{ textAlign:'center', padding:'40px 0', color:'#94a3b8', fontSize:14 }}>No students enrolled in any class yet. Add students to a class first.</div>
                        ) : (
                          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12, marginBottom:24, maxHeight:320, overflowY:'auto', paddingRight:4 }}>
                            {allStudents.map(st=>{
                              const sel = selectedStudentIds.includes(st.id);
                              return (
                                <div key={st.id} onClick={()=>toggleStudent(st.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, border:`2px solid ${sel?'#818cf8':'#e2e8f0'}`, background:sel?'rgba(129,140,248,0.06)':'#fff', cursor:'pointer', transition:'all 0.15s' }}>
                                  <div style={{ width:36, height:36, borderRadius:'50%', background:sel?'linear-gradient(135deg,#818cf8,#a78bfa)':'#f1f5f9', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${sel?'#818cf8':'#e2e8f0'}` }}>
                                    {st.avatar ? <img src={st.avatar} alt="av" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <User size={16} color={sel?'#fff':'#94a3b8'}/>}
                                  </div>
                                  <div style={{ minWidth:0 }}>
                                    <div style={{ fontWeight:700, fontSize:13, color:'#1e1b4b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{st.name||'Unknown'}</div>
                                    <div style={{ fontSize:11, color:'#94a3b8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{st.email}</div>
                                  </div>
                                  {sel && <CheckCircle2 size={16} color="#6366f1" style={{ marginLeft:'auto', flexShrink:0 }}/>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div style={{ display:'flex', gap:12 }}>
                          <button type="submit" disabled={creatingGroup || !newGroupName.trim() || selectedStudentIds.length===0} style={{ display:'flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', padding:'12px 24px', borderRadius:12, fontWeight:700, fontSize:14, cursor:(creatingGroup||!newGroupName.trim()||selectedStudentIds.length===0)?'not-allowed':'pointer', opacity:(creatingGroup||!newGroupName.trim()||selectedStudentIds.length===0)?0.6:1, boxShadow:'0 4px 12px rgba(99,102,241,0.3)' }}>
                            {creatingGroup?<Loader2 className="spin" size={16}/>:<Users size={16}/>} Create Group
                          </button>
                          <button type="button" onClick={()=>{ setShowGroupForm(false); setNewGroupName(''); setSelectedStudentIds([]); }} style={{ background:'#f1f5f9', border:'none', color:'#64748b', padding:'12px 20px', borderRadius:12, fontWeight:600, fontSize:14, cursor:'pointer' }}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Groups Grid */}
                  {groups.length === 0 && !showGroupForm ? (
                    <div style={{ textAlign:'center', padding:'80px 0', color:'#94a3b8' }}>
                      <Users size={56} style={{ margin:'0 auto 20px', display:'block', opacity:0.3, color:'#6366f1' }}/>
                      <div style={{ fontWeight:800, fontSize:22, color:'#1e1b4b', marginBottom:8 }}>No Groups Yet</div>
                      <div style={{ fontSize:15 }}>Click <strong>New Group</strong> to create your first student group.</div>
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
                      {groups.map(grp=>{
                        const members = allStudents.filter(s=>grp.memberUids?.includes(s.id));
                        const grad = getGradient(grp.groupName);
                        const ini = grp.groupName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
                        return (
                          <div key={grp.id} style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(99,102,241,0.08)', padding:22, boxShadow:'0 4px 20px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s, transform 0.2s' }} onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 32px rgba(99,102,241,0.15)'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.05)'; e.currentTarget.style.transform='none'; }}>
                            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                              <div style={{ width:52, height:52, borderRadius:14, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff', textShadow:'0 2px 4px rgba(0,0,0,0.2)', flexShrink:0 }}>{ini}</div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontWeight:800, fontSize:16, color:'#1e1b4b' }}>{grp.groupName}</div>
                                <div style={{ fontSize:12, color:'#64748b', marginTop:3 }}>{members.length} member{members.length!==1?'s':''} · Created {grp.createdAt?new Date(grp.createdAt).toLocaleDateString():'—'}</div>
                              </div>
                              <button onClick={()=>deleteGroup(grp.id)} disabled={deletingGroupId===grp.id} style={{ background:'transparent', border:'1px solid #fca5a5', color:'#ef4444', width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:deletingGroupId===grp.id?'not-allowed':'pointer', opacity:deletingGroupId===grp.id?0.5:1, transition:'all 0.15s', flexShrink:0 }} onMouseEnter={e=>{ e.currentTarget.style.background='#fef2f2'; }} onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}>
                                {deletingGroupId===grp.id?<Loader2 className="spin" size={14}/>:<Trash2 size={14}/>}
                              </button>
                            </div>
                            <div style={{ height:1, background:'#f1f5f9', marginBottom:14 }}/>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                              {members.slice(0,6).map(m=>(
                                <div key={m.id} title={m.name||m.email} style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #fff', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.1)', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9', marginLeft:-6, firstChild:{marginLeft:0} }}>
                                  {m.avatar?<img src={m.avatar} alt="av" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>:<User size={14} color="#94a3b8"/>}
                                </div>
                              ))}
                              {members.length>6 && <div style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #fff', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff', marginLeft:-6 }}>+{members.length-6}</div>}
                              {members.length===0 && <span style={{ fontSize:12, color:'#94a3b8' }}>No members found</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
    </>
  );
}
