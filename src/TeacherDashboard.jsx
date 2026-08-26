import { useState, useEffect } from 'react';
import { db } from './services/firebase';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, writeBatch, getDoc, arrayRemove } from 'firebase/firestore';
import { User, Users, BookOpen, Plus, Loader2, CheckCircle2, X, ChevronRight, Clock, FileText, Edit3, LayoutDashboard, GraduationCap, ClipboardList, LogOut, Search, Trash2, UserPlus, Sparkles, AlertTriangle, UploadCloud, Trophy, BarChart2, ShieldAlert } from 'lucide-react';
import Profile from './Profile';
import { EXPERIMENTS } from './data/experiments';
import { useCollege } from './contexts/CollegeContext';
import { useNavigate } from 'react-router-dom';

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

function NavItem({ icon: Icon, label, active, onClick, badge }) {
  const [hover, setHover] = useState(false);
  const bg = active ? 'rgba(255,255,255,0.15)' : hover ? 'rgba(255,255,255,0.08)' : 'transparent';
  const color = active ? '#ffffff' : '#94a3b8';
  const transform = hover && !active ? 'translateY(-2px)' : 'none';

  return (
    <button 
      onClick={onClick} 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,width:60,height:60,margin:'0 auto 8px',borderRadius:16,border:'none',cursor:'pointer',background:bg,color:color,transition:'all 0.2s',position:'relative',transform:transform }}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} style={{ filter: active ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none' }} />
      <span style={{ fontSize:10,fontWeight:700,letterSpacing:'0.03em' }}>{label}</span>
      {badge>0 && <span style={{ position:'absolute',top:-4,right:-4,background:'linear-gradient(135deg,#f43f5e,#e11d48)',color:'#fff',fontSize:10,fontWeight:800,borderRadius:999,minWidth:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 6px',boxShadow:'0 4px 8px rgba(225,29,72,0.4)',border:'2px solid #1e1b4b' }}>{badge}</span>}
    </button>
  );
}

export default function TeacherDashboard({ user, onLogout, onUpdate }) {
  const { subscriptionTier } = useCollege();
  const navigate = useNavigate();
  
  const [classes,setClasses]         = useState([]);
  const [submissions,setSubmissions] = useState([]);
  const [loading,setLoading]         = useState(true);
  const [activeNav,setActiveNav]     = useState('classes');
  const [searchQ,setSearchQ]         = useState('');
  const [showCreateForm,setShowCreateForm] = useState(false);
  const [newClassName,setNewClassName]     = useState('');
  const [creating,setCreating]             = useState(false);
  const [selectedSubmission,setSelectedSubmission] = useState(null);
  const [teacherScoreInput,setTeacherScoreInput]   = useState('');
  const [savingGrade,setSavingGrade]               = useState(false);
  const [reportTab,setReportTab]                   = useState('overview');
  const [managingClass,setManagingClass]     = useState(null);
  const [broadcastExpId,setBroadcastExpId]   = useState('');
  const [classStudents,setClassStudents]     = useState([]);
  const [loadingStudents,setLoadingStudents] = useState(false);
  const [removingStudentId,setRemovingStudentId] = useState(null);
  const [deletingClass,setDeletingClass]     = useState(false);

  // Groups state
  const [groups,setGroups]               = useState([]);
  const [allStudents,setAllStudents]     = useState([]);
  const [showGroupForm,setShowGroupForm] = useState(false);
  const [newGroupName,setNewGroupName]   = useState('');
  const [selectedStudentIds,setSelectedStudentIds] = useState([]);
  const [creatingGroup,setCreatingGroup] = useState(false);
  const [deletingGroupId,setDeletingGroupId] = useState(null);

  useEffect(()=>{ fetchData(); },[user.uid]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cs,ss,gs] = await Promise.all([
        getDocs(query(collection(db,'classes'),where('teacherUid','==',user.uid))),
        getDocs(query(collection(db,'submissions'),where('teacherUid','==',user.uid))),
        getDocs(query(collection(db,'groups'),where('teacherUid','==',user.uid))),
      ]);
      const classList = cs.docs.map(d=>({id:d.id,...d.data()}));
      setClasses(classList);
      setSubmissions(ss.docs.map(d=>({id:d.id,...d.data()})));
      setGroups(gs.docs.map(d=>({id:d.id,...d.data()})));
      // Collect all unique student UIDs across all classes
      const allUids = [...new Set(classList.flatMap(c=>c.studentUids||[]))];
      if (allUids.length > 0) {
        const studentSnaps = await Promise.all(allUids.map(uid=>getDoc(doc(db,'users',uid))));
        setAllStudents(studentSnaps.filter(s=>s.exists()).map(s=>({id:s.id,...s.data()})));
      }
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedStudentIds.length === 0) return;
    setCreatingGroup(true);
    const groupId = 'GRP-' + Math.random().toString(36).substring(2,10).toUpperCase();
    try {
      await setDoc(doc(db,'groups',groupId),{
        teacherUid: user.uid,
        groupName: newGroupName.trim(),
        memberUids: selectedStudentIds,
        createdAt: new Date().toISOString(),
      });
      setNewGroupName(''); setSelectedStudentIds([]); setShowGroupForm(false);
      fetchData();
    } catch(e){ alert('Failed to create group.'); }
    finally{ setCreatingGroup(false); }
  };

  const deleteGroup = async (groupId) => {
    if (!window.confirm('Delete this group?')) return;
    setDeletingGroupId(groupId);
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db,'groups',groupId));
      setGroups(p=>p.filter(g=>g.id!==groupId));
    } catch(e){ alert('Failed to delete group.'); }
    finally{ setDeletingGroupId(null); }
  };

  const toggleStudent = (uid) => {
    setSelectedStudentIds(prev=>
      prev.includes(uid) ? prev.filter(id=>id!==uid) : [...prev,uid]
    );
  };

  const createClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreating(true);
    const code = 'VLAB-'+Math.random().toString(36).substring(2,8).toUpperCase();
    try {
      await setDoc(doc(db,'classes',code),{ teacherUid:user.uid,className:newClassName.trim(),inviteCode:code,studentUids:[] });
      setNewClassName(''); setShowCreateForm(false); fetchData();
    } catch(e){ console.error(e); }
    finally{ setCreating(false); }
  };

  const saveGrade = async (e) => {
    e.preventDefault();
    if (!teacherScoreInput||!selectedSubmission) return;
    setSavingGrade(true);
    try {
      const score=parseInt(teacherScoreInput);
      await updateDoc(doc(db,'submissions',selectedSubmission.id),{teacherScore:score,status:'graded'});
      setSubmissions(s=>s.map(x=>x.id===selectedSubmission.id?{...x,teacherScore:score,status:'graded'}:x));
      setSelectedSubmission(null); setTeacherScoreInput('');
    } catch(e){ alert('Failed to save grade.'); }
    finally{ setSavingGrade(false); }
  };

  const openManageStudents = async (cls) => {
    setManagingClass(cls); setLoadingStudents(true);
    try {
      if (!cls.studentUids?.length){ setClassStudents([]); return; }
      const snaps = await Promise.all(cls.studentUids.map(uid=>getDoc(doc(db,'users',uid))));
      setClassStudents(snaps.filter(s=>s.exists()).map(s=>({id:s.id,...s.data()})));
    } catch(e){ alert('Failed to load students.'); }
    finally{ setLoadingStudents(false); }
  };

  const removeStudent = async (sid) => {
    if (!managingClass||!window.confirm('Remove this student?')) return;
    setRemovingStudentId(sid);
    try {
      const b=writeBatch(db);
      b.update(doc(db,'classes',managingClass.id),{studentUids:arrayRemove(sid)});
      b.update(doc(db,'users',sid),{enrolledTeacherUids:arrayRemove(user.uid)});
      await b.commit();
      setClassStudents(p=>p.filter(s=>s.id!==sid));
      setClasses(p=>p.map(c=>c.id===managingClass.id?{...c,studentUids:c.studentUids.filter(u=>u!==sid)}:c));
    } catch(e){ alert('Failed to remove.'); }
    finally{ setRemovingStudentId(null); }
  };

  const deleteClass = async () => {
    if (!managingClass||!window.confirm(`Delete "${managingClass.className}"?`)) return;
    setDeletingClass(true);
    try {
      const b=writeBatch(db);
      b.delete(doc(db,'classes',managingClass.id));
      for (const uid of (managingClass.studentUids||[])) b.update(doc(db,'users',uid),{enrolledTeacherUids:arrayRemove(user.uid)});
      await b.commit();
      setClasses(p=>p.filter(c=>c.id!==managingClass.id)); setManagingClass(null);
    } catch(e){ alert('Failed to delete.'); }
    finally{ setDeletingClass(false); }
  };

  const pending  = submissions.filter(s=>s.teacherScore==null).length;
  const filtSubs = submissions.filter(s=>!searchQ||s.studentName?.toLowerCase().includes(searchQ.toLowerCase())||s.experimentName?.toLowerCase().includes(searchQ.toLowerCase()));
  const filtCls  = classes.filter(c=>!searchQ||c.className?.toLowerCase().includes(searchQ.toLowerCase()));

  const avgViva = submissions.length > 0 ? (submissions.reduce((acc, sub) => acc + (sub.vivaScore || 0), 0) / submissions.length).toFixed(1) : '-';
  const cheatingFlags = submissions.filter(s => (s.tabSwitches || 0) > 0).length;
  const gradedSubs = submissions.filter(s => s.teacherScore != null);
  const avgTeacher = gradedSubs.length > 0 ? (gradedSubs.reduce((acc, sub) => acc + sub.teacherScore, 0) / gradedSubs.length).toFixed(1) : '-';

  return (
    <div style={{ display:'flex',height:'100vh',overflow:'hidden',fontFamily:"'Inter', 'Segoe UI', sans-serif",background:'linear-gradient(145deg, #f0f4ff 0%, #faf7ff 40%, #f0fbff 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .small-card-hover:hover {
          box-shadow: 0 8px 24px rgba(99,102,241,0.15) !important;
          transform: translateY(-2px) !important;
        }
        .table-row-hover:hover {
          background: rgba(99,102,241,0.02) !important;
          border-left: 4px solid #8b5cf6 !important;
        }
      `}</style>
      {/* SIDEBAR */}
      <aside style={{ width:72,background:'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,zIndex:10,boxShadow:'4px 0 24px rgba(0,0,0,0.1)' }}>
        <div style={{ width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg, #818cf8, #38bdf8)',display:'flex',alignItems:'center',justifyContent:'center',margin:'20px 0 28px',flexShrink:0,boxShadow:'0 4px 12px rgba(129,140,248,0.4)' }}>
          <GraduationCap size={20} color="#fff" />
        </div>
        <div style={{ flex:1,width:'100%' }}>
          <NavItem icon={LayoutDashboard} label="Dashboard"  active={activeNav==='dashboard'}    onClick={()=>setActiveNav('dashboard')} />
          <NavItem icon={BookOpen}        label="Classes"    active={activeNav==='classes'}      onClick={()=>setActiveNav('classes')} />
          <NavItem icon={ClipboardList}   label="Grades"     active={activeNav==='submissions'}  onClick={()=>setActiveNav('submissions')} badge={pending} />
          <NavItem icon={Users}           label="Groups"     active={activeNav==='groups'}       onClick={()=>setActiveNav('groups')} />
          <NavItem icon={User}            label="Profile"    active={activeNav==='profile'}      onClick={()=>setActiveNav('profile')} />
        </div>
        <div style={{ width:'100%',paddingBottom:20 }}>
          <NavItem icon={LogOut} label="Logout" active={false} onClick={onLogout} />
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        <header style={{ background:'rgba(255,255,255,0.7)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',boxShadow:'0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',padding:'0 32px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,zIndex:5 }}>
          <div>
            <div style={{ fontSize:11,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em' }}>V-Lab Console</div>
            <div style={{ fontSize:18,fontWeight:800,color:'#1e1b4b',marginTop:1 }}>
              {activeNav==='classes'?'Classes':activeNav==='submissions'?'Student Submissions':activeNav==='dashboard'?'Dashboard':activeNav==='groups'?'Groups':'Profile'}
            </div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:16 }}>
            <div style={{ position:'relative' }}>
              <Search size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8' }} />
              <input placeholder="Search…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{ paddingLeft:36,paddingRight:12,height:36,borderRadius:18,border:'1px solid #e2e8f0',fontSize:13,color:'#1e293b',outline:'none',width:200,background:'rgba(255,255,255,0.8)',boxShadow:'inset 0 1px 3px rgba(0,0,0,0.02)',transition:'all 0.2s',fontFamily:'inherit' }} onFocus={e=>e.target.style.outline='2px solid rgba(99,102,241,0.3)'} onBlur={e=>e.target.style.outline='none'} />
            </div>
            
            {/* ─── Plan Upgrade Widget ─── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 999, padding: '4px 6px 4px 16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: subscriptionTier === 'pilot' ? '#f59e0b' : subscriptionTier === 'department' ? '#0d9488' : '#8b5cf6' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600, marginRight: 4 }}>Plan:</span>
                {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </div>
              {subscriptionTier === 'pilot' && (
                <button
                  onClick={() => navigate('/pricing')}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(13,148,136,0.3)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <Sparkles size={14} /> Upgrade
                </button>
              )}
            </div>
            
            {activeNav==='classes' && (
              <button onClick={()=>setShowCreateForm(v=>!v)} style={{ display:'flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',color:'#fff',border:'none',padding:'10px 24px',borderRadius:999,fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 4px 14px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',transition:'transform 0.2s, box-shadow 0.2s',textShadow:'0 1px 2px rgba(0,0,0,0.1)' }} onMouseEnter={e=>{e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 6px 20px rgba(79,70,229,0.5), inset 0 1px 0 rgba(255,255,255,0.2)';}} onMouseLeave={e=>{e.target.style.transform='none'; e.target.style.boxShadow='0 4px 14px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)';}}>
                <Plus size={18} strokeWidth={3} /> Create Class
              </button>
            )}
            <div style={{ width:44,height:44,borderRadius:'50%',overflow:'hidden',border:'2px solid #fff',boxShadow:'0 4px 12px rgba(0,0,0,0.1)',background:'#f1f5f9',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'transform 0.2s' }} onClick={()=>setActiveNav('profile')} onMouseEnter={e=>e.target.style.transform='scale(1.08)'} onMouseLeave={e=>e.target.style.transform='none'}>
              {user.avatar?<img src={user.avatar} alt="me" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={22} color="#94a3b8" />}
            </div>
          </div>
        </header>

        <div style={{ flex:1,overflowY:'auto',padding:'32px 40px' }}>
          {loading ? (
            <div style={{ display:'flex',justifyContent:'center',padding:80 }}><Loader2 className="spin" size={36} color="#6366f1" /></div>
          ) : (
            <>
              {activeNav==='classes' && (
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
              )}

              {activeNav==='submissions' && (
                <div style={{ background:'#fff',borderRadius:20,border:'1px solid rgba(99,102,241,0.08)',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div style={{ padding:'24px 28px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:800,fontSize:20,color:'#1e1b4b' }}>Student Submissions</div>
                      <div style={{ color:'#64748b',fontSize:14,marginTop:4 }}>Review and grade laboratory reports</div>
                    </div>
                    <span style={{ background:pending>0?'linear-gradient(135deg,#f59e0b,#f97316)':'linear-gradient(135deg,#10b981,#34d399)',color:'#fff',fontSize:13,fontWeight:800,padding:'6px 16px',borderRadius:999,boxShadow:pending>0?'0 4px 12px rgba(245,158,11,0.3)':'0 4px 12px rgba(16,185,129,0.3)' }}>{pending} pending</span>
                  </div>
                  <table style={{ width:'100%',borderCollapse:'collapse',fontSize:14 }}>
                    <thead>
                      <tr style={{ background:'linear-gradient(90deg, #f8f7ff, #f0f9ff)' }}>
                        {['Student','Experiment','Date Submitted','Grade Status','Action'].map((h,i)=>(
                          <th key={h} style={{ padding:'16px 24px',textAlign:i===4?'right':'left',fontSize:12,fontWeight:800,color:'#4f46e5',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap',borderBottom:'1px solid rgba(99,102,241,0.1)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtSubs.map((sub,idx)=>(
                        <tr key={sub.id} className="table-row-hover" style={{ borderTop:'1px solid #f1f5f9',background:'#fff',borderLeft:'4px solid transparent',transition:'all 0.2s' }}>
                          <td style={{ padding:'16px 24px' }}>
                            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                              <div style={{ width:38,height:38,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #e2e8f0' }}>
                                {sub.studentAvatar?<img src={sub.studentAvatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={18} color="#94a3b8"/>}
                              </div>
                              <span style={{ fontWeight:700,color:'#1e1b4b',fontSize:15 }}>{sub.studentName||'Unknown'}</span>
                            </div>
                          </td>
                          <td style={{ padding:'16px 24px',color:'#475569',fontWeight:500 }}>{sub.experimentName||sub.experimentId}</td>
                          <td style={{ padding:'16px 24px',color:'#64748b' }}>{sub.submittedAt?new Date(sub.submittedAt).toLocaleDateString():'N/A'}</td>
                          <td style={{ padding:'16px 24px' }}>
                            {sub.teacherScore!=null?(
                              <span style={{ display:'inline-flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#10b981,#34d399)',color:'#fff',padding:'5px 14px',borderRadius:999,fontSize:12,fontWeight:700,boxShadow:'0 2px 8px rgba(16,185,129,0.3)' }}>
                                <CheckCircle2 size={14}/> Graded ({sub.teacherScore}/10)
                              </span>
                            ):(
                              <span style={{ display:'inline-flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',padding:'5px 14px',borderRadius:999,fontSize:12,fontWeight:700,boxShadow:'0 2px 8px rgba(245,158,11,0.3)' }}>
                                <Clock size={14}/> Pending Grade
                              </span>
                            )}
                          </td>
                          <td style={{ padding:'16px 24px',textAlign:'right' }}>
                            <button onClick={()=>{ setSelectedSubmission(sub); setReportTab('overview'); }} style={{ display:'inline-flex',alignItems:'center',gap:6,background:'transparent',border:'1px solid #8b5cf6',color:'#8b5cf6',padding:'8px 16px',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer',transition:'all 0.2s' }} onMouseEnter={e=>{e.target.style.background='#8b5cf6'; e.target.style.color='#fff'; e.target.style.transform='translateY(-1px)'; e.target.style.boxShadow='0 4px 12px rgba(139,92,246,0.3)';}} onMouseLeave={e=>{e.target.style.background='transparent'; e.target.style.color='#8b5cf6'; e.target.style.transform='none'; e.target.style.boxShadow='none';}}>
                              Review <ChevronRight size={14}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtSubs.length===0 && (
                    <div style={{ textAlign:'center',padding:'80px 0',color:'#94a3b8' }}>
                      <FileText size={48} style={{ margin:'0 auto 16px',display:'block',opacity:0.3,color:'#6366f1' }}/>
                      <div style={{ fontWeight:700,fontSize:18,color:'#1e1b4b' }}>No submissions yet</div>
                    </div>
                  )}
                </div>
              )}

              {activeNav==='dashboard' && (
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
              )}

              {activeNav==='groups' && (
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
              )}

              {activeNav==='profile' && <Profile user={user} onUpdate={onUpdate} />}
            </>
          )}
        </div>
      </div>

      {selectedSubmission && (()=>{
        const M = { bg:'#ffffff',card:'#f8fafc',border:'rgba(99,102,241,0.1)',ink:'#1e1b4b',muted:'#64748b',teal:'#0d9488',copper:'#b45309',purple:'#6366f1',tabBg:'#f8f7ff' };
        return (
          <div style={{ position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
            <div style={{ background:M.bg,width:'100%',maxWidth:900,maxHeight:'90vh',borderRadius:24,border:`1px solid ${M.border}`,display:'flex',flexDirection:'column',boxShadow:'0 32px 64px rgba(0,0,0,0.4)',overflow:'hidden' }}>
              <div style={{ padding:'24px 32px',background:'linear-gradient(to right, #ffffff, #f8fafc)',borderBottom:`1px solid ${M.border}`,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <div style={{ display:'flex',alignItems:'center',gap:16 }}>
                  <div style={{ width:48,height:48,borderRadius:'50%',background:'#f1f5f9',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #e2e8f0',boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
                    {selectedSubmission.studentAvatar?<img src={selectedSubmission.studentAvatar} alt="av" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<User size={24} color="#94a3b8"/>}
                  </div>
                  <div>
                    <div style={{ fontWeight:900,fontSize:18,color:M.ink }}>{selectedSubmission.studentName}</div>
                    <div style={{ color:M.muted,fontSize:13,marginTop:2,fontWeight:500 }}>{selectedSubmission.experimentName} · {selectedSubmission.submittedAt?new Date(selectedSubmission.submittedAt).toLocaleString():'N/A'}</div>
                  </div>
                </div>
                <button onClick={()=>{ setSelectedSubmission(null); setReportTab('overview'); }} style={{ background:'#f1f5f9',border:'none',color:M.ink,width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'background 0.2s' }} onMouseEnter={e=>e.target.style.background='#e2e8f0'} onMouseLeave={e=>e.target.style.background='#f1f5f9'}>
                  <X size={18} strokeWidth={2.5}/>
                </button>
              </div>
              <div style={{ display:'flex',padding:'0 32px',borderBottom:`1px solid ${M.border}`,background:M.tabBg }}>
                {[{id:'overview',label:'Overview',icon:'📊'},{id:'activity',label:'Lab Activity',icon:'🔬'},{id:'observations',label:'Observations',icon:'📋'},{id:'viva',label:'Viva Quiz',icon:'🎯'}].map(t=>(
                  <button key={t.id} onClick={()=>setReportTab(t.id)} style={{ padding:'14px 20px',border:'none',cursor:'pointer',fontWeight:reportTab===t.id?800:600,fontSize:14,background:'transparent',color:reportTab===t.id?'#6366f1':M.muted,borderBottom:reportTab===t.id?`3px solid #6366f1`:'3px solid transparent',transition:'all 0.15s',display:'flex',alignItems:'center',gap:8 }}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
              <div style={{ padding:32,overflowY:'auto',flex:1,background:'#fff' }}>
                {reportTab==='overview' && (()=>{
                  const exp=EXPERIMENTS.find(e=>e.id===selectedSubmission.experimentId);
                  const ld=selectedSubmission.labData||{};
                  const rows=ld.rows?.length||0;
                  const hasAct=!!(ld.labActivity?.circuitImg||ld.labActivity?.scopeImg);
                  return (
                    <div style={{ display:'flex',flexDirection:'column',gap:24 }}>
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20 }}>
                        {[{label:'Viva Score',value:`${selectedSubmission.vivaScore??0}`,sub:'/ 3',grad:'linear-gradient(135deg,#0ea5e9,#06b6d4)'},{label:'Trials Recorded',value:`${rows}`,sub:'rows',grad:'linear-gradient(135deg,#f59e0b,#f97316)'},{label:'Teacher Grade',value:selectedSubmission.teacherScore!=null?`${selectedSubmission.teacherScore}`:'—',sub:selectedSubmission.teacherScore!=null?'/ 10':'not graded',grad:'linear-gradient(135deg,#6366f1,#8b5cf6)'}].map(c=>(
                          <div key={c.label} style={{ background:'#fff',padding:24,borderRadius:20,border:`1px solid ${M.border}`,textAlign:'center',boxShadow:'0 4px 16px rgba(99,102,241,0.04)' }}>
                            <div style={{ fontSize:12,color:M.muted,textTransform:'uppercase',fontWeight:800,letterSpacing:'0.06em',marginBottom:12 }}>{c.label}</div>
                            <div style={{ display:'flex',alignItems:'baseline',justifyContent:'center',gap:8 }}>
                              <span style={{ fontSize:36,fontWeight:900,background:c.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{c.value}</span>
                              <span style={{ fontSize:14,color:M.muted,fontWeight:700 }}>{c.sub}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {exp&&<div style={{ background:'#f8fafc',borderRadius:16,border:`1px solid ${M.border}`,padding:'20px 24px' }}><div style={{ fontWeight:800,fontSize:14,marginBottom:10,color:M.ink }}>📖 Aim</div><div style={{ fontSize:15,color:M.muted,lineHeight:1.6,fontWeight:500 }}>{exp.aim}</div></div>}
                      <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                        {[{label:'Circuit Captured',ok:hasAct},{label:'Scope Captured',ok:!!ld.labActivity?.scopeImg},{label:'Observations Filled',ok:rows>0},{label:'Viva Attempted',ok:!!ld.vivaSubmitted}].map(c=>(
                          <div key={c.label} style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:999,fontSize:13,fontWeight:700,background:c.ok?'#ecfdf5':'#fef2f2',color:c.ok?'#065f46':'#991b1b',border:`1px solid ${c.ok?'#a7f3d0':'#fca5a5'}` }}>
                            {c.ok?<CheckCircle2 size={16}/>:<XCircle size={16}/>} {c.label}
                          </div>
                        ))}
                        {selectedSubmission.tabSwitches > 0 && (
                          <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:999,fontSize:13,fontWeight:800,background:'#fef2f2',color:'#dc2626',border:'1px solid #fca5a5',boxShadow:'0 2px 8px rgba(220,38,38,0.2)' }}>
                            <AlertTriangle size={16} strokeWidth={3} /> {selectedSubmission.tabSwitches} Tab Switch(es) Detected
                          </div>
                        )}
                      </div>
                            {c.ok?<CheckCircle2 size={15}/>:<X size={15}/>} {c.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                {reportTab==='activity' && (()=>{
                  const la=selectedSubmission.labData?.labActivity;
                  if (!la||(!la.circuitImg&&!la.scopeImg&&!la.analysisData)) return <div style={{ textAlign:'center',padding:'60px 0',color:M.muted,fontSize:15,fontWeight:500 }}>No lab activity captured.</div>;
                  return (
                    <div style={{ display:'flex',flexDirection:'column',gap:28 }}>
                      <div style={{ display:'flex',gap:24,flexWrap:'wrap' }}>
                        {la.circuitImg&&<div style={{ flex:'1 1 360px' }}><div style={{ fontWeight:800,fontSize:13,color:M.muted,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:12 }}>🔌 Circuit Snapshot</div><img src={la.circuitImg} alt="Circuit" style={{ width:'100%',borderRadius:16,border:`1px solid ${M.border}`,boxShadow:'0 8px 24px rgba(0,0,0,0.06)' }}/></div>}
                        {la.scopeImg&&<div style={{ flex:'1 1 260px' }}><div style={{ fontWeight:800,fontSize:13,color:M.muted,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:12 }}>📡 Scope Trace</div><img src={la.scopeImg} alt="Scope" style={{ width:'100%',borderRadius:16,border:`1px solid ${M.border}`,background:'#050d1a',boxShadow:'0 8px 24px rgba(0,0,0,0.06)' }}/></div>}
                      </div>
                    </div>
                  );
                })()}
                {reportTab==='observations' && (()=>{
                  const rows=selectedSubmission.labData?.rows;
                  if (!rows?.length) return <div style={{ textAlign:'center',padding:'60px 0',color:M.muted,fontSize:15,fontWeight:500 }}>No observation data.</div>;
                  return (
                    <div style={{ borderRadius:16,overflow:'hidden',border:`1px solid ${M.border}` }}>
                      <table style={{ width:'100%',borderCollapse:'collapse',fontSize:14,textAlign:'left' }}>
                        <thead><tr style={{ background:'#f8fafc' }}><th style={{ padding:'12px 16px',borderBottom:`1px solid ${M.border}`,fontWeight:800,color:M.ink }}>#</th>{Object.keys(rows[0]).filter(k=>k!=='id').map(k=><th key={k} style={{ padding:'12px 16px',borderBottom:`1px solid ${M.border}`,fontWeight:800,color:M.ink }}>{k}</th>)}</tr></thead>
                        <tbody>{rows.map((row,i)=><tr key={i} style={{ background:i%2===0?'#fff':'#fafbfc' }}><td style={{ padding:'12px 16px',borderBottom:i===rows.length-1?'none':`1px solid ${M.border}`,color:M.muted,fontWeight:700 }}>{i+1}</td>{Object.keys(row).filter(k=>k!=='id').map(k=><td key={k} style={{ padding:'12px 16px',borderBottom:i===rows.length-1?'none':`1px solid ${M.border}`,color:M.ink,fontWeight:500 }}>{row[k]??''}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  );
                })()}
                {reportTab==='viva' && (()=>{
                  const exp=EXPERIMENTS.find(e=>e.id===selectedSubmission.experimentId);
                  const res=selectedSubmission.vivaResponses||{};
                  if (!exp||!exp.viva?.[0]?.options||!Object.keys(res).length) return <div style={{ textAlign:'center',padding:'60px 0',color:M.muted,fontSize:15,fontWeight:500 }}>No viva data available.</div>;
                  const answered=exp.viva.filter(q=>res[q.id]!==undefined);
                  const correct=answered.filter(q=>res[q.id]===q.correctIndex).length;
                  return (
                    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:16,padding:'20px 24px',background:'linear-gradient(135deg, #f0fdfa, #ccfbf1)',borderRadius:16,border:'1px solid #99f6e4',marginBottom:8,boxShadow:'0 4px 12px rgba(20,184,166,0.1)' }}>
                        <div style={{ fontSize:32,fontWeight:900,color:'#0f766e',lineHeight:1 }}>{correct}/{answered.length}</div>
                        <div style={{ fontSize:15,color:'#0f766e',fontWeight:700 }}>questions answered correctly</div>
                      </div>
                      {answered.map((q,i)=>{ const si=res[q.id]; const ok=si===q.correctIndex; const to=si===-1; return (
                        <div key={q.id} style={{ background:ok?'#f0fdf4':'#fef2f2',border:`1px solid ${ok?'#bbf7d0':'#fecaca'}`,borderRadius:16,padding:'16px 20px',boxShadow:'0 2px 8px rgba(0,0,0,0.02)' }}>
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
              <div style={{ padding:'20px 32px',borderTop:`1px solid ${M.border}`,background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:16 }}>
                <form onSubmit={saveGrade} style={{ display:'flex',alignItems:'center',gap:16 }}>
                  <label style={{ fontWeight:800,color:M.ink,fontSize:15 }}>Assign Grade:</label>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <input type="number" min="0" max="10" placeholder={selectedSubmission.teacherScore!=null?selectedSubmission.teacherScore:'—'} value={teacherScoreInput} onChange={e=>setTeacherScoreInput(e.target.value)} style={{ width:72,padding:'10px 14px',borderRadius:12,border:`2px solid #cbd5e1`,background:'#fff',color:M.ink,fontWeight:800,fontSize:16,outline:'none',transition:'border-color 0.2s',textAlign:'center' }} onFocus={e=>e.target.style.borderColor='#8b5cf6'} onBlur={e=>e.target.style.borderColor='#cbd5e1'}/>
                    <span style={{ color:M.muted,fontWeight:700,fontSize:16 }}>/ 10</span>
                  </div>
                  <button type="submit" disabled={savingGrade||!teacherScoreInput} style={{ display:'flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',border:'none',padding:'12px 28px',borderRadius:12,fontWeight:800,fontSize:15,cursor:(savingGrade||!teacherScoreInput)?'not-allowed':'pointer',opacity:(savingGrade||!teacherScoreInput)?0.6:1,boxShadow:'0 4px 16px rgba(245,158,11,0.3)',transition:'transform 0.2s' }} onMouseEnter={e=>{if(!savingGrade&&teacherScoreInput)e.target.style.transform='translateY(-2px)'}} onMouseLeave={e=>e.target.style.transform='none'}>
                    {savingGrade?<Loader2 className="spin" size={18}/>:<Edit3 size={18}/>} Save Grade
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })()}

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
    </div>
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
