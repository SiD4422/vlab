import { getAdmin } from './firebaseAdmin.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let db, auth;
  try {
    const admin = await getAdmin();
    db = admin.db;
    auth = admin.auth;
  } catch (err) {
    console.error("Initialization Crash:", err);
    return res.status(500).json({ error: 'Admin Init Failed: ' + err.message });
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

    const { submissionId } = req.body;
    if (!submissionId) {
      return res.status(400).json({ error: 'Missing submissionId' });
    }

    // 2. Fetch Submission and Idempotency Check
    const submissionRef = db.collection('submissions').doc(submissionId);
    const submissionSnap = await submissionRef.get();

    if (!submissionSnap.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const data = submissionSnap.data();

    // Verify Ownership
    if (data.studentUid !== uid) {
      return res.status(403).json({ error: 'Forbidden: You do not own this submission' });
    }

    // Idempotency: Block if already graded or manually overridden
    if (data.status !== 'pending_auto_grade') {
      return res.status(409).json({ error: 'Conflict: Submission is not pending auto-grade' });
    }
    if (data.manuallyOverridden) {
      return res.status(409).json({ error: 'Conflict: Submission has been manually overridden by teacher' });
    }

    const isNonBridge = ['thermocouple', 'rtd', 'photodiode-ldr'].includes(data.experimentId);
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    
    const vivaScore = data.vivaScore || 0;
    const bridgeState = data.labData || {};
    const p = bridgeState.progress || {};
    
    // 3. --- GRADING LOGIC ---
    let teacherScore = 0;
    const gradingBreakdown = {};

    if (isNonBridge) {
      const vivaFraction = clamp(vivaScore / 3, 0, 1);
      gradingBreakdown.viva = Math.round(vivaFraction * 50);
      gradingBreakdown.progress = 
        (p.pretestDone ? 13 : 0) + 
        (p.posttestDone ? 13 : 0) + 
        (p.simulation ? 12 : 0) + 
        (p.theory ? 12 : 0);
      
      teacherScore = gradingBreakdown.viva + gradingBreakdown.progress;
    } else {
      const vivaFraction = clamp(vivaScore / 3, 0, 1);
      gradingBreakdown.viva = Math.round(vivaFraction * 30);
      
      const rows = bridgeState.rows || [];
      const n = rows.length;
      gradingBreakdown.table = n >= 3 ? 25 : n === 2 ? 16 : n === 1 ? 8 : 0;
      
      let accPts = 0;
      if (bridgeState?.hidden?.[0]?.value !== undefined) {
        const knownVal = bridgeState.hidden[0].value;
        if (knownVal !== 0 && n > 0) {
          const keyCandidates = ['Rx', 'Cx', 'C1', 'Lx', 'L1'];
          const firstRow = rows[0] || {};
          let relevantKey = keyCandidates.find(k => k in firstRow);
          
          if (relevantKey) {
            const measured = rows.map(r => parseFloat(r[relevantKey])).filter(v => !isNaN(v));
            if (measured.length > 0) {
              const avgMeasured = measured.reduce((sum, v) => sum + v, 0) / measured.length;
              const error = Math.abs(avgMeasured - knownVal) / Math.abs(knownVal);
              if (error <= 0.05) accPts = 30;
              else if (error <= 0.15) accPts = 20;
              else if (error <= 0.30) accPts = 10;
            }
          }
        }
      }
      gradingBreakdown.accuracy = accPts;
      
      gradingBreakdown.progress = 
        (p.pretestDone ? 4 : 0) + 
        (p.posttestDone ? 4 : 0) + 
        (p.simulation ? 3 : 0) + 
        (p.theory ? 4 : 0);
        
      teacherScore = gradingBreakdown.viva + gradingBreakdown.table + gradingBreakdown.accuracy + gradingBreakdown.progress;
    }

    // 4. --- INTEGRITY LAYER ---
    const integrityFlags = [];
    let integrityScore = 100;
    
    try {
      const telemetrySnap = await submissionRef.collection('telemetry').get();
      if (!telemetrySnap.empty) {
        const events = [];
        telemetrySnap.forEach(docSnap => {
           const d = docSnap.data();
           if (d.ts) events.push({ ...d, ts: typeof d.ts.toMillis === 'function' ? d.ts.toMillis() : d.ts });
        });
        events.sort((a, b) => a.ts - b.ts);
        
        const startEvent = events.find(e => e.type === 'session_start');
        const interactionEvents = events.filter(e => e.type !== 'session_start');
        
        let timeFlagTriggered = false;
        // Verify submittedAt exists, otherwise fallback to current time
        const submittedAtMs = data.submittedAt ? new Date(data.submittedAt).getTime() : Date.now();
        const rowsCount = bridgeState.rows?.length || 0;
        
        if (startEvent) {
          const timeOnTaskMs = submittedAtMs - startEvent.ts;
          if (timeOnTaskMs < 60000 && rowsCount > 0) {
            integrityFlags.push({ check: 'Time on Task', severity: 'high', detail: 'Suspiciously low completion time (< 60s)' });
            integrityScore -= 40;
            timeFlagTriggered = true;
          }
        }

        if (interactionEvents.length === 0 && rowsCount > 0) {
          integrityFlags.push({ check: 'Interaction Velocity', severity: 'high', detail: 'No simulation interaction detected' });
          integrityScore -= 40;
          timeFlagTriggered = true;
        } else if (interactionEvents.length > 1) {
          const firstInteraction = interactionEvents[0].ts;
          const lastInteraction = interactionEvents[interactionEvents.length - 1].ts;
          if (lastInteraction - firstInteraction < 2000) {
            integrityFlags.push({ check: 'Interaction Velocity', severity: 'high', detail: 'Unnatural interaction velocity (scripting/pasting suspected)' });
            integrityScore -= 40;
            timeFlagTriggered = true;
          }
        }

        // Conditional precision anomaly - 2% threshold
        if (!isNonBridge && timeFlagTriggered && rowsCount > 0) {
           if (bridgeState?.hidden?.[0]?.value !== undefined) {
             const knownVal = bridgeState.hidden[0].value;
             const keyCandidates = ['Rx', 'Cx', 'C1', 'Lx', 'L1'];
             const firstRow = bridgeState.rows[0] || {};
             let relevantKey = keyCandidates.find(k => k in firstRow);
             
             if (relevantKey) {
                const measured = bridgeState.rows.map(r => parseFloat(r[relevantKey])).filter(v => !isNaN(v));
                if (measured.length > 0) {
                   const avgMeasured = measured.reduce((sum, v) => sum + v, 0) / measured.length;
                   const error = Math.abs(avgMeasured - knownVal) / Math.abs(knownVal);
                   if (error <= 0.02) {
                      integrityFlags.push({ check: 'Precision Anomaly', severity: 'medium', detail: 'Impossibly precise match achieved at impossible speed (scripting/pasting suspected)' });
                      integrityScore -= 30;
                   }
                }
             }
           }
        }
      }
    } catch (e) {
      console.error('Error fetching/computing integrity flags', e);
    }
    
    integrityScore = Math.max(0, integrityScore);

    // 5. Save back to Firestore via Admin SDK
    await submissionRef.update({
      teacherScore,
      gradingVersion: 1,
      gradingBreakdown,
      integrityFlags,
      integrityScore,
      status: 'auto_graded',
      manuallyOverridden: false
    });
    
    return res.status(200).json({ success: true, teacherScore, integrityScore });
  } catch (error) {
    console.error('Grading Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
