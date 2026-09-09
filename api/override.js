import { db, auth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Authenticate Request
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const uid = decodedToken.uid;

    const { submissionId, teacherScore } = req.body;
    if (!submissionId || teacherScore === undefined) {
      return res.status(400).json({ error: 'Missing submissionId or teacherScore' });
    }

    // 2. Fetch User to Verify Teacher Role
    const userSnap = await db.collection('users').doc(uid).get();
    if (!userSnap.exists) {
      return res.status(403).json({ error: 'Forbidden: User not found' });
    }
    const userData = userSnap.data();
    if (userData.role !== 'admin_teacher' && userData.role !== 'teacher') {
      return res.status(403).json({ error: 'Forbidden: Must be a teacher to override grades' });
    }

    // 3. Fetch Submission
    const submissionRef = db.collection('submissions').doc(submissionId);
    const submissionSnap = await submissionRef.get();

    if (!submissionSnap.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    const data = submissionSnap.data();

    // Verify the teacher owns this submission (optional but recommended for multi-tenant safety)
    if (data.teacherUid !== uid) {
      return res.status(403).json({ error: 'Forbidden: You are not the teacher for this submission' });
    }

    // 4. Update Submission with Override
    const score = Math.max(0, parseInt(teacherScore) || 0);
    
    await submissionRef.update({
      teacherScore: score,
      status: 'teacher_reviewed',
      manuallyOverridden: true
    });
    
    return res.status(200).json({ success: true, teacherScore: score });
  } catch (error) {
    console.error('Override Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
