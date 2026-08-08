import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, arrayUnion, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);

async function run() {
  try {
    const cred = await signInWithEmailAndPassword(auth, 'student1@test.com', 'password123');
    const user = cred.user;
    console.log("Logged in as student:", user.uid);

    const classDocRef = doc(db, 'classes', 'VLAB-QCWUM2'); // using a known invite code from screenshot
    
    // Simulate join class batch
    const batch = writeBatch(db);
    batch.update(classDocRef, {
      studentUids: arrayUnion(user.uid)
    });
    
    const userDocRef = doc(db, 'users', user.uid);
    batch.update(userDocRef, {
      enrolledTeacherUids: arrayUnion('lHDicrCqU6RC92hyPvFLRoyLIsf2'),
      lastJoinedClassId: 'VLAB-QCWUM2'
    });
    
    await batch.commit();
    console.log("Batch commit SUCCESS. The rule worked.");

  } catch (err) {
    console.error("Batch commit FAILED. The rule rejected it:", err);
  }
  process.exit(0);
}

run();
