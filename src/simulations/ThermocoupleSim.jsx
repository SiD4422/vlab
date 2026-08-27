import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from 'recharts';

// ─── Thermocouple Type Definitions ───────────────────────────────────────────
// Seebeck coefficients in μV/°C (average linearised values per IEC 60584)
const THERMOCOUPLE_TYPES = {
  J: { label: 'Type J (Iron–Constantan)', seebeck: 50.38, maxTemp: 760,  color: '#c1712f', unit: 'μV/°C' },
  K: { label: 'Type K (Chromel–Alumel)',  seebeck: 40.44, maxTemp: 1200, color: '#1f7a72', unit: 'μV/°C' },
  T: { label: 'Type T (Copper–Constantan)',seebeck: 40.68, maxTemp: 400,  color: '#7c3aed', unit: 'μV/°C' },
  E: { label: 'Type E (Chromel–Constantan)',seebeck: 63.00, maxTemp: 870,  color: '#d97706', unit: 'μV/°C' },
};

// ─── EMF Calculation ─────────────────────────────────────────────────────────
// V (mV) = S (μV/°C) × ΔT (°C) ÷ 1000
// ΔT = T_hot − T_cold
// With CJC error: the cold junction compensation introduces an additive error
// equivalent to ΔV_error = S × CJC_error / 1000 mV
function calcEMF(seebeck, tHot, tCold) {
  const deltaT = tHot - tCold;
  return (seebeck * deltaT) / 1000; // → mV
}

function calcCompensatedEMF(seebeck, tHot, tCold, cjcError) {
  // CJC error shifts the effective reference temperature
  const effectiveCold = tCold + cjcError;
  return calcEMF(seebeck, tHot, effectiveCold);
}

// ─── Build full curve data for the graph ─────────────────────────────────────
function buildCurveData(seebeck, maxTemp, tCold, cjcError) {
  const points = [];
  const step = Math.max(1, Math.round(maxTemp / 100));
  for (let t = 0; t <= maxTemp; t += step) {
    points.push({
      temp: t,
      raw: parseFloat(calcEMF(seebeck, t, tCold).toFixed(4)),
      compensated: parseFloat(calcCompensatedEMF(seebeck, t, tCold, cjcError).toFixed(4)),
    });
  }
  // Ensure last point is exactly maxTemp
  const last = maxTemp;
  if (points[points.length - 1]?.temp !== last) {
    points.push({
      temp: last,
      raw: parseFloat(calcEMF(seebeck, last, tCold).toFixed(4)),
      compensated: parseFloat(calcCompensatedEMF(seebeck, last, tCold, cjcError).toFixed(4)),
    });
  }
  return points;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #dfe3df',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
        boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
      }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1b2430' }}>
          T<sub>hot</sub> = {label}°C
        </p>
        {payload.map((p) => (
          <p key={p.name} style={{ margin: '2px 0', color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value} mV
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Slider Component ─────────────────────────────────────────────────────────
function LabeledSlider({ label, value, min, max, step = 1, onChange, unit, accent = '#1f7a72', formatValue }) {
  const display = formatValue ? formatValue(value) : value;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1b2430' }}>{label}</span>
        <span style={{
          fontSize: 13, fontWeight: 700, color: accent,
          background: '#f0f7f6', borderRadius: 6, padding: '2px 10px',
          border: `1px solid ${accent}30`,
        }}>
          {display}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: accent,
          cursor: 'pointer',
          height: 4,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: 11, color: '#8a9a8a' }}>{min}{unit}</span>
        <span style={{ fontSize: 11, color: '#8a9a8a' }}>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ThermocoupleSim() {
  const [tcType, setTcType]       = useState('K');
  const [tHot, setTHot]           = useState(300);
  const [tCold, setTCold]         = useState(25);
  const [cjcError, setCjcError]   = useState(0);
  const [curveData, setCurveData] = useState([]);

  const tc = THERMOCOUPLE_TYPES[tcType];

  // Clamp tHot to the type's valid range whenever type changes
  useEffect(() => {
    if (tHot > tc.maxTemp) setTHot(tc.maxTemp);
  }, [tcType]);

  // Rebuild curve whenever inputs change
  useEffect(() => {
    setCurveData(buildCurveData(tc.seebeck, tc.maxTemp, tCold, cjcError));
  }, [tcType, tCold, cjcError]);

  // Live values
  const rawEMF           = calcEMF(tc.seebeck, tHot, tCold);
  const compensatedEMF   = calcCompensatedEMF(tc.seebeck, tHot, tCold, cjcError);
  const cjcCorrectionMV  = compensatedEMF - rawEMF;
  const deltaT           = tHot - tCold;

  // Dot position on graph for current temperature
  const dotRaw         = parseFloat(rawEMF.toFixed(4));
  const dotCompensated = parseFloat(compensatedEMF.toFixed(4));

  // ─── Styles ────────────────────────────────────────────────────────────────
  const styles = {
    wrapper: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: '#f8f9fa',
      minHeight: '100vh',
      padding: '28px 24px',
      color: '#1b2430',
      boxSizing: 'border-box',
    },
    header: {
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: 800,
      color: '#1b2430',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    headerSubtitle: {
      fontSize: 13,
      color: '#6b7c6b',
      marginTop: 4,
    },
    badge: {
      display: 'inline-block',
      background: '#1f7a7215',
      color: '#1f7a72',
      border: '1px solid #1f7a7240',
      borderRadius: 20,
      padding: '2px 12px',
      fontSize: 12,
      fontWeight: 600,
      marginLeft: 12,
      verticalAlign: 'middle',
    },
    card: {
      background: '#ffffff',
      border: '1px solid #dfe3df',
      borderRadius: 14,
      padding: '22px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    controlsRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20,
      marginBottom: 20,
    },
    midRow: {
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: 20,
      marginBottom: 20,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#8a9a8a',
      marginBottom: 16,
    },
    dropdown: {
      width: '100%',
      padding: '10px 14px',
      border: '1px solid #dfe3df',
      borderRadius: 8,
      background: '#f8f9fa',
      color: '#1b2430',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      outline: 'none',
      marginBottom: 18,
      accentColor: '#1f7a72',
    },
    emfDisplay: {
      textAlign: 'center',
      padding: '16px 0',
    },
    emfMain: {
      fontSize: 54,
      fontWeight: 900,
      color: '#1f7a72',
      lineHeight: 1,
      letterSpacing: '-2px',
    },
    emfUnit: {
      fontSize: 20,
      fontWeight: 600,
      color: '#6b7c6b',
      marginLeft: 6,
    },
    emfLabel: {
      fontSize: 12,
      color: '#8a9a8a',
      marginTop: 4,
      fontWeight: 500,
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #dfe3df',
      margin: '14px 0',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '7px 0',
    },
    statLabel: {
      fontSize: 12,
      color: '#6b7c6b',
      fontWeight: 500,
    },
    statValue: {
      fontSize: 13,
      fontWeight: 700,
      color: '#1b2430',
    },
    compensatedEMF: {
      fontSize: 22,
      fontWeight: 800,
      color: '#c1712f',
    },
    sensitivityBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: `${tc.color}12`,
      border: `1px solid ${tc.color}30`,
      borderRadius: 20,
      padding: '5px 14px',
      fontSize: 13,
      fontWeight: 700,
      color: tc.color,
      marginTop: 10,
      width: '100%',
      justifyContent: 'center',
      boxSizing: 'border-box',
    },
    infoRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: 14,
      marginBottom: 20,
    },
    infoCard: {
      background: '#ffffff',
      border: '1px solid #dfe3df',
      borderRadius: 12,
      padding: '14px 18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    infoCardLabel: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: '#8a9a8a',
      marginBottom: 6,
    },
    infoCardValue: {
      fontSize: 20,
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    errorBanner: {
      padding: '10px 16px',
      background: cjcError !== 0 ? '#fff7ed' : '#f0f7f6',
      border: `1px solid ${cjcError !== 0 ? '#c1712f40' : '#1f7a7230'}`,
      borderRadius: 8,
      fontSize: 12,
      color: cjcError !== 0 ? '#c1712f' : '#1f7a72',
      fontWeight: 500,
      marginTop: 12,
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          🌡️ Thermocouple Simulator
          <span style={styles.badge}>Physics Lab</span>
        </h1>
        <p style={styles.headerSubtitle}>
          Seebeck EMF · Cold Junction Compensation · IEC 60584 Linearised Coefficients
        </p>
      </div>

      {/* ── Info Cards Row ──────────────────────────────────────────────── */}
      <div style={styles.infoRow}>
        <div style={styles.infoCard}>
          <div style={styles.infoCardLabel}>Type Selected</div>
          <div style={{ ...styles.infoCardValue, color: tc.color }}>{tcType}</div>
          <div style={{ fontSize: 11, color: '#8a9a8a', marginTop: 2 }}>Thermocouple</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoCardLabel}>Seebeck Coeff.</div>
          <div style={{ ...styles.infoCardValue, color: '#1f7a72' }}>{tc.seebeck}</div>
          <div style={{ fontSize: 11, color: '#8a9a8a', marginTop: 2 }}>μV/°C</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoCardLabel}>ΔT (Hot − Cold)</div>
          <div style={{ ...styles.infoCardValue, color: '#1b2430' }}>{deltaT}</div>
          <div style={{ fontSize: 11, color: '#8a9a8a', marginTop: 2 }}>°C</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoCardLabel}>Max Range</div>
          <div style={{ ...styles.infoCardValue, color: '#6b7c6b' }}>{tc.maxTemp}</div>
          <div style={{ fontSize: 11, color: '#8a9a8a', marginTop: 2 }}>°C</div>
        </div>
      </div>

      {/* ── Controls Row ────────────────────────────────────────────────── */}
      <div style={styles.controlsRow}>
        {/* Left controls card */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>⚙ Thermocouple Type</div>
          <select
            value={tcType}
            onChange={(e) => setTcType(e.target.value)}
            style={styles.dropdown}
          >
            {Object.entries(THERMOCOUPLE_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          <LabeledSlider
            label="Hot Junction Temperature (T_hot)"
            value={tHot}
            min={tCold + 1}
            max={tc.maxTemp}
            step={1}
            onChange={setTHot}
            unit="°C"
            accent={tc.color}
          />

          <LabeledSlider
            label="Cold Junction Temperature (T_cold)"
            value={tCold}
            min={-10}
            max={100}
            step={1}
            onChange={(v) => {
              setTCold(v);
              if (tHot <= v) setTHot(v + 1);
            }}
            unit="°C"
            accent="#1f7a72"
          />
        </div>

        {/* Right controls card — CJC */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>🔧 Cold Junction Compensation (CJC)</div>
          <p style={{ fontSize: 12, color: '#6b7c6b', marginTop: 0, marginBottom: 18, lineHeight: 1.6 }}>
            In real instruments, the CJC circuit measures the cold-junction temperature using an
            on-board sensor (thermistor / RTD). An error in this measurement shifts the compensated
            EMF. Adjust the slider below to simulate a ±5 °C CJC sensor error.
          </p>

          <LabeledSlider
            label="CJC Sensor Error (ε_CJC)"
            value={cjcError}
            min={-5}
            max={5}
            step={0.1}
            onChange={setCjcError}
            unit="°C"
            accent="#c1712f"
            formatValue={(v) => (v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1))}
          />

          <div style={styles.errorBanner}>
            {cjcError === 0
              ? '✅ No CJC error — ideal compensation'
              : `⚠ CJC error of ${cjcError > 0 ? '+' : ''}${cjcError.toFixed(1)}°C causes ${(Math.abs(cjcCorrectionMV)).toFixed(4)} mV offset (${(tc.seebeck * Math.abs(cjcError) / 1000).toFixed(4)} mV)`}
          </div>

          <p style={{ fontSize: 11, color: '#8a9a8a', marginTop: 14, marginBottom: 0, fontStyle: 'italic' }}>
            Formula: V<sub>raw</sub> = S × (T<sub>hot</sub> − T<sub>cold</sub>) / 1000 &nbsp;|&nbsp;
            V<sub>comp</sub> = S × (T<sub>hot</sub> − (T<sub>cold</sub> + ε)) / 1000
          </p>
        </div>
      </div>

      {/* ── Middle: Output + Graph ───────────────────────────────────────── */}
      <div style={styles.midRow}>
        {/* Output Card */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>📊 Live EMF Output</div>

          {/* Raw EMF — primary display */}
          <div style={styles.emfDisplay}>
            <div>
              <span style={styles.emfMain}>{rawEMF.toFixed(3)}</span>
              <span style={styles.emfUnit}>mV</span>
            </div>
            <div style={styles.emfLabel}>Raw Seebeck EMF (no CJC correction)</div>
          </div>

          <hr style={styles.divider} />

          {/* Stats */}
          <div style={styles.statRow}>
            <span style={styles.statLabel}>CJC-Compensated EMF</span>
            <span style={{ ...styles.statValue, ...styles.compensatedEMF }}>
              {compensatedEMF.toFixed(3)} mV
            </span>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>CJC Correction</span>
            <span style={{ ...styles.statValue, color: cjcError !== 0 ? '#c1712f' : '#6b7c6b' }}>
              {cjcError >= 0 ? '' : '+'}{(-cjcCorrectionMV).toFixed(4)} mV
            </span>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>T_hot</span>
            <span style={styles.statValue}>{tHot}°C</span>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>T_cold (reference)</span>
            <span style={styles.statValue}>{tCold}°C</span>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>ΔT</span>
            <span style={{ ...styles.statValue, color: '#1f7a72' }}>{deltaT}°C</span>
          </div>

          <hr style={styles.divider} />

          {/* Sensitivity badge */}
          <div style={{ textAlign: 'center' }}>
            <div style={styles.sensitivityBadge}>
              ⚡ Sensitivity: {tc.seebeck} μV/°C &nbsp;|&nbsp; Type {tcType}
            </div>
          </div>

          {/* Physics recap */}
          <div style={{
            background: '#f8f9fa',
            border: '1px solid #dfe3df',
            borderRadius: 8,
            padding: '12px 14px',
            marginTop: 14,
            fontSize: 12,
            color: '#4a5a6a',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: '#1b2430' }}>Seebeck Effect:</strong><br />
            V = S × (T<sub>hot</sub> − T<sub>cold</sub>)<br />
            V = {tc.seebeck} × {deltaT} / 1000<br />
            V = <strong style={{ color: '#1f7a72' }}>{rawEMF.toFixed(4)} mV</strong>
          </div>
        </div>

        {/* Graph Card */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>
            📈 EMF vs Temperature — Type {tcType} ({tc.maxTemp}°C max)
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <LineChart
              data={curveData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe3df" />
              <XAxis
                dataKey="temp"
                type="number"
                domain={[0, tc.maxTemp]}
                label={{
                  value: 'Temperature (°C)',
                  position: 'insideBottom',
                  offset: -12,
                  style: { fontSize: 12, fill: '#6b7c6b', fontWeight: 600 },
                }}
                tick={{ fontSize: 11, fill: '#6b7c6b' }}
                tickCount={8}
              />
              <YAxis
                label={{
                  value: 'EMF (mV)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { fontSize: 12, fill: '#6b7c6b', fontWeight: 600 },
                }}
                tick={{ fontSize: 11, fill: '#6b7c6b' }}
                tickCount={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                verticalAlign="top"
              />

              {/* Raw EMF curve */}
              <Line
                type="monotone"
                dataKey="raw"
                name="Raw EMF"
                stroke="#1f7a72"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#1f7a72' }}
              />

              {/* CJC-compensated curve */}
              <Line
                type="monotone"
                dataKey="compensated"
                name="CJC Compensated EMF"
                stroke="#c1712f"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                activeDot={{ r: 5, fill: '#c1712f' }}
              />

              {/* Current temp indicator — raw */}
              {tHot >= 0 && tHot <= tc.maxTemp && (
                <ReferenceDot
                  x={tHot}
                  y={dotRaw}
                  r={7}
                  fill="#1f7a72"
                  stroke="#ffffff"
                  strokeWidth={2}
                  label={{
                    value: `${dotRaw.toFixed(2)} mV`,
                    position: 'top',
                    style: { fontSize: 11, fontWeight: 700, fill: '#1f7a72' },
                  }}
                />
              )}

              {/* Current temp indicator — compensated */}
              {cjcError !== 0 && tHot >= 0 && tHot <= tc.maxTemp && (
                <ReferenceDot
                  x={tHot}
                  y={dotCompensated}
                  r={6}
                  fill="#c1712f"
                  stroke="#ffffff"
                  strokeWidth={2}
                  label={{
                    value: `${dotCompensated.toFixed(2)} mV`,
                    position: 'bottom',
                    style: { fontSize: 11, fontWeight: 700, fill: '#c1712f' },
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Legend annotations */}
          <div style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            marginTop: 10,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 24, height: 3, background: '#1f7a72', borderRadius: 2 }} />
              <span style={{ color: '#6b7c6b' }}>Raw EMF (ideal CJC)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{
                width: 24, height: 3, background: '#c1712f', borderRadius: 2,
                backgroundImage: 'repeating-linear-gradient(90deg, #c1712f 0px, #c1712f 5px, transparent 5px, transparent 8px)',
              }} />
              <span style={{ color: '#6b7c6b' }}>CJC-Compensated EMF</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 12, height: 12, background: '#1f7a72', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 0 1px #1f7a72' }} />
              <span style={{ color: '#6b7c6b' }}>Current T<sub>hot</sub> = {tHot}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #dfe3df',
        borderRadius: 10,
        padding: '14px 20px',
        fontSize: 12,
        color: '#6b7c6b',
        lineHeight: 1.7,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <strong style={{ color: '#1b2430' }}>📘 Theory Note:</strong>{' '}
        The <strong>Seebeck effect</strong> produces an EMF proportional to the temperature difference between the hot and cold junctions of two dissimilar metals.
        The <strong>Cold Junction Compensation (CJC)</strong> circuit corrects the output by measuring the cold-junction temperature with an on-board sensor and adding the corresponding EMF.
        Any error in CJC measurement (ε<sub>CJC</sub>) directly adds to or subtracts from the final measured value: ΔV<sub>error</sub> = S × ε<sub>CJC</sub>.{' '}
        Linearised coefficients per <strong>IEC 60584</strong> are used here. Real thermocouple transfer functions are polynomial.
      </div>
    </div>
  );
}
