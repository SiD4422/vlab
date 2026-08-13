import { useEffect } from 'react';
import { Zap } from 'lucide-react';
import { C } from '../App';
import { useLiveBroadcast } from '../hooks/useLiveBroadcast';

/**
 * CircuitSandboxTab — The interactive circuit builder workspace.
 * Uses the useLiveBroadcast hook for real-time teacher/student sync.
 *
 * Props:
 *   expId         — current experiment ID
 *   bridgeState   — current lab state for this experiment
 *   setBridgeSims — state updater from StudentApp
 *   isBroadcaster — true when the teacher is broadcasting
 *   isSpectator   — true when a student is watching the broadcast
 *   classId       — Firebase class ID
 *   teacherId     — teacher's UID
 */
export default function CircuitSandboxTab({ expId, bridgeState, setBridgeSims, isBroadcaster, isSpectator, classId, teacherId }) {
  const { iframeRef, iframeLoaded, setIframeLoaded, handleIframeMessage } = useLiveBroadcast({
    isBroadcaster,
    isSpectator,
    classId,
    expId,
    teacherId,
  });

  // Handle postMessage events from the circuit-sandbox iframe
  useEffect(() => {
    const listener = (e) => handleIframeMessage(e, { setBridgeSims, expId, classId, isBroadcaster });
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [expId, setBridgeSims, classId, isBroadcaster]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#e8f5f3', color: C.teal, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} /> INTERACTIVE
          </div>
          <span style={{ fontSize: 13, color: C.muted }}>Build and test real circuits with live physics simulation.</span>
        </div>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: '#0a0e14' }}>
        <iframe
          ref={iframeRef}
          onLoad={() => setIframeLoaded(true)}
          src="/circuit-sandbox.html"
          style={{ width: '100%', height: '560px', border: 'none', display: 'block' }}
          title="Circuit Sandbox"
          allow="fullscreen"
        />
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
        <b style={{ color: C.ink }}>How to use:</b> Click a component from the left panel → click on the grid to place it → drag from a terminal dot to another to wire them → watch the live readings update. Press <b>R</b> to rotate, <b>Delete</b> to remove.
      </div>
    </div>
  );
}
