import { useState, useEffect, useMemo } from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';

/**
 * AccordionSection — used inside LabReportTab. Exported for reuse.
 */
export function AccordionSection({ title, icon: Icon, color, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="report-accordion" style={{ border: '1px solid var(--border)', borderRadius: 12, marginBottom: 16, overflow: 'hidden', background: 'var(--card)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="no-print"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--muted)', flexShrink: 0 }}>
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="print-only" style={{ display: 'none', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</span>
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''} print-force-open`} style={{ display: isOpen ? 'block' : 'none', borderTop: isOpen ? '1px solid var(--border)' : 'none' }}>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

/**
 * VivaMCQ — Timed multiple-choice viva quiz with a shuffled question pool.
 */
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
        <button
          onClick={() => setStarted(true)}
          style={{ marginTop: 8, padding: '13px 40px', borderRadius: 999, border: 'none', background: 'var(--teal)', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 18px rgba(20,184,166,0.35)', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          🚀 Start Test
        </button>
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
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'relative', overflow: 'hidden' }}>
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
              <label
                key={si}
                onClick={() => !locked && handleSelect(si)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `1.5px solid ${isSelected ? '#10b981' : 'var(--border)'}`, borderRadius: 9, background: isSelected ? '#ecfdf5' : 'transparent', color: isSelected ? '#065f46' : locked ? 'var(--muted)' : 'var(--ink)', cursor: locked ? 'not-allowed' : 'pointer', opacity: locked && !isSelected ? 0.5 : 1, transition: 'all 0.18s' }}
              >
                <input type="radio" name={q.id} checked={isSelected} readOnly disabled={locked} style={{ margin: 0, accentColor: 'var(--teal)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14 }}>{opt}</span>
                {isSelected && <CheckCircle2 size={16} color="#10b981" />}
              </label>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.4 : 1, fontWeight: 600, fontSize: 13 }}>← Back</button>
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

/**
 * VivaPrepTab — Default export. Renders Q&A reveal cards (open-ended)
 * or delegates to VivaMCQ for multiple-choice questions.
 *
 * Props:
 *   exp         — experiment object with .viva array
 *   bridgeState — current lab state for this experiment
 *   setBridgeSims — state updater from StudentApp
 *   hideTitle   — if true, suppresses the section heading (used inside LabReportTab)
 */
export default function VivaPrepTab({ exp, bridgeState, setBridgeSims, hideTitle = false }) {
  const [revealed, setRevealed] = useState({});
  const questions = exp.viva;
  if (!questions || questions.length === 0) return null;
  const isMCQ = questions[0].options !== undefined;

  if (!isMCQ) {
    return (
      <div style={hideTitle ? {} : { marginTop: 40, borderTop: '1px dashed var(--border)', paddingTop: 32 }}>
        {!hideTitle && <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: 'var(--ink)' }}>Viva Prep (Self-Assessment)</h3>}
        {!hideTitle && <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Test your conceptual understanding before your lab viva.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 15, marginBottom: 8, display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--teal)' }}>Q{i + 1}.</span>
                <span>{q.question}</span>
              </div>
              {revealed[i] ? (
                <div style={{ padding: 12, background: 'var(--canvas)', borderRadius: 8, fontSize: 14, color: 'var(--muted)', marginTop: 12, borderLeft: '3px solid var(--teal)' }}>{q.answer}</div>
              ) : (
                <button
                  onClick={() => setRevealed(prev => ({ ...prev, [i]: true }))}
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '6px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Eye size={14} /> Reveal Answer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <VivaMCQ questions={questions} exp={exp} bridgeState={bridgeState} setBridgeSims={setBridgeSims} hideTitle={hideTitle} />;
}
