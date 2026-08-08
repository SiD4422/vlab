import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

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
  console.log("Starting backfill...");
  try {
    const subsSnap = await getDocs(collection(db, 'submissions'));
    let updated = 0;
    
    for (const subDoc of subsSnap.docs) {
      const data = subDoc.data();
      if (!data.teacherUid && data.classId) {
        // Fetch class to get teacherUid
        const classRef = doc(db, 'classes', data.classId);
        const classSnap = await getDoc(classRef);
        
        if (classSnap.exists()) {
          const teacherUid = classSnap.data().teacherUid;
          await updateDoc(subDoc.ref, { teacherUid });
          console.log(`Updated submission ${subDoc.id} with teacherUid ${teacherUid}`);
          updated++;
        }
      }
    }
    
    console.log(`Backfill complete. Updated ${updated} submissions.`);
  } catch (err) {
    console.error("Backfill failed:", err);
  }
  process.exit(0);
}

run();
