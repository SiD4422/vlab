const fs = require('fs');

const file = 'src/TeacherDashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

const imports = `import React from 'react';
import { User, Users, BookOpen, Plus, Loader2, CheckCircle2, X, ChevronRight, Clock, FileText, Edit3, LayoutDashboard, GraduationCap, ClipboardList, LogOut, Search, Trash2, UserPlus, Sparkles, AlertTriangle, UploadCloud, Trophy, BarChart2, ShieldAlert } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { EXPERIMENTS } from '../../data/experiments';
`;

function extractJSX(startStr, endStr) {
  const start = code.indexOf(startStr);
  const end = code.indexOf(endStr, start) + endStr.length;
  if (start === -1 || end === -1) throw new Error("Could not find " + startStr.substring(0, 20));
  const snippet = code.substring(start, end);
  return snippet;
}

const classListMain = extractJSX(`              {activeNav==='classes' && (`, `              )}`).split('\n').slice(1, -1).join('\n');
const classListModal = extractJSX(`      {managingClass && (`, `      )}`).split('\n').slice(0, -1).join('\n');
const featuredCard = extractJSX(`function FeaturedCard({`, `}`);
const smallCard = extractJSX(`function SmallCard({`, `}`);
const smallCard2 = code.substring(code.indexOf('function SmallCard'), code.lastIndexOf('}') + 1);

const submissionReviewMain = extractJSX(`              {activeNav==='submissions' && (`, `              )}`).split('\n').slice(1, -1).join('\n');
const submissionReviewModal = extractJSX(`      {selectedSubmission && activeNav==='submissions' && (`, `        );
      })()}`).replace(`        );
      })()}`, `        )
      }`);

const analyticsMain = extractJSX(`              {activeNav==='dashboard' && (`, `              )}`).split('\n').slice(1, -1).join('\n');

const groupManagerMain = extractJSX(`              {activeNav==='groups' && (`, `              )}`).split('\n').slice(1, -1).join('\n');

// Write ClassList
fs.mkdirSync('src/components/teacher', { recursive: true });
fs.writeFileSync('src/components/teacher/ClassList.jsx', 
`${imports}

export function ClassList({
  classes, submissions, showCreateForm, setShowCreateForm, createClass, 
  newClassName, setNewClassName, creating, searchQ, filtCls, 
  openManageStudents, managingClass, setManagingClass, deleteClass, 
  deletingClass, loadingStudents, classStudents, removeStudent, 
  removingStudentId, broadcastExpId, setBroadcastExpId, getGradient
}) {
  return (
    <>
${classListMain}
${classListModal}
    </>
  );
}

${featuredCard}

${smallCard2.substring(smallCard2.indexOf('function SmallCard'))}
`);

// Write SubmissionReview
fs.writeFileSync('src/components/teacher/SubmissionReview.jsx', 
`${imports}

export function SubmissionReview({
  submissions, pending, filtSubs, selectedSubmission, setSelectedSubmission,
  reportTab, setReportTab, saveGrade, teacherScoreInput, setTeacherScoreInput,
  savingGrade, setActiveNav
}) {
  return (
    <>
${submissionReviewMain}
${submissionReviewModal}
    </>
  );
}
`);

// Write Analytics
fs.writeFileSync('src/components/teacher/Analytics.jsx', 
`${imports}

export function Analytics({
  user, classes, submissions, pending, avgViva, avgTeacher, cheatingFlags,
  setSelectedSubmission, setReportTab, setActiveNav
}) {
  return (
    <>
${analyticsMain}
    </>
  );
}
`);

// Write GroupManager
fs.writeFileSync('src/components/teacher/GroupManager.jsx', 
`${imports}

export function GroupManager({
  groups, allStudents, showGroupForm, setShowGroupForm, newGroupName,
  setNewGroupName, selectedStudentIds, creatingGroup, deletingGroupId,
  createGroup, deleteGroup, toggleStudent
}) {
  return (
    <>
${groupManagerMain}
    </>
  );
}
`);

// Replace in TeacherDashboard
let newDashboard = code;
newDashboard = newDashboard.replace(classListMain, `<ClassList 
                  classes={classes} submissions={submissions} showCreateForm={showCreateForm} setShowCreateForm={setShowCreateForm} 
                  createClass={createClass} newClassName={newClassName} setNewClassName={setNewClassName} creating={creating} 
                  searchQ={searchQ} filtCls={filtCls} openManageStudents={openManageStudents} managingClass={managingClass} 
                  setManagingClass={setManagingClass} deleteClass={deleteClass} deletingClass={deletingClass} 
                  loadingStudents={loadingStudents} classStudents={classStudents} removeStudent={removeStudent} 
                  removingStudentId={removingStudentId} broadcastExpId={broadcastExpId} setBroadcastExpId={setBroadcastExpId} 
                  getGradient={getGradient}
                />`);
newDashboard = newDashboard.replace(submissionReviewMain, `<SubmissionReview 
                  submissions={submissions} pending={pending} filtSubs={filtSubs} selectedSubmission={selectedSubmission} 
                  setSelectedSubmission={setSelectedSubmission} reportTab={reportTab} setReportTab={setReportTab} 
                  saveGrade={saveGrade} teacherScoreInput={teacherScoreInput} setTeacherScoreInput={setTeacherScoreInput} 
                  savingGrade={savingGrade} setActiveNav={setActiveNav}
                />`);
newDashboard = newDashboard.replace(analyticsMain, `<Analytics 
                  user={user} classes={classes} submissions={submissions} pending={pending} avgViva={avgViva} 
                  avgTeacher={avgTeacher} cheatingFlags={cheatingFlags} setSelectedSubmission={setSelectedSubmission} 
                  setReportTab={setReportTab} setActiveNav={setActiveNav}
                />`);
newDashboard = newDashboard.replace(groupManagerMain, `<GroupManager 
                  groups={groups} allStudents={allStudents} showGroupForm={showGroupForm} setShowGroupForm={setShowGroupForm} 
                  newGroupName={newGroupName} setNewGroupName={setNewGroupName} selectedStudentIds={selectedStudentIds} 
                  creatingGroup={creatingGroup} deletingGroupId={deletingGroupId} createGroup={createGroup} 
                  deleteGroup={deleteGroup} toggleStudent={toggleStudent}
                />`);

newDashboard = newDashboard.replace(classListModal, '');
newDashboard = newDashboard.replace(submissionReviewModal, '');
newDashboard = newDashboard.replace(featuredCard, '');
const smallCardEnd = newDashboard.lastIndexOf('}') + 1;
const smallCardStart = newDashboard.indexOf('function SmallCard');
newDashboard = newDashboard.substring(0, smallCardStart) + newDashboard.substring(smallCardEnd);

// Add imports to top
newDashboard = newDashboard.replace(`import Profile from './Profile';`, `import Profile from './Profile';
import { ClassList } from './components/teacher/ClassList';
import { SubmissionReview } from './components/teacher/SubmissionReview';
import { Analytics } from './components/teacher/Analytics';
import { GroupManager } from './components/teacher/GroupManager';`);

// Fix activeNav rendering logic
newDashboard = newDashboard.replace(`              {activeNav==='classes' && (
                <ClassList`, `              {activeNav==='classes' && <ClassList`);
newDashboard = newDashboard.replace(`getGradient={getGradient}
                />
              )}`, `getGradient={getGradient}
                />}`);

newDashboard = newDashboard.replace(`              {activeNav==='submissions' && (
                <SubmissionReview`, `              {activeNav==='submissions' && <SubmissionReview`);
newDashboard = newDashboard.replace(`savingGrade={savingGrade} setActiveNav={setActiveNav}
                />
              )}`, `savingGrade={savingGrade} setActiveNav={setActiveNav}
                />}`);

newDashboard = newDashboard.replace(`              {activeNav==='dashboard' && (
                <Analytics`, `              {activeNav==='dashboard' && <Analytics`);
newDashboard = newDashboard.replace(`setReportTab={setReportTab} setActiveNav={setActiveNav}
                />
              )}`, `setReportTab={setReportTab} setActiveNav={setActiveNav}
                />}`);

newDashboard = newDashboard.replace(`              {activeNav==='groups' && (
                <GroupManager`, `              {activeNav==='groups' && <GroupManager`);
newDashboard = newDashboard.replace(`deleteGroup={deleteGroup} toggleStudent={toggleStudent}
                />
              )}`, `deleteGroup={deleteGroup} toggleStudent={toggleStudent}
                />}`);

fs.writeFileSync(file, newDashboard);
console.log('Refactoring done.');
