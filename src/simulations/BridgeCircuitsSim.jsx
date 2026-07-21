import React, { useState } from 'react';

export default function BridgeCircuitsSim() {
  const [bridgeType, setBridgeType] = useState('maxwell');

  // Maxwell Controls
  const [m_R2, setM_R2] = useState(10);
  const [m_R3, setM_R3] = useState(100);
  const [m_R4, setM_R4] = useState(100);
  const [m_L2, setM_L2] = useState(10);

  // Schering Controls
  const [s_R3, setS_R3] = useState(100);
  const [s_R4, setS_R4] = useState(100);
  const [s_C2, setS_C2] = useState(1);
  const [s_C4, setS_C4] = useState(1);

  // Unknowns (fixed for simulation)
  const unknownL = 45; // mH
  const unknownR1 = 15; // ohms
  const unknownCx = 2.5; // uF
  const unknownRx = 20; // ohms

  // Calculate imbalance
  let imbalance = 0;
  if (bridgeType === 'maxwell') {
    const calcL = (m_R3 / m_R4) * m_L2;
    const calcR = (m_R3 / m_R4) * m_R2;
    const errorL = Math.abs(calcL - unknownL) / unknownL;
    const errorR = Math.abs(calcR - unknownR1) / unknownR1;
    imbalance = (errorL + errorR) * 100;
  } else {
    const calcC = s_C2 * (s_R4 / s_R3);
    const calcR = s_R3 * (s_C4 / s_C2);
    const errorC = Math.abs(calcC - unknownCx) / unknownCx;
    const errorR = Math.abs(calcR - unknownRx) / unknownRx;
    imbalance = (errorC + errorR) * 100;
  }

  const isBalanced = imbalance < 1;
  const detectorVoltage = isBalanced ? 0 : imbalance; 

  return (
    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
      <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: 22, fontWeight: 800 }}>Bridge Simulator</h3>
          <select 
            value={bridgeType} 
            onChange={(e) => setBridgeType(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: 14, color: '#334155', outline: 'none' }}
          >
            <option value="maxwell">Maxwell's Inductance Bridge</option>
            <option value="schering">Schering's Capacitance Bridge</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* Controls */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h4 style={{ margin: 0, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, fontWeight: 800 }}>Adjust Variable Arms</h4>
            
            {bridgeType === 'maxwell' ? (
              <>
                <Control label="Resistance R2 (Ω)" min={1} max={50} value={m_R2} onChange={setM_R2} />
                <Control label="Resistance R3 (Ω)" min={10} max={500} step={10} value={m_R3} onChange={setM_R3} />
                <Control label="Resistance R4 (Ω)" min={10} max={500} step={10} value={m_R4} onChange={setM_R4} />
                <Control label="Inductance L2 (mH)" min={1} max={100} value={m_L2} onChange={setM_L2} />
              </>
            ) : (
              <>
                <Control label="Resistance R3 (Ω)" min={10} max={500} step={10} value={s_R3} onChange={setS_R3} />
                <Control label="Resistance R4 (Ω)" min={10} max={500} step={10} value={s_R4} onChange={setS_R4} />
                <Control label="Capacitance C2 (µF)" min={0.1} max={10} step={0.1} value={s_C2} onChange={setS_C2} />
                <Control label="Capacitance C4 (µF)" min={0.1} max={10} step={0.1} value={s_C4} onChange={setS_C4} />
              </>
            )}
          </div>

          {/* Detector */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h4 style={{ margin: 0, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, fontWeight: 800 }}>Null Detector (Headphone)</h4>
            <div style={{ 
              background: '#fff', border: `2px solid ${isBalanced ? '#10b981' : '#e2e8f0'}`, 
              borderRadius: '16px', padding: '40px', textAlign: 'center',
              boxShadow: isBalanced ? '0 10px 30px rgba(16, 185, 129, 0.15)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Imbalance Signal
              </div>
              <div style={{ fontSize: '56px', fontWeight: 800, color: isBalanced ? '#10b981' : '#f59e0b', margin: '16px 0', fontFamily: 'monospace' }}>
                {detectorVoltage.toFixed(1)} <span style={{ fontSize: '20px', color: '#94a3b8' }}>mV</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: isBalanced ? '#10b981' : '#64748b' }}>
                {isBalanced ? "✓ BRIDGE BALANCED" : "Bridge Unbalanced"}
              </div>
            </div>

            {isBalanced && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '20px', borderRadius: '12px', border: '1px solid #a7f3d0', fontSize: 15, lineHeight: 1.6 }}>
                <strong style={{ display: 'block', marginBottom: '12px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Derived Values</strong>
                {bridgeType === 'maxwell' ? (
                  <>
                    Unknown Inductance L1 = ({m_R3}/{m_R4}) * {m_L2}mH = <strong>{((m_R3/m_R4)*m_L2).toFixed(1)} mH</strong><br/>
                    Unknown Resistance R1 = ({m_R3}/{m_R4}) * {m_R2}Ω = <strong>{((m_R3/m_R4)*m_R2).toFixed(1)} Ω</strong>
                  </>
                ) : (
                  <>
                    Unknown Capacitance Cx = {s_C2}µF * ({s_R4}/{s_R3}) = <strong>{(s_C2*(s_R4/s_R3)).toFixed(2)} µF</strong><br/>
                    Unknown Resistance Rx = {s_R3}Ω * ({s_C4}/{s_C2}) = <strong>{(s_R3*(s_C4/s_C2)).toFixed(1)} Ω</strong>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Control({ label, min, max, step = 1, value, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 700, fontSize: '14px', color: '#334155' }}>
        <span>{label}</span>
        <span style={{ color: '#0f766e', background: '#f0fdfa', padding: '2px 8px', borderRadius: 6, border: '1px solid #ccfbf1' }}>{value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#0d9488', height: 6 }}
      />
    </div>
  );
}
