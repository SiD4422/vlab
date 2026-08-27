import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ComposedChart,
  Legend,
} from "recharts";

// ─────────────────────────────────────────────
//  Callendar-Van Dusen constants (IEC 60751)
// ─────────────────────────────────────────────
const R0 = 100; // PT100 nominal resistance at 0°C
const A = 3.9083e-3;
const B = -5.775e-7;
const C = -4.183e-12;

/** True resistance at temperature T (°C) */
function calcRTrue(T) {
  if (T >= 0) {
    return R0 * (1 + A * T + B * T * T);
  } else {
    return R0 * (1 + A * T + B * T * T + C * (T - 100) * T * T * T);
  }
}

/**
 * Given a measured resistance Rm, invert the CVD equation to get temperature.
 * Uses simple bisection over [-200, 850].
 */
function resistanceToTemp(Rm) {
  let lo = -200,
    hi = 850;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (calcRTrue(mid) < Rm) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ─────────────────────────────────────────────
//  Wiring error logic
// ─────────────────────────────────────────────
function wiringError(config, Rlead) {
  if (config === "2-wire") return 2 * Rlead;
  if (config === "3-wire") return Rlead;
  return 0; // 4-wire
}

// ─────────────────────────────────────────────
//  Style constants
// ─────────────────────────────────────────────
const colors = {
  teal: "#1f7a72",
  copper: "#c1712f",
  bg: "#f8f9fa",
  border: "#dfe3df",
  card: "#ffffff",
  text: "#1b2430",
  textMuted: "#6b7a8d",
  tealLight: "#e8f4f2",
  copperLight: "#fdf3ea",
  redLight: "#fef2f2",
  red: "#dc2626",
  green: "#16a34a",
  greenLight: "#f0fdf4",
};

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

function SliderRow({ label, value, min, max, step, unit, onChange, color = colors.teal, formatVal }) {
  const pct = ((value - min) / (max - min)) * 100;
  const displayVal = formatVal ? formatVal(value) : value;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{label}</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: color,
            background: color === colors.teal ? colors.tealLight : colors.copperLight,
            padding: "2px 10px",
            borderRadius: 20,
          }}
        >
          {displayVal} {unit}
        </span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: colors.border }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.05s",
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          marginTop: -6,
          opacity: 0,
          cursor: "pointer",
          height: 20,
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function OutputCard({ label, value, unit, sub, accent, icon }) {
  const bg = accent === "teal" ? colors.tealLight : accent === "copper" ? colors.copperLight : accent === "red" ? colors.redLight : colors.greenLight;
  const accentColor = accent === "teal" ? colors.teal : accent === "copper" ? colors.copper : accent === "red" ? colors.red : colors.green;

  return (
    <div
      style={{
        background: colors.card,
        border: `1.5px solid ${accentColor}33`,
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: 12,
        padding: "18px 20px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: accentColor, lineHeight: 1.1 }}>
        {value}
        <span style={{ fontSize: 15, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>{unit}</span>
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Custom Tooltip for Chart
// ─────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: 700, color: colors.text, marginBottom: 4 }}>
        T = {payload[0]?.payload?.T?.toFixed(1)} °C
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: <b>{Number(p.value).toFixed(3)} Ω</b>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Wiring config badge helper
// ─────────────────────────────────────────────
const WIRING_INFO = {
  "2-wire": {
    label: "2-Wire",
    color: colors.red,
    bg: colors.redLight,
    desc: "Error = 2 × R\u2097\u2091\u2090\u2093 — both lead resistances add to reading",
  },
  "3-wire": {
    label: "3-Wire",
    color: colors.copper,
    bg: colors.copperLight,
    desc: "Error = 1 × R\u2097\u2091\u2090\u2093 — one lead resistance partially cancelled",
  },
  "4-wire": {
    label: "4-Wire (Kelvin)",
    color: colors.teal,
    bg: colors.tealLight,
    desc: "Zero lead resistance error — true resistance measured",
  },
};

// ─────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────
export default function RTDSim() {
  const [temperature, setTemperature] = useState(25);
  const [rlead, setRlead] = useState(1.0);
  const [wiringConfig, setWiringConfig] = useState("2-wire");

  // ── Core calculations ──
  const rTrue = useMemo(() => calcRTrue(temperature), [temperature]);
  const rError = useMemo(() => wiringError(wiringConfig, rlead), [wiringConfig, rlead]);
  const rMeasured = rTrue + rError;

  // Temperature inferred from measured resistance (what the instrument "thinks")
  const tInferred = useMemo(() => resistanceToTemp(rMeasured), [rMeasured]);
  const tError = tInferred - temperature;

  // ── Graph data (sampled every 5°C for performance) ──
  const chartData = useMemo(() => {
    const points = [];
    for (let T = -200; T <= 850; T += 5) {
      const rT = calcRTrue(T);
      const rM = rT + wiringError(wiringConfig, rlead);
      points.push({ T, rTrue: parseFloat(rT.toFixed(4)), rMeasured: parseFloat(rM.toFixed(4)) });
    }
    return points;
  }, [wiringConfig, rlead]);

  // Current dot data
  const dotData = [{ T: temperature, rTrue: parseFloat(rTrue.toFixed(4)), rMeasured: parseFloat(rMeasured.toFixed(4)) }];

  const info = WIRING_INFO[wiringConfig];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: colors.bg,
        minHeight: "100vh",
        padding: "28px 20px",
        color: colors.text,
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${colors.teal}, ${colors.copper})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            🌡️
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: colors.text }}>
              RTD / PT100 Resistance Simulator
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textMuted }}>
              Callendar–Van Dusen equation (IEC 60751) · R₀ = 100 Ω · A = 3.9083×10⁻³ · B = −5.775×10⁻⁷ · C = −4.183×10⁻¹²
            </p>
          </div>
        </div>

        {/* ── Main grid: controls left, outputs right ── */}
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, marginBottom: 20 }}>

          {/* ── Controls card ── */}
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 20 }}>
              ⚙️ Parameters
            </div>

            <SliderRow
              label="Temperature"
              value={temperature}
              min={-200}
              max={850}
              step={1}
              unit="°C"
              onChange={setTemperature}
              color={colors.teal}
            />

            <SliderRow
              label="Lead Resistance (R\u2097\u2091\u2090\u2093)"
              value={rlead}
              min={0}
              max={5}
              step={0.1}
              unit="Ω"
              onChange={setRlead}
              color={colors.copper}
              formatVal={(v) => v.toFixed(1)}
            />

            {/* ── Wiring Config ── */}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 10 }}>
                Wiring Configuration
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["2-wire", "3-wire", "4-wire"].map((cfg) => {
                  const selected = wiringConfig === cfg;
                  const cfgInfo = WIRING_INFO[cfg];
                  return (
                    <label
                      key={cfg}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: `1.5px solid ${selected ? cfgInfo.color : colors.border}`,
                        background: selected ? cfgInfo.bg : colors.card,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="radio"
                        name="wiring"
                        value={cfg}
                        checked={selected}
                        onChange={() => setWiringConfig(cfg)}
                        style={{ accentColor: cfgInfo.color, width: 16, height: 16 }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: cfgInfo.color }}>
                          {cfgInfo.label}
                        </div>
                        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
                          {cfgInfo.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── CVD equation display ── */}
            <div
              style={{
                marginTop: 20,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, marginBottom: 6 }}>
                ACTIVE EQUATION
              </div>
              {temperature >= 0 ? (
                <div style={{ fontSize: 11, fontFamily: "monospace", color: colors.text, lineHeight: 1.7 }}>
                  R(T) = R₀·(1 + A·T + B·T²)
                  <br />
                  <span style={{ color: colors.textMuted }}>Valid: 0°C ≤ T ≤ 850°C</span>
                </div>
              ) : (
                <div style={{ fontSize: 11, fontFamily: "monospace", color: colors.text, lineHeight: 1.7 }}>
                  R(T) = R₀·(1 + A·T + B·T² + C·(T−100)·T³)
                  <br />
                  <span style={{ color: colors.textMuted }}>Valid: −200°C ≤ T &lt; 0°C</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Outputs panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Output cards row */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <OutputCard
                label="True Resistance"
                value={rTrue.toFixed(3)}
                unit="Ω"
                sub={`R(T) at ${temperature}°C — ideal, no wire error`}
                accent="teal"
                icon="🎯"
              />
              <OutputCard
                label="Measured Resistance"
                value={rMeasured.toFixed(3)}
                unit="Ω"
                sub={`Includes wiring error of +${rError.toFixed(3)} Ω`}
                accent="copper"
                icon="📏"
              />
              <OutputCard
                label="Temperature Error"
                value={tError >= 0 ? `+${tError.toFixed(3)}` : tError.toFixed(3)}
                unit="°C"
                sub={`Instrument reads ${tInferred.toFixed(3)}°C instead of ${temperature}°C`}
                accent={Math.abs(tError) < 0.01 ? "green" : "red"}
                icon="⚠️"
              />
            </div>

            {/* Wiring explanation panel */}
            <div
              style={{
                background: colors.card,
                border: `1.5px solid ${info.color}33`,
                borderLeft: `4px solid ${info.color}`,
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 28 }}>
                {wiringConfig === "4-wire" ? "✅" : wiringConfig === "3-wire" ? "⚡" : "❌"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: info.color, marginBottom: 4 }}>
                  {info.label} Configuration
                </div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
                  {wiringConfig === "4-wire" && (
                    <>
                      Kelvin (4-wire) sensing eliminates lead resistance entirely. Separate source and sense leads carry current and measure voltage independently. <b style={{ color: colors.teal }}>Zero wiring error.</b>
                    </>
                  )}
                  {wiringConfig === "3-wire" && (
                    <>
                      Three-wire configuration cancels one lead resistance from the bridge circuit. The remaining error is <b style={{ color: colors.copper }}>+{rError.toFixed(3)} Ω</b> (= R<sub>lead</sub>), causing a <b style={{ color: colors.red }}>+{tError.toFixed(3)} °C</b> offset in the indicated temperature.
                    </>
                  )}
                  {wiringConfig === "2-wire" && (
                    <>
                      Two-wire configuration adds both lead resistances in series with the RTD measurement. Error is <b style={{ color: colors.red }}>+{rError.toFixed(3)} Ω</b> (= 2×R<sub>lead</sub>), shifting the indicated temperature by <b style={{ color: colors.red }}>+{tError.toFixed(3)} °C</b>.
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats mini grid */}
            <div
              style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "14px 20px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {[
                { label: "R₀ (0°C)", val: "100.000 Ω" },
                { label: "Sensitivity", val: `${(A * R0).toFixed(3)} Ω/°C` },
                { label: "Rlead Error", val: `${rError.toFixed(3)} Ω` },
                { label: "Wiring Mode", val: info.label },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Chart card ── */}
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: "24px 24px 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>
                📈 R(T) — Temperature vs Resistance Curve
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                Range: −200°C to 850°C · PT100 · Callendar–Van Dusen · Current point marked with dot
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 3, background: colors.teal, borderRadius: 2 }} />
                <span style={{ fontSize: 12, color: colors.textMuted }}>True R(T)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 3, background: colors.copper, borderRadius: 2, borderStyle: "dashed" }} />
                <span style={{ fontSize: 12, color: colors.textMuted }}>Measured R</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis
                dataKey="T"
                type="number"
                domain={[-200, 850]}
                tickCount={12}
                tickFormatter={(v) => `${v}°`}
                label={{ value: "Temperature (°C)", position: "insideBottom", offset: -4, fontSize: 12, fill: colors.textMuted }}
                tick={{ fontSize: 11, fill: colors.textMuted }}
              />
              <YAxis
                tickFormatter={(v) => `${v.toFixed(0)}Ω`}
                tick={{ fontSize: 11, fill: colors.textMuted }}
                label={{ value: "Resistance (Ω)", angle: -90, position: "insideLeft", offset: 12, fontSize: 12, fill: colors.textMuted }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* True R(T) line */}
              <Line
                type="monotone"
                dataKey="rTrue"
                name="True R(T)"
                stroke={colors.teal}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />

              {/* Measured R line (offset by wiring error) */}
              <Line
                type="monotone"
                dataKey="rMeasured"
                name="Measured R"
                stroke={colors.copper}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                isAnimationActive={false}
              />

              {/* Current temperature vertical reference */}
              <ReferenceLine
                x={temperature}
                stroke={colors.text}
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{
                  value: `${temperature}°C`,
                  position: temperature < 600 ? "top" : "insideTopLeft",
                  fontSize: 11,
                  fill: colors.text,
                  fontWeight: 700,
                }}
              />

              {/* Current point dots */}
              <Scatter
                data={dotData}
                dataKey="rTrue"
                fill={colors.teal}
                r={6}
                isAnimationActive={false}
              />
              <Scatter
                data={dotData}
                dataKey="rMeasured"
                fill={colors.copper}
                r={6}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: "0.03em",
          }}
        >
          PT100 RTD · IEC 60751 · Callendar–Van Dusen Model · R₀=100Ω · A=3.9083×10⁻³ · B=−5.775×10⁻⁷ · C=−4.183×10⁻¹² (T&lt;0°C only)
        </div>
      </div>
    </div>
  );
}
