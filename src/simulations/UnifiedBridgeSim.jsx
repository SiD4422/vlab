import { useState } from 'react';

/* ─────────────────────────── HELPERS ─────────────────────────── */

function fmt(v, decimals = 3) {
  if (v === undefined || v === null || isNaN(v)) return '--';
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(2);
  return v.toFixed(decimals);
}

function rnd(min, max, decimals = 3) {
  const v = min + Math.random() * (max - min);
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
}

function fixedLookup(bridge) {
  const o = {};
  if (bridge.id === 'kelvin-double-bridge') o.r = 0.02;
  if (bridge.id === 'maxwell-inductance-bridge') o.r2 = 15;
  if (bridge.id === 'transformer-ratio-bridge') o.Cs = 1;
  return o;
}

export function initBridgeState(bridge) {
  const ctrl = {};
  bridge.controls.forEach(cc => { ctrl[cc.label] = cc.def; });
  const hidden = {};
  bridge.hidden.forEach(h => { hidden[h.key] = rnd(h.range[0], h.range[1], h.decimals); });
  return { ctrl, hidden, rows: [], revealed: false };
}

function computeDeviations(bridge, st) {
  const fx = fixedLookup(bridge);
  const computed = bridge.compute(st.ctrl, fx);
  const devs = bridge.hidden.map(h => {
    const truth = st.hidden[h.key];
    const val = computed[h.key];
    return (val - truth) / truth;
  });
  return { devs, computed };
}

/* ─────────────────────────── SVG CIRCUIT ─────────────────────── */

function ArmIcon({ type, label, midX, midY, angleDeg, labelDX, labelDY }) {
  const transform = `translate(${midX},${midY}) rotate(${angleDeg})`;
  let inner = null;
  if (type === 'R') {
    inner = <path stroke="var(--teal)" strokeWidth="2" fill="none"
      d="M-22,0 L-14,0 L-10,-8 L-2,8 L6,-8 L14,8 L18,0 L22,0" />;
  } else if (type === 'L') {
    inner = <path stroke="var(--teal)" strokeWidth="2" fill="none"
      d="M-22,0 Q-16,-14 -8,0 Q0,-14 8,0 Q16,-14 22,0" />;
  } else if (type === 'C') {
    inner = <path stroke="var(--teal)" strokeWidth="2" fill="none"
      d="M-4,-12 L-4,12 M4,-12 L4,12 M-22,0 L-4,0 M4,0 L22,0" />;
  } else {
    inner = <>
      <rect fill="var(--card)" stroke="var(--copper)" strokeWidth="1.5" strokeDasharray="4 3"
        x="-26" y="-12" width="52" height="24" rx="6" />
      <text fill="var(--copper)" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700"
        x="0" y="4" textAnchor="middle">{label}</text>
    </>;
  }
  return (
    <>
      <g transform={transform}>{inner}</g>
      {type !== 'unknown' && (
        <text fill="var(--ink)" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="600"
          x={midX + labelDX} y={midY + labelDY} textAnchor="middle">{label}</text>
      )}
    </>
  );
}

function CircuitSVG({ cfg }) {
  const a = [70, 150], b = [240, 40], c = [410, 150], d = [240, 260];
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const mAB = mid(a, b), mBC = mid(b, c), mAD = mid(a, d), mDC = mid(d, c);
  return (
    <svg viewBox="0 0 480 380" style={{ width: '100%', maxWidth: 400, height: 'auto' }}>
      <path stroke="var(--border)" strokeWidth="2.5" fill="none"
        d={`M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]} L${d[0]},${d[1]} Z`} />
      <path stroke="var(--border)" strokeWidth="2.5" fill="none"
        d={`M${b[0]},${b[1]} L${d[0]},${d[1]}`} />
      <path stroke="var(--border)" strokeWidth="2.5" fill="none"
        d={`M${a[0]},${a[1]} L${a[0]},330 L${c[0]},330 L${c[0]},${c[1]}`} />
      {[a, b, c, d].map(([x, y], i) => <circle key={i} fill="var(--muted)" cx={x} cy={y} r={4} />)}
      <text fill="var(--muted)" fontFamily="ui-monospace,monospace" fontSize="13" x={a[0] - 16} y={a[1] + 4}>a</text>
      <text fill="var(--muted)" fontFamily="ui-monospace,monospace" fontSize="13" x={b[0] - 4} y={b[1] - 10}>b</text>
      <text fill="var(--muted)" fontFamily="ui-monospace,monospace" fontSize="13" x={c[0] + 10} y={c[1] + 4}>c</text>
      <text fill="var(--muted)" fontFamily="ui-monospace,monospace" fontSize="13" x={d[0] - 4} y={d[1] + 20}>d</text>
      <ArmIcon {...cfg.ab} midX={mAB[0]} midY={mAB[1]} angleDeg={-33} labelDX={-14} labelDY={-8} />
      <ArmIcon {...cfg.bc} midX={mBC[0]} midY={mBC[1]} angleDeg={33} labelDX={14} labelDY={-8} />
      <ArmIcon {...cfg.ad} midX={mAD[0]} midY={mAD[1]} angleDeg={33} labelDX={-16} labelDY={10} />
      <ArmIcon {...cfg.dc} midX={mDC[0]} midY={mDC[1]} angleDeg={-33} labelDX={16} labelDY={10} />
      {/* detector */}
      <circle fill="var(--canvas)" stroke="var(--teal)" strokeWidth="2" cx="240" cy="150" r="22" />
      <text fill="var(--teal)" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="700"
        x="240" y="154" textAnchor="middle">{cfg.detector === 'gal' ? 'G' : '♪'}</text>
      {/* source */}
      <circle fill="var(--canvas)" stroke="var(--muted)" strokeWidth="2" cx="240" cy="330" r="18" />
      <text fill="var(--muted)" fontFamily="ui-monospace,monospace" fontSize="11"
        x="240" y="334" textAnchor="middle">{cfg.source === 'dc' ? 'DC' : '~'}</text>
    </svg>
  );
}

/* ─────────────────────── GAUGE ─────────────────────────────── */

function Gauge({ rms, signed, detector }) {
  const clamped = Math.max(-1, Math.min(1, signed * 3));
  const angle = clamped * 80;
  const arcLen = Math.min(1, rms * 2.2) * 302;
  let arcColor = 'var(--teal)';
  let statusBg = 'rgba(31,122,114,0.12)';
  let statusColor = 'var(--teal)';
  let statusText = '● NULL — BRIDGE BALANCED';
  if (rms > 0.02 && rms <= 0.15) {
    arcColor = 'var(--copper)'; statusBg = 'rgba(193,113,47,0.12)'; statusColor = 'var(--copper)';
    statusText = '◐ CLOSE — KEEP ADJUSTING';
  } else if (rms > 0.15) {
    arcColor = '#e05252'; statusBg = 'rgba(224,82,82,0.12)'; statusColor = '#e05252';
    statusText = '○ OFF BALANCE';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="220" height="130" viewBox="0 0 220 130">
        <path fill="none" stroke="var(--border)" strokeWidth="14"
          d="M14,116 A96,96 0 0 1 206,116" />
        <path fill="none" stroke={arcColor} strokeWidth="14" strokeLinecap="round"
          style={{ transition: 'stroke 0.2s' }}
          strokeDasharray={`${arcLen} 302`}
          d="M14,116 A96,96 0 0 1 206,116" />
        <g transform={`rotate(${angle} 110 116)`} style={{ transition: 'transform 0.15s ease-out' }}>
          <line stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" x1="110" y1="116" x2="110" y2="34" />
          <circle fill="var(--ink)" cx="110" cy="116" r="6" />
        </g>
      </svg>
      <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        {detector === 'gal' ? 'Galvanometer' : 'Headphone'} signal: {fmt(Math.min(999, rms * 100), 1)}% of full-scale
      </div>
      <div style={{
        fontFamily: 'ui-monospace,monospace', fontWeight: 700, fontSize: 13,
        padding: '5px 14px', borderRadius: 20,
        background: statusBg, color: statusColor, border: `1px solid ${arcColor}`,
      }}>
        {statusText}
      </div>
    </div>
  );
}

/* ─────────────────── BRIDGE DATA (all 11) ──────────────────── */

const R = (min, max, step, def, label, unit) => ({ label, min, max, step, def, unit });

export const BRIDGES = [
  {
    id: 'wheatstone-bridge', group: 'DC BRIDGES', detector: 'gal', source: 'dc',
    svg: { ab: { type: 'R', label: 'P' }, bc: { type: 'R', label: 'Q' }, ad: { type: 'R', label: 'R' }, dc: { type: 'unknown', label: 'Rx' } },
    formula: 'At balance: P·R<sub>x</sub> = Q·R &nbsp;→&nbsp; <b>R<sub>x</sub> = (Q × R) / P</b>',
    apparatus: ['Wheatstone bridge trainer kit', 'Galvanometer (null detector)', 'DC regulated power supply / battery', 'Resistance boxes P, Q, R', 'Unknown resistor (sealed box)', 'Connecting patch cords', 'Battery key & galvanometer key'],
    controls: [R(100, 1000, 10, 300, 'P', 'Ω'), R(100, 1000, 10, 300, 'Q', 'Ω'), R(0, 1000, 1, 200, 'R', 'Ω')],
    fixed: [], hidden: [{ key: 'Rx', label: 'Unknown Resistance Rₓ', unit: 'Ω', range: [50, 900], decimals: 1 }],
    compute: (c) => ({ Rx: (c.Q * c.R) / c.P }),
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'R', u: 'Ω' }, { k: 'Rx', u: 'Ω', label: 'Rₓ (measured)' }],
  },
  {
    id: 'kelvin-bridge', group: 'DC BRIDGES', detector: 'gal', source: 'dc',
    svg: { ab: { type: 'R', label: 'P' }, bc: { type: 'R', label: 'Q' }, ad: { type: 'R', label: 'S' }, dc: { type: 'unknown', label: 'Rx' } },
    formula: 'At balance: P·R<sub>x</sub> = Q·S &nbsp;→&nbsp; <b>R<sub>x</sub> = (Q × S) / P</b>',
    apparatus: ['Kelvin bridge trainer kit', 'Galvanometer (sensitive, centre-zero)', 'Low-voltage, high-current DC supply', 'Ratio arm resistance boxes P, Q', 'Standard low-resistance decade box S', 'Unknown low resistance (sealed box)', 'Heavy-gauge connecting leads'],
    controls: [R(10, 1000, 10, 100, 'P', 'Ω'), R(10, 1000, 10, 100, 'Q', 'Ω'), R(0.01, 5, 0.01, 1, 'S', 'Ω')],
    fixed: [], hidden: [{ key: 'Rx', label: 'Unknown Low Resistance Rₓ', unit: 'Ω', range: [0.02, 3], decimals: 3 }],
    compute: (c) => ({ Rx: (c.Q * c.S) / c.P }),
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'S', u: 'Ω' }, { k: 'Rx', u: 'Ω', label: 'Rₓ (measured)' }],
  },
  {
    id: 'kelvin-double-bridge', group: 'DC BRIDGES', detector: 'gal', source: 'dc',
    svg: { ab: { type: 'R', label: 'P' }, bc: { type: 'R', label: 'Q' }, ad: { type: 'R', label: 'S' }, dc: { type: 'unknown', label: 'Rx' } },
    formula: 'R<sub>x</sub> = (P/Q)·S + [ q·r / (p+q+r) ]·(P/Q − p/q)<br><small style="color:var(--muted)">Correction term → 0 when P/Q = p/q</small>',
    extraNote: 'Inner ratio arms p, q and yoke r cancel lead-resistance error when P/Q = p/q.',
    apparatus: ['Kelvin double bridge trainer kit', 'Centre-zero galvanometer', 'High-current, low-voltage DC supply', 'Outer ratio arms P, Q', 'Inner ratio arms p, q', 'Standard low resistance S', 'Unknown low resistance (sealed box)', 'Heavy copper link (yoke) of resistance r'],
    controls: [R(100, 1000, 10, 300, 'P', 'Ω'), R(100, 1000, 10, 300, 'Q', 'Ω'), R(100, 1000, 10, 300, 'p', 'Ω'), R(100, 1000, 10, 300, 'q', 'Ω'), R(0.001, 0.5, 0.001, 0.1, 'S', 'Ω')],
    fixed: [{ label: 'Yoke / link resistance r', value: 0.02, unit: 'Ω' }],
    hidden: [{ key: 'Rx', label: 'Unknown Low Resistance Rₓ', unit: 'Ω', range: [0.001, 0.3], decimals: 4 }],
    compute: (c, f) => ({ Rx: (c.P / c.Q) * c.S + (c.q * f.r / (c.p + c.q + f.r)) * ((c.P / c.Q) - (c.p / c.q)) }),
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'p', u: 'Ω' }, { k: 'q', u: 'Ω' }, { k: 'S', u: 'Ω' }, { k: 'Rx', u: 'Ω', label: 'Rₓ (measured)' }],
  },
  {
    id: 'capacitance-comparison-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Cx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'C', label: 'C2' }, dc: { type: 'R', label: 'R4' } },
    formula: 'At balance: C<sub>x</sub>·R3 = C2·R4 &nbsp;→&nbsp; <b>C<sub>x</sub> = (C2 × R4) / R3</b>',
    apparatus: ['Capacitance comparison bridge kit', 'Audio oscillator (~1 kHz)', 'Headphone / tuned null detector', 'Standard capacitor C2 (loss-free)', 'Non-inductive resistance boxes R3, R4', 'Unknown capacitor (sealed box)', 'Screened connecting leads'],
    controls: [R(100, 20000, 100, 5000, 'R3', 'Ω'), R(100, 20000, 100, 5000, 'R4', 'Ω'), R(0.001, 5, 0.001, 1, 'C2', 'µF')],
    fixed: [], hidden: [{ key: 'Cx', label: 'Unknown Capacitance Cₓ', unit: 'µF', range: [0.05, 3], decimals: 3 }],
    compute: (c) => ({ Cx: (c.C2 * c.R4) / c.R3 }),
    tabCols: [{ k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C2', u: 'µF' }, { k: 'Cx', u: 'µF', label: 'Cₓ (measured)' }],
  },
  {
    id: 'maxwell-inductance-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'L1' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'L', label: 'L2' }, dc: { type: 'R', label: 'R4' } },
    formula: 'L<sub>1</sub> = (R3/R4)·L2 &nbsp;|&nbsp; R<sub>1</sub> = (R3/R4)·(R2 + r2)',
    extraNote: 'r2 = 15 Ω is the fixed winding resistance of the standard inductor.',
    apparatus: ["Maxwell's bridge kit", 'Oscillator', 'Decade inductance box (variable standard inductor L2)', 'Head phone', 'Non-inductive resistance boxes R2, R3, R4', 'Patch cords'],
    controls: [R(10, 2000, 10, 500, 'R2', 'Ω'), R(100, 20000, 100, 5000, 'R3', 'Ω'), R(100, 20000, 100, 5000, 'R4', 'Ω'), R(1, 500, 1, 100, 'L2', 'mH')],
    fixed: [{ label: 'Fixed resistance of standard inductor r2', value: 15, unit: 'Ω' }],
    hidden: [{ key: 'L1', label: 'Unknown Inductance L1', unit: 'mH', range: [20, 300], decimals: 1 }, { key: 'R1', label: 'Unknown Coil Resistance R1', unit: 'Ω', range: [50, 800], decimals: 1 }],
    compute: (c, f) => ({ L1: (c.R3 / c.R4) * c.L2, R1: (c.R3 / c.R4) * (c.R2 + f.r2) }),
    tabCols: [{ k: 'R2', u: 'Ω' }, { k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'L2', u: 'mH' }, { k: 'L1', u: 'mH', label: 'L1 (measured)' }, { k: 'R1', u: 'Ω', label: 'R1 (measured)' }],
  },
  {
    id: 'maxwell-lc-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Lx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'R', label: 'R2' }, dc: { type: 'C', label: 'C4‖R4' } },
    formula: 'L<sub>x</sub> = R2·R3·C4 (×10<sup>−3</sup> for mH) &nbsp;|&nbsp; R<sub>x</sub> = R2·R3 / R4',
    apparatus: ["Maxwell's L-C bridge kit", 'Audio oscillator', 'Head phone', 'Standard variable capacitor C4', 'Non-inductive resistance boxes R2, R3, R4', 'Unknown coil (sealed box)'],
    controls: [R(100, 20000, 100, 5000, 'R2', 'Ω'), R(100, 20000, 100, 5000, 'R3', 'Ω'), R(100, 20000, 100, 5000, 'R4', 'Ω'), R(0.001, 2, 0.001, 0.1, 'C4', 'µF')],
    fixed: [], hidden: [{ key: 'Lx', label: 'Unknown Inductance Lx', unit: 'mH', range: [10, 400], decimals: 1 }, { key: 'Rx', label: 'Unknown Coil Resistance Rx', unit: 'Ω', range: [50, 2000], decimals: 1 }],
    compute: (c) => ({ Lx: c.R2 * c.R3 * c.C4 * 1e-3, Rx: (c.R2 * c.R3) / c.R4 }),
    tabCols: [{ k: 'R2', u: 'Ω' }, { k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C4', u: 'µF' }, { k: 'Lx', u: 'mH', label: 'Lx (measured)' }, { k: 'Rx', u: 'Ω', label: 'Rx (measured)' }],
  },
  {
    id: 'hays-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Lx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'R', label: 'R2' }, dc: { type: 'C', label: 'C4+R4' } },
    formula: 'Let X = ωC4R4. Then: L<sub>x</sub> = R2·R3·C4/(1+X²) &nbsp;|&nbsp; R<sub>x</sub> = X²·(R2·R3/R4)/(1+X²)',
    apparatus: ["Hay's bridge kit", 'Audio oscillator with frequency dial', 'Head phone', 'Standard variable capacitor C4 in series with R4', 'Non-inductive resistance boxes R2, R3', 'Unknown high-Q coil (sealed box)'],
    controls: [R(100, 20000, 100, 5000, 'R2', 'Ω'), R(100, 20000, 100, 5000, 'R3', 'Ω'), R(10, 5000, 10, 500, 'R4', 'Ω'), R(0.001, 2, 0.001, 0.1, 'C4', 'µF'), R(50, 5000, 50, 1000, 'f', 'Hz')],
    fixed: [], hidden: [{ key: 'Lx', label: 'Unknown Inductance Lx', unit: 'mH', range: [10, 400], decimals: 1 }, { key: 'Rx', label: 'Unknown Coil Resistance Rx', unit: 'Ω', range: [20, 2000], decimals: 1 }],
    compute: (c) => { const X = 2 * Math.PI * c.f * (c.C4 * 1e-6) * c.R4; return { Lx: c.R2 * c.R3 * (c.C4 * 1e-3) / (1 + X * X), Rx: X * X * (c.R2 * c.R3 / c.R4) / (1 + X * X) }; },
    tabCols: [{ k: 'R2', u: 'Ω' }, { k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C4', u: 'µF' }, { k: 'f', u: 'Hz' }, { k: 'Lx', u: 'mH', label: 'Lx (measured)' }, { k: 'Rx', u: 'Ω', label: 'Rx (measured)' }],
  },
  {
    id: 'anderson-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Lx' }, bc: { type: 'R', label: 'P' }, ad: { type: 'R', label: 'R' }, dc: { type: 'R', label: 'Q' } },
    formula: 'S = Q·R / P &nbsp;|&nbsp; <b>L<sub>x</sub> = C·[ R·Q + (R+S)·m ]</b>',
    extraNote: "Fixed capacitor C and balancing resistor m sit in an auxiliary branch — this removes the need for a variable capacitor.",
    apparatus: ["Anderson's bridge kit", 'Audio oscillator', 'Head phone', 'Standard capacitor C (fixed value box)', 'Non-inductive resistance boxes P, Q, R', 'Variable resistor S (DC balance)', 'Variable resistor m (final AC balance)', 'Unknown coil (sealed box)'],
    controls: [R(100, 20000, 100, 1500, 'P', 'Ω'), R(100, 20000, 100, 1500, 'Q', 'Ω'), R(100, 20000, 100, 1500, 'R', 'Ω'), R(1, 2000, 1, 150, 'S', 'Ω'), R(1, 2000, 1, 80, 'm', 'Ω'), R(0.01, 5, 0.01, 0.3, 'C', 'µF')],
    fixed: [], hidden: [{ key: 'Lx', label: 'Unknown Inductance Lx', unit: 'mH', range: [200, 3000], decimals: 0 }],
    compute: (c) => ({ Lx: c.C * 1e-3 * (c.R * c.Q + (c.R + c.S) * c.m) }),
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'R', u: 'Ω' }, { k: 'S', u: 'Ω' }, { k: 'm', u: 'Ω' }, { k: 'C', u: 'µF' }, { k: 'Lx', u: 'mH', label: 'Lx (measured)' }],
  },
  {
    id: 'schering-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Cx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'C', label: 'C2' }, dc: { type: 'C', label: 'C4‖R4' } },
    formula: 'C<sub>x</sub> = C2·(R4/R3) &nbsp;|&nbsp; D = tan δ = ω·C4·R4',
    apparatus: ["Schering's bridge kit", 'Oscillator', 'Decade capacitance box (C4)', 'Head phone', 'Standard capacitor C2 (loss-free)', 'Non-inductive resistance boxes R3, R4', 'Unknown capacitor (sealed box)'],
    controls: [R(100, 20000, 100, 5000, 'R3', 'Ω'), R(10, 5000, 10, 500, 'R4', 'Ω'), R(0.001, 1, 0.001, 0.1, 'C2', 'µF'), R(0.001, 1, 0.001, 0.1, 'C4', 'µF'), R(50, 5000, 50, 1000, 'f', 'Hz')],
    fixed: [], hidden: [{ key: 'Cx', label: 'Unknown Capacitance Cx', unit: 'µF', range: [0.01, 0.5], decimals: 3 }, { key: 'D', label: 'Dissipation Factor D', unit: '', range: [0.002, 0.05], decimals: 4 }],
    compute: (c) => ({ Cx: (c.C2 * c.R4) / c.R3, D: 2 * Math.PI * c.f * (c.C4 * 1e-6) * c.R4 }),
    tabCols: [{ k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C2', u: 'µF' }, { k: 'C4', u: 'µF' }, { k: 'f', u: 'Hz' }, { k: 'Cx', u: 'µF', label: 'Cx (measured)' }, { k: 'D', u: '', label: 'D (measured)' }],
  },
  {
    id: 'wiens-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'C', label: 'C=C1' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'R', label: 'R=R1' }, dc: { type: 'R', label: 'R4' } },
    formula: 'Balances only when: <b>f = 1 / (2π·R·C)</b>',
    extraNote: 'Symmetric config R1=R2=R, C1=C2=C; ratio arms fixed at R3=2×R4.',
    apparatus: ["Wien's bridge kit", 'Oscillator of unknown frequency', 'Head phone', 'Equal resistance decade boxes R (=R1=R2)', 'Equal capacitance decade boxes C (=C1=C2)', 'Fixed ratio resistors R3 = 2×R4'],
    controls: [R(100, 20000, 100, 5000, 'R', 'Ω'), R(0.001, 1, 0.001, 0.1, 'C', 'µF')],
    fixed: [{ label: 'Ratio arms (fixed)', value: 'R3 = 20 kΩ, R4 = 10 kΩ', unit: '' }],
    hidden: [{ key: 'f', label: 'Unknown Oscillator Frequency', unit: 'Hz', range: [100, 2000], decimals: 1 }],
    compute: (c) => ({ f: 1 / (2 * Math.PI * c.R * (c.C * 1e-6)) }),
    tabCols: [{ k: 'R', u: 'Ω' }, { k: 'C', u: 'µF' }, { k: 'f', u: 'Hz', label: 'f (measured)' }],
  },
  {
    id: 'transformer-ratio-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Cx' }, bc: { type: 'C', label: 'Cs' }, ad: { type: 'R', label: 'N1 turns' }, dc: { type: 'R', label: 'N2 turns' } },
    formula: 'At null: <b>C<sub>x</sub> = Cs × n</b>, where n = N2/N1 is the transformer tap ratio',
    extraNote: 'Transformer windings replace resistive ratio arms — turns ratios are far more precise and stable.',
    apparatus: ['Ratio-transformer bridge kit', 'Precision tapped transformer (ratio arms)', 'Audio oscillator', 'Head phone / null voltmeter', 'Standard capacitor Cs = 1 µF', 'Unknown capacitor (sealed box)'],
    controls: [R(0.1, 5, 0.01, 1, 'n', 'ratio')],
    fixed: [{ label: 'Standard capacitor Cs', value: 1, unit: 'µF' }],
    hidden: [{ key: 'Cx', label: 'Unknown Capacitance Cx', unit: 'µF', range: [0.1, 5], decimals: 3 }],
    compute: (c, f) => ({ Cx: f.Cs * c.n }),
    tabCols: [{ k: 'n', u: '', label: 'Ratio n' }, { k: 'Cx', u: 'µF', label: 'Cx (measured)' }],
  },
];

/* ─────────────────── SIMULATION PANEL (clean) ───────────────── */
/**
 * Renders ONLY the interactive part:
 *   - Circuit SVG + gauge (left)
 *   - Sliders + action buttons (right)
 * Apparatus, formula, table, result live in the Procedure tab via BridgeProcedurePanel.
 */
export default function UnifiedBridgeSim({ bridgeId, bridgeState, onStateChange }) {
  const bridge = BRIDGES.find(b => b.id === bridgeId);

  if (!bridge) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
        <div>Interactive simulation not yet available for this experiment.</div>
      </div>
    );
  }

  const st = bridgeState || initBridgeState(bridge);

  function update(newSt) { if (onStateChange) onStateChange(newSt); }
  function updateCtrl(label, rawVal) {
    update({ ...st, ctrl: { ...st.ctrl, [label]: parseFloat(rawVal) } });
  }
  function newUnknown() {
    const hidden = {};
    bridge.hidden.forEach(h => { hidden[h.key] = rnd(h.range[0], h.range[1], h.decimals); });
    update({ ...st, hidden, rows: [], revealed: false });
  }

  const { devs } = computeDeviations(bridge, st);
  const rms = Math.sqrt(devs.reduce((a, d) => a + d * d, 0) / devs.length);
  const signed = devs[0];

  const btnBase = {
    fontWeight: 600, fontSize: 13, padding: '9px 16px', borderRadius: 8,
    border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>

      {/* LEFT: Circuit + Gauge */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
          Circuit Diagram
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircuitSVG cfg={{ ...bridge.svg, detector: bridge.detector, source: bridge.source }} />
        </div>
        {bridge.extraNote && (
          <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 12, lineHeight: 1.55, borderTop: '1px dashed var(--border)', paddingTop: 12 }}
            dangerouslySetInnerHTML={{ __html: bridge.extraNote }} />
        )}
        <div style={{ marginTop: 20 }}>
          <Gauge rms={rms} signed={signed} detector={bridge.detector} />
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
          Adjust Bridge Arms
        </div>

        {(bridge.fixed || []).map((fx, i) => (
          <div key={i} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'var(--muted)', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', marginBottom: 10 }}>
            Given (fixed): <b style={{ color: 'var(--ink)' }}>{fx.label}</b> = {fx.value} {fx.unit}
          </div>
        ))}

        {bridge.controls.map(cc => {
          const val = st.ctrl[cc.label] ?? cc.def;
          const dec = cc.step < 1 ? 3 : 0;
          return (
            <div key={`${bridgeId}-${cc.label}`} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ui-monospace,monospace', fontSize: 12.5, color: 'var(--muted)', marginBottom: 5 }}>
                <span>{cc.label}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{fmt(val, dec)} {cc.unit}</span>
              </div>
              <input
                type="range"
                min={cc.min} max={cc.max} step={cc.step}
                value={val}
                onChange={e => updateCtrl(cc.label, e.target.value)}
                style={{ width: '100%', accentColor: 'var(--teal)', height: 4, cursor: 'pointer' }}
              />
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button
            style={{ ...btnBase, background: 'var(--teal)', color: '#fff', border: '1px solid var(--teal)' }}
            onClick={() => {
              const fx = fixedLookup(bridge);
              const computed = bridge.compute(st.ctrl, fx);
              update({ ...st, rows: [...st.rows, { ...st.ctrl, ...computed }] });
            }}
          >
            Record Reading
          </button>
          <button style={{ ...btnBase, background: 'transparent', color: 'var(--ink)' }} onClick={newUnknown}>
            🎲 New Unknown
          </button>
          <button style={{ ...btnBase, background: 'transparent', color: 'var(--muted)' }}
            onClick={() => update({ ...st, revealed: !st.revealed })}>
            {st.revealed ? 'Hide' : 'Reveal'} True Value
          </button>
          <button style={{ ...btnBase, background: 'transparent', color: 'var(--muted)' }}
            onClick={() => update({ ...st, rows: [] })}>
            Clear Trials
          </button>
        </div>

        <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--canvas)', borderRadius: 8, fontSize: 12.5, color: 'var(--muted)', fontFamily: 'ui-monospace,monospace', lineHeight: 1.5 }}>
          💡 Adjust sliders until the gauge turns <b style={{ color: 'var(--teal)' }}>teal</b> and reads NULL, then Record a Reading. Switch to the <b style={{ color: 'var(--ink)' }}>Procedure</b> tab to see your observation table and result.
        </div>
      </div>
    </div>
  );
}

/* ─────────────── PROCEDURE PANEL (apparatus + table + result) ── */
/**
 * This is rendered inside the Procedure tab for bridge experiments.
 * Shows: Apparatus list, Balance Formula, Observation Table, Result.
 */
export function BridgeProcedurePanel({ bridgeId, bridgeState, onStateChange }) {
  const bridge = BRIDGES.find(b => b.id === bridgeId);
  if (!bridge) return null;
  const st = bridgeState || initBridgeState(bridge);
  function update(newSt) { if (onStateChange) onStateChange(newSt); }

  const sectionTitle = {
    fontSize: 13, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: 'var(--muted)', marginBottom: 12, marginTop: 24,
  };
  const card = {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 20, marginBottom: 16,
  };
  const th = {
    textAlign: 'left', color: 'var(--muted)', fontWeight: 600,
    padding: '7px 10px', borderBottom: '1px solid var(--border)',
    fontFamily: 'ui-monospace,monospace', fontSize: 12.5, whiteSpace: 'nowrap',
  };
  const td = {
    padding: '7px 10px', borderBottom: '1px solid var(--border)',
    fontFamily: 'ui-monospace,monospace', fontSize: 12.5, color: 'var(--ink)',
  };

  /* average result */
  let resultContent = null;
  if (st.rows.length > 0) {
    const avg = {};
    bridge.hidden.forEach(h => { avg[h.key] = st.rows.reduce((a, r) => a + r[h.key], 0) / st.rows.length; });
    resultContent = bridge.hidden.map(h => {
      const errStr = st.revealed
        ? ` | Actual = ${fmt(st.hidden[h.key], 4)} ${h.unit} — Error: ${fmt(Math.abs(avg[h.key] - st.hidden[h.key]) / st.hidden[h.key] * 100, 2)}%`
        : '';
      return (
        <div key={h.key} style={{ marginBottom: 6 }}>
          {h.label} (mean of {st.rows.length} trial{st.rows.length > 1 ? 's' : ''}) ={' '}
          <b style={{ color: 'var(--teal)' }}>{fmt(avg[h.key], 4)} {h.unit}</b>
          {st.revealed && <span style={{ color: 'var(--muted)', fontSize: 13 }}>{errStr}</span>}
        </div>
      );
    });
  }

  return (
    <div>
      {/* Apparatus */}
      <div style={sectionTitle}>Apparatus Required</div>
      <div style={card}>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '8px 20px' }}>
          {bridge.apparatus.map((a, i) => (
            <li key={i} style={{ fontSize: 13.5, color: 'var(--ink)', padding: '5px 0', borderBottom: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--teal)', fontWeight: 700 }}>→</span> {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Formula */}
      <div style={sectionTitle}>Balance Formula</div>
      <div style={{ ...card, fontFamily: 'ui-monospace,monospace', fontSize: 14, color: 'var(--teal)', lineHeight: 1.9, overflowX: 'auto' }}
        dangerouslySetInnerHTML={{ __html: bridge.formula }} />

      {/* Observation Table */}
      <div style={sectionTitle}>Observation Table</div>
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--canvas)' }}>
                <th style={th}>S.No.</th>
                {bridge.tabCols.map(c => (
                  <th key={c.k} style={th}>{c.label || `${c.k}${c.u ? ` (${c.u})` : ''}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {st.rows.length === 0 ? (
                <tr>
                  <td colSpan={bridge.tabCols.length + 1}
                    style={{ ...td, color: 'var(--muted)', textAlign: 'center', padding: 24 }}>
                    No readings yet — go to the <b>Simulation</b> tab, balance the bridge, and click "Record Reading".
                  </td>
                </tr>
              ) : st.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--canvas)' }}>
                  <td style={td}>{i + 1}</td>
                  {bridge.tabCols.map(c => (
                    <td key={c.k} style={td}>{fmt(row[c.k], c.u === 'µF' ? 4 : 2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {st.rows.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <button
              onClick={() => update({ ...st, revealed: !st.revealed })}
              style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--teal)', background: 'transparent', color: 'var(--teal)', cursor: 'pointer' }}>
              {st.revealed ? 'Hide' : 'Reveal'} True Value
            </button>
            <button
              onClick={() => update({ ...st, rows: [], revealed: false })}
              style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      <div style={sectionTitle}>Result</div>
      <div style={{ ...card, fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>
        {resultContent || (
          <span style={{ color: 'var(--muted)' }}>
            Take at least one reading at balance to see the computed result here.
          </span>
        )}
      </div>
    </div>
  );
}
