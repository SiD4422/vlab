/**
 * ExperimentSession.jsx
 *
 * Contains everything needed for the active experiment view:
 *   - Detail (main layout + tabs)
 *   - Section, Feedback, Quiz (tab content helpers)
 *   - AccordionSection, LabReportTab (lab report view)
 *   - VivaPrep, VivaMCQ (viva quiz)
 *
 * bridgeState (lab activity, viva responses, observation rows) lives in
 * StudentApp and is passed down as props. It is correctly scoped there —
 * it resets when the student navigates away, which is the right lifecycle.
 *
 * KNOWN TRADEOFF (unsaved work on Back):
 *   If a student presses the browser Back button mid-quiz or mid-lab,
 *   unsaved bridgeState will be lost without a confirmation prompt.
 *   A window.beforeunload warning is in place to catch browser-level
 *   close/refresh, but the in-app Back button bypass is a known gap,
 *   accepted as a tradeoff of local state scope.
 */
import { useState, useEffect, useMemo } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import {
  Zap, BookOpen, ClipboardCheck, ListOrdered, Sparkles, MessageSquare,
  Link2, Target, ArrowLeft, Loader2, CheckCircle2, XCircle,
  ChevronDown, Activity, GraduationCap, Eye, FileText, Bot,
  Calculator, Trophy, AlertTriangle, HelpCircle, Building, IdCard,
  Printer, Download, BarChart2, User, Star,
} from 'lucide-react';
import StrainGaugeSim from '../simulations/StrainGaugeSim';
import UnifiedBridgeSim, { BridgeProcedurePanel, BRIDGES, CircuitSVG } from '../simulations/UnifiedBridgeSim';
import AIChatbot from '../AIChatbot';
import { C } from '../App';
import { db, rtdb } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, set, update, onValue, onDisconnect } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { useRef } from 'react';

// ─── Tabs definition ────────────────────────────────────────────────────────
const TABS = [
  { id: "aim",        label: "Aim",        icon: Target },
  { id: "theory",     label: "Theory",     icon: BookOpen },
  { id: "simulation", label: "Simulation", icon: Activity,       badge: "BETA" },
  { id: "pretest",    label: "Pretest",    icon: ClipboardCheck },
  { id: "procedure",  label: "Procedure",  icon: ListOrdered },
  { id: "posttest",   label: "Posttest",   icon: ClipboardCheck },
  { id: "report",     label: "Lab Report", icon: FileText },
  { id: "references", label: "References", icon: Link2 },
  { id: "feedback",   label: "Feedback",   icon: MessageSquare },
];

// ─── Section ────────────────────────────────────────────────────────────────
function Section({ title, children, id }) {
  return (
    <div style={{ marginBottom: 40 }} id={id}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid var(--border)` }}>{title}</div>
      <div style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

// ─── Quiz (pre/post test) ────────────────────────────────────────────────────
function Quiz({ questions, onComplete }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);

  if (!questions || questions.length === 0) {
    return <div style={{ color: C.muted, fontSize: 14, padding: "24px 0" }}>Quiz for this experiment is being added — check back soon.</div>;
  }

  const score = questions.reduce((s, q, i) => s + (picked[i] === q.answer ? 1 : 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {questions.map((q, i) => (
        <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, background: C.card }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: C.ink }}>{i + 1}. {q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, oi) => {
              const isPicked = picked[i] === oi;
              const isCorrect = oi === q.answer;
              let border = C.border, bg = "transparent";
              if (checked && isCorrect) { border = C.teal; bg = "#e8f5f3"; }
              else if (checked && isPicked && !isCorrect) { border = "#c0392b"; bg = "#fbeae8"; }
              else if (isPicked) { border = C.copper; }
              return (
                <button key={oi} onClick={() => !checked && setPicked(p => ({ ...p, [i]: oi }))}
                  style={{ textAlign: "left", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${border}`, background: bg, cursor: checked ? "default" : "pointer", fontSize: 14, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}
                >
                  {checked && isCorrect && <CheckCircle2 size={15} color={C.teal} />}
                  {checked && isPicked && !isCorrect && <XCircle size={15} color="#c0392b" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => { setChecked(true); if (onComplete) onComplete(); }}
          disabled={Object.keys(picked).length < questions.length}
          style={{ background: C.copper, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer", opacity: Object.keys(picked).length < questions.length ? 0.5 : 1 }}
        >Check answers</button>
        {checked && <span style={{ fontSize: 14, color: C.muted }}>Score: <b style={{ color: C.ink }}>{score}/{questions.length}</b></span>}
        {checked && (
          <button onClick={() => { setPicked({}); setChecked(false); }} style={{ background: "none", border: "none", color: C.teal, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>Retry</button>
        )}
      </div>
    </div>
  );
}

// ─── Feedback ────────────────────────────────────────────────────────────────
function Feedback() {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  if (sent) return <div style={{ color: C.teal, fontWeight: 600 }}>Thanks — your feedback helps improve this lab.</div>;
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Star size={22} fill={n <= rating ? C.copper : "none"} color={n <= rating ? C.copper : C.border} />
          </button>
        ))}
      </div>
      <textarea placeholder="Any comments about this experiment?"
        style={{ width: "100%", minHeight: 90, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
      />
      <button onClick={() => setSent(true)}
        style={{ marginTop: 12, background: C.copper, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
      >Submit feedback</button>
    </div>
  );
}

// ─── AccordionSection (Lab Report) ───────────────────────────────────────────
function AccordionSection({ title, icon: Icon, color, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="report-accordion" style={{ border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, overflow: 'hidden', background: C.card }}>
      <button onClick={() => setIsOpen(!isOpen)} className="no-print"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{title}</span>
        </div>
        <ChevronDown size={20} color={C.muted} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      <div className="print-only" style={{ display: 'none', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{title}</span>
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''} print-force-open`} style={{ display: isOpen ? 'block' : 'none', borderTop: isOpen ? `1px solid ${C.border}` : 'none' }}>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── VivaPrep ────────────────────────────────────────────────────────────────
function VivaPrep({ exp, bridgeState, setBridgeSims, hideTitle = false }) {
  const [revealed, setRevealed] = useState({});
  const questions = exp.viva;
  if (!questions || questions.length === 0) return null;
  const isMCQ = questions[0].options !== undefined;

  if (!isMCQ) {
    return (
      <div style={hideTitle ? {} : { marginTop: 40, borderTop: `1px dashed var(--border)`, paddingTop: 32 }}>
        {!hideTitle && <h3 style={{ margin: "0 0 8px 0", fontSize: 20, color: "var(--ink)" }}>Viva Prep (Self-Assessment)</h3>}
        {!hideTitle && <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Test your conceptual understanding before your lab viva.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ background: "var(--card)", border: `1px solid var(--border)`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 15, marginBottom: 8, display: "flex", gap: 12 }}>
                <span style={{ color: "var(--teal)" }}>Q{i + 1}.</span>
                <span>{q.question}</span>
              </div>
              {revealed[i] ? (
                <div style={{ padding: 12, background: "var(--canvas)", borderRadius: 8, fontSize: 14, color: "var(--muted)", marginTop: 12, borderLeft: `3px solid var(--teal)` }}>{q.answer}</div>
              ) : (
                <button onClick={() => setRevealed(prev => ({ ...prev, [i]: true }))}
                  style={{ background: "transparent", border: `1px solid var(--border)`, color: "var(--muted)", padding: "6px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                ><Eye size={14} /> Reveal Answer</button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <VivaMCQ questions={questions} exp={exp} bridgeState={bridgeState} setBridgeSims={setBridgeSims} hideTitle={hideTitle} />;
}

// ─── VivaMCQ ─────────────────────────────────────────────────────────────────
function VivaMCQ({ questions, exp, bridgeState, setBridgeSims, hideTitle }) {
  const TIMER_SECONDS = 30;
  const QUESTIONS_PER_SESSION = 5;

  const [pool, setPool] = useState(null);
  useEffect(() => {
    import('../data/vivaPool.js').then(m => {
      const p = m.default?.[exp.id];
      setPool(p && p.length >= QUESTIONS_PER_SESSION ? p : null);
    }).catch(() => setPool(null));
  }, [exp.id]);

  const sessionQuestions = useMemo(() => {
    const src = pool || questions;
    if (src.length <= QUESTIONS_PER_SESSION) return src;
    const seed = Math.floor(Date.now() / 60000);
    const arr = [...src];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = ((seed * 9301 + 49297) % 233280 + i * 1299709) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, QUESTIONS_PER_SESSION);
  }, [pool, questions]);

  const shuffled = useMemo(() => sessionQuestions.map(q => {
    const indices = q.options.map((_, i) => i);
    const seed2 = (q.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = (seed2 * 7 + i * 13) % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return { ...q, shuffledOptions: indices.map(idx => q.options[idx]), shuffledToOriginal: indices };
  }), [sessionQuestions]);

  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [done, setDone] = useState(false);

  const responses = bridgeState?.vivaResponses || {};
  const submitted = bridgeState?.vivaSubmitted || false;
  const answeredCount = Object.keys(responses).length;
  const q = shuffled[current] || shuffled[0];

  useEffect(() => {
    if (!started || submitted || done) return;
    setTimeLeft(TIMER_SECONDS);
    setTimedOut(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimedOut(true);
          if (responses[q.id] === undefined) {
            setBridgeSims && setBridgeSims(prev2 => {
              const cur = prev2[exp.id] || {};
              return { ...prev2, [exp.id]: { ...cur, vivaResponses: { ...(cur.vivaResponses || {}), [q.id]: -1 } } };
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [current, started, submitted, done]);

  useEffect(() => {
    if (!timedOut || submitted) return;
    const t = setTimeout(() => {
      if (current < shuffled.length - 1) setCurrent(c => c + 1);
      else setDone(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [timedOut]);

  const handleSelect = (shuffledIdx) => {
    if (submitted || responses[q.id] !== undefined || timedOut) return;
    const originalIdx = q.shuffledToOriginal[shuffledIdx];
    setBridgeSims && setBridgeSims(prev => {
      const cur = prev[exp.id] || {};
      return { ...prev, [exp.id]: { ...cur, vivaResponses: { ...(cur.vivaResponses || {}), [q.id]: originalIdx } } };
    });
    setTimeout(() => {
      if (current < shuffled.length - 1) setCurrent(c => c + 1);
      else setDone(true);
    }, 700);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    shuffled.forEach(q => { if (responses[q.id] === q.correctIndex) correctCount++; });
    const finalScore = Math.round((correctCount / shuffled.length) * 3);
    setBridgeSims && setBridgeSims(prev => {
      const cur = prev[exp.id] || {};
      return { ...prev, [exp.id]: { ...cur, vivaSubmitted: true, vivaScore: finalScore, vivaCorrectCount: correctCount } };
    });
  };

  if (submitted) return null;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 7 ? '#f59e0b' : '#ef4444';

  if (!started) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🎯</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>Viva Quiz</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 420, lineHeight: 1.7 }}>
          You will be shown <strong>{QUESTIONS_PER_SESSION} questions</strong> randomly selected from a large pool.<br />
          Each question has a <strong style={{ color: '#ef4444' }}>⏱ {TIMER_SECONDS}-second timer</strong>. Unanswered questions are marked wrong.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 320, background: 'var(--canvas)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--border)', textAlign: 'left' }}>
          {['📚 Questions sampled fresh each session', '⏱ 30 seconds per question', '🔀 Answer options are shuffled', '⚡ Auto-advances on timeout'].map((t, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--muted)' }}>{t}</div>
          ))}
        </div>
        <button onClick={() => setStarted(true)}
          style={{ marginTop: 8, padding: '13px 40px', borderRadius: 999, border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 18px rgba(20,184,166,0.35)', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >🚀 Start Test</button>
      </div>
    );
  }

  if (done) {
    const correct = shuffled.filter(q => responses[q.id] === q.correctIndex).length;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>{correct >= 4 ? '🏆' : correct >= 2 ? '👍' : '📖'}</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>Quiz Complete!</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--teal)' }}>{correct} / {shuffled.length}</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>
          {correct === shuffled.length ? 'Perfect score! Excellent preparation.' : correct >= 3 ? 'Good understanding. Review the missed concepts.' : 'Review the theory and try again during your next session.'}
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {shuffled.map((sq, i) => {
            const ans = responses[sq.id];
            const isCorrect = ans === sq.correctIndex;
            const timedout = ans === -1;
            return (
              <div key={i} style={{ background: isCorrect ? '#ecfdf5' : '#fef2f2', border: `1px solid ${isCorrect ? '#a7f3d0' : '#fca5a5'}`, borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 6 }}>Q{i + 1}. {sq.question}</div>
                <div style={{ fontSize: 12, color: isCorrect ? '#065f46' : '#991b1b' }}>
                  {timedout ? '⏱ Timed out' : isCorrect ? `✓ ${sq.shuffledOptions[sq.shuffledToOriginal.indexOf(ans)]}` : `✗ Your answer: ${ans >= 0 ? sq.shuffledOptions[sq.shuffledToOriginal.indexOf(ans)] : '-'}`}
                </div>
                {!isCorrect && <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>✓ Correct: {sq.options[sq.correctIndex]}</div>}
              </div>
            );
          })}
        </div>
        <button onClick={handleSubmit} style={{ padding: '12px 36px', borderRadius: 999, border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
          ✓ Save Score &amp; Close
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${(answeredCount / shuffled.length) * 100}%`, height: '100%', background: 'var(--teal)', borderRadius: 99, transition: 'width 0.4s' }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{answeredCount} / {shuffled.length} answered</span>
      </div>
      <div style={{ background: 'var(--card)', border: `1px solid var(--border)`, borderRadius: 14, padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: `${timerPct}%`, height: '100%', background: timerColor, transition: 'width 1s linear, background 0.3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Question {current + 1} of {shuffled.length}</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: timerColor, fontFamily: 'monospace' }}>⏱ {timeLeft}s {timedOut && <span style={{ color: '#ef4444', fontSize: 11 }}> — Time Up!</span>}</span>
        </div>
        <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15, lineHeight: 1.65, marginBottom: 22 }}>{q.question}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.shuffledOptions.map((opt, si) => {
            const originalIdx = q.shuffledToOriginal[si];
            const isSelected = responses[q.id] === originalIdx;
            const alreadyAnswered = responses[q.id] !== undefined;
            const locked = alreadyAnswered || timedOut;
            return (
              <label key={si} onClick={() => !locked && handleSelect(si)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `1.5px solid ${isSelected ? '#10b981' : 'var(--border)'}`, borderRadius: 9, background: isSelected ? '#ecfdf5' : 'transparent', color: isSelected ? '#065f46' : locked ? 'var(--muted)' : 'var(--ink)', cursor: locked ? 'not-allowed' : 'pointer', opacity: locked && !isSelected ? 0.5 : 1, transition: 'all 0.18s' }}>
                <input type="radio" name={q.id} checked={isSelected} readOnly disabled={locked} style={{ margin: 0, accentColor: 'var(--teal)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14 }}>{opt}</span>
                {isSelected && <CheckCircle2 size={16} color="#10b981" />}
              </label>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.4 : 1, fontWeight: 600, fontSize: 13 }}
          >← Back</button>
          {current < shuffled.length - 1
            ? <button onClick={() => setCurrent(c => c + 1)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--teal)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Next →</button>
            : <button onClick={() => setDone(true)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Finish →</button>
          }
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, justifyContent: 'center' }}>
        {shuffled.map((sq, i) => {
          const ans = responses[sq.id];
          const isDone = ans !== undefined;
          return (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${i === current ? 'var(--teal)' : isDone ? '#10b981' : 'var(--border)'}`, background: isDone ? '#ecfdf5' : i === current ? 'var(--canvas)' : 'transparent', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: i === current ? 'var(--teal)' : isDone ? '#065f46' : 'var(--muted)' }}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── LabReportTab ─────────────────────────────────────────────────────────────
function LabReportTab({ exp, bridgeState, setBridgeSims }) {
  const { user, enrolledClass } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiConclusion, setAiConclusion] = useState('');
  const [generatingConclusion, setGeneratingConclusion] = useState(false);

  if (!exp) return null;
  const bridge = BRIDGES ? BRIDGES.find(b => b.id === exp.id) : null;

  const updateRow = (idx, key, val) => {
    if (!setBridgeSims) return;
    setBridgeSims(prev => {
      const current = prev[exp.id] || { rows: [], snapshots: [] };
      const newRows = [...current.rows];
      newRows[idx] = { ...newRows[idx], [key]: val };
      return { ...prev, [exp.id]: { ...current, rows: newRows } };
    });
  };

  const submitToTeacher = async () => {
    if (!enrolledClass) {
      alert("You must join a class first from the Home dashboard to submit your report.");
      return;
    }
    if (exp.viva && !bridgeState?.vivaSubmitted) {
      if (!window.confirm("You have not submitted the Viva Quiz yet. Submit anyway? (Viva score will be 0).")) return;
    }
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
      const submissionRef = doc(db, 'submissions', submissionId);
      const existingDoc = await getDoc(submissionRef);
      if (existingDoc.exists()) {
        const data = existingDoc.data();
        if (data.teacherScore !== null && data.teacherScore !== undefined) {
          alert("This lab report has already been graded by your teacher. You cannot overwrite it.");
          setSubmitting(false);
          return;
        }
        if (!window.confirm("You have already submitted this lab report. Overwrite?")) {
          setSubmitting(false);
          return;
        }
      }
      await setDoc(submissionRef, payload);
      setSubmitted(true);
      alert("Lab report successfully submitted to " + enrolledClass.className + "!");
    } catch (e) {
      console.error("Submission error:", e);
      alert("Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateAIConclusion = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) { alert("Please configure your Gemini API Key in the Strict Examiner AI Chatbot (bottom right) first."); return; }
    if (!bridgeState?.rows || bridgeState.rows.length === 0) { alert("Please add some readings to your observation table first!"); return; }
    setGeneratingConclusion(true);
    try {
      const readings = JSON.stringify(bridgeState.rows);
      const prompt = `You are a helpful lab assistant. The student just finished the experiment "${exp.title}". Here are their observation table readings: ${readings}. Write a professional, concise 1-2 paragraph conclusion that summarizes these specific findings and the underlying principle. Return ONLY the conclusion text.`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 300 } }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);
      setAiConclusion(data.candidates[0].content.parts[0].text);
    } catch (e) {
      console.error(e);
      alert("Failed to generate conclusion: " + e.message);
    } finally {
      setGeneratingConclusion(false);
    }
  };

  return (
    <div className="print-report-container" style={{ padding: "40px", fontFamily: "var(--sans)", color: C.ink, background: C.card, borderRadius: 12, minHeight: "100vh", position: "relative" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#dcfce7', color: '#166534', padding: '12px 20px', borderRadius: 12, minWidth: 120 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>DC-02</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Required Module</div>
        </div>
        <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
          <h1 style={{ margin: "0 0 4px 0", fontSize: 28, fontWeight: 800, color: C.ink }}>{exp.title}</h1>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#059669' }}>LABORATORY RECORD</h2>
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: 'center' }}>
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
                      <input type="text" value={row[c.k] !== undefined ? row[c.k] : ""} onChange={e => updateRow(i, c.k, e.target.value)}
                        style={{ width: "100%", background: "transparent", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit", textAlign: "center", outline: "none" }}
                      />
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
          <VivaPrep hideTitle={true} exp={exp} bridgeState={bridgeState} setBridgeSims={setBridgeSims} />
        ) : (
          exp.viva && exp.viva[0]?.options ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
          <button onClick={submitToTeacher} disabled={submitting || submitted} className="create-btn"
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

// ─── RTDB Delta Diffing ──────────────────────────────────────────────────────
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
      if (oldVal !== newVal) {
        updates[p] = newVal;
      }
    }
  }
  return updates;
}

// ─── CircuitSandbox ───────────────────────────────────────────────────────────
function CircuitSandbox({ expId, bridgeState, setBridgeSims, isBroadcaster, isSpectator, classId, teacherId }) {
  const iframeRef = useRef(null);
  const lastState = useRef({});
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [spectatorState, setSpectatorState] = useState(null);

  useEffect(() => {
    if (isBroadcaster && classId && teacherId) {
      const sessionRef = ref(rtdb, `liveSessions/${classId}`);
      set(sessionRef, { active: true, expId, teacherId, state: { components: [], wires: [], readings: {} } })
        .catch(e => console.error("[ExperimentSession] Error setting live session:", e));
      
      onDisconnect(sessionRef).update({ active: false, teacherId })
        .catch(e => console.error("[ExperimentSession] Error registering onDisconnect:", e));

      return () => {
        update(sessionRef, { active: false }).catch(e => console.error(e));
        onDisconnect(sessionRef).cancel();
      };
    }
  }, [isBroadcaster, classId, expId, teacherId]);

  useEffect(() => {
    if (isSpectator && classId) {
      const sessionRef = ref(rtdb, `liveSessions/${classId}`);
      const unsub = onValue(sessionRef, snap => {
         const data = snap.val();
         if (!data || !data.active) {
            alert("The teacher has ended the broadcast.");
            window.location.href = '/student';
            return;
         }
         setSpectatorState(data.state);
      });
      return () => unsub();
    }
  }, [isSpectator, classId]);

  useEffect(() => {
    if (iframeLoaded && spectatorState && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'SYNC_STATE', state: spectatorState }, '*');
    }
  }, [iframeLoaded, spectatorState]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.origin || e.origin !== window.location.origin) return;
      const data = e.data;
      if (!data) return;
      if (data.type === 'BROADCAST_STATE' && isBroadcaster && classId) {
         const updates = getRTDBUpdates(lastState.current, data.state, `liveSessions/${classId}/state`);
         if(Object.keys(updates).length > 0) {
            update(ref(rtdb), updates);
            lastState.current = JSON.parse(JSON.stringify(data.state));
         }
      }
      if (data.type === 'SNAPSHOT_RESULT') {
        setBridgeSims(prev => ({
          ...prev,
          [expId]: {
            ...prev[expId],
            labActivity: { ...prev[expId]?.labActivity, circuitImg: data.svgDataUrl, scopeImg: data.graphDataUrl, analysisData: data.analysisData },
          },
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [expId, setBridgeSims]);

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
        <iframe ref={iframeRef} onLoad={() => setIframeLoaded(true)} src="/circuit-sandbox.html" style={{ width: '100%', height: '560px', border: 'none', display: 'block' }} title="Circuit Sandbox" allow="fullscreen" />
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
        <b style={{ color: C.ink }}>How to use:</b> Click a component from the left panel → click on the grid to place it → drag from a terminal dot to another to wire them → watch the live readings update. Press <b>R</b> to rotate, <b>Delete</b> to remove.
      </div>
    </div>
  );
}

// ─── Detail (main experiment layout) ─────────────────────────────────────────
function Detail({ exp, tab, setTab, onBack, sidebarOpen, markCompleted, bridgeSims, setBridgeSims, isBroadcaster, isSpectator, classId }) {
  const { user, enrolledClass } = useAuth();

  // beforeunload guard — warn on browser close/refresh if bridgeState has data
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

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === 'SNAPSHOT_RESULT') {
        setBridgeSims(prev => {
          const current = prev[exp.id] || { rows: [], snapshots: [] };
          return { ...prev, [exp.id]: { ...current, snapshots: [...(current.snapshots || []), { id: Date.now(), svg: e.data.svgDataUrl, graph: e.data.graphDataUrl }] } };
        });
        alert('Circuit captured and added to your Lab Report!');
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
  }, [exp.id, setBridgeSims]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: '#tour-tabs', popover: { title: 'Navigation', description: 'Use these tabs to switch between Theory, Simulation, and Procedure.', side: "right", align: 'start' } },
        { element: '#tour-reference', popover: { title: 'Reference Diagram', description: 'This is the exact circuit schematic you need to build for this experiment.', side: "bottom", align: 'start' } },
        { element: '#tour-sandbox', popover: { title: 'Circuit Sandbox', description: 'This is your workspace. Drag components from the palette, wire them, and manually balance the bridge.', side: "top", align: 'start' } },
        { element: '#tour-procedure-tab', popover: { title: 'Record Readings', description: 'Once balanced, click the Procedure tab to manually record your readings into the observation table.', side: "right", align: 'start' } },
      ],
    });
    driverObj.drive();
  };

  const bridgeIds = ["wheatstone-bridge","kelvin-bridge","kelvin-double-bridge","capacitance-comparison-bridge","maxwell-inductance-bridge","maxwell-lc-bridge","hays-bridge","anderson-bridge","schering-bridge","wiens-bridge","transformer-ratio-bridge"];

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <div className="no-print" style={{ background: "var(--card)", borderBottom: `1px solid ${C.border}`, padding: "20px 60px", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: C.muted }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: 0 }}>
          <ArrowLeft size={16} /> Course Overview
        </button>
        <span>/</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>Module: {exp.title}</span>
      </div>

      <div style={{ display: "flex", gap: 40, padding: "40px 60px 80px", alignItems: "flex-start", maxWidth: 1400, margin: "0 auto" }}>
        {/* Sidebar tabs */}
        <div className="app-sidebar" style={{ width: sidebarOpen ? 240 : 0, overflow: "hidden", flexShrink: 0, transition: "width 0.15s", position: "sticky", top: 116 }} id="tour-tabs">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, paddingLeft: 16, marginBottom: 12 }}>Module Contents</div>
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button key={t.id} id={t.id === "procedure" ? "tour-procedure-tab" : undefined} onClick={() => setTab(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, background: isActive ? "var(--teal-soft)" : "transparent", color: isActive ? "var(--teal)" : "var(--ink-soft)", border: "none", cursor: "pointer", fontSize: 15, fontWeight: isActive ? 700 : 500, textAlign: "left", transition: "all 0.2s ease" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={18} style={{ color: isActive ? "var(--teal)" : "var(--ink-soft)" }} />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {t.badge && !isActive && <span style={{ fontSize: 10, background: "var(--copper-soft)", color: "var(--copper)", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>{t.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="premium-panel" style={{ flex: 1, minWidth: 0, padding: "56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span className="status-badge pending" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", padding: "4px 10px", borderRadius: 6 }}>{exp.tag}</span>
            <span className="text-muted" style={{ fontSize: 13, fontWeight: 600 }}>Required Module</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", margin: "0 0 32px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: -0.5 }}>{exp.title}</h2>
            {tab === "simulation" && exp.id !== "strain-gauge" && (
              <button onClick={startTour} className="manage-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 14 }}>
                <Sparkles size={16} /> Guide Me
              </button>
            )}
          </div>
          
          {isBroadcaster && (
            <div style={{ marginBottom: 24, padding: '12px 20px', background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#3730a3', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                You are broadcasting this experiment live to your students!
              </div>
              <button 
                onClick={() => {
                  try {
                    const sessionRef = ref(rtdb, `liveSessions/${classId}`);
                    update(sessionRef, { active: false }).catch(e => console.error("Error ending broadcast:", e));
                  } catch (e) {
                    console.error("Error ending broadcast setup:", e);
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
          {isSpectator && (
            <div style={{ marginBottom: 24, padding: '12px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, color: '#b91c1c', fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Live Spectating: The teacher is controlling this simulation. Your controls are locked.
            </div>
          )}

          {tab === "aim" && (
            <div>
              <Section title="Aim">{exp.aim}</Section>
              <Section title="Objectives">
                <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.8 }}>
                  {exp.objectives.map((o, i) => <li key={i}>{o}</li>)}
                </ol>
              </Section>
            </div>
          )}
          {tab === "theory" && (
            <Section title="Theory">
              <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.theory.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </Section>
          )}
          {tab === "simulation" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {exp.id === "strain-gauge" ? (
                <Section title="Interactive Simulation"><StrainGaugeSim /></Section>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div>
                    <Section title="Reference Diagram" id="tour-reference">
                      {bridgeIds.includes(exp.id) ? (
                        <UnifiedBridgeSim bridgeId={exp.id} />
                      ) : (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted, background: "var(--card)", borderRadius: 8, border: `1px solid ${C.border}` }}>
                          <Activity size={32} color={C.border} style={{ marginBottom: 12 }} />
                          <div>The reference diagram for {exp.title} is currently under development.</div>
                        </div>
                      )}
                    </Section>
                  </div>
                  <div>
                    <Section title="Circuit Sandbox Workspace" id="tour-sandbox">
                      <CircuitSandbox 
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
                </div>
              )}
            </div>
          )}
          {tab === "pretest" && <Section title="Pretest"><Quiz questions={exp.pretest} /></Section>}
          {tab === "posttest" && (
            <Section title="Posttest">
              <Quiz questions={exp.posttest} onComplete={markCompleted} />
              <VivaPrep exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />
            </Section>
          )}
          {tab === "report" && <LabReportTab exp={exp} bridgeState={bridgeSims[exp.id]} setBridgeSims={setBridgeSims} />}
          {tab === "procedure" && (
            <Section title="Procedure">
              <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.procedure.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              {bridgeIds.includes(exp.id) && (
                <BridgeProcedurePanel
                  bridgeId={exp.id}
                  bridgeState={bridgeSims[exp.id]}
                  onStateChange={newSt => setBridgeSims(prev => ({ ...prev, [exp.id]: newSt }))}
                />
              )}
            </Section>
          )}
          {tab === "references" && (
            <Section title="References">
              <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9 }}>
                {exp.references.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>
          )}
          {tab === "feedback" && <Section title="Feedback"><Feedback /></Section>}
        </div>
      </div>

      {/* AI Chatbot widget */}
      <AIChatbot currentExperiment={exp.title} />
    </div>
  );
}

// ─── ExperimentSession (the exported page component) ─────────────────────────
export default function ExperimentSession({ exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen, markCompleted, bridgeSims, setBridgeSims, isBroadcaster, isSpectator, classId }) {
  return (
    <div style={{ paddingTop: 76 }}>
      <Detail
        exp={exp}
        tab={tab}
        setTab={setTab}
        onBack={onBack}
        sidebarOpen={sidebarOpen}
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
