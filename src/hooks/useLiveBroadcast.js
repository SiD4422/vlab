import { useEffect, useRef, useState } from 'react';
import { rtdb } from '../services/firebase';
import { ref, set, update, onValue, onDisconnect } from 'firebase/database';

/**
 * useLiveBroadcast — encapsulates all RTDB real-time broadcast logic
 * for both the teacher (broadcaster) and student (spectator) sides.
 *
 * @param {object} options
 * @param {boolean} options.isBroadcaster - true if this user is the teacher broadcasting
 * @param {boolean} options.isSpectator   - true if this user is a student watching
 * @param {string}  options.classId       - the Firebase class ID
 * @param {string}  options.expId         - the experiment ID being broadcast
 * @param {string}  options.teacherId     - the teacher's UID (required for broadcaster)
 * @param {string}  options.expId         - experiment id
 * @returns {{ spectatorState, iframeRef, iframeLoaded, setIframeLoaded }}
 */
export function useLiveBroadcast({ isBroadcaster, isSpectator, classId, expId, teacherId }) {
  const iframeRef = useRef(null);
  const lastState = useRef({});
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [spectatorState, setSpectatorState] = useState(null);

  // Broadcaster: initialize and manage the live session node in RTDB
  useEffect(() => {
    if (isBroadcaster && classId && teacherId) {
      const sessionRef = ref(rtdb, `liveSessions/${classId}`);
      set(sessionRef, {
        active: true,
        expId,
        teacherId,
        state: { components: [], wires: [], readings: {} },
      }).catch(e => console.error('[useLiveBroadcast] Error initializing session:', e));

      onDisconnect(sessionRef)
        .update({ active: false, teacherId })
        .catch(e => console.error('[useLiveBroadcast] Error registering onDisconnect:', e));

      return () => {
        update(sessionRef, { active: false }).catch(e => console.error(e));
        onDisconnect(sessionRef).cancel();
      };
    }
  }, [isBroadcaster, classId, expId, teacherId]);

  // Spectator: listen to the live session and redirect on end
  useEffect(() => {
    if (isSpectator && classId) {
      const sessionRef = ref(rtdb, `liveSessions/${classId}`);
      const unsub = onValue(sessionRef, snap => {
        const data = snap.val();
        if (!data || !data.active) {
          const overlay = document.createElement('div');
          overlay.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui"><div style="background:#1a0a0a;border:1px solid #ef4444;border-radius:16px;padding:32px 40px;text-align:center;max-width:400px"><div style="font-size:32px;margin-bottom:16px">📡</div><div style="color:#fff;font-size:20px;font-weight:700;margin-bottom:8px">Broadcast Ended</div><div style="color:rgba(255,255,255,0.65);font-size:15px">The teacher has ended the live broadcast. Redirecting you back...</div></div></div>`;
          document.body.appendChild(overlay);
          setTimeout(() => { window.location.href = '/student'; }, 2000);
          return;
        }
        setSpectatorState(data.state);
      });
      return () => unsub();
    }
  }, [isSpectator, classId]);

  // Sync spectator state into the iframe when it loads
  useEffect(() => {
    if (iframeLoaded && spectatorState && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SYNC_STATE', state: spectatorState },
        '*'
      );
    }
  }, [iframeLoaded, spectatorState]);

  /**
   * getRTDBUpdates — computes a minimal diff between two state objects
   * so only changed paths are written to RTDB (delta sync).
   */
  function getRTDBUpdates(oldObj, newObj, path = '') {
    const updates = {};
    if (Array.isArray(newObj)) {
      if (!oldObj || oldObj.length !== newObj.length) {
        updates[path] = newObj;
        return updates;
      }
    }
    for (let key in newObj) {
      const p = path ? `${path}/${key}` : key;
      const newVal = newObj[key];
      const oldVal = oldObj ? oldObj[key] : undefined;
      if (newVal !== null && typeof newVal === 'object') {
        if (Array.isArray(newVal)) {
          if (!oldVal || oldVal.length !== newVal.length) {
            updates[p] = newVal;
          } else {
            Object.assign(updates, getRTDBUpdates(oldVal, newVal, p));
          }
        } else {
          Object.assign(updates, getRTDBUpdates(oldVal, newVal, p));
        }
      } else {
        if (oldVal !== newVal) updates[p] = newVal;
      }
    }
    return updates;
  }

  /**
   * handleIframeMessage — call this from a window 'message' event listener.
   * Handles BROADCAST_STATE (teacher → RTDB) and SNAPSHOT_RESULT (capture → state).
   */
  const handleIframeMessage = (e, { setBridgeSims, expId: eid, classId: cid, isBroadcaster: isB }) => {
    if (!e.origin || e.origin !== window.location.origin) return;
    const data = e.data;
    if (!data) return;
    if (data.type === 'BROADCAST_STATE' && isB && cid) {
      const updates = getRTDBUpdates(
        lastState.current,
        data.state,
        `liveSessions/${cid}/state`
      );
      if (Object.keys(updates).length > 0) {
        update(ref(rtdb), updates);
        lastState.current = JSON.parse(JSON.stringify(data.state));
      }
    }
    if (data.type === 'SNAPSHOT_RESULT') {
      setBridgeSims(prev => ({
        ...prev,
        [eid]: {
          ...prev[eid],
          labActivity: {
            ...prev[eid]?.labActivity,
            circuitImg: data.svgDataUrl,
            scopeImg: data.graphDataUrl,
            analysisData: data.analysisData,
          },
        },
      }));
    }
  };

  return { spectatorState, iframeRef, iframeLoaded, setIframeLoaded, handleIframeMessage };
}
