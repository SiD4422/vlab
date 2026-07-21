import React, { useState, useMemo, useRef, useCallback } from "react";

/**
 * InteractiveWiringSim.jsx
 * Virtual Circuit Wiring & Bridge Tuning Simulator
 * Supports: bridgeType = "maxwell" | "schering"
 *
 * Phase 1 — drag/click-to-wire the trainer kit into a Wheatstone bridge topology.
 * Phase 2 — tune sliders to null the headphone (detector) output.
 *
 * Zero external deps beyond React. Pure SVG + inline styles.
 */

// ---------- Node layout (shared topology, matches the physical trainer-kit diagrams) ----------
const NODES = {
  A: { x: 120, y: 250, label: "a" },
  B: { x: 400, y: 80, label: "b" },
  C: { x: 680, y: 250, label: "c" },
  D: { x: 400, y: 420, label: "d" },
  DET: { x: 400, y: 250, label: "Headphone (D)" },
  OSC: { x: 400, y: 495, label: "Oscillator (E)" },
};

// the 8 patch-cord connections that make a correctly wired bridge
const CORRECT_EDGES = [
  ["A", "B"],
  ["B", "C"],
  ["A", "D"],
  ["D", "C"],
  ["B", "DET"],
  ["D", "DET"],
  ["A", "OSC"],
  ["C", "OSC"],
];

const edgeKey = (a, b) => [a, b].sort().join("::");
const CORRECT_SET = new Set(CORRECT_EDGES.map(([a, b]) => edgeKey(a, b)));

// ---------- Bridge-specific content ----------
const CONFIG = {
  maxwell: {
    title: "Maxwell's Inductance Bridge",
    armLabels: {
      "A::B": "R1, L1 (unknown)",
      "B::C": "R3",
      "A::D": "R2, L2 (r2)",
      "C::D": "R4",
    },
    sliders: [
      { key: "R2", label: "R2", unit: "Ω", min: 10, max: 1000, step: 1, def: 200 },
      { key: "R3", label: "R3", unit: "Ω", min: 100, max: 10000, step: 10, def: 2000 },
      { key: "R4", label: "R4", unit: "Ω", min: 100, max: 10000, step: 10, def: 2000 },
      { key: "L2", label: "L2", unit: "mH", min: 1, max: 200, step: 1, def: 60 },
    ],
    genTarget: () => ({
      L1: +(30 + Math.random() * 120).toFixed(1), // mH
      R1: +(50 + Math.random() * 400).toFixed(1), // ohm
      r2: 5, // fixed known series resistance of L2, ohm
    }),
    compute: (s, t) => {
      const L1_calc = (s.R3 / s.R4) * s.L2;
      const R1_calc = (s.R3 / s.R4) * (s.R2 + t.r2);
      const errL = Math.abs(L1_calc - t.L1) / t.L1;
      const errR = Math.abs(R1_calc - t.R1) / t.R1;
      const imbalance = Math.min(5000, ((errL + errR) / 2) * 6000);
      return {
        imbalance,
        results: [
          { label: "L1 (calculated)", value: `${L1_calc.toFixed(2)} mH` },
          { label: "L1 (true)", value: `${t.L1} mH` },
          { label: "R1 (calculated)", value: `${R1_calc.toFixed(1)} Ω` },
          { label: "R1 (true)", value: `${t.R1} Ω` },
        ],
        formula: "L1 = (R3 / R4) · L2      R1 = (R3 / R4) · (R2 + r2)",
      };
    },
  },

  "capacitance-comparison": {
    title: "Capacitance Comparison Bridge",
    armLabels: { "A::B": "C1 (unknown)", "B::C": "R1", "A::D": "C2 (standard)", "C::D": "R2" },
    sliders: [
      { key: "R1", label: "R1", unit: "Ω", min: 10, max: 1000, step: 10, def: 500 },
      { key: "R2", label: "R2", unit: "Ω", min: 10, max: 1000, step: 10, def: 500 },
      { key: "C2", label: "C2", unit: "µF", min: 0.1, max: 10, step: 0.1, def: 1.0 },
    ],
    genTarget: () => ({ C1: +(0.5 + Math.random() * 5).toFixed(1) }),
    compute: (s, t) => {
      const C1_calc = s.C2 * (s.R1 / s.R2);
      const err = Math.abs(C1_calc - t.C1) / t.C1;
      const imbalance = Math.min(5000, err * 10000);
      return {
        imbalance,
        results: [
          { label: "C1 (calculated)", value: `${C1_calc.toFixed(2)} µF` },
          { label: "C1 (true)", value: `${t.C1} µF` }
        ],
        formula: "C1 = C2 · (R1 / R2)"
      };
    }
  },
  "maxwell-inductance": {
    title: "Maxwell's Inductance Bridge",
    armLabels: { "A::B": "L1, R1 (unknown)", "B::C": "R3", "A::D": "L2, R2 (standard)", "C::D": "R4" },
    sliders: [
      { key: "R2", label: "R2", unit: "Ω", min: 10, max: 1000, step: 1, def: 200 },
      { key: "R3", label: "R3", unit: "Ω", min: 10, max: 1000, step: 1, def: 200 },
      { key: "R4", label: "R4", unit: "Ω", min: 10, max: 1000, step: 1, def: 200 },
      { key: "L2", label: "L2", unit: "mH", min: 10, max: 200, step: 1, def: 50 },
    ],
    genTarget: () => ({ L1: +(20 + Math.random() * 100).toFixed(1), R1: +(30 + Math.random() * 150).toFixed(1) }),
    compute: (s, t) => {
      const L1_calc = s.L2 * (s.R3 / s.R4);
      const R1_calc = s.R2 * (s.R3 / s.R4);
      const errL = Math.abs(L1_calc - t.L1) / t.L1;
      const errR = Math.abs(R1_calc - t.R1) / t.R1;
      return {
        imbalance: Math.min(5000, ((errL + errR) / 2) * 8000),
        results: [
          { label: "L1 (calculated)", value: `${L1_calc.toFixed(1)} mH` }, { label: "L1 (true)", value: `${t.L1} mH` },
          { label: "R1 (calculated)", value: `${R1_calc.toFixed(1)} Ω` }, { label: "R1 (true)", value: `${t.R1} Ω` }
        ],
        formula: "L1 = L2(R3/R4)      R1 = R2(R3/R4)"
      };
    }
  },
  "hays": {
    title: "Hay's Bridge",
    armLabels: { "A::B": "L1, R1 (unknown)", "B::C": "R3", "A::D": "R2, C2 (series)", "C::D": "R4" },
    sliders: [
      { key: "R2", label: "R2", unit: "Ω", min: 10, max: 2000, step: 10, def: 500 },
      { key: "R3", label: "R3", unit: "Ω", min: 10, max: 2000, step: 10, def: 500 },
      { key: "R4", label: "R4", unit: "Ω", min: 10, max: 2000, step: 10, def: 500 },
      { key: "C2", label: "C2", unit: "µF", min: 0.1, max: 5, step: 0.1, def: 1.0 },
    ],
    genTarget: () => ({ L1: +(50 + Math.random() * 200).toFixed(1), R1: +(20 + Math.random() * 80).toFixed(1) }),
    compute: (s, t) => {
      const omega = 2 * Math.PI * 1000;
      const denom = 1 + Math.pow(omega * (s.C2*1e-6) * s.R2, 2);
      const L1_calc = (s.R3 * s.R4 * (s.C2*1e-6)) / denom * 1000; // in mH
      const R1_calc = (omega * omega * Math.pow(s.C2*1e-6, 2) * s.R2 * s.R3 * s.R4) / denom;
      const errL = Math.abs(L1_calc - t.L1) / t.L1;
      const errR = Math.abs(R1_calc - t.R1) / t.R1;
      return {
        imbalance: Math.min(5000, ((errL + errR) / 2) * 8000),
        results: [
          { label: "L1 (calc)", value: `${L1_calc.toFixed(1)} mH` }, { label: "L1 (true)", value: `${t.L1} mH` },
          { label: "R1 (calc)", value: `${R1_calc.toFixed(1)} Ω` }, { label: "R1 (true)", value: `${t.R1} Ω` }
        ],
        formula: "L1 = (R3 R4 C2)/(1 + (ω C2 R2)²)"
      };
    }
  },
  "wiens": {
    title: "Wien's Bridge",
    armLabels: { "A::B": "C1, R1 (series)", "B::C": "R3", "A::D": "C2, R2 (parallel)", "C::D": "R4" },
    sliders: [
      { key: "R2", label: "R2", unit: "Ω", min: 100, max: 10000, step: 100, def: 1000 },
      { key: "R3", label: "R3", unit: "Ω", min: 100, max: 10000, step: 100, def: 2000 },
      { key: "R4", label: "R4", unit: "Ω", min: 100, max: 10000, step: 100, def: 1000 },
      { key: "C2", label: "C2", unit: "µF", min: 0.01, max: 1, step: 0.01, def: 0.1 },
    ],
    genTarget: () => ({ f: +(500 + Math.random() * 1500).toFixed(0) }), // target frequency
    compute: (s, t) => {
      // Assuming C1=C2, R1=R2 for balance condition simplification (often true in basic setups)
      // Actual frequency f = 1 / (2π√(R1 R2 C1 C2))
      const f_calc = 1 / (2 * Math.PI * s.R2 * (s.C2 * 1e-6));
      const errF = Math.abs(f_calc - t.f) / t.f;
      return {
        imbalance: Math.min(5000, errF * 15000),
        results: [
          { label: "Freq (calc)", value: `${f_calc.toFixed(0)} Hz` },
          { label: "Freq (true)", value: `${t.f} Hz` }
        ],
        formula: "f = 1 / (2π√(R1 R2 C1 C2))"
      };
    }
  },
  "kelvin": {
    title: "Kelvin Bridge",
    armLabels: { "A::B": "Rx (unknown)", "B::C": "R2", "A::D": "Rs (standard)", "C::D": "R1" },
    sliders: [
      { key: "R1", label: "R1", unit: "Ω", min: 1, max: 1000, step: 1, def: 100 },
      { key: "R2", label: "R2", unit: "Ω", min: 1, max: 1000, step: 1, def: 100 },
      { key: "Rs", label: "Rs", unit: "mΩ", min: 0.1, max: 10, step: 0.1, def: 1.0 },
    ],
    genTarget: () => ({ Rx: +(0.1 + Math.random() * 5).toFixed(2) }), // in mΩ
    compute: (s, t) => {
      const Rx_calc = s.Rs * (s.R1 / s.R2);
      const err = Math.abs(Rx_calc - t.Rx) / t.Rx;
      return {
        imbalance: Math.min(5000, err * 20000),
        results: [
          { label: "Rx (calc)", value: `${Rx_calc.toFixed(3)} mΩ` },
          { label: "Rx (true)", value: `${t.Rx} mΩ` }
        ],
        formula: "Rx = Rs · (R1 / R2)"
      };
    }
  },
  schering: {
    title: "Schering's Capacitance Bridge",
    armLabels: {
      "A::B": "Cx, r1 (unknown)",
      "B::C": "R3",
      "A::D": "C2",
      "C::D": "R4 ‖ C4",
    },
    sliders: [
      { key: "R3", label: "R3", unit: "Ω", min: 100, max: 10000, step: 10, def: 2000 },
      { key: "R4", label: "R4", unit: "Ω", min: 100, max: 10000, step: 10, def: 2000 },
      { key: "C2", label: "C2", unit: "µF", min: 0.01, max: 1, step: 0.01, def: 0.2 },
      { key: "C4", label: "C4", unit: "µF", min: 0.001, max: 0.5, step: 0.001, def: 0.05 },
    ],
    genTarget: () => ({
      Cx: +(0.05 + Math.random() * 0.4).toFixed(3), // µF
      D: +(0.01 + Math.random() * 0.08).toFixed(3), // dissipation factor, dimensionless
    }),
    compute: (s, t) => {
      const omega = 2 * Math.PI * 1000; // simulator assumes 1 kHz test frequency
      const Cx_calc = s.C2 * (s.R4 / s.R3);
      const D_calc = omega * (s.C4 * 1e-6) * s.R4;
      const errC = Math.abs(Cx_calc - t.Cx) / t.Cx;
      const errD = Math.abs(D_calc - t.D) / t.D;
      const imbalance = Math.min(5000, ((errC + errD) / 2) * 6000);
      return {
        imbalance,
        results: [
          { label: "Cx (calculated)", value: `${Cx_calc.toFixed(3)} µF` },
          { label: "Cx (true)", value: `${t.Cx} µF` },
          { label: "D (calculated)", value: D_calc.toFixed(4) },
          { label: "D (true)", value: t.D },
        ],
        formula: "Cx = C2 · (R4 / R3)      D = tan δ = ω · C4 · R4",
      };
    },
  },
};

export default function InteractiveWiringSim({ bridgeType = "maxwell" }) {
  const cfg = CONFIG[bridgeType] ?? CONFIG.maxwell;

  const [wires, setWires] = useState([]); // [{a,b}]
  const [pending, setPending] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const svgRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const [wiringOk, setWiringOk] = useState(false);
  const target = useRef(cfg.genTarget()).current;

  const [sliderVals, setSliderVals] = useState(
    Object.fromEntries(cfg.sliders.map((s) => [s.key, s.def]))
  );

  const wrongSet = useMemo(() => {
    if (!checked) return new Set();
    const bad = new Set();
    wires.forEach((w, i) => {
      if (!CORRECT_SET.has(edgeKey(w.a, w.b))) bad.add(i);
    });
    return bad;
  }, [checked, wires]);

  const correctCount = useMemo(() => {
    const have = new Set(wires.map((w) => edgeKey(w.a, w.b)));
    let n = 0;
    CORRECT_SET.forEach((k) => {
      if (have.has(k)) n += 1;
    });
    return n;
  }, [wires]);

  const handleTerminalDown = useCallback((id) => {
    if (wiringOk) return;
    if (pending && pending !== id) {
      const key = edgeKey(pending, id);
      const exists = wires.some((w) => edgeKey(w.a, w.b) === key);
      if (!exists) {
        setWires((prev) => [...prev, { a: pending, b: id }]);
      }
      setPending(null);
      setChecked(false);
      setMousePos(null);
      return;
    }
    if (pending === id) {
      setPending(null);
      setMousePos(null);
      return;
    }
    setPending(id);
  }, [pending, wires, wiringOk]);

  const handleTerminalUp = (e, id) => {
    if (wiringOk) return;
    e.stopPropagation();
    if (pending && pending !== id && mousePos) {
      const key = edgeKey(pending, id);
      const exists = wires.some((w) => edgeKey(w.a, w.b) === key);
      if (!exists) {
        setWires((prev) => [...prev, { a: pending, b: id }]);
      }
      setPending(null);
      setChecked(false);
      setMousePos(null);
    } else if (pending && pending === id && mousePos) {
      setMousePos(null);
    }
  };

  const handleGlobalMove = useCallback((e) => {
    if (!pending || wiringOk || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    // Support both mouse and touch events
    pt.x = e.clientX ?? (e.touches && e.touches[0].clientX);
    pt.y = e.clientY ?? (e.touches && e.touches[0].clientY);
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    setMousePos({ x: svgP.x, y: svgP.y });
  }, [pending, wiringOk]);

  const handleGlobalUp = useCallback(() => {
    if (pending && mousePos) {
      setPending(null);
      setMousePos(null);
    }
  }, [pending, mousePos]);

  const removeWire = (idx) => {
    if (wiringOk) return;
    setWires((prev) => prev.filter((_, i) => i !== idx));
    setChecked(false);
  };

  const checkConnections = () => {
    const have = new Set(wires.map((w) => edgeKey(w.a, w.b)));
    const ok =
      have.size === CORRECT_SET.size &&
      [...CORRECT_SET].every((k) => have.has(k)) &&
      wires.length === CORRECT_SET.size;
    setChecked(true);
    setWiringOk(ok);
  };

  const resetWiring = () => {
    setWires([]);
    setPending(null);
    setChecked(false);
    setWiringOk(false);
  };

  const { imbalance, results, formula } = useMemo(
    () => cfg.compute(sliderVals, target),
    [cfg, sliderVals, target]
  );
  const balanced = imbalance < 5;

  return (
    <div style={styles.page}>
      <style>{cssKeyframes}</style>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Virtual Trainer Kit · Bridge Tuning Simulator</div>
        <h1 style={styles.title}>{cfg.title}</h1>
      </div>

      <div style={styles.grid}>
        {/* ---------------- Phase 1 : wiring ---------------- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.stepBadge}>Phase 1</span>
            <span style={styles.cardTitle}>Wire the bridge</span>
            {wiringOk && <span style={styles.okPill}>✓ Wired correctly</span>}
          </div>
          <p style={styles.hint}>
            Click a terminal, then click another to patch a cord between them. Click a
            drawn wire to remove it. Connect the 4 arms, the headphone to b &amp; d, and
            the oscillator to a &amp; c.
          </p>

          <svg 
            ref={svgRef} 
            viewBox="0 0 800 560" 
            style={styles.svg}
            onMouseMove={handleGlobalMove}
            onMouseUp={handleGlobalUp}
            onMouseLeave={handleGlobalUp}
            onTouchMove={handleGlobalMove}
            onTouchEnd={handleGlobalUp}
          >
            {/* arms (static component leads, must also be patched) */}
            {CORRECT_EDGES.filter(([a, b]) => !a.match(/OSC|DET/) && !b.match(/OSC|DET/)).map(
              ([a, b]) => {
                const n1 = NODES[a];
                const n2 = NODES[b];
                const mx = (n1.x + n2.x) / 2;
                const my = (n1.y + n2.y) / 2;
                return (
                  <text
                    key={a + b + "lbl"}
                    x={mx}
                    y={my}
                    dy={a === "A" && b === "D" ? 18 : a === "A" && b === "B" ? -10 : 4}
                    dx={b === "C" ? 18 : -18}
                    style={styles.armLabel}
                  >
                    {cfg.armLabels[edgeKey(a, b).split("::").sort().join("::")] ||
                      cfg.armLabels[`${a}::${b}`]}
                  </text>
                );
              }
            )}

            {/* drawn wires */}
            {wires.map((w, i) => {
              const n1 = NODES[w.a];
              const n2 = NODES[w.b];
              const bad = wrongSet.has(i);
              return (
                <line
                  key={i}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={bad ? "#ff6b6b" : "#4fd1c5"}
                  strokeWidth={4}
                  strokeLinecap="round"
                  onClick={() => removeWire(i)}
                  style={{ cursor: wiringOk ? "default" : "pointer" }}
                  opacity={0.9}
                />
              );
            })}

            {/* pending wire preview */}
            {pending && (
              <>
                <circle
                  cx={NODES[pending].x}
                  cy={NODES[pending].y}
                  r={16}
                  fill="none"
                  stroke="#e0a458"
                  strokeWidth={2}
                  style={{ animation: "pulse 1.2s infinite" }}
                />
                {mousePos && (
                  <line
                    x1={NODES[pending].x}
                    y1={NODES[pending].y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke="#e0a458"
                    strokeWidth={4}
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    opacity={0.8}
                    style={{ pointerEvents: 'none' }}
                  />
                )}
              </>
            )}

            {/* terminals */}
            {Object.entries(NODES).map(([id, n]) => (
              <g
                key={id}
                onMouseDown={() => handleTerminalDown(id)}
                onMouseUp={(e) => handleTerminalUp(e, id)}
                onTouchStart={() => handleTerminalDown(id)}
                onTouchEnd={(e) => handleTerminalUp(e, id)}
                style={{ cursor: wiringOk ? "default" : "pointer" }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={id === "DET" || id === "OSC" ? 20 : 12}
                  fill={id === "DET" || id === "OSC" ? "#1f2937" : "#0f172a"}
                  stroke={pending === id ? "#e0a458" : "#4fd1c5"}
                  strokeWidth={2.5}
                />
                <text
                  x={n.x}
                  y={n.y - (id === "DET" || id === "OSC" ? 28 : 20)}
                  style={styles.nodeLabel}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>

          <div style={styles.rowBetween}>
            <div style={styles.progressText}>
              {correctCount}/{CORRECT_SET.size} correct patch cords
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.btnGhost} onClick={resetWiring} disabled={wiringOk}>
                Reset
              </button>
              <button
                style={styles.btnPrimary}
                onClick={checkConnections}
                disabled={wiringOk}
              >
                Check Connections
              </button>
            </div>
          </div>
          {checked && !wiringOk && (
            <div style={styles.warnBox}>
              Some cords are wrong or missing — bad ones are highlighted red. Fix and
              check again.
            </div>
          )}
        </div>

        {/* ---------------- Phase 2 : tuning ---------------- */}
        <div style={{ ...styles.card, opacity: wiringOk ? 1 : 0.45, pointerEvents: wiringOk ? "auto" : "none" }}>
          <div style={styles.cardHeader}>
            <span style={styles.stepBadge}>Phase 2</span>
            <span style={styles.cardTitle}>Balance the bridge</span>
            {balanced && wiringOk && <span style={styles.okPill}>✓ Balanced</span>}
          </div>

          {!wiringOk && (
            <p style={styles.hint}>Complete Phase 1 wiring to unlock the controls.</p>
          )}

          <fieldset
            disabled={!wiringOk}
            style={{ border: "none", padding: 0, margin: 0 }}
          >
            <div style={styles.meterWrap}>
              <div style={styles.meterLabel}>Headphone output (imbalance)</div>
              <div
                style={{
                  ...styles.meterValue,
                  color: balanced ? "#4fd1c5" : "#e0a458",
                  textShadow: balanced ? "0 0 18px #4fd1c5aa" : "none",
                }}
              >
                {imbalance.toFixed(1)} mV
              </div>
              <div style={styles.meterBarTrack}>
                <div
                  style={{
                    ...styles.meterBarFill,
                    width: `${Math.min(100, (imbalance / 500) * 100)}%`,
                    background: balanced
                      ? "linear-gradient(90deg,#4fd1c5,#2fb9ab)"
                      : "linear-gradient(90deg,#e0a458,#c97a3f)",
                  }}
                />
              </div>
            </div>

            <div style={styles.sliderGrid}>
              {cfg.sliders.map((s) => (
                <div key={s.key} style={styles.sliderRow}>
                  <div style={styles.sliderTop}>
                    <span>{s.label}</span>
                    <span style={styles.sliderVal}>
                      {sliderVals[s.key]} {s.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={sliderVals[s.key]}
                    onChange={(e) =>
                      setSliderVals((v) => ({
                        ...v,
                        [s.key]: parseFloat(e.target.value),
                      }))
                    }
                    style={styles.slider}
                  />
                </div>
              ))}
            </div>

            {balanced && (
              <div style={styles.successBox}>
                <div style={styles.successTitle}>🎧 Null detected — bridge balanced!</div>
                <div style={styles.formula}>{formula}</div>
                <div style={styles.resultsGrid}>
                  {results.map((r) => (
                    <div key={r.label} style={styles.resultChip}>
                      <span style={styles.resultLabel}>{r.label}</span>
                      <span style={styles.resultValue}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  );
}

// ---------- styles ----------
const styles = {
  page: {
    minHeight: "100%",
    width: "100%",
    borderRadius: 16,
    background:
      "radial-gradient(1200px 600px at 10% -10%, #14293355, transparent), linear-gradient(160deg,#0b1220,#0f1b2b 60%,#0b1220)",
    color: "#e5e9f0",
    fontFamily:
      "'Inter','Segoe UI',ui-sans-serif,system-ui,-apple-system,sans-serif",
    padding: "32px 24px",
    boxSizing: "border-box",
  },
  header: { marginBottom: 24, textAlign: "center" },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#7fd1c3",
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: 700, margin: 0, color: "#f4f1ea" },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px,1.2fr) minmax(300px,1fr)",
    gap: 20,
    maxWidth: 1200,
    margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 18,
    padding: 20,
    backdropFilter: "blur(14px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
  stepBadge: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "3px 8px",
    borderRadius: 999,
    background: "rgba(224,164,88,0.18)",
    color: "#e0a458",
    border: "1px solid rgba(224,164,88,0.4)",
  },
  cardTitle: { fontSize: 16, fontWeight: 600, color: "#f4f1ea" },
  okPill: {
    marginLeft: "auto",
    fontSize: 12,
    fontWeight: 600,
    color: "#4fd1c5",
    background: "rgba(79,209,197,0.12)",
    border: "1px solid rgba(79,209,197,0.4)",
    borderRadius: 999,
    padding: "3px 10px",
  },
  hint: { fontSize: 13, color: "#9fb0c3", lineHeight: 1.5, marginTop: 4 },
  svg: { width: "100%", height: "auto", display: "block" },
  armLabel: { fill: "#c9945f", fontSize: 13, fontWeight: 600 },
  nodeLabel: { fill: "#dfe7ef", fontSize: 13, fontWeight: 600, textAnchor: "middle" },
  rowBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 10,
  },
  progressText: { fontSize: 13, color: "#9fb0c3" },
  btnGhost: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#e5e9f0",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  btnPrimary: {
    background: "linear-gradient(135deg,#2fb9ab,#1f8f84)",
    border: "none",
    color: "#04211d",
    fontWeight: 700,
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(47,185,171,0.35)",
  },
  warnBox: {
    marginTop: 10,
    fontSize: 12,
    color: "#ff9b9b",
    background: "rgba(255,107,107,0.1)",
    border: "1px solid rgba(255,107,107,0.35)",
    borderRadius: 10,
    padding: "8px 12px",
  },
  meterWrap: {
    background: "rgba(0,0,0,0.25)",
    borderRadius: 14,
    padding: 16,
    margin: "12px 0 18px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  meterLabel: { fontSize: 12, color: "#9fb0c3", marginBottom: 4 },
  meterValue: { fontSize: 30, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  meterBarTrack: {
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    marginTop: 10,
    overflow: "hidden",
  },
  meterBarFill: { height: "100%", transition: "width 0.25s ease" },
  sliderGrid: { display: "flex", flexDirection: "column", gap: 14 },
  sliderRow: { display: "flex", flexDirection: "column", gap: 4 },
  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#dfe7ef",
  },
  sliderVal: { color: "#e0a458", fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  slider: { width: "100%", accentColor: "#4fd1c5" },
  successBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    background: "rgba(79,209,197,0.08)",
    border: "1px solid rgba(79,209,197,0.4)",
    animation: "glow 1.8s ease-in-out infinite",
  },
  successTitle: { fontWeight: 700, color: "#4fd1c5", marginBottom: 8 },
  formula: {
    fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace",
    fontSize: 12,
    color: "#c9945f",
    marginBottom: 10,
  },
  resultsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  resultChip: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  resultLabel: { fontSize: 11, color: "#9fb0c3" },
  resultValue: { fontSize: 14, fontWeight: 700, color: "#f4f1ea" },
};

const cssKeyframes = `
@keyframes pulse { 0%{opacity:1;} 50%{opacity:0.3;} 100%{opacity:1;} }
@keyframes glow { 0%{box-shadow:0 0 0px rgba(79,209,197,0);} 50%{box-shadow:0 0 24px rgba(79,209,197,0.35);} 100%{box-shadow:0 0 0px rgba(79,209,197,0);} }
`;
