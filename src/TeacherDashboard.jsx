import { useState, useEffect } from 'react';
import { db } from './services/firebase';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, writeBatch, getDoc, arrayRemove } from 'firebase/firestore';
import { User, Users, BookOpen, Plus, Loader2, CheckCircle2, X, ChevronRight, Clock, FileText, Edit3, LayoutDashboard, GraduationCap, ClipboardList, LogOut, Search, Trash2, UserPlus, Sparkles, AlertTriangle, UploadCloud, Trophy, BarChart2, ShieldAlert } from 'lucide-react';
import Profile from './Profile';
import { ClassList } from './components/teacher/ClassList';
import { SubmissionReview } from './components/teacher/SubmissionReview';
import { Analytics } from './components/teacher/Analytics';
import { GroupManager } from './components/teacher/GroupManager';
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
              {activeNav==='classes' && <ClassList 
                  classes={classes} submissions={submissions} showCreateForm={showCreateForm} setShowCreateForm={setShowCreateForm} 
                  createClass={createClass} newClassName={newClassName} setNewClassName={setNewClassName} creating={creating} 
                  searchQ={searchQ} filtCls={filtCls} openManageStudents={openManageStudents} managingClass={managingClass} 
                  setManagingClass={setManagingClass} deleteClass={deleteClass} deletingClass={deletingClass} 
                  loadingStudents={loadingStudents} classStudents={classStudents} removeStudent={removeStudent} 
                  removingStudentId={removingStudentId} broadcastExpId={broadcastExpId} setBroadcastExpId={setBroadcastExpId} 
                  setClasses={setClasses} user={user}
                />}
              {activeNav==='submissions' && <SubmissionReview 
                  submissions={submissions} pending={pending} filtSubs={filtSubs} selectedSubmission={selectedSubmission} 
                  setSelectedSubmission={setSelectedSubmission} reportTab={reportTab} setReportTab={setReportTab} 
                  saveGrade={saveGrade} teacherScoreInput={teacherScoreInput} setTeacherScoreInput={setTeacherScoreInput} 
                  savingGrade={savingGrade} setActiveNav={setActiveNav}
                />}
              {activeNav==='dashboard' && <Analytics 
                  user={user} classes={classes} submissions={submissions} pending={pending} avgViva={avgViva} 
                  avgTeacher={avgTeacher} cheatingFlags={cheatingFlags} setSelectedSubmission={setSelectedSubmission} 
                  setReportTab={setReportTab} setActiveNav={setActiveNav}
                />}
              {activeNav==='groups' && <GroupManager 
                  groups={groups} allStudents={allStudents} showGroupForm={showGroupForm} setShowGroupForm={setShowGroupForm} 
                  newGroupName={newGroupName} setNewGroupName={setNewGroupName} selectedStudentIds={selectedStudentIds} 
                  creatingGroup={creatingGroup} deletingGroupId={deletingGroupId} createGroup={createGroup} 
                  deleteGroup={deleteGroup} toggleStudent={toggleStudent}
                />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
