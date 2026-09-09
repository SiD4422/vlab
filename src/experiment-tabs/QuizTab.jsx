import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { C } from '../App';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizTab({ questions, onComplete }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);

  const shuffledQuestions = useMemo(() => {
    if (!questions) return [];
    
    // First, shuffle the options and update the answer index for each question
    const processed = questions.map(q => {
      // Create objects to track the original correct option
      const optsWithTruth = q.options.map((opt, i) => ({
        text: opt,
        isCorrect: i === q.answer
      }));
      
      const shuffledOpts = shuffleArray(optsWithTruth);
      const newAnswerIndex = shuffledOpts.findIndex(o => o.isCorrect);
      
      return {
        q: q.q,
        options: shuffledOpts.map(o => o.text),
        answer: newAnswerIndex,
        difficulty: q.difficulty || Math.floor(Math.random() * 3) + 8 // fallback 8-10
      };
    });
    
    // Then, shuffle the order of the questions themselves
    const fullyShuffled = shuffleArray(processed);
    
    // Pick a subset of questions (e.g. 5) so students get different sets
    const subsetSize = Math.min(5, fullyShuffled.length);
    return fullyShuffled.slice(0, subsetSize);
  }, [questions]);

  if (!shuffledQuestions || shuffledQuestions.length === 0) {
    return (
      <div style={{ color: C.muted, fontSize: 14, padding: '24px 0' }}>
        Quiz for this experiment is being added — check back soon.
      </div>
    );
  }

  const score = shuffledQuestions.reduce(
    (s, q, i) => s + (picked[i] === q.answer ? 1 : 0),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {shuffledQuestions.map((q, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 10, padding: 16,
            background: C.card,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 10, color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{i + 1}. {q.q}</span>
            <span style={{ fontSize: 11, background: '#fef2f2', color: '#b91c1c', padding: '2px 8px', borderRadius: 999, fontWeight: 800, whiteSpace: 'nowrap', marginLeft: 12 }}>
              Level {q.difficulty}/10
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, oi) => {
              const isPicked = picked[i] === oi;
              const isCorrect = oi === q.answer;
              let border = C.border;
              let bg = 'transparent';
              if (checked && isCorrect) { border = C.teal; bg = '#e8f5f3'; }
              else if (checked && isPicked && !isCorrect) { border = '#c0392b'; bg = '#fbeae8'; }
              else if (isPicked) { border = C.copper; }
              return (
                <button
                  key={oi}
                  onClick={() => !checked && setPicked(p => ({ ...p, [i]: oi }))}
                  style={{
                    textAlign: 'left', padding: '9px 12px',
                    borderRadius: 8, border: `1.5px solid ${border}`,
                    background: bg, cursor: checked ? 'default' : 'pointer',
                    fontSize: 14, color: C.ink,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => { setChecked(true); if (onComplete) onComplete(); }}
          disabled={Object.keys(picked).length < shuffledQuestions.length}
          style={{
            background: C.copper, color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 20px',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            opacity: Object.keys(picked).length < shuffledQuestions.length ? 0.5 : 1,
          }}
        >
          Check answers
        </button>
        {checked && (
          <span style={{ fontSize: 14, color: C.muted }}>
            Score: <b style={{ color: C.ink }}>{score}/{shuffledQuestions.length}</b>
          </span>
        )}
        {checked && (
          <button
            onClick={() => { setPicked({}); setChecked(false); }}
            style={{
              background: 'none', border: 'none',
              color: C.teal, fontSize: 13,
              cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
