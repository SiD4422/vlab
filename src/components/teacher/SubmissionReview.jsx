import React from 'react';
import { User, CheckCircle2, X, ChevronRight, FileText, Edit3, AlertTriangle, XCircle, Loader2, Shield } from 'lucide-react';
import { EXPERIMENTS } from '../../data/experiments';

export function SubmissionReview({
  submissions, pending, filtSubs, selectedSubmission, setSelectedSubmission,
  reportTab, setReportTab, saveGrade, teacherScoreInput, setTeacherScoreInput,
  savingGrade, setActiveNav
}) {
  return (
    <>
      {/* ── Submissions Table ── */}
      <div style={{ background:'#fff',borderRadius:20,border:'1px solid rgba(99,102,241,0.08)',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ padding:'24px 28px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:800,fontSize:20,color:'#1e1b4b' }}>Student Submissions</div>
            <div style={{ color:'#64748b',fontSize:14,marginTop:4 }}>Review and grade laboratory reports</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => {
              const headers = ['Student Name', 'Experiment', 'Submitted At', 'Progress %', 'Grade Status', 'Teacher Score', 'Integrity Score'];
              const rows = filtSubs.map(s => [
                `"${s.studentName || 'Unknown'}"`,
                `"${s.experimentName || s.experimentId}"`,
                `"${s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'N/A'}"`,
                s.progressPercent ?? 0,
                `"${s.status}"`,
                s.teacherScore ?? 'N/A',
                s.integrityScore ?? 'N/A'
              ]);
              const csvContent = "data:text/csv;charset=utf-8," 
                + [headers.join(','), ...rows.map(r => r.join(','))].join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `naac_report_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            }} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s' }}>
              Export NAAC Report (CSV)
            </button>
            <span style={{ background:pending>0?'linear-gradient(135deg,#f59e0b,#f97316)':'linear-gradient(135deg,#10b981,#34d399)',color:'#fff',fontSize:13,fontWeight:800,padding:'6px 16px',borderRadius:999 }}>{pending} pending</span>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:14 }}>
            <thead>
              <tr style={{ background:'linear-gradient(90deg,#f8f7ff,#f0f9ff)' }}>
                {['Student','Experiment','Progress','Date Submitted','Grade Status','Action'].map((h,i)=>(
                  <th key={h} style={{ padding:'14px 20px',textAlign:i===5?'right':'left',fontSize:12,fontWeight:800,color:'#4f46e5',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap',borderBottom:'1px solid rgba(99,102,241,0.1)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtSubs.map(sub => {
                const prog = sub.progressPercent ?? 0;
                return (
                  <tr key={sub.id} className="table-row-hover" style={{ borderTop:'1px solid #f1f5f9',background:'#fff',borderLeft:'4px solid transparent',transition:'all 0.2s' }}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                        <div style={{ width:36,height:36,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #e2e8f0' }}>
                          {sub.studentAvatar?<img src={sub.studentAvatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={16} color="#94a3b8"/>}
                        </div>
                        <span style={{ fontWeight:700,color:'#1e1b4b',fontSize:14 }}>{sub.studentName||'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px',color:'#475569',fontWeight:500 }}>{sub.experimentName||sub.experimentId}</td>
                    <td style={{ padding:'14px 20px',minWidth:130 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                        <div style={{ flex:1,height:6,background:'#f1f5f9',borderRadius:99,overflow:'hidden' }}>
                          <div style={{ width:`${prog}%`,height:'100%',background:prog>=100?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:99,transition:'width 0.4s ease' }} />
                        </div>
                        <span style={{ fontSize:12,fontWeight:800,color:prog>=100?'#10b981':'#6366f1',whiteSpace:'nowrap' }}>{prog}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px',color:'#64748b',fontSize:13 }}>{sub.submittedAt?new Date(sub.submittedAt).toLocaleDateString():'N/A'}</td>
                    <td style={{ padding:'14px 20px' }}>
                      {(()=>{
                        const badge = {
                          auto_graded:        { icon: '✅', label: 'Auto-Graded',      bg: 'linear-gradient(135deg,#10b981,#34d399)' },
                          teacher_reviewed:   { icon: '🎓', label: 'Teacher Graded',   bg: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
                          pending_auto_grade: { icon: '⏳', label: 'Pending Auto-Grade', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
                          grading_failed:     { icon: '⚠️', label: 'Grading Failed',   bg: 'linear-gradient(135deg,#ef4444,#f87171)' },
                          completed:          { icon: '⏳', label: 'Pending Review',    bg: 'linear-gradient(135deg,#f59e0b,#f97316)' },
                        }[sub.status] ?? { icon: '⏳', label: 'Pending Review', bg: 'linear-gradient(135deg,#f59e0b,#f97316)' };
                        
                        return (
                          <span style={{ display:'inline-flex',alignItems:'center',gap:6,background:badge.bg,color:'#fff',padding:'5px 12px',borderRadius:999,fontSize:12,fontWeight:700 }}>
                            <span>{badge.icon}</span> {badge.label} {sub.teacherScore != null ? `(${sub.teacherScore}/${sub.gradingVersion === 1 ? '100' : '10'})` : ''}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding:'14px 20px',textAlign:'right' }}>
                      <button onClick={()=>{ setSelectedSubmission(sub); setReportTab('overview'); }} style={{ display:'inline-flex',alignItems:'center',gap:6,background:'transparent',border:'1px solid #8b5cf6',color:'#8b5cf6',padding:'7px 14px',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer',transition:'all 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.background='#8b5cf6';e.currentTarget.style.color='#fff';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#8b5cf6';}}>
                        Review <ChevronRight size={14}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtSubs.length===0 && (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#94a3b8' }}>
            <FileText size={48} style={{ margin:'0 auto 16px',display:'block',opacity:0.3,color:'#6366f1' }}/>
            <div style={{ fontWeight:700,fontSize:18,color:'#1e1b4b' }}>No submissions yet</div>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedSubmission && (()=>{
        const M = { bg:'#ffffff',card:'#f8fafc',border:'rgba(99,102,241,0.1)',ink:'#1e1b4b',muted:'#64748b',teal:'#0d9488',copper:'#b45309',purple:'#6366f1',tabBg:'#f8f7ff' };
        return (
          <div style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
            <div style={{ background:M.bg,width:'100%',maxWidth:900,maxHeight:'90vh',borderRadius:24,border:`1px solid ${M.border}`,display:'flex',flexDirection:'column',boxShadow:'0 32px 64px rgba(0,0,0,0.4)',overflow:'hidden' }}>
              {/* Modal header */}
              <div style={{ padding:'24px 32px',background:'linear-gradient(to right,#ffffff,#f8fafc)',borderBottom:`1px solid ${M.border}`,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                  <div style={{ width:48,height:48,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #e2e8f0' }}>
                    {selectedSubmission.studentAvatar?<img src={selectedSubmission.studentAvatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={24} color="#94a3b8"/>}
                  </div>
                  <div>
                    <div style={{ fontWeight:900,fontSize:18,color:M.ink }}>{selectedSubmission.studentName}</div>
                    <div style={{ color:M.muted,fontSize:13,marginTop:2,fontWeight:500 }}>{selectedSubmission.experimentName} · {selectedSubmission.submittedAt?new Date(selectedSubmission.submittedAt).toLocaleString():'N/A'}</div>
                    {(()=>{
                      const evasionCount = submissions.filter(s => s.studentUid === selectedSubmission.studentUid && s.status === 'grading_failed').length;
                      if (evasionCount > 1) {
                         return <div style={{ marginTop: 6, background: '#fef2f2', border: '1px solid #f87171', padding: '4px 8px', borderRadius: 6, color: '#b91c1c', fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14}/> Serial Evasion Detected: Bypassed auto-grading {evasionCount} times</div>;
                      }
                      return null;
                    })()}
                    {/* Progress bar in modal header */}
                    {(selectedSubmission.progressPercent ?? 0) > 0 && (
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginTop:8 }}>
                        <div style={{ width:160,height:5,background:'#e2e8f0',borderRadius:99,overflow:'hidden' }}>
                          <div style={{ width:`${selectedSubmission.progressPercent}%`,height:'100%',background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:99 }} />
                        </div>
                        <span style={{ fontSize:12,fontWeight:800,color:'#6366f1' }}>{selectedSubmission.progressPercent}% completed</span>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={()=>{ setSelectedSubmission(null); setReportTab('overview'); }} style={{ background:'#f1f5f9',border:'none',color:M.ink,width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
                  <X size={18} strokeWidth={2.5}/>
                </button>
              </div>
              {/* Tabs */}
              <div style={{ display:'flex',padding:'0 32px',borderBottom:`1px solid ${M.border}`,background:M.tabBg }}>
                {[{id:'overview',label:'Overview',icon:'📊'},{id:'activity',label:'Lab Activity',icon:'🔬'},{id:'observations',label:'Observations',icon:'📋'},{id:'viva',label:'Viva Quiz',icon:'🎯'}].map(t=>(
                  <button key={t.id} onClick={()=>setReportTab(t.id)} style={{ padding:'14px 20px',border:'none',cursor:'pointer',fontWeight:reportTab===t.id?800:600,fontSize:14,background:'transparent',color:reportTab===t.id?'#6366f1':M.muted,borderBottom:reportTab===t.id?'3px solid #6366f1':'3px solid transparent',transition:'all 0.15s',display:'flex',alignItems:'center',gap:8 }}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
              {/* Content */}
              <div style={{ padding:32,overflowY:'auto',flex:1,background:'#fff' }}>
                {reportTab==='overview' && (()=>{
                  const exp=EXPERIMENTS.find(e=>e.id===selectedSubmission.experimentId);
                  const ld=selectedSubmission.labData||{};
                  const rows=ld.rows?.length||0;
                  const hasAct=!!(ld.labActivity?.circuitImg||ld.labActivity?.scopeImg);
                  return (
                    <div style={{ display:'flex',flexDirection:'column',gap:24 }}>
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20 }}>
                        {(()=>{
                          const bd = selectedSubmission.gradingBreakdown;
                          if (!bd) {
                            return [{label:'Viva Score',value:`${Number(selectedSubmission.vivaScore??0).toFixed(1)}`,sub:'/ 3',grad:'linear-gradient(135deg,#0ea5e9,#06b6d4)'},{label:'Trials Recorded',value:`${rows}`,sub:'rows',grad:'linear-gradient(135deg,#f59e0b,#f97316)'},{label:'Teacher Grade',value:selectedSubmission.teacherScore!=null?`${selectedSubmission.teacherScore}`:'—',sub:selectedSubmission.teacherScore!=null?'/ 10':'not graded',grad:'linear-gradient(135deg,#6366f1,#8b5cf6)'}].map(c=>(
                              <div key={c.label} style={{ background:'#fff',padding:24,borderRadius:20,border:`1px solid ${M.border}`,textAlign:'center' }}>
                                <div style={{ fontSize:12,color:M.muted,textTransform:'uppercase',fontWeight:800,letterSpacing:'0.06em',marginBottom:12 }}>{c.label}</div>
                                <div style={{ display:'flex',alignItems:'baseline',justifyContent:'center',gap:8 }}>
                                  <span style={{ fontSize:36,fontWeight:900,background:c.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{c.value}</span>
                                  <span style={{ fontSize:14,color:M.muted,fontWeight:700 }}>{c.sub}</span>
                                </div>
                              </div>
                            ));
                          }
                          const isNonBridge = bd.table === undefined;
                          const cards = [];
                          cards.push({label:'Total Score',value:`${selectedSubmission.teacherScore??0}`,sub:'/ 100',grad:'linear-gradient(135deg,#6366f1,#8b5cf6)'});
                          if(bd.viva!==undefined) cards.push({label:'Viva Quiz',value:bd.viva,sub:`/ ${isNonBridge?50:30}`,grad:'linear-gradient(135deg,#0ea5e9,#06b6d4)'});
                          if(bd.table!==undefined) cards.push({label:'Table Data',value:bd.table,sub:'/ 25',grad:'linear-gradient(135deg,#f59e0b,#f97316)'});
                          if(bd.accuracy!==undefined) cards.push({label:'Simulation',value:bd.accuracy,sub:'/ 30',grad:'linear-gradient(135deg,#10b981,#34d399)'});
                          if(bd.progress!==undefined) cards.push({label:'Progress',value:bd.progress,sub:`/ ${isNonBridge?50:15}`,grad:'linear-gradient(135deg,#ec4899,#f43f5e)'});
                          
                          return cards.map(c=>(
                            <div key={c.label} style={{ background:'#fff',padding:24,borderRadius:20,border:`1px solid ${M.border}`,textAlign:'center' }}>
                              <div style={{ fontSize:12,color:M.muted,textTransform:'uppercase',fontWeight:800,letterSpacing:'0.06em',marginBottom:12 }}>{c.label}</div>
                              <div style={{ display:'flex',alignItems:'baseline',justifyContent:'center',gap:8 }}>
                                <span style={{ fontSize:36,fontWeight:900,background:c.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{c.value}</span>
                                <span style={{ fontSize:14,color:M.muted,fontWeight:700 }}>{c.sub}</span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      {/* Integrity Flags hidden for silent pilot 
                          They are being calculated securely in the Vercel API and logged in Firestore 
                          but won't be shown to teachers until thresholds are calibrated. */}

                      {selectedSubmission.status === 'grading_failed' && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '16px 20px', borderRadius: 16, fontSize: 14, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600 }}>
                          <AlertTriangle size={24} color="#dc2626" />
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Auto-Grading Bypassed Locally</div>
                            <div style={{ fontWeight: 500 }}>This submission was marked failed by the client, evading automated telemetry checks. Manual review of telemetry is highly recommended.</div>
                          </div>
                        </div>
                      )}

                      {exp&&<div style={{ background:'#f8fafc',borderRadius:16,border:`1px solid ${M.border}`,padding:'20px 24px' }}><div style={{ fontWeight:800,fontSize:14,marginBottom:10,color:M.ink }}>📖 Aim</div><div style={{ fontSize:15,color:M.muted,lineHeight:1.6,fontWeight:500 }}>{exp.aim}</div></div>}
                      <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                        {[{label:'Circuit Captured',ok:hasAct},{label:'Observations Filled',ok:rows>0},{label:'Viva Attempted',ok:!!ld.vivaSubmitted}].map(c=>(
                          <div key={c.label} style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:999,fontSize:13,fontWeight:700,background:c.ok?'#ecfdf5':'#fef2f2',color:c.ok?'#065f46':'#991b1b',border:`1px solid ${c.ok?'#a7f3d0':'#fca5a5'}` }}>
                            {c.ok?<CheckCircle2 size={16}/>:<XCircle size={16}/>} {c.label}
                          </div>
                        ))}
                        {selectedSubmission.tabSwitches > 0 && (
                          <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:999,fontSize:13,fontWeight:800,background:'#fef2f2',color:'#dc2626',border:'1px solid #fca5a5' }}>
                            <AlertTriangle size={16} strokeWidth={3} /> {selectedSubmission.tabSwitches} Tab Switch(es) Detected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                {reportTab==='activity' && (()=>{
                  const la=selectedSubmission.labData?.labActivity;
                  if (!la||(!la.circuitImg&&!la.scopeImg)) return <div style={{ textAlign:'center',padding:'60px 0',color:M.muted }}>No lab activity captured.</div>;
                  return (
                    <div style={{ display:'flex',gap:24,flexWrap:'wrap' }}>
                      {la.circuitImg&&<div style={{ flex:'1 1 360px' }}><div style={{ fontWeight:800,fontSize:13,color:M.muted,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:12 }}>🔌 Circuit Snapshot</div><img src={la.circuitImg} alt="Circuit" style={{ width:'100%',borderRadius:16,border:`1px solid ${M.border}` }}/></div>}
                      {la.scopeImg&&<div style={{ flex:'1 1 260px' }}><div style={{ fontWeight:800,fontSize:13,color:M.muted,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:12 }}>📡 Scope Trace</div><img src={la.scopeImg} alt="Scope" style={{ width:'100%',borderRadius:16,border:`1px solid ${M.border}`,background:'#050d1a' }}/></div>}
                    </div>
                  );
                })()}
                {reportTab==='observations' && (()=>{
                  const rows=selectedSubmission.labData?.rows;
                  if (!rows?.length) return <div style={{ textAlign:'center',padding:'60px 0',color:M.muted }}>No observation data.</div>;
                  return (
                    <div style={{ borderRadius:16,overflow:'hidden',border:`1px solid ${M.border}` }}>
                      <table style={{ width:'100%',borderCollapse:'collapse',fontSize:14,textAlign:'left' }}>
                        <thead><tr style={{ background:'#f8fafc' }}><th style={{ padding:'12px 16px',borderBottom:`1px solid ${M.border}`,fontWeight:800,color:M.ink }}>#</th>{Object.keys(rows[0]).filter(k=>k!=='id').map(k=><th key={k} style={{ padding:'12px 16px',borderBottom:`1px solid ${M.border}`,fontWeight:800,color:M.ink }}>{k}</th>)}</tr></thead>
                        <tbody>{rows.map((row,i)=><tr key={i} style={{ background:i%2===0?'#fff':'#fafbfc' }}><td style={{ padding:'12px 16px',color:M.muted,fontWeight:700 }}>{i+1}</td>{Object.keys(row).filter(k=>k!=='id').map(k=><td key={k} style={{ padding:'12px 16px',color:M.ink,fontWeight:500 }}>{row[k]??''}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  );
                })()}
                {reportTab==='viva' && (()=>{
                  const exp=EXPERIMENTS.find(e=>e.id===selectedSubmission.experimentId);
                  const res=selectedSubmission.vivaResponses||{};
                  if (!exp||!exp.viva?.[0]?.options||!Object.keys(res).length) return <div style={{ textAlign:'center',padding:'60px 0',color:M.muted }}>No viva data available.</div>;
                  const answered=exp.viva.filter(q=>res[q.id]!==undefined);
                  const correct=answered.filter(q=>res[q.id]===q.correctIndex).length;
                  return (
                    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:16,padding:'20px 24px',background:'linear-gradient(135deg,#f0fdfa,#ccfbf1)',borderRadius:16,border:'1px solid #99f6e4',marginBottom:8 }}>
                        <div style={{ fontSize:32,fontWeight:900,color:'#0f766e' }}>{correct}/{answered.length}</div>
                        <div style={{ fontSize:15,color:'#0f766e',fontWeight:700 }}>questions answered correctly</div>
                      </div>
                      {answered.map((q,i)=>{ const si=res[q.id]; const ok=si===q.correctIndex; const to=si===-1; return (
                        <div key={q.id} style={{ background:ok?'#f0fdf4':'#fef2f2',border:`1px solid ${ok?'#bbf7d0':'#fecaca'}`,borderRadius:16,padding:'16px 20px' }}>
                          <div style={{ fontWeight:800,color:'#1e1b4b',fontSize:15,marginBottom:10 }}>Q{i+1}. {q.question}</div>
                          <div style={{ display:'flex',alignItems:'center',gap:10,fontSize:14,color:ok?'#059669':'#b91c1c',fontWeight:700 }}>
                            {ok?<CheckCircle2 size={18}/>:<X size={18}/>}<span>{to?'⏱ Timed out':q.options[si]}</span>
                          </div>
                          {!ok&&!to&&<div style={{ fontSize:13,color:'#059669',marginTop:8,fontWeight:700,background:'#d1fae5',padding:'6px 12px',borderRadius:8,display:'inline-block' }}>✓ Correct: {q.options[q.correctIndex]}</div>}
                        </div>
                      ); })}
                    </div>
                  );
                })()}
              </div>
              {/* Grade footer */}
              <div style={{ padding:'20px 32px',borderTop:`1px solid ${M.border}`,background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:16 }}>
                <form onSubmit={saveGrade} style={{ display:'flex',alignItems:'center',gap:16 }}>
                  <label style={{ fontWeight:800,color:M.ink,fontSize:15 }}>Assign Grade:</label>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <input type="number" min="0" max={selectedSubmission?.gradingVersion === 1 ? 100 : 10} placeholder={selectedSubmission?.gradingVersion === 1 ? 'Score /100' : 'Score /10'} value={teacherScoreInput} onChange={e=>setTeacherScoreInput(e.target.value)} style={{ width:72,padding:'10px 14px',borderRadius:12,border:'2px solid #cbd5e1',background:'#fff',color:M.ink,fontWeight:800,fontSize:16,outline:'none',textAlign:'center' }} onFocus={e=>e.target.style.borderColor='#8b5cf6'} onBlur={e=>e.target.style.borderColor='#cbd5e1'}/>
                    <span style={{ color:M.muted,fontWeight:700,fontSize:16 }}>/ {selectedSubmission?.gradingVersion === 1 ? '100' : '10'}</span>
                  </div>
                  <button type="submit" disabled={savingGrade||!teacherScoreInput} style={{ display:'flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',border:'none',padding:'12px 28px',borderRadius:12,fontWeight:800,fontSize:15,cursor:(savingGrade||!teacherScoreInput)?'not-allowed':'pointer',opacity:(savingGrade||!teacherScoreInput)?0.6:1 }}>
                    {savingGrade?<Loader2 className="spin" size={18}/>:<Edit3 size={18}/>} Save Grade
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
