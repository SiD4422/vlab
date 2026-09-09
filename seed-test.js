import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding test data...");

  // 1. Create Teacher
  await setDoc(doc(db, "users", "test-teacher-1"), {
    uid: "test-teacher-1",
    email: "teacher@srmist.edu.in",
    name: "Dr. AI Teacher",
    role: "admin_teacher",
    status: "active",
    department: "ECE"
  });

  // 2. Create Students
  const students = [
    { uid: "test-student-1", name: "Agent One (3 Exps)" },
    { uid: "test-student-2", name: "Agent Two (4 Exps)" },
    { uid: "test-student-3", name: "Agent Three (1 Exp)" }
  ];

  for (const s of students) {
    await setDoc(doc(db, "users", s.uid), {
      uid: s.uid,
      email: s.uid + "@srmist.edu.in",
      name: s.name,
      role: "student",
      status: "active",
      registrationNo: s.uid.toUpperCase(),
      department: "ECE",
      section: "A"
    });
  }

  // 3. Create Class
  await setDoc(doc(db, "classes", "TEST12"), {
    className: "AI Test Class",
    inviteCode: "TEST12",
    teacherUid: "test-teacher-1",
    studentUids: students.map(s => s.uid),
    createdAt: serverTimestamp()
  });

  // 4. Create Submissions
  const exps = ["wheatstone_bridge", "maxwell_bridge", "schering_bridge", "hay_bridge"];
  
  const createSub = async (student, expId, progress, score) => {
    const subId = `${student.uid}_${expId}`;
    await setDoc(doc(db, "submissions", subId), {
      id: subId,
      studentId: student.uid,
      studentName: student.name,
      studentAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.uid}`,
      experimentId: expId,
      experimentName: expId.replace("_", " ").toUpperCase(),
      classId: "TEST12",
      teacherUid: "test-teacher-1",
      submittedAt: new Date().toISOString(),
      progressPercent: progress,
      vivaScore: 3,
      vivaResponses: { "q1": 0, "q2": 1, "q3": 2 },
      labData: { rows: [{ V: 5, I: 2, R: 2.5 }] },
      feedback: "Great experiment!",
      aiConclusion: "The bridge is balanced.",
      teacherScore: score
    });
  };

  // Agent 1: 3 experiments
  await createSub(students[0], exps[0], 100, null); // pending
  await createSub(students[0], exps[1], 80, 8); // graded
  await createSub(students[0], exps[2], 100, null);

  // Agent 2: 4 experiments
  await createSub(students[1], exps[0], 100, 10);
  await createSub(students[1], exps[1], 100, 9);
  await createSub(students[1], exps[2], 95, null);
  await createSub(students[1], exps[3], 100, null);

  // Agent 3: 1 experiment
  await createSub(students[2], exps[0], 45, null); // half done

  console.log("Seeding complete! You can now log in as the teacher to witness the results.");
  process.exit(0);
}

seed().catch(console.error);