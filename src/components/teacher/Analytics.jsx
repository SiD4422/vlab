import React from 'react';
import { User, Users, BookOpen, Plus, Loader2, CheckCircle2, X, ChevronRight, Clock, FileText, Edit3, LayoutDashboard, GraduationCap, ClipboardList, LogOut, Search, Trash2, UserPlus, Sparkles, AlertTriangle, UploadCloud, Trophy, BarChart2, ShieldAlert } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { EXPERIMENTS } from '../../data/experiments';


export function Analytics({
  user, classes, submissions, pending, avgViva, avgTeacher, cheatingFlags,
  setSelectedSubmission, setReportTab, setActiveNav
}) {
  return (
    <>
                <div>
                  <div style={{ marginBottom:36,position:'relative',padding:'32px',background:'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',borderRadius:24,border:'1px solid rgba(255,255,255,0.5)',boxShadow:'0 8px 32px rgba(99,102,241,0.05)',overflow:'hidden' }}>
                    <div style={{ position:'absolute',right:'-5%',top:'-20%',width:200,height:200,background:'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',borderRadius:'50%' }} />
                    <div style={{ position:'absolute',left:'20%',bottom:'-20%',width:150,height:150,background:'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',borderRadius:'50%' }} />
                    <div style={{ position:'relative',zIndex:1 }}>
                      <div style={{ fontSize:32,fontWeight:900,color:'#1e1b4b',letterSpacing:'-0.02em' }}>Welcome back, {user.name?.split(' ')[0]} 👋</div>
                      <div style={{ color:'#64748b',marginTop:6,fontSize:16,fontWeight:500 }}>Here's what is happening with your classes today.</div>
                    </div>
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:24,marginBottom:40 }}>
                    {[
                      { label:'Total Classes',  value:classes.length,                                                         icon:GraduationCap, color:'99,102,241' },
                      { label:'Total Students', value:classes.reduce((s,c)=>s+(c.studentUids?.length||0),0),                  icon:Users,         color:'14,165,233' },
                      { label:'Submissions',    value:submissions.length,                                                     icon:ClipboardList, color:'245,158,11' },
                      { label:'Pending Grades', value:pending,                                                                icon:Clock,         color:'239,68,68' },
                    ].map((stat,i)=>(
                      <div key={stat.label} style={{ background:'#fff',borderRadius:24,border:'1px solid rgba(226,232,240,0.8)',padding:28,boxShadow:'0 4px 20px rgba(0,0,0,0.03)',position:'relative',transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 16px 32px rgba(${stat.color},0.12)`; e.currentTarget.style.borderColor=`rgba(${stat.color},0.2)`;}} onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor='rgba(226,232,240,0.8)';}}>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
                          <div style={{ width:56,height:56,borderRadius:16,background:`rgba(${stat.color},0.12)`,display:'flex',alignItems:'center',justifyContent:'center',color:`rgb(${stat.color})` }}>
                            <stat.icon size={28} strokeWidth={2.5}/>
                          </div>
                          <div style={{ width:10,height:10,borderRadius:'50%',background:`rgb(${stat.color})`,boxShadow:`0 0 12px rgba(${stat.color},0.6)` }} />
                        </div>
                        <div style={{ fontSize:40,fontWeight:900,color:'#0f172a',lineHeight:1 }}>{stat.value}</div>
                        <div style={{ fontSize:14,color:'#64748b',fontWeight:700,marginTop:10,letterSpacing:'0.02em' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 40 }}>
                    {/* Left: Analytics Bars */}
                    <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                       <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:24 }}>
                         <div style={{ width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#14b8a6,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(20,184,166,0.3)' }}>
                           <BarChart2 size={16} color="#fff" />
                         </div>
                         <h3 style={{ margin: 0, fontSize: 18, color: '#1e1b4b', fontWeight: 800 }}>Class Averages</h3>
                       </div>
                       
                       <div style={{ marginBottom: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 700, color: '#64748b' }}>
                             <span>AI Viva Score</span>
                             <span style={{ color: '#10b981' }}>{avgViva} / 10</span>
                          </div>
                          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                             <div style={{ height: '100%', width: `${avgViva === '-' ? 0 : (avgViva/10)*100}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 6 }} />
                          </div>
                       </div>
                       
                       <div style={{ marginBottom: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 700, color: '#64748b' }}>
                             <span>Teacher Grading</span>
                             <span style={{ color: '#8b5cf6' }}>{avgTeacher} / 10</span>
                          </div>
                          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                             <div style={{ height: '100%', width: `${avgTeacher === '-' ? 0 : (avgTeacher/10)*100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 6 }} />
                          </div>
                       </div>
                       
                       <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#b91c1c', fontWeight: 700, fontSize: 14 }}>
                             <ShieldAlert size={20} /> Integrity Alerts (Tab Switches)
                          </div>
                          <div style={{ fontSize: 24, fontWeight: 900, color: '#991b1b' }}>{cheatingFlags}</div>
                       </div>
                    </div>
                  
                    {/* Right: Leaderboard */}
                    <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                       <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:24 }}>
                         <div style={{ width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#f59e0b,#fcd34d)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(245,158,11,0.3)' }}>
                           <Trophy size={16} color="#fff" />
                         </div>
                         <h3 style={{ margin: 0, fontSize: 18, color: '#1e1b4b', fontWeight: 800 }}>Top Performers</h3>
                       </div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {[...submissions]
                            .sort((a,b) => ((b.teacherScore||0)+(b.vivaScore||0)) - ((a.teacherScore||0)+(a.vivaScore||0)))
                            .slice(0,3)
                            .map((sub, i) => (
                             <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i===0?'#fef3c7':i===1?'#f1f5f9':'#ffedd5', color: i===0?'#d97706':i===1?'#64748b':'#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{i+1}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                   <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.studentName}</div>
                                   <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.experimentName}</div>
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>{(sub.teacherScore||0)+(sub.vivaScore||0)}</div>
                             </div>
                          ))}
                          {submissions.length === 0 && <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>No graded submissions yet</div>}
                       </div>
                    </div>
                  </div>

                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:20 }}>
                    <div style={{ width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(99,102,241,0.3)' }}>
                      <FileText size={16} color="#fff" />
                    </div>
                    <div style={{ fontWeight:800,fontSize:18,color:'#1e1b4b' }}>Recent Submissions</div>
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                    {submissions.slice(0,5).map((sub,i)=>{
                      const isGraded = sub.teacherScore!=null;
                      return (
                      <div key={sub.id} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'#fff',borderRadius:14,border:'1px solid #f1f5f9',boxShadow:'0 2px 8px rgba(0,0,0,0.02)',borderLeft:isGraded?'4px solid #10b981':'4px solid #f59e0b',transition:'transform 0.2s, boxShadow 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,0.06)';}} onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.02)';}}>
                        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                          <div style={{ width:40,height:40,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #e2e8f0' }}>
                            {sub.studentAvatar?<img src={sub.studentAvatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={18} color="#94a3b8"/>}
                          </div>
                          <div>
                            <div style={{ fontWeight:800,fontSize:15,color:'#1e1b4b' }}>{sub.studentName}</div>
                            <div style={{ fontSize:13,color:'#64748b',fontWeight:500,marginTop:2 }}>{sub.experimentName}</div>
                          </div>
                        </div>
                        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                          {isGraded?(
                            <span style={{ background:'linear-gradient(135deg,#10b981,#34d399)',color:'#fff',fontSize:12,fontWeight:800,padding:'5px 14px',borderRadius:999,boxShadow:'0 2px 8px rgba(16,185,129,0.3)' }}>{sub.teacherScore}/10</span>
                          ):(
                            <button onClick={()=>{ setSelectedSubmission(sub); setReportTab('overview'); setActiveNav('submissions'); }} style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',border:'none',fontSize:12,fontWeight:800,padding:'6px 16px',borderRadius:999,cursor:'pointer',boxShadow:'0 2px 8px rgba(245,158,11,0.3)',transition:'transform 0.2s' }} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='none'}>Grade Now</button>
                          )}
                          <div style={{ fontSize:12,color:'#94a3b8',fontWeight:600,minWidth:60,textAlign:'right' }}>
                            {sub.submittedAt?Math.round((Date.now() - new Date(sub.submittedAt).getTime())/(1000*60*60*24))+'d ago':''}
                          </div>
                        </div>
                      </div>
                    )})}
                    {submissions.length===0&&<div style={{ textAlign:'center',padding:'40px 0',color:'#94a3b8',fontSize:15,fontWeight:500,background:'#fff',borderRadius:14,border:'1px dashed #cbd5e1' }}>No submissions yet.</div>}
                  </div>
                </div>
    </>
  );
}
