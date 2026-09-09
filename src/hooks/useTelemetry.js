import { useEffect, useRef, useCallback } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function useTelemetry(expId, user) {
  const lastEventTime = useRef(0);
  const eventCount = useRef(0);
  const mounted = useRef(false);
  // Track in-flight write promises so flushTelemetry() can await them all
  const writePromises = useRef([]);

  useEffect(() => {
    if (!user || !expId || mounted.current) return;
    mounted.current = true;
    
    // Write session start event
    try {
      const submissionId = `${user.uid}_${expId}`;
      const colRef = collection(db, 'submissions', submissionId, 'telemetry');
      const p = addDoc(colRef, {
        type: 'session_start',
        ts: serverTimestamp()
      }).catch(err => console.warn('Telemetry write failed:', err));
      writePromises.current.push(p);
    } catch (e) {
      // fail silently
    }
  }, [expId, user]);

  const trackEvent = useCallback((type, detail = null) => {
    if (!user || !expId) return;
    
    const now = Date.now();
    // Throttle: max 1 event every 3 seconds, capped at 50 events
    if (now - lastEventTime.current < 3000 || eventCount.current >= 50) {
      return;
    }
    
    lastEventTime.current = now;
    eventCount.current += 1;
    
    try {
      const submissionId = `${user.uid}_${expId}`;
      const colRef = collection(db, 'submissions', submissionId, 'telemetry');
      
      const payload = {
        type,
        ts: serverTimestamp()
      };
      if (detail) payload.detail = detail;

      const p = addDoc(colRef, payload).catch(err => console.warn('Telemetry write failed:', err));
      writePromises.current.push(p);
    } catch (e) {
      // fail silently
    }
  }, [expId, user]);

  // Await all in-flight telemetry writes before submission.
  // Uses allSettled — a single failed write must never block the grade.
  const flushTelemetry = useCallback(async () => {
    await Promise.allSettled(writePromises.current);
    writePromises.current = [];
  }, []);

  return { trackEvent, flushTelemetry };
}
