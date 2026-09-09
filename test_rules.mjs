import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, setDoc } from 'firebase/firestore';

async function runTests() {
  const projectId = 'vlab-test-' + Date.now();
  const testEnv = await initializeTestEnvironment({
    projectId: projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });

  const teacherAuth = { uid: 'teacher1', email: 'teacher@gmail.com' };
  const teacherContext = testEnv.authenticatedContext('teacher1', teacherAuth);
  
  // Create user doc
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', 'teacher1'), {
      role: 'teacher',
      status: 'active'
    });
  });

  const db = teacherContext.firestore();
  
  try {
    await assertSucceeds(setDoc(doc(db, 'classes', 'class1'), {
      teacherUid: 'teacher1',
      className: 'Test Class'
    }));
    console.log('Class creation SUCCEEDED');
  } catch (e) {
    console.log('Class creation FAILED:', e.message);
  }

  await testEnv.cleanup();
}
runTests();
