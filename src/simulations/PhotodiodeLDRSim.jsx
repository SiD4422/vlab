import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Label,
} from "recharts";

// ─── Style constants ──────────────────────────────────────────────────────────
const TEAL   = "#1f7a72";
const AMBER  = "#c1712f";
const BG     = "#f8f9fa";
const CARD   = "#ffffff";
const BORDER = "#dfe3df";
const TEXT   = "#1b2430";
const MUTED  = "#6b7280";

// ─── Photodiode physics constants ─────────────────────────────────────────────
const Kph = 0.5; // mA / lux  (responsivity constant)

// ─── LDR physics constants ────────────────────────────────────────────────────
const K_LDR   = 500000; // Ω·lux^gamma
const GAMMA   = 0.7;    // empirical exponent
const VCC     = 5;      // volts

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ldrResistanceOhm = (lux) => K_LDR / Math.pow(Math.max(lux, 0.001), GAMMA);
const ldrResistanceKOhm = (lux) => ldrResistanceOhm(lux) / 1000;
const vout = (lux, rLoadKOhm) => {
  const rLDR = ldrResistanceKOhm(lux);
  return VCC * rLoadKOhm / (rLDR + rLoadKOhm);
};

// ─── Custom tooltip wrappers ──────────────────────────────────────────────────
const PhotoTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8,
      padding: "8px 14px", fontSize: 13, color: TEXT, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div style={{ fontWeight: 600, color: TEAL, marginBottom: 4 }}>{label} lux</div>
      <div>Iph = <strong>{payload[0]?.value?.toFixed(3)}</strong> mA</div>
    </div>
  );
};

const LDRTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8,
      padding: "8px 14px", fontSize: 13, color: TEXT, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div style={{ fontWeight: 600, color: AMBER, marginBottom: 4 }}>{label} lux</div>
      <div>R_LDR = <strong>{payload[0]?.value?.toFixed(2)}</strong> kΩ</div>
    </div>
  );
};

// ─── Slider component ─────────────────────────────────────────────────────────
function Slider({ label, min, max, step, value, onChange, unit, accent, formatValue }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{label}</span>
        <span style={{
          fontSize: 13, fontWeight: 700, color: accent,
          background: `${accent}18`, borderRadius: 6, padding: "2px 8px"
        }}>
          {formatValue ? formatValue(value) : value} {unit}
        </span>
      </div>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: 6,
          background: BORDER, borderRadius: 3, overflow: "hidden"
        }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: `linear-gradient(90deg, ${accent}88, ${accent})`,
            borderRadius: 3
          }} />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute", width: "100%", opacity: 0,
            cursor: "pointer", height: 20, margin: 0
          }}
        />
        <div style={{
          position: "absolute",
          left: `calc(${pct}% - 10px)`,
          width: 20, height: 20, borderRadius: "50%",
          background: accent, border: `3px solid ${CARD}`,
          boxShadow: `0 0 0 2px ${accent}`, pointerEvents: "none"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: MUTED }}>{min} {unit}</span>
        <span style={{ fontSize: 11, color: MUTED }}>{max} {unit}</span>
      </div>
    </div>
  );
}

// ─── Output card ──────────────────────────────────────────────────────────────
function OutputCard({ label, value, unit, accent, sub }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 12, padding: "16px 20px", flex: 1, minWidth: 140,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    }}>
      <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{unit}</div>
      {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 6, borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ─── Photodiode Mode ──────────────────────────────────────────────────────────
function PhotodiodeMode() {
  const [lux, setLux] = useState(500);
  const [vbias, setVbias] = useState(5);

  const iph = Kph * lux; // mA
  const responsivity = Kph; // constant = 0.5 mA/lux

  // Build chart data: Illuminance vs Photocurrent
  const chartData = useMemo(() => {
    const pts = [];
    for (let e = 0; e <= 1000; e += 20) {
      pts.push({ lux: e, iph: parseFloat((Kph * e).toFixed(4)) });
    }
    return pts;
  }, []);

  const operatingIph = parseFloat((Kph * lux).toFixed(4));

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* Controls panel */}
      <div style={{
        background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 14, padding: 24, flex: "0 0 300px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${TEAL}18`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>💡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Parameters</div>
            <div style={{ fontSize: 12, color: MUTED }}>Adjust simulation inputs</div>
          </div>
        </div>

        <Slider
          label="Light Intensity (E)"
          min={0} max={1000} step={10} value={lux}
          onChange={setLux} unit="lux" accent={TEAL}
        />
        <Slider
          label="Reverse Bias Voltage"
          min={0} max={20} step={0.5} value={vbias}
          onChange={setVbias} unit="V" accent={TEAL}
        />

        {/* Physics equations box */}
        <div style={{
          background: BG, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: 14, marginTop: 8
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Physics Model
          </div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, fontFamily: "monospace" }}>
            <div>I<sub>ph</sub> = K<sub>ph</sub> × E</div>
            <div>K<sub>ph</sub> = 0.5 mA/lux</div>
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 6, paddingTop: 6 }}>
              E = {lux} lux
            </div>
            <div>V<sub>bias</sub> = {vbias} V (reverse)</div>
          </div>
        </div>

        {/* Behavior note */}
        <div style={{
          background: `${TEAL}0d`, border: `1px solid ${TEAL}30`,
          borderRadius: 8, padding: 10, marginTop: 12, fontSize: 11, color: TEAL
        }}>
          ℹ️ In photoconductive mode, I<sub>ph</sub> is nearly independent of reverse bias voltage.
          The photocurrent is purely proportional to incident illuminance.
        </div>
      </div>

      {/* Right: outputs + graph */}
      <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Output cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <OutputCard
            label="Photocurrent (Iph)"
            value={iph.toFixed(3)}
            unit="mA"
            accent={TEAL}
            sub={`= ${Kph} mA/lux × ${lux} lux`}
          />
          <OutputCard
            label="Responsivity"
            value={responsivity.toFixed(3)}
            unit="mA / lux"
            accent="#2196a8"
            sub="R = Iph / E (constant for PIN photodiode)"
          />
          <OutputCard
            label="Reverse Bias"
            value={vbias}
            unit="V"
            accent="#4a90b8"
            sub="Photoconductive mode active"
          />
        </div>

        {/* Chart */}
        <div style={{
          background: CARD, border: `1px solid ${BORDER}`,
          borderRadius: 14, padding: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
        }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
              Illuminance vs Photocurrent
            </div>
            <div style={{ fontSize: 12, color: MUTED }}>
              Linear relationship — I<sub>ph</sub> = K<sub>ph</sub> × E
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${BORDER}`} />
              <XAxis
                dataKey="lux"
                stroke={MUTED}
                tick={{ fontSize: 11, fill: MUTED }}
              >
                <Label value="Illuminance (lux)" position="insideBottom" offset={-18} style={{ fontSize: 12, fill: MUTED }} />
              </XAxis>
              <YAxis
                stroke={MUTED}
                tick={{ fontSize: 11, fill: MUTED }}
                tickFormatter={(v) => `${v}`}
              >
                <Label value="Iph (mA)" angle={-90} position="insideLeft" offset={10} style={{ fontSize: 12, fill: MUTED }} />
              </YAxis>
              <Tooltip content={<PhotoTooltip />} />
              <Line
                type="linear"
                dataKey="iph"
                stroke={TEAL}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: TEAL }}
              />
              {/* Operating point */}
              <ReferenceDot
                x={lux}
                y={operatingIph}
                r={7}
                fill={TEAL}
                stroke={CARD}
                strokeWidth={2}
                label={{
                  value: `(${lux}, ${operatingIph.toFixed(2)})`,
                  position: lux < 700 ? "right" : "left",
                  fontSize: 11,
                  fill: TEAL,
                  fontWeight: 700
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── LDR Mode ─────────────────────────────────────────────────────────────────
function LDRMode() {
  const [lux, setLux] = useState(100);
  const [rLoad, setRLoad] = useState(10); // kΩ

  const rLDR  = ldrResistanceKOhm(lux);
  const vOut  = vout(lux, rLoad);
  const iLDR  = (VCC / (rLDR + rLoad)) * 1000; // mA (through divider)

  // Build chart: 1..1000 lux vs R_LDR (kΩ)
  const chartData = useMemo(() => {
    const pts = [];
    for (let e = 1; e <= 1000; e += 10) {
      pts.push({
        lux: e,
        resistance: parseFloat(ldrResistanceKOhm(e).toFixed(3))
      });
    }
    return pts;
  }, []);

  // Build Vout vs Lux chart data (depends on rLoad)
  const voutChartData = useMemo(() => {
    const pts = [];
    for (let e = 1; e <= 1000; e += 10) {
      pts.push({ lux: e, vout: parseFloat(vout(e, rLoad).toFixed(4)) });
    }
    return pts;
  }, [rLoad]);

  const opR = parseFloat(rLDR.toFixed(3));

  const rLabel = rLDR >= 1000
    ? `${(rLDR / 1000).toFixed(1)} MΩ`
    : rLDR < 1
    ? `${(rLDR * 1000).toFixed(0)} Ω`
    : `${rLDR.toFixed(2)} kΩ`;

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* Controls panel */}
      <div style={{
        background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 14, padding: 24, flex: "0 0 300px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${AMBER}18`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>☀️</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Parameters</div>
            <div style={{ fontSize: 12, color: MUTED }}>Adjust simulation inputs</div>
          </div>
        </div>

        <Slider
          label="Light Intensity (E)"
          min={1} max={1000} step={1} value={lux}
          onChange={setLux} unit="lux" accent={AMBER}
        />
        <Slider
          label="Load Resistance (R_load)"
          min={1} max={100} step={1} value={rLoad}
          onChange={setRLoad} unit="kΩ" accent={AMBER}
        />

        {/* Voltage divider diagram */}
        <div style={{
          background: BG, border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: 14, marginTop: 8
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Voltage Divider Circuit
          </div>
          {/* ASCII-ish diagram */}
          <div style={{ fontFamily: "monospace", fontSize: 11, color: TEXT, lineHeight: 1.9 }}>
            <div>VCC (+5V)</div>
            <div style={{ color: MUTED }}>  │</div>
            <div>┌─┴─┐  R_LDR = {rLabel}</div>
            <div style={{ color: MUTED }}>└─┬─┘</div>
            <div style={{ color: AMBER }}>  ├──── Vout = {vOut.toFixed(3)} V</div>
            <div style={{ color: MUTED }}>┌─┴─┐</div>
            <div>│R_L│  {rLoad} kΩ</div>
            <div style={{ color: MUTED }}>└─┬─┘</div>
            <div>GND</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: MUTED, fontFamily: "monospace" }}>
            <div>R = K / E<sup>γ</sup></div>
            <div>K=500000, γ=0.7</div>
            <div>V<sub>out</sub> = V<sub>cc</sub>·R<sub>L</sub>/(R<sub>LDR</sub>+R<sub>L</sub>)</div>
          </div>
        </div>

        <div style={{
          background: `${AMBER}0d`, border: `1px solid ${AMBER}30`,
          borderRadius: 8, padding: 10, marginTop: 12, fontSize: 11, color: AMBER
        }}>
          ℹ️ At high lux (bright), R_LDR is low → Vout rises. At low lux (dark), R_LDR is high → Vout falls.
        </div>
      </div>

      {/* Right: outputs + graph */}
      <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Output cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <OutputCard
            label="LDR Resistance"
            value={
              rLDR >= 1000
                ? `${(rLDR / 1000).toFixed(2)} MΩ`
                : rLDR < 1
                ? `${(rLDR * 1000).toFixed(0)} Ω`
                : `${rLDR.toFixed(2)} kΩ`
            }
            unit=""
            accent={AMBER}
            sub={`R = 500000 / ${lux}^0.7`}
          />
          <OutputCard
            label="Output Voltage (Vout)"
            value={vOut.toFixed(3)}
            unit="V"
            accent="#d4890a"
            sub={`Vcc=${VCC}V, R_L=${rLoad}kΩ`}
          />
          <OutputCard
            label="Divider Current"
            value={iLDR.toFixed(3)}
            unit="mA"
            accent="#b85c20"
            sub="I = Vcc / (R_LDR + R_L)"
          />
        </div>

        {/* LDR Graph */}
        <div style={{
          background: CARD, border: `1px solid ${BORDER}`,
          borderRadius: 14, padding: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
        }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
              Illuminance vs LDR Resistance
            </div>
            <div style={{ fontSize: 12, color: MUTED }}>
              R = K / E<sup>γ</sup> — exponential decay (log-log linear)
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis
                dataKey="lux"
                stroke={MUTED}
                tick={{ fontSize: 11, fill: MUTED }}
              >
                <Label value="Illuminance (lux)" position="insideBottom" offset={-18} style={{ fontSize: 12, fill: MUTED }} />
              </XAxis>
              <YAxis
                stroke={MUTED}
                tick={{ fontSize: 11, fill: MUTED }}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}M` : `${v}k`}
              >
                <Label value="R_LDR (kΩ)" angle={-90} position="insideLeft" offset={-5} style={{ fontSize: 12, fill: MUTED }} />
              </YAxis>
              <Tooltip content={<LDRTooltip />} />
              <Line
                type="monotone"
                dataKey="resistance"
                stroke={AMBER}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: AMBER }}
              />
              {/* Operating point */}
              <ReferenceDot
                x={lux}
                y={opR}
                r={7}
                fill={AMBER}
                stroke={CARD}
                strokeWidth={2}
                label={{
                  value: `(${lux}lx, ${opR > 999 ? (opR/1000).toFixed(1)+"M" : opR.toFixed(1)+"k"}Ω)`,
                  position: lux < 600 ? "right" : "left",
                  fontSize: 10,
                  fill: AMBER,
                  fontWeight: 700
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Vout vs Lux mini chart */}
          <div style={{ marginTop: 20, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
              Illuminance vs Output Voltage (Vout)
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
              At R_load = {rLoad} kΩ, Vcc = {VCC}V
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={voutChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="lux" stroke={MUTED} tick={{ fontSize: 10, fill: MUTED }}>
                  <Label value="Illuminance (lux)" position="insideBottom" offset={-18} style={{ fontSize: 11, fill: MUTED }} />
                </XAxis>
                <YAxis domain={[0, VCC]} stroke={MUTED} tick={{ fontSize: 10, fill: MUTED }}>
                  <Label value="Vout (V)" angle={-90} position="insideLeft" offset={10} style={{ fontSize: 11, fill: MUTED }} />
                </YAxis>
                <Tooltip
                  formatter={(v) => [`${v} V`, "Vout"]}
                  labelFormatter={(l) => `${l} lux`}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${BORDER}` }}
                />
                <Line
                  type="monotone"
                  dataKey="vout"
                  stroke="#d4890a"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#d4890a" }}
                />
                <ReferenceDot
                  x={lux}
                  y={parseFloat(vOut.toFixed(4))}
                  r={6}
                  fill="#d4890a"
                  stroke={CARD}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PhotodiodeLDRSim() {
  const [mode, setMode] = useState("photodiode"); // "photodiode" | "ldr"

  const accent = mode === "photodiode" ? TEAL : AMBER;

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: BG,
      minHeight: "100vh",
      padding: 24,
      color: TEXT,
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: "20px 28px",
        marginBottom: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: accent, letterSpacing: "-0.02em" }}>
              {mode === "photodiode" ? "📷 Photodiode" : "☀️ LDR"} Simulation
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: MUTED }}>
              {mode === "photodiode"
                ? "Silicon PIN photodiode — photocurrent vs. illuminance model"
                : "Light Dependent Resistor — empirical resistance model with voltage divider"}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: "flex",
            background: BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 4,
            gap: 4
          }}>
            <button
              onClick={() => setMode("photodiode")}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                transition: "all 0.2s",
                background: mode === "photodiode" ? TEAL : "transparent",
                color: mode === "photodiode" ? "#fff" : MUTED,
                boxShadow: mode === "photodiode" ? "0 2px 8px rgba(31,122,114,0.35)" : "none"
              }}
            >
              💡 Photodiode
            </button>
            <button
              onClick={() => setMode("ldr")}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                transition: "all 0.2s",
                background: mode === "ldr" ? AMBER : "transparent",
                color: mode === "ldr" ? "#fff" : MUTED,
                boxShadow: mode === "ldr" ? "0 2px 8px rgba(193,113,47,0.35)" : "none"
              }}
            >
              ☀️ LDR
            </button>
          </div>
        </div>

        {/* Mode indicator strip */}
        <div style={{
          display: "flex", gap: 24, marginTop: 16,
          paddingTop: 14, borderTop: `1px solid ${BORDER}`,
          flexWrap: "wrap"
        }}>
          {mode === "photodiode" ? (
            <>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: TEAL, fontWeight: 700 }}>Model:</span> I<sub>ph</sub> = K<sub>ph</sub> × E
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: TEAL, fontWeight: 700 }}>K<sub>ph</sub>:</span> 0.5 mA/lux
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: TEAL, fontWeight: 700 }}>Range:</span> 0 – 1000 lux
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: TEAL, fontWeight: 700 }}>Max I<sub>sc</sub>:</span> 500 mA
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: AMBER, fontWeight: 700 }}>Model:</span> R = K / E<sup>γ</sup>
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: AMBER, fontWeight: 700 }}>K:</span> 500,000 · γ = 0.7
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: AMBER, fontWeight: 700 }}>Dark (1 lux):</span> ≈ 500 kΩ
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                <span style={{ color: AMBER, fontWeight: 700 }}>Bright (1000 lux):</span> ≈ {ldrResistanceKOhm(1000).toFixed(2)} kΩ
              </div>
            </>
          )}
        </div>
      </div>

      {/* Simulation area */}
      {mode === "photodiode" ? <PhotodiodeMode /> : <LDRMode />}

      {/* Footer */}
      <div style={{
        marginTop: 20, padding: "12px 20px",
        background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 10, fontSize: 11, color: MUTED,
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8
      }}>
        <span>⚡ VLab Physics Engine — Photodiode / LDR Module</span>
        <span>
          {mode === "photodiode"
            ? "Based on ideal PIN photodiode linear model (linear region, no saturation)"
            : "Empirical LDR model: R = K·E⁻ᵞ (GL5516 / ORP12 class sensor)"}
        </span>
      </div>
    </div>
  );
}
