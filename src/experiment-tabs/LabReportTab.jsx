import { useState } from 'react';
import {
  Target, BookOpen, Zap, Sparkles, Activity, Calculator,
  BarChart2, Trophy, HelpCircle, CheckCircle2, XCircle,
  Printer, Download, Loader2, User, GraduationCap, Building, IdCard,
} from 'lucide-react';
import { C } from '../App';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { BRIDGES, CircuitSVG } from '../simulations/UnifiedBridgeSim';
import { AccordionSection } from './VivaPrepTab';
import VivaPrepTab from './VivaPrepTab';

/**
 * LabReportTab — The printable lab report view.
 * Handles observation table editing, AI conclusion generation,
 * and Firestore submission to the teacher.
 */
export default function LabReportTab({ exp, bridgeState, setBridgeSims }) {
  const { user, enrolledClass } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiConclusion, setAiConclusion] = useState('');
  const [generatingConclusion, setGeneratingConclusion] = useState(false);
  // Inline confirmation state (replaces window.confirm)
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  // Inline error/success messages (replaces alert)
  const [inlineMsg, setInlineMsg] = useState(null); // { type: 'error'|'success', text: string }

  if (!exp) return null;
  const bridge = BRIDGES ? BRIDGES.find(b => b.id === exp.id) : null;

  const showMsg = (type, text) => {
    setInlineMsg({ type, text });
    setTimeout(() => setInlineMsg(null), 5000);
  };

  const updateRow = (idx, key, val) => {
    if (!setBridgeSims) return;
    setBridgeSims(prev => {
      const current = prev[exp.id] || { rows: [], snapshots: [] };
      const newRows = [...current.rows];
      newRows[idx] = { ...newRows[idx], [key]: val };
      return { ...prev, [exp.id]: { ...current, rows: newRows } };
    });
  };

  const doSubmit = async () => {
    setShowOverwriteConfirm(false);
    setSubmitting(true);
    const vivaScore = bridgeState?.vivaScore || 0;
    const vivaResponses = bridgeState?.vivaResponses || {};
    const submissionId = `${user.uid}_${exp.id}`;
    const payload = {
      studentUid: user.uid, studentName: user.name, studentAvatar: user.avatar,
      classId: enrolledClass.id, teacherUid: enrolledClass.teacherUid,
      experimentId: exp.id, experimentName: exp.title,
      vivaScore, vivaResponses, teacherScore: null,
      labData: bridgeState || {}, submittedAt: new Date().toISOString(), status: 'completed',
    };
    try {
      await setDoc(doc(db, 'submissions', submissionId), payload);
      setSubmitted(true);
      showMsg('success', `Lab report submitted to ${enrolledClass.className}!`);
    } catch (e) {
      console.error('Submission error:', e);
      showMsg('error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitToTeacher = async () => {
    if (!enrolledClass) {
      showMsg('error', 'You must join a class first from the Home dashboard to submit your report.');
      return;
    }
    if (exp.viva && !bridgeState?.vivaSubmitted) {
      // Instead of window.confirm, show inline confirmation
      setShowOverwriteConfirm('viva');
      return;
    }
    const submissionId = `${user.uid}_${exp.id}`;
    setSubmitting(true);
    try {
      const existingDoc = await getDoc(doc(db, 'submissions', submissionId));
      if (existingDoc.exists()) {
        const data = existingDoc.data();
        if (data.teacherScore !== null && data.teacherScore !== undefined) {
          showMsg('error', 'This lab report has already been graded by your teacher. You cannot overwrite it.');
          setSubmitting(false);
          return;
        }
        setSubmitting(false);
        setShowOverwriteConfirm('overwrite');
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
    doSubmit();
  };

  const generateAIConclusion = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      showMsg('error', 'Please configure your Gemini API Key in the AI Chatbot (bottom right) first.');
      return;
    }
    if (!bridgeState?.rows || bridgeState.rows.length === 0) {
      showMsg('error', 'Please add some readings to your observation table first!');
      return;
    }
    setGeneratingConclusion(true);
    try {
      const readings = JSON.stringify(bridgeState.rows);
      const prompt = `You are a helpful lab assistant. The student just finished the experiment "${exp.title}". Here are their observation table readings: ${readings}. Write a professional, concise 1-2 paragraph conclusion that summarizes these specific findings and the underlying principle. Return ONLY the conclusion text.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 300 } }) }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);
      setAiConclusion(data.candidates[0].content.parts[0].text);
    } catch (e) {
      console.error(e);
      showMsg('error', 'Failed to generate conclusion: ' + e.message);
    } finally {
      setGeneratingConclusion(false);
    }
  };

  return (
    <div className="print-report-container" style={{ padding: '40px', fontFamily: 'var(--sans)', color: C.ink, background: C.card, borderRadius: 12, minHeight: '100vh', position: 'relative' }}>
      
      {/* Inline message banner */}
      {inlineMsg && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: inlineMsg.type === 'success' ? '#ecfdf5' : '#fef2f2', border: `1px solid ${inlineMsg.type === 'success' ? '#a7f3d0' : '#fca5a5'}`, color: inlineMsg.type === 'success' ? '#065f46' : '#991b1b', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          {inlineMsg.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {inlineMsg.text}
        </div>
      )}

      {/* Inline overwrite confirmation */}
      {showOverwriteConfirm && (
        <div style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 12, background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            {showOverwriteConfirm === 'viva' ? 'Viva Quiz not submitted' : 'Report already submitted'}
          </div>
          <div style={{ fontSize: 14, marginBottom: 12 }}>
            {showOverwriteConfirm === 'viva'
              ? 'You have not submitted the Viva Quiz yet. Submit anyway? (Viva score will be 0).'
              : 'You have already submitted this lab report. Overwrite it?'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={doSubmit} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Yes, Submit</button>
            <button onClick={() => setShowOverwriteConfirm(false)} style={{ background: 'transparent', border: '1px solid #d97706', color: '#d97706', padding: '8px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#dcfce7', color: '#166534', padding: '12px 20px', borderRadius: 12, minWidth: 120 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>DC-02</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Required Module</div>
        </div>
        <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 28, fontWeight: 800, color: C.ink }}>{exp.title}</h1>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#059669' }}>LABORATORY RECORD</h2>
          <div style={{ fontSize: 15, color: C.muted }}>Experiment: {exp.title}</div>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: `1px solid ${C.border}`, borderRadius: 8, background: 'transparent', color: C.ink, fontWeight: 600, cursor: 'pointer' }}>
            <Printer size={16} /> Print
          </button>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#059669', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Student Details */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: '24px 32px', border: `1px solid ${C.border}`, borderRadius: 12 }}>
        {[
          { icon: User, label: 'Name', val: user?.name || '' },
          { icon: GraduationCap, label: 'Class', val: user?.class || '' },
          { icon: Building, label: 'Department', val: user?.department || '' },
          { icon: IdCard, label: 'Registration No.', val: user?.regNo || '' },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
              <Icon size={16} color={C.muted} /> {label}
            </div>
            <input type="text" defaultValue={val} style={{ width: '100%', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '4px 0', outline: 'none', background: 'transparent', fontSize: 15, color: C.ink }} />
          </div>
        ))}
      </div>

      <AccordionSection title="1. Aim" icon={Target} color="#10b981" defaultOpen={false}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: C.ink }}>{exp.aim}</p>
      </AccordionSection>
      <AccordionSection title="2. Theory" icon={BookOpen} color="#3b82f6" defaultOpen={false}>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6, color: C.ink }}>
          {exp.theory.map((p, i) => <li key={i} style={{ marginBottom: 8 }}>{p}</li>)}
        </ul>
      </AccordionSection>

      {bridge && (
        <>
          <AccordionSection title="3. Circuit Diagram" icon={Zap} color="#a855f7" defaultOpen={false}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <CircuitSVG cfg={{ ...bridge.svg, detector: bridge.detector, source: bridge.source }} />
            </div>
          </AccordionSection>
          <AccordionSection title="4. Formula" icon={Sparkles} color="#f59e0b" defaultOpen={false}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
              <div dangerouslySetInnerHTML={{ __html: bridge.formula }} style={{ fontSize: 24, padding: 20, background: '#fff', borderRadius: 8, border: `1px solid ${C.border}` }} />
              <div style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: 20, color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
                {(bridge.fixed || []).map((fx, i) => <div key={i}>{fx.k} = {fx.label}</div>)}
                {bridge.tabCols.map((c, i) => <div key={`c${i}`}>{c.k} = {c.label || c.k}</div>)}
              </div>
            </div>
          </AccordionSection>
        </>
      )}

      <AccordionSection title="5. Lab Activity" icon={Activity} color="#3b82f6" defaultOpen={true}>
        {bridgeState?.labActivity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {bridgeState.labActivity.circuitImg && (
                <div style={{ flex: '1 1 400px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: C.ink }}>Circuit Snapshot</h4>
                  <img src={bridgeState.labActivity.circuitImg} alt="Circuit" style={{ width: '100%', borderRadius: 8, border: `1px solid ${C.border}`, background: '#ffffff' }} />
                </div>
              )}
              {bridgeState.labActivity.scopeImg && (
                <div style={{ flex: '1 1 300px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: C.ink }}>Oscilloscope Trace</h4>
                  <img src={bridgeState.labActivity.scopeImg} alt="Scope" style={{ width: '100%', borderRadius: 8, border: `1px solid ${C.border}`, background: '#050d1a' }} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>No lab activity captured yet. Build your circuit in the Simulation tab and click Capture.</div>
        )}
      </AccordionSection>

      <AccordionSection title="6. Calculations" icon={Calculator} color="#10b981" defaultOpen={false}>
        {bridgeState?.rows?.length > 0 && bridge ? (
          <>
            <div style={{ fontSize: 15, marginBottom: 16 }}>Using the formula: <span dangerouslySetInnerHTML={{ __html: bridge.formula }} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }} /></div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {bridgeState.rows.map((row, i) => (
                <div key={i} style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Trial {i + 1}:</div>
                  <div style={{ color: C.muted, lineHeight: 1.6 }}>
                    {bridge.tabCols.map(c => `${c.k} = ${row[c.k] || 0}`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>No calculations available. Perform trials in the Simulation tab first.</div>
        )}
      </AccordionSection>

      <AccordionSection title="7. Observation Table" icon={BarChart2} color="#ec4899" defaultOpen={false}>
        {bridgeState?.rows?.length > 0 && bridge ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, textAlign: 'center' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ border: `1px solid ${C.border}`, padding: '12px 16px', color: C.muted, fontWeight: 600 }}>Trial No.</th>
                {bridge.tabCols.map(c => (
                  <th key={c.k} style={{ border: `1px solid ${C.border}`, padding: '12px 16px', color: C.ink, fontWeight: 600 }}>{c.label || `${c.k} (${c.u || ''})`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bridgeState.rows.map((row, i) => (
                <tr key={row.id || i}>
                  <td style={{ border: `1px solid ${C.border}`, padding: '12px 16px', fontWeight: 600 }}>{i + 1}.</td>
                  {bridge.tabCols.map(c => (
                    <td key={c.k} style={{ border: `1px solid ${C.border}`, padding: '12px 16px' }}>
                      <input type="text" value={row[c.k] !== undefined ? row[c.k] : ''} onChange={e => updateRow(i, c.k, e.target.value)} style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', textAlign: 'center', outline: 'none' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>No readings recorded. Use the Record button in the Simulation tab to populate this table.</div>
        )}
      </AccordionSection>

      <AccordionSection title="8. Result" icon={Trophy} color="#14b8a6" defaultOpen={false}>
        {bridgeState?.rows?.length > 0 && bridge ? (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 16, borderRadius: 8, color: '#065f46', fontSize: 15 }}>
            The calculated values have been recorded. Averages can be derived from the table above.
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', padding: '16px 0' }}>Result is pending completion of the lab trials.</div>
        )}
      </AccordionSection>

      <AccordionSection title="9. Viva Questions" icon={HelpCircle} color="#ec4899" defaultOpen={false}>
        {!bridgeState?.vivaSubmitted ? (
          <VivaPrepTab hideTitle={true} exp={exp} bridgeState={bridgeState} setBridgeSims={setBridgeSims} />
        ) : (
          exp.viva && exp.viva[0]?.options ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontWeight: 600, color: C.ink, marginBottom: 8 }}>Score: {bridgeState.vivaCorrectCount} / {exp.viva.length}</div>
              {exp.viva.map((q, i) => {
                const selectedIdx = bridgeState?.vivaResponses?.[q.id];
                const isCorrect = selectedIdx === q.correctIndex;
                const hasAnswered = selectedIdx !== undefined;
                return (
                  <div key={q.id} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                    <div style={{ fontWeight: 600, color: C.ink, fontSize: 14, marginBottom: 8 }}>Q{i + 1}. {q.question}</div>
                    {hasAnswered ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: isCorrect ? '#059669' : '#dc2626' }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        <span>{q.options[selectedIdx]}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: C.muted, fontStyle: 'italic' }}>No answer recorded.</div>
                    )}
                    {hasAnswered && !isCorrect && <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Correct Answer: {q.options[q.correctIndex]}</div>}
                  </div>
                );
              })}
            </div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6, color: C.ink }}>
              {exp.viva ? exp.viva.map((v, i) => <li key={i} style={{ marginBottom: 8 }}>{v.question}</li>) : <li>Refer to the manual for viva questions.</li>}
            </ul>
          )
        )}
      </AccordionSection>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        {enrolledClass && (
          <button
            onClick={submitToTeacher}
            disabled={submitting || submitted}
            className="create-btn"
            style={{ opacity: submitted ? 0.6 : 1, cursor: submitted ? 'default' : 'pointer', padding: '12px 32px', fontSize: 16, borderRadius: 999 }}
          >
            {submitting ? <Loader2 className="spin" size={16} /> : <CheckCircle2 size={16} />}
            {submitted ? 'Report Submitted' : 'Submit Lab Report to Teacher'}
          </button>
        )}
      </div>
    </div>
  );
}
