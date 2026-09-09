const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');
const { setLogLevel, doc, setDoc, updateDoc, getDoc } = require('firebase/firestore');

setLogLevel('error');

async function runTests() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'vlab-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080
    },
  });

  let failedCount = 0;
  
  async function test(name, fn) {
    try {
      await testEnv.clearFirestore();
      await fn();
      console.log(`✅ ${name}`);
    } catch (e) {
      console.error(`❌ ${name}`);
      console.error(e.message);
      failedCount++;
    }
  }

  async function setupUser(uid, email, role, status) {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'users', uid), { uid, email, role, status });
    });
  }
  
  console.log("Running security rules tests...");

  // 1. Status poison on non-teacher target
  await test('Reject status update by teacher on student account', async () => {
    await setupUser('teacher1', 't1@srmist.edu.in', 'teacher', 'active');
    await setupUser('student1', 's1@srmist.edu.in', 'student', 'active');
    
    const db = testEnv.authenticatedContext('teacher1', { email: 't1@srmist.edu.in' }).firestore();
    await assertFails(updateDoc(doc(db, 'users', 'student1'), { status: 'rejected' }));
  });

  // 2. Status poison on admin target
  await test('Reject status update by teacher on admin account', async () => {
    await setupUser('teacher1', 't1@srmist.edu.in', 'teacher', 'active');
    await setupUser('admin1', 'admin1@srmist.edu.in', 'admin_teacher', 'active');
    
    const db = testEnv.authenticatedContext('teacher1', { email: 't1@srmist.edu.in' }).firestore();
    await assertFails(updateDoc(doc(db, 'users', 'admin1'), { status: 'rejected' }));
  });
  
  // 3. Submissions grade lock
  await test('Reject student update of teacherScore', async () => {
    await setupUser('student1', 's1@srmist.edu.in', 'student', 'active');
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'submissions', 'sub1'), {
        studentUid: 'student1',
        teacherScore: 80,
        status: 'pending'
      });
    });
    
    const db = testEnv.authenticatedContext('student1', { email: 's1@srmist.edu.in' }).firestore();
    await assertFails(updateDoc(doc(db, 'submissions', 'sub1'), { teacherScore: 90 }));
  });
  
  // 4. Admin-collection denial
  await test('Reject teacher read of organizations collection', async () => {
    await setupUser('teacher1', 't1@srmist.edu.in', 'teacher', 'active');
    const db = testEnv.authenticatedContext('teacher1', { email: 't1@srmist.edu.in' }).firestore();
    await assertFails(getDoc(doc(db, 'organizations', 'srm_univ')));
  });

  // 5. Rejected teacher login / signout rule tests
  // Technically this tests if a rejected teacher can read/write users collection
  await test('Reject write for rejected teacher', async () => {
    await setupUser('teacher2', 't2@srmist.edu.in', 'teacher', 'rejected');
    const db = testEnv.authenticatedContext('teacher2', { email: 't2@srmist.edu.in' }).firestore();
    
    // Attempt to update a class document (requires active teacher)
    await assertFails(updateDoc(doc(db, 'classes', 'someClass'), { className: 'Hacked Class' }));
  });

  // 6. Submissions strict create payload
  await test('Reject submission creation with grading fields', async () => {
    await setupUser('student2', 's2@srmist.edu.in', 'student', 'active');
    const db = testEnv.authenticatedContext('student2', { email: 's2@srmist.edu.in' }).firestore();
    
    // Missing status
    await assertFails(setDoc(doc(db, 'submissions', 'sub2'), {
      studentUid: 'student2',
    }));

    // Spoofed teacherScore
    await assertFails(setDoc(doc(db, 'submissions', 'sub2'), {
      studentUid: 'student2',
      status: 'pending_auto_grade',
      teacherScore: 100
    }));

    // Spoofed status auto_graded
    await assertFails(setDoc(doc(db, 'submissions', 'sub2'), {
      studentUid: 'student2',
      status: 'auto_graded'
    }));

    // Valid raw payload
    await assertSucceeds(setDoc(doc(db, 'submissions', 'sub2'), {
      studentUid: 'student2',
      status: 'pending_auto_grade',
      experimentId: 'wheatstone-bridge'
    }));
  });

  await testEnv.cleanup();
  
  if (failedCount > 0) process.exit(1);
  console.log("All rules tests passed!");
}

runTests().catch(console.error);
