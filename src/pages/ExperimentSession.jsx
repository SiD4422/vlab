/**
 * ExperimentSession.jsx
 *
 * Thin orchestrator for the experiment detail view.
 * All tab content components live in src/experiment-tabs/
 * All Firebase/RTDB logic lives in src/hooks/
 *
 * State lifecycle:
 *   bridgeSims lives in StudentApp (or TeacherDashboardView for broadcast)
 *   and is passed down as props — resets when the student navigates away.
 */
import { useState, useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import {
  Zap, BookOpen, ClipboardCheck, ListOrdered, Sparkles, MessageSquare,
  Link2, Target, ArrowLeft, Activity, FileText,
  AlertTriangle, XCircle, Sidebar,
} from 'lucide-react';
import StrainGaugeSim from '../simulations/StrainGaugeSim';
import UnifiedBridgeSim, { BridgeProcedurePanel } from '../simulations/UnifiedBridgeSim';
import AIChatbot from '../AIChatbot';
import { C } from '../App';
import { rtdb } from '../services/firebase';
import { ref, update } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import Section from '../components/Section';
import { useToast } from '../hooks/useToast';
import QuizTab from '../experiment-tabs/QuizTab';
import VivaPrepTab from '../experiment-tabs/VivaPrepTab';
import LabReportTab from '../experiment-tabs/LabReportTab';
import CircuitSandboxTab from '../experiment-tabs/CircuitSandboxTab';
import FeedbackTab from '../experiment-tabs/FeedbackTab';

// ─── Tabs definition ───────────────────────────────────────────────
const TABS = [
  { id: 'aim',        label: 'Aim',        icon: Target },
  { id: 'theory',     label: 'Theory',     icon: BookOpen },
  { id: 'simulation', label: 'Simulation', icon: Activity,       badge: 'BETA' },
  { id: 'pretest',    label: 'Pretest',    icon: ClipboardCheck },
  { id: 'procedure',  label: 'Procedure',  icon: ListOrdered },
  { id: 'posttest',   label: 'Posttest',   icon: ClipboardCheck },
  { id: 'report',     label: 'Lab Report', icon: FileText },
  { id: 'references', label: 'References', icon: Link2 },
  { id: 'feedback',   label: 'Feedback',   icon: MessageSquare },
];

const BRIDGE_IDS = [
  'wheatstone-bridge', 'kelvin-bridge', 'kelvin-double-bridge',
  'capacitance-comparison-bridge', 'maxwell-inductance-bridge',
  'maxwell-lc-bridge', 'hays-bridge', 'anderson-bridge',
  'schering-bridge', 'wiens-bridge', 'transformer-ratio-bridge',
];

// ─── Detail (main experiment layout) ───────────────────────────────────────────
function Detail({ exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen, markCompleted, bridgeSims, setBridgeSims, isBroadcaster, isSpectator, classId }) {
  const { user } = useAuth();
  const { toasts, addToast } = useToast();

  // Warn on browser close/refresh if lab has unsaved data
  useEffect(() => {
    const hasData = bridgeSims[exp.id] &&
      (bridgeSims[exp.id].rows?.length > 0 || bridgeSims[exp.id].vivaResponses);
    if (!hasData) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = 'You have unsaved lab work. Are you sure you want to leave?';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [bridgeSims, exp.id]);

  // Listen for snapshot/reading events from the circuit iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === 'SNAPSHOT_RESULT') {
        setBridgeSims(prev => {
          const current = prev[exp.id] || { rows: [], snapshots: [] };
          return {
            ...prev,
            [exp.id]: {
              ...current,
              snapshots: [...(current.snapshots || []), { id: Date.now(), svg: e.data.svgDataUrl, graph: e.data.graphDataUrl }],
            },
          };
        });
        addToast('Circuit Captured!', 'Your circuit snapshot has been added to the Lab Report.', 'success');
      } else if (e.data.type === 'READING_RESULT') {
        const newRow = { id: Date.now() };
        setBridgeSims(prev => {
          const current = prev[exp.id] || { rows: [], snapshots: [] };
          return { ...prev, [exp.id]: { ...current, rows: [...current.rows, newRow] } };
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [exp.id, setBridgeSims, addToast]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: '#tour-tabs', popover: { title: 'Navigation', description: 'Use these tabs to switch between Theory, Simulation, and Procedure.', side: 'right', align: 'start' } },
        { element: '#tour-reference', popover: { title: 'Reference Diagram', description: 'This is the exact circuit schematic you need to build for this experiment.', side: 'bottom', align: 'start' } },
        { element: '#tour-sandbox', popover: { title: 'Circuit Sandbox', description: 'This is your workspace. Drag components from the palette, wire them, and manually balance the bridge.', side: 'top', align: 'start' } },
        { element: '#tour-procedure-tab', popover: { title: 'Record Readings', description: 'Once balanced, click the Procedure tab to manually record your readings into the observation table.', side: 'right', align: 'start' } },
      ],
    });
    driverObj.drive();
  };

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Toast toasts={toasts} />

      {/* Breadcrumb bar */}
      <div className="no-print" style={{ background: 'var(--card)', borderBottom: `1px solid ${C.border}`, padding: '20px 60px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: C.muted }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.teal, fontWeight: 600, cursor: 'pointer', fontSize: 14, padding: 0 }}>
          <ArrowLeft size={16} /> Course Overview
        </button>
        <span>/</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>Module: {exp.title}</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: sidebarOpen ? C.teal : C.muted, fontWeight: 600, cursor: 'pointer', fontSize: 14, padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = C.teal}
          onMouseLeave={e => e.currentTarget.style.color = sidebarOpen ? C.teal : C.muted}
        >
          <Sidebar size={18} /> {sidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 40, padding: '40px 60px 80px', alignItems: 'flex-start', maxWidth: 1400, margin: '0 auto' }}>
        {/* Sidebar tabs */}
        <div className="app-sidebar" style={{ width: sidebarOpen ? 240 : 0, overflow: 'hidden', flexShrink: 0, transition: 'width 0.15s', position: 'sticky', top: 116 }} id="tour-tabs">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 16, marginBottom: 12 }}>Module Contents</div>
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  id={t.id === 'procedure' ? 'tour-procedure-tab' : undefined}
                  onClick={() => setTab(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isActive ? 'var(--teal-soft)' : 'transparent', color: isActive ? 'var(--teal)' : 'var(--ink-soft)', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: isActive ? 700 : 500, textAlign: 'left', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={18} style={{ color: isActive ? 'var(--teal)' : 'var(--ink-soft)' }} />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {t.badge && !isActive && (
                    <span style={{ fontSize: 10, background: 'var(--copper-soft)', color: 'var(--copper)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>{t.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content panel */}
        <div className="premium-panel" style={{ flex: 1, minWidth: 0, padding: '56px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="status-badge pending" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', padding: '4px 10px', borderRadius: 6 }}>{exp.tag}</span>
            <span className="text-muted" style={{ fontSize: 13, fontWeight: 600 }}>Required Module</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '0 0 32px' }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: -0.5 }}>{exp.title}</h2>
            {tab === 'simulation' && exp.id !== 'strain-gauge' && (
              <button onClick={startTour} className="manage-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 14 }}>
                <Sparkles size={16} /> Guide Me
              </button>
            )}
          </div>

          {/* Broadcaster banner */}
          {isBroadcaster && (
            <div style={{ marginBottom: 24, padding: '12px 20px', background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#3730a3', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                You are broadcasting this experiment live to your students!
              </div>
              <button
                onClick={() => {
                  try {
                    update(ref(rtdb, `liveSessions/${classId}`), { active: false })
                      .catch(e => console.error('Error ending broadcast:', e));
                  } catch (e) {
                    console.error(e);
                  }
                  if (onBack) onBack();
                }}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => e.target.style.background = '#dc2626'}
                onMouseLeave={e => e.target.style.background = '#ef4444'}
              >
                <XCircle size={16} /> Stop Broadcast
              </button>
            </div>
          )}

          {/* Spectator banner */}
          {isSpectator && (
            <div style={{ marginBottom: 24, padding: '12px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, color: '#b91c1c', fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Live Spectating: The teacher is controlling this simulation. Your controls are locked.
            </div>
          )}

          {/* Tab content with fade transition */}
          <div key={tab} className="tab-content-enter">
            {tab === 'aim' && (
              <div>
                <Section title="Aim">{exp.aim}</Section>
                <Section title="Objectives">
                  <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.8 }}>
                    {exp.objectives.map((o, i) => <li key={i}>{o}</li>)}
                  </ol>
                </Section>
              </div>
            )}

            {tab === 'theory' && (
              <Section title="Theory">
                <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {exp.theory.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </Section>
            )}

            {tab === 'simulation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {exp.id === 'strain-gauge' ? (
                  <Section title="Interactive Simulation"><StrainGaugeSim /></Section>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <Section title="Reference Diagram" id="tour-reference">
                      {BRIDGE_IDS.includes(exp.id) ? (
                        <UnifiedBridgeSim bridgeId={exp.id} />
                      ) : (
                        <div style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)', borderRadius: 16, border: '1px solid rgba(14,165,233,0.15)', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(34,197,94,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse 3s ease-in-out infinite' }}>
                              <Activity size={36} color="#0ea5e9" />
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 10 }}>Diagram Coming Soon</div>
                            <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 20px' }}>The interactive reference diagram for <strong style={{ color: C.ink }}>{exp.title}</strong> is currently being built by our team.</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(14,165,233,0.1)', borderRadius: 999, fontSize: 13, fontWeight: 700, color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                              In development
                            </div>
                          </div>
                        </div>
                      )}
                    </Section>
                    <Section title="Circuit Sandbox Workspace" id="tour-sandbox">
                      <CircuitSandboxTab
                        expId={exp.id}
                        bridgeState={bridgeSims[exp.id]}
                        setBridgeSims={setBridgeSims}
                        isBroadcaster={isBroadcaster}
                        isSpectator={isSpectator}
                        classId={classId}
                        teacherId={user?.uid}
                      />
                    </Section>
                  </div>
                )}
              </div>
            )}

            {tab === 'pretest' && (
              <Section title="Pretest">
                <QuizTab questions={exp.pretest} />
              </Section>
            )}

            {tab === 'posttest' && (
              <Section title="Posttest">
                <QuizTab questions={exp.posttest} onComplete={markCompleted} />
                <VivaPrepTab exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />
              </Section>
            )}

            {tab === 'report' && (
              <LabReportTab exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />
            )}

            {tab === 'procedure' && (
              <Section title="Procedure">
                <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {exp.procedure.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
                {BRIDGE_IDS.includes(exp.id) && (
                  <BridgeProcedurePanel
                    bridgeId={exp.id}
                    bridgeState={bridgeSims[exp.id]}
                    onStateChange={newSt => setBridgeSims(prev => ({ ...prev, [exp.id]: newSt }))}
                  />
                )}
              </Section>
            )}

            {tab === 'references' && (
              <Section title="References">
                <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9 }}>
                  {exp.references.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </Section>
            )}

            {tab === 'feedback' && (
              <Section title="Feedback">
                <FeedbackTab />
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* AI Chatbot widget */}
      <AIChatbot currentExperiment={exp.title} />
    </div>
  );
}

// ─── ExperimentSession (exported page component) ───────────────────────────────────
export default function ExperimentSession({ exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen, markCompleted, bridgeSims, setBridgeSims, isBroadcaster, isSpectator, classId }) {
  return (
    <div style={{ paddingTop: 76 }}>
      <Detail
        exp={exp}
        tab={tab}
        setTab={setTab}
        onBack={onBack}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        markCompleted={markCompleted}
        bridgeSims={bridgeSims}
        setBridgeSims={setBridgeSims}
        isBroadcaster={isBroadcaster}
        isSpectator={isSpectator}
        classId={classId}
      />
    </div>
  );
}
