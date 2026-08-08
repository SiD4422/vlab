import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCli8_QsZSqt-LURHpgjNMV91wV5nYHFec",
  authDomain: "vlab-4946a.firebaseapp.com",
  projectId: "vlab-4946a",
  storageBucket: "vlab-4946a.firebasestorage.app",
  messagingSenderId: "106401534256",
  appId: "1:106401534256:web:5f702801a7973ad54af8f5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Starting user enrolledTeacherUids backfill...");
  try {
    const classSnap = await getDocs(collection(db, 'classes'));
    let updatedUsers = new Set();
    const batch = writeBatch(db);
    
    // Create a mapping of studentUid -> Set of teacherUids
    const studentToTeachers = {};

    for (const classDoc of classSnap.docs) {
      const data = classDoc.data();
      const teacherUid = data.teacherUid;
      const studentUids = data.studentUids || [];

      for (const studentUid of studentUids) {
        if (!studentToTeachers[studentUid]) {
          studentToTeachers[studentUid] = new Set();
        }
        studentToTeachers[studentUid].add(teacherUid);
      }
    }

    // Now update each user
    for (const [studentUid, teacherUids] of Object.entries(studentToTeachers)) {
      const userRef = doc(db, 'users', studentUid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const currentData = userSnap.data();
        if (!currentData.enrolledTeacherUids) {
          batch.update(userRef, { enrolledTeacherUids: Array.from(teacherUids) });
          updatedUsers.add(studentUid);
          console.log(`Will update student ${studentUid} with teachers:`, Array.from(teacherUids));
        }
      }
    }
    
    if (updatedUsers.size > 0) {
      await batch.commit();
    }
    console.log(`Backfill complete. Updated ${updatedUsers.size} students.`);
  } catch (err) {
    console.error("Backfill failed:", err);
  }
  process.exit(0);
}

run();
