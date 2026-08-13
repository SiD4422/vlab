import { useState } from 'react';
import { Star } from 'lucide-react';
import { C } from '../App';

/**
 * FeedbackTab — Simple star-rating feedback form for experiments.
 */
export default function FeedbackTab() {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div style={{ color: 'var(--teal)', fontWeight: 600 }}>
        Thanks — your feedback helps improve this lab.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setRating(n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Star
              size={22}
              fill={n <= rating ? C.copper : 'none'}
              color={n <= rating ? C.copper : C.border}
            />
          </button>
        ))}
      </div>
      <textarea
        placeholder="Any comments about this experiment?"
        style={{
          width: '100%', minHeight: 90,
          border: `1px solid ${C.border}`, borderRadius: 8,
          padding: 12, fontSize: 14,
          fontFamily: 'inherit', resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <button
        onClick={() => setSent(true)}
        style={{
          marginTop: 12, background: C.copper, color: '#fff',
          border: 'none', borderRadius: 8,
          padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}
      >
        Submit feedback
      </button>
    </div>
  );
}
