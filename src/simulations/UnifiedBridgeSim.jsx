import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Printer } from 'lucide-react';

/* ─────────────────────────── HELPERS ─────────────────────────── */

function fmt(v, decimals = 3) {
  if (v === undefined || v === null || isNaN(v)) return '--';
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(2);
  return v.toFixed(decimals);
}

export function initBridgeState(bridge) {
  return { rows: [] };
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


/* ─────────────────── BRIDGE DATA (all 11) ──────────────────── */

const R = (min, max, step, def, label, unit) => ({ label, min, max, step, def, unit });

export const BRIDGES = [
  {
    id: 'wheatstone-bridge', group: 'DC BRIDGES', detector: 'gal', source: 'dc',
    svg: { ab: { type: 'R', label: 'P' }, bc: { type: 'R', label: 'Q' }, ad: { type: 'R', label: 'R' }, dc: { type: 'unknown', label: 'Rx' } },
    formula: 'At balance: P·R<sub>x</sub> = Q·R &nbsp;→&nbsp; <b>R<sub>x</sub> = (Q × R) / P</b>',
    apparatus: ['Wheatstone bridge trainer kit', 'Galvanometer (null detector)', 'DC regulated power supply / battery', 'Resistance boxes P, Q, R', 'Unknown resistor (sealed box)', 'Connecting patch cords', 'Battery key & galvanometer key'],
    fixed: [], hidden: [{ key: 'Rx', label: 'Unknown Resistance Rₓ', unit: 'Ω' }],
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'R', u: 'Ω' }, { k: 'Rx', u: 'Ω', label: 'Rₓ (measured)' }],
  },
  {
    id: 'kelvin-bridge', group: 'DC BRIDGES', detector: 'gal', source: 'dc',
    svg: { ab: { type: 'R', label: 'P' }, bc: { type: 'R', label: 'Q' }, ad: { type: 'R', label: 'S' }, dc: { type: 'unknown', label: 'Rx' } },
    formula: 'At balance: P·R<sub>x</sub> = Q·S &nbsp;→&nbsp; <b>R<sub>x</sub> = (Q × S) / P</b>',
    apparatus: ['Kelvin bridge trainer kit', 'Galvanometer (sensitive, centre-zero)', 'Low-voltage, high-current DC supply', 'Ratio arm resistance boxes P, Q', 'Standard low-resistance decade box S', 'Unknown low resistance (sealed box)', 'Heavy-gauge connecting leads'],
    fixed: [], hidden: [{ key: 'Rx', label: 'Unknown Low Resistance Rₓ', unit: 'Ω' }],
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'S', u: 'Ω' }, { k: 'Rx', u: 'Ω', label: 'Rₓ (measured)' }],
  },
  {
    id: 'kelvin-double-bridge', group: 'DC BRIDGES', detector: 'gal', source: 'dc',
    svg: { ab: { type: 'R', label: 'P' }, bc: { type: 'R', label: 'Q' }, ad: { type: 'R', label: 'S' }, dc: { type: 'unknown', label: 'Rx' } },
    formula: 'R<sub>x</sub> = (P/Q)·S + [ q·r / (p+q+r) ]·(P/Q − p/q)<br><small style="color:var(--muted)">Correction term → 0 when P/Q = p/q</small>',
    extraNote: 'Inner ratio arms p, q and yoke r cancel lead-resistance error when P/Q = p/q.',
    apparatus: ['Kelvin double bridge trainer kit', 'Centre-zero galvanometer', 'High-current, low-voltage DC supply', 'Outer ratio arms P, Q', 'Inner ratio arms p, q', 'Standard low resistance S', 'Unknown low resistance (sealed box)', 'Heavy copper link (yoke) of resistance r'],
    fixed: [{ label: 'Yoke / link resistance r', value: 0.02, unit: 'Ω' }],
    hidden: [{ key: 'Rx', label: 'Unknown Low Resistance Rₓ', unit: 'Ω' }],
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'p', u: 'Ω' }, { k: 'q', u: 'Ω' }, { k: 'S', u: 'Ω' }, { k: 'Rx', u: 'Ω', label: 'Rₓ (measured)' }],
  },
  {
    id: 'capacitance-comparison-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Cx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'C', label: 'C2' }, dc: { type: 'R', label: 'R4' } },
    formula: 'At balance: C<sub>x</sub>·R3 = C2·R4 &nbsp;→&nbsp; <b>C<sub>x</sub> = (C2 × R4) / R3</b>',
    apparatus: ['Capacitance comparison bridge kit', 'Audio oscillator (~1 kHz)', 'Headphone / tuned null detector', 'Standard capacitor C2 (loss-free)', 'Non-inductive resistance boxes R3, R4', 'Unknown capacitor (sealed box)', 'Screened connecting leads'],
    fixed: [], hidden: [{ key: 'Cx', label: 'Unknown Capacitance Cₓ', unit: 'µF' }],
    tabCols: [{ k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C2', u: 'µF' }, { k: 'Cx', u: 'µF', label: 'Cₓ (measured)' }],
  },
  {
    id: 'maxwell-inductance-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'L1' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'L', label: 'L2' }, dc: { type: 'R', label: 'R4' } },
    formula: 'L<sub>1</sub> = (R3/R4)·L2 &nbsp;|&nbsp; R<sub>1</sub> = (R3/R4)·(R2 + r2)',
    extraNote: 'r2 = 15 Ω is the fixed winding resistance of the standard inductor.',
    apparatus: ["Maxwell's bridge kit", 'Oscillator', 'Decade inductance box (variable standard inductor L2)', 'Head phone', 'Non-inductive resistance boxes R2, R3, R4', 'Patch cords'],
    fixed: [{ label: 'Fixed resistance of standard inductor r2', value: 15, unit: 'Ω' }],
    hidden: [{ key: 'L1', label: 'Unknown Inductance L1', unit: 'mH' }, { key: 'R1', label: 'Unknown Coil Resistance R1', unit: 'Ω' }],
    tabCols: [{ k: 'R2', u: 'Ω' }, { k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'L2', u: 'mH' }, { k: 'L1', u: 'mH', label: 'L1 (measured)' }, { k: 'R1', u: 'Ω', label: 'R1 (measured)' }],
  },
  {
    id: 'maxwell-lc-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Lx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'R', label: 'R2' }, dc: { type: 'C', label: 'C4‖R4' } },
    formula: 'L<sub>x</sub> = R2·R3·C4 (×10<sup>−3</sup> for mH) &nbsp;|&nbsp; R<sub>x</sub> = R2·R3 / R4',
    apparatus: ["Maxwell's L-C bridge kit", 'Audio oscillator', 'Head phone', 'Standard variable capacitor C4', 'Non-inductive resistance boxes R2, R3, R4', 'Unknown coil (sealed box)'],
    fixed: [], hidden: [{ key: 'Lx', label: 'Unknown Inductance Lx', unit: 'mH' }, { key: 'Rx', label: 'Unknown Coil Resistance Rx', unit: 'Ω' }],
    tabCols: [{ k: 'R2', u: 'Ω' }, { k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C4', u: 'µF' }, { k: 'Lx', u: 'mH', label: 'Lx (measured)' }, { k: 'Rx', u: 'Ω', label: 'Rx (measured)' }],
  },
  {
    id: 'hays-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Lx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'R', label: 'R2' }, dc: { type: 'C', label: 'C4+R4' } },
    formula: 'Let X = ωC4R4. Then: L<sub>x</sub> = R2·R3·C4/(1+X²) &nbsp;|&nbsp; R<sub>x</sub> = X²·(R2·R3/R4)/(1+X²)',
    apparatus: ["Hay's bridge kit", 'Audio oscillator with frequency dial', 'Head phone', 'Standard variable capacitor C4 in series with R4', 'Non-inductive resistance boxes R2, R3', 'Unknown high-Q coil (sealed box)'],
    fixed: [], hidden: [{ key: 'Lx', label: 'Unknown Inductance Lx', unit: 'mH' }, { key: 'Rx', label: 'Unknown Coil Resistance Rx', unit: 'Ω' }],
    tabCols: [{ k: 'R2', u: 'Ω' }, { k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C4', u: 'µF' }, { k: 'f', u: 'Hz' }, { k: 'Lx', u: 'mH', label: 'Lx (measured)' }, { k: 'Rx', u: 'Ω', label: 'Rx (measured)' }],
  },
  {
    id: 'anderson-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Lx' }, bc: { type: 'R', label: 'P' }, ad: { type: 'R', label: 'R' }, dc: { type: 'R', label: 'Q' } },
    formula: 'S = Q·R / P &nbsp;|&nbsp; <b>L<sub>x</sub> = C·[ R·Q + (R+S)·m ]</b>',
    extraNote: "Fixed capacitor C and balancing resistor m sit in an auxiliary branch — this removes the need for a variable capacitor.",
    apparatus: ["Anderson's bridge kit", 'Audio oscillator', 'Head phone', 'Standard capacitor C (fixed value box)', 'Non-inductive resistance boxes P, Q, R', 'Variable resistor S (DC balance)', 'Variable resistor m (final AC balance)', 'Unknown coil (sealed box)'],
    fixed: [], hidden: [{ key: 'Lx', label: 'Unknown Inductance Lx', unit: 'mH' }],
    tabCols: [{ k: 'P', u: 'Ω' }, { k: 'Q', u: 'Ω' }, { k: 'R', u: 'Ω' }, { k: 'S', u: 'Ω' }, { k: 'm', u: 'Ω' }, { k: 'C', u: 'µF' }, { k: 'Lx', u: 'mH', label: 'Lx (measured)' }],
  },
  {
    id: 'schering-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Cx' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'C', label: 'C2' }, dc: { type: 'C', label: 'C4‖R4' } },
    formula: 'C<sub>x</sub> = C2·(R4/R3) &nbsp;|&nbsp; D = tan δ = ω·C4·R4',
    apparatus: ["Schering's bridge kit", 'Oscillator', 'Decade capacitance box (C4)', 'Head phone', 'Standard capacitor C2 (loss-free)', 'Non-inductive resistance boxes R3, R4', 'Unknown capacitor (sealed box)'],
    fixed: [], hidden: [{ key: 'Cx', label: 'Unknown Capacitance Cx', unit: 'µF' }, { key: 'D', label: 'Dissipation Factor D', unit: '' }],
    tabCols: [{ k: 'R3', u: 'Ω' }, { k: 'R4', u: 'Ω' }, { k: 'C2', u: 'µF' }, { k: 'C4', u: 'µF' }, { k: 'f', u: 'Hz' }, { k: 'Cx', u: 'µF', label: 'Cx (measured)' }, { k: 'D', u: '', label: 'D (measured)' }],
  },
  {
    id: 'wiens-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'C', label: 'C=C1' }, bc: { type: 'R', label: 'R3' }, ad: { type: 'R', label: 'R=R1' }, dc: { type: 'R', label: 'R4' } },
    formula: 'Balances only when: <b>f = 1 / (2π·R·C)</b>',
    extraNote: 'Symmetric config R1=R2=R, C1=C2=C; ratio arms fixed at R3=2×R4.',
    apparatus: ["Wien's bridge kit", 'Oscillator of unknown frequency', 'Head phone', 'Equal resistance decade boxes R (=R1=R2)', 'Equal capacitance decade boxes C (=C1=C2)', 'Fixed ratio resistors R3 = 2×R4'],
    fixed: [{ label: 'Ratio arms (fixed)', value: 'R3 = 20 kΩ, R4 = 10 kΩ', unit: '' }],
    hidden: [{ key: 'f', label: 'Unknown Oscillator Frequency', unit: 'Hz' }],
    tabCols: [{ k: 'R', u: 'Ω' }, { k: 'C', u: 'µF' }, { k: 'f', u: 'Hz', label: 'f (measured)' }],
  },
  {
    id: 'transformer-ratio-bridge', group: 'AC BRIDGES', detector: 'phone', source: 'ac',
    svg: { ab: { type: 'unknown', label: 'Cx' }, bc: { type: 'C', label: 'Cs' }, ad: { type: 'R', label: 'N1 turns' }, dc: { type: 'R', label: 'N2 turns' } },
    formula: 'At null: <b>C<sub>x</sub> = Cs × n</b>, where n = N2/N1 is the transformer tap ratio',
    extraNote: 'Transformer windings replace resistive ratio arms — turns ratios are far more precise and stable.',
    apparatus: ['Ratio-transformer bridge kit', 'Precision tapped transformer (ratio arms)', 'Audio oscillator', 'Head phone / null voltmeter', 'Standard capacitor Cs = 1 µF', 'Unknown capacitor (sealed box)'],
    fixed: [{ label: 'Standard capacitor Cs', value: 1, unit: 'µF' }],
    hidden: [{ key: 'Cx', label: 'Unknown Capacitance Cx', unit: 'µF' }],
    tabCols: [{ k: 'n', u: '', label: 'Ratio n' }, { k: 'Cx', u: 'µF', label: 'Cx (measured)' }],
  },
];

/* ─────────────────── REFERENCE PANEL (clean) ───────────────── */
/**
 * Renders ONLY the static reference part:
 *   - Circuit SVG
 *   - Formula
 *   - Fixed Values
 */
export default function UnifiedBridgeSim({ bridgeId }) {
  const bridge = BRIDGES.find(b => b.id === bridgeId);

  if (!bridge) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
        <div>Reference diagram not yet available for this experiment.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
          Reference Circuit Diagram
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircuitSVG cfg={{ ...bridge.svg, detector: bridge.detector, source: bridge.source }} />
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
          Balance Formula & Info
        </div>
        <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 14, color: 'var(--teal)', lineHeight: 1.9, marginBottom: 16 }}
          dangerouslySetInnerHTML={{ __html: bridge.formula }} />
        {bridge.extraNote && (
          <div style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.55, borderTop: '1px dashed var(--border)', paddingTop: 12 }}
            dangerouslySetInnerHTML={{ __html: bridge.extraNote }} />
        )}
        {(bridge.fixed || []).map((fx, i) => (
          <div key={i} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'var(--muted)', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', marginTop: 10 }}>
            Given (fixed): <b style={{ color: 'var(--ink)' }}>{fx.label}</b> = {fx.value} {fx.unit}
          </div>
        ))}
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
  const [graphX, setGraphX] = useState(bridge && bridge.tabCols.length >= 2 ? bridge.tabCols[0].k : '');
  const [graphY, setGraphY] = useState(bridge && bridge.tabCols.length >= 2 ? bridge.tabCols[1].k : '');
  if (!bridge) return null;
  const st = bridgeState || initBridgeState(bridge);
  function update(newSt) { if (onStateChange) onStateChange(newSt); }

  function updateRow(index, key, rawVal) {
    const newRows = [...st.rows];
    const val = rawVal === '' ? '' : parseFloat(rawVal);
    newRows[index] = { ...newRows[index], [key]: isNaN(val) ? rawVal : val };
    update({ ...st, rows: newRows });
  }

  function addEmptyRow() {
    const emptyRow = {};
    bridge.tabCols.forEach(c => emptyRow[c.k] = '');
    update({ ...st, rows: [...st.rows, emptyRow] });
  }

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
  const validRows = st.rows.filter(r => bridge.hidden.every(h => typeof r[h.key] === 'number' && !isNaN(r[h.key])));
  
  if (validRows.length > 0) {
    const avg = {};
    bridge.hidden.forEach(h => { avg[h.key] = validRows.reduce((a, r) => a + r[h.key], 0) / validRows.length; });
    resultContent = bridge.hidden.map(h => {
      return (
        <div key={h.key} style={{ marginBottom: 6 }}>
          {h.label} (mean of {validRows.length} valid trial{validRows.length > 1 ? 's' : ''}) ={' '}
          <b style={{ color: 'var(--teal)' }}>{fmt(avg[h.key], 4)} {h.unit}</b>
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
                    No readings yet — add a row manually to record your observations.
                  </td>
                </tr>
              ) : st.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--canvas)' }}>
                  <td style={td}>{i + 1}</td>
                  {bridge.tabCols.map(c => (
                    <td key={c.k} style={{ ...td, padding: '4px 8px' }}>
                      <input
                        type="number"
                        step="any"
                        value={row[c.k] !== undefined ? row[c.k] : ''}
                        onChange={e => updateRow(i, c.k, e.target.value)}
                        style={{
                          width: '100%',
                          minWidth: '70px',
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          padding: '6px 8px',
                          fontFamily: 'ui-monospace,monospace',
                          fontSize: 12.5,
                          color: 'var(--ink)',
                          outline: 'none',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={addEmptyRow}
            style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--canvas)', color: 'var(--ink)', cursor: 'pointer' }}>
            + Add Row
          </button>
          {st.rows.length > 0 && (
            <>
              <button
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--teal)', background: 'var(--teal)', color: '#fff', cursor: 'pointer' }}>
                <Printer size={16} /> Export Lab Report
              </button>
              <button
                onClick={() => {
                  const headers = ['S.No.', ...bridge.tabCols.map(c => c.label || `${c.k}${c.u ? ` (${c.u})` : ''}`)];
                  const rows = st.rows.map((row, i) => [i + 1, ...bridge.tabCols.map(c => row[c.k] !== undefined ? row[c.k] : '')].join(','));
                  const csv = [headers.join(','), ...rows].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `${bridge.id}_observations.csv`;
                  a.click();
                }}
                style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--copper)', background: 'transparent', color: 'var(--copper)', cursor: 'pointer' }}>
                ⬇ Download CSV
              </button>
              <button
                onClick={() => update({ ...st, rows: [] })}
                style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>
                Clear
              </button>
            </>
          )}

        </div>
        
        {/* Live Graphing Section */}
        {st.rows.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--panel)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Live Graph Analysis</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <select value={graphX} onChange={e => setGraphX(e.target.value)} style={{ padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid var(--border)' }}>
                  <option value="" disabled>Select X-Axis</option>
                  {bridge.tabCols.map(c => <option key={c.k} value={c.k}>{c.label || c.k}</option>)}
                </select>
                <select value={graphY} onChange={e => setGraphY(e.target.value)} style={{ padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid var(--border)' }}>
                  <option value="" disabled>Select Y-Axis</option>
                  {bridge.tabCols.map(c => <option key={c.k} value={c.k}>{c.label || c.k}</option>)}
                </select>
              </div>
            </div>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey={graphX} 
                    type="number" 
                    name={graphX}
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 11, fill: 'var(--muted)' }}
                    label={{ value: graphX, position: 'insideBottom', offset: -10, fontSize: 12, fill: 'var(--muted)' }}
                  />
                  <YAxis 
                    dataKey={graphY} 
                    type="number" 
                    name={graphY}
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 11, fill: 'var(--muted)' }}
                    label={{ value: graphY, angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fill: 'var(--muted)' }}
                  />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Scatter name="Readings" data={st.rows.filter(r => r[graphX] !== '' && r[graphY] !== '' && !isNaN(r[graphX]) && !isNaN(r[graphY]))} fill="var(--teal)" line shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      <div style={sectionTitle}>Result</div>
      <div style={{ ...card, fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>
        {resultContent || (
          <span style={{ color: 'var(--muted)' }}>
            Enter at least one complete reading in the observation table to see the computed average here.
          </span>
        )}
      </div>
    </div>
  );
}
