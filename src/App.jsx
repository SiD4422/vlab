import { useState, useEffect } from "react";
import {
  Zap, BookOpen, ClipboardCheck, ListOrdered, Sparkles, MessageSquare,
  Link2, Target, ArrowLeft, Loader2, CheckCircle2, XCircle, Star,
  ChevronRight, Cpu, Menu, X, Activity,
  GraduationCap, Mail, Phone, MapPin, Shield, Globe, Users, Lock
} from "lucide-react";

import StrainGaugeSim from "./simulations/StrainGaugeSim";
import BridgeCircuitsSim from "./simulations/BridgeCircuitsSim";
import InteractiveWiringSim from "./simulations/InteractiveWiringSim";

/* ---------------------------------------------------------------
   DESIGN TOKENS — circuit-board palette: ink navy shell, copper
   accent (component/trace color), teal secondary, warm paper canvas
--------------------------------------------------------------- */
const C = {
  shell: "#121826",      // header / sidebar ink
  shellSoft: "#1c2436",
  canvas: "#eef1ee",     // page background
  card: "#ffffff",
  copper: "#c1712f",
  copperDark: "#8f5320",
  teal: "#1f7a72",
  ink: "#1b2430",
  muted: "#68707c",
  border: "#dfe3df",
  border2: "#2a3346",
};

/* ---------------------------------------------------------------
   EXPERIMENT DATA
--------------------------------------------------------------- */
const EXPERIMENTS = [
  {
    id: "strain-gauge", tag: "SG-01", title: "Strain Gauge Sensor",
    aim: "To understand the working principle and characteristics of a resistive strain gauge sensor.",
    objectives: [
      "Plot strain gauge output voltage against applied load.",
      "Determine the gauge factor experimentally.",
      "Compare quarter, half and full bridge configurations.",
    ],
    theory: [
      "Stress is internal force per unit cross-sectional area; strain ε = ΔL / L is the resulting fractional deformation (dimensionless).",
      "A strain gauge is a resistive element bonded to a surface — as the surface strains, the gauge's resistance changes proportionally.",
      "Gauge factor GF = (ΔR/R) / ε. Metallic foil gauges typically have GF between 2 and 5.",
      "A Wheatstone bridge converts the small resistance change into a measurable output voltage. Full-bridge (4 active arms) gives the highest sensitivity and cancels temperature drift.",
      "A dummy (unstrained) gauge on an adjacent arm is used for temperature compensation.",
    ],
    procedure: [
      "Connect the active gauge in a quarter-bridge configuration with the bridge supply.",
      "Zero-balance the bridge with no load applied.",
      "Apply a series of known calibrated loads to the cantilever beam.",
      "Record the bridge output voltage for each load.",
      "Repeat with half and full bridge wiring and compare sensitivity.",
      "Plot load vs. output voltage and compute the gauge factor from the slope.",
    ],
    references: ["Doebelin, E.O. — Measurement Systems: Application & Design", "COEP Virtual Labs — Sensors Modeling & Simulation Lab"],
    pretest: [
      { q: "What does a strain gauge primarily convert?", options: ["Voltage to current", "Mechanical strain to resistance change", "Light to voltage", "Temperature to frequency"], answer: 1 },
      { q: "Strain (ε) is defined as:", options: ["Force / Area", "ΔL / L", "R / V", "P × t"], answer: 1 },
      { q: "A Wheatstone bridge is used with strain gauges to:", options: ["Amplify light", "Convert ΔR into a measurable voltage", "Store charge", "Generate heat"], answer: 1 },
    ],
    posttest: [
      { q: "Full-bridge configuration compared to quarter-bridge is:", options: ["Less sensitive", "More sensitive & temperature compensated", "Only used for AC signals", "Unrelated to sensitivity"], answer: 1 },
      { q: "A dummy gauge is added mainly to:", options: ["Increase cost", "Compensate for temperature effects", "Reduce gauge factor", "Add noise"], answer: 1 },
      { q: "Typical gauge factor for metallic foil gauges is:", options: ["0.1–0.5", "2–5", "50–100", "1000+"], answer: 1 },
    ],
  },
  {
    id: "bridge-circuits", tag: "LC-02", title: "Measurement of L and C using Bridge Circuits",
    aim: "To design and determine the self-inductance of a given coil using Maxwell's Inductance Bridge, and the unknown capacitance and dissipation factor using Schering's bridge.",
    objectives: ["Determine self-inductance using Maxwell's Bridge.", "Determine unknown capacitance using Schering's bridge.", "Calculate the dissipation factor using Schering's bridge."],
    theory: [
      "Maxwell's Inductance Bridge measures an unknown inductance by comparison with a variable standard self-inductance.",
      "At balance for Maxwell's bridge, the unknown inductance is: L1 = (R3/R4) * L2",
      "The unknown internal resistance for Maxwell's bridge is: R1 = (R3/R4) * (R2 + r2)",
      "Schering's Bridge is a widely used bridge circuit for the precise measurement of capacitance and dissipation factor.",
      "At balance for Schering's bridge, the unknown capacitance is: Cx = C2 * (R4/R3)",
      "The dissipation factor (D1) in Schering's bridge is defined as Tan δ = ω * C1 * r1",
      "By substituting the balance equations, the dissipation factor simplifies directly to: D = ω * C4 * R4, where ω is the angular frequency (2πf) of the AC oscillator."
    ],
    procedure: [
      "Connect the circuit as per the Maxwell's bridge or Schering's bridge diagram.",
      "Connect the unknown inductance (L1) or capacitance (Cx) to the respective terminals.",
      "Connect the headphone between the ground and the output of the imbalance amplifier.",
      "Initially keep R3 at some value and vary R4 or R2 to achieve the balanced condition.",
      "Check the balanced condition with the help of the headphone (minimum sound).",
      "Note down all the values and calculate the unknown L or C using the derived formulas."
    ],
    references: ["Doebelin, E.O. — Measurement Systems", "Laboratory Manual: Dept. of EEE, SRM University"],
    pretest: [
      { q: "[Easy] The Maxwell inductance bridge compares an unknown inductance against a:", options: ["Standard variable inductance", "Standard variable capacitance", "Standard variable resistance", "Standard variable voltage"], answer: 0 },
      { q: "[Easy] Schering's bridge is widely recognized for measuring capacitance and:", options: ["Dissipation factor", "Frequency", "Mutual inductance", "Voltage"], answer: 0 },
      { q: "[Easy] Which component is typically used as a null detector in an audio-frequency AC bridge?", options: ["Galvanometer", "Headphone", "DC Ammeter", "Electrometer"], answer: 1 },
      { q: "[Easy] The main objective of balancing an AC bridge is to obtain:", options: ["Maximum voltage across the arms", "Minimum or zero signal at the detector", "Maximum current in the bridge", "Minimum overall resistance"], answer: 1 },
      { q: "[Medium] For an AC bridge to be perfectly balanced, what must be true about the arms?", options: ["The sum of their complex impedances must be equal", "The product of the complex impedances of opposite arms must be exactly equal", "Only the magnitudes of opposite arms must be equal", "Only the phase angles must be equal"], answer: 1 },
      { q: "[Medium] In a Maxwell bridge, if the resistance R3 is doubled while balancing a new unknown inductor, what happens to the calculated value of L1?", options: ["It is halved", "It is doubled", "It is squared", "It remains the same"], answer: 1 },
      { q: "[Medium] The dissipation factor (D) of a capacitor is mathematically defined as:", options: ["Tan δ", "Sin δ", "Cos δ", "Sec δ"], answer: 0 },
      { q: "[Medium] What is the primary reason a DC voltage source cannot be used to operate a Schering bridge?", options: ["DC damages the standard capacitor", "Capacitors block DC current, preventing bridge operation", "Resistors overheat with DC", "DC causes severe magnetic interference"], answer: 1 },
      { q: "[Hard] Why does the standard Maxwell inductance bridge (L vs L) suffer when measuring unknown coils?", options: ["The required standard variable inductor becomes excessively bulky, expensive, and prone to magnetic interference", "The sliding balance effect completely prevents convergence", "It requires a standard capacitor instead", "The null detector cannot detect the resulting high frequencies"], answer: 0 },
      { q: "[Hard] If the frequency of the AC oscillator in a Maxwell bridge is inadvertently doubled during measurement, how does this affect the final balanced value of the unknown inductance L1?", options: ["L1 is halved", "L1 is doubled", "L1 remains completely unchanged because the balance equations are frequency-independent", "The bridge permanently loses balance"], answer: 2 },
      { q: "[Hard] Why is a Wagner Earth connection essential when measuring very small capacitances (e.g., < 100 pF) at high frequencies with a Schering bridge?", options: ["To increase the oscillator frequency", "To safely ground the high voltage supply", "To eliminate measurement errors caused by stray earth capacitances at the detector nodes", "To amplify the microscopic null detector signal"], answer: 2 },
      { q: "[Hard] Based on the Schering bridge balance equation (Cx = C2 * R4/R3), what is the most effective way to measure a significantly larger unknown capacitance Cx without changing the physical standard capacitor C2?", options: ["Decrease the oscillator frequency", "Increase the oscillator voltage", "Increase R4 while decreasing R3", "Increase R3 while keeping R4 constant"], answer: 2 },
      { q: "[Hard] A Schering bridge is balancing a capacitor with an extremely high dissipation factor. To achieve balance, the parallel tuning capacitor C4 must be:", options: ["Set to exactly zero", "Made very small", "Made relatively large", "Replaced with an inductor"], answer: 2 },
      { q: "[Hard] What specific type of standard capacitor is typically used for C2 in a high-voltage Schering bridge to ensure zero internal dielectric loss?", options: ["Electrolytic capacitor", "Ceramic disk capacitor", "Compressed gas (SF6) or air capacitor", "Tantalum capacitor"], answer: 2 },
      { q: "[Hard] If stray alternating magnetic fields couple into the unshielded arms of an AC bridge, what type of error is predominantly introduced?", options: ["Purely resistive error", "Frequency shift error", "Mutual inductance error shifting the null point", "DC offset error"], answer: 2 }
    ],
    posttest: [
      { q: "[Easy] At exact balance, the sound in the headphone null detector is:", options: ["Maximum", "Minimum or zero", "Pulsating", "High pitch"], answer: 1 },
      { q: "[Easy] The standard unit of the dissipation factor (D) is:", options: ["Farads", "Ohms", "Hertz", "Dimensionless (Unitless)"], answer: 3 },
      { q: "[Easy] Which bridge is best suited for measuring the capacitance of an underground high-voltage cable?", options: ["Maxwell Bridge", "Schering Bridge", "Wheatstone Bridge", "Kelvin Double Bridge"], answer: 1 },
      { q: "[Easy] The angular frequency (ω) of the oscillator is calculated from the frequency (f) using the formula:", options: ["ω = 2πf", "ω = f/2π", "ω = πf", "ω = f²"], answer: 0 },
      { q: "[Medium] In Schering's bridge, the dissipation factor (D) is calculated exactly as:", options: ["ω * C4 * R4", "1 / (ω * C4 * R4)", "R4 / C4", "ω * C2 * R3"], answer: 0 },
      { q: "[Medium] If a bridge uses an AC oscillator source of exactly 1 kHz, what is the approximate angular frequency (ω) in rad/s?", options: ["314 rad/s", "1000 rad/s", "3141 rad/s", "6283 rad/s"], answer: 3 },
      { q: "[Medium] What is the effect of severe harmonics in the AC oscillator waveform on the bridge balance?", options: ["No effect whatsoever", "The fundamental frequency balances perfectly, but harmonics cause a residual humming noise at the null point", "The bridge balances at a completely different, incorrect point", "It permanently damages the headphone detector"], answer: 1 },
      { q: "[Medium] In a Maxwell-Wien bridge (the modified Maxwell bridge), the unknown inductance is measured in terms of a standard:", options: ["Inductor", "Resistor", "Capacitor", "Transformer"], answer: 2 },
      { q: "[Hard] For a Schering bridge measuring a high-voltage power bushing, why are the unknown capacitor (Cx) and standard capacitor (C2) placed adjacent to the high voltage source, while R3 and R4 are placed near ground?", options: ["To minimize resistance heating", "To protect the operator and null detector from dangerous high voltages", "To prevent the capacitors from discharging", "To increase the overall bridge sensitivity"], answer: 1 },
      { q: "[Hard] The Maxwell bridge relies on the complex phase balance condition. If one arm is purely resistive (phase angle = 0°), what must be true about the opposite arm to achieve balance?", options: ["It must also be purely resistive", "It must be purely inductive", "It must be purely capacitive", "It must be a short circuit"], answer: 0 },
      { q: "[Hard] If the null detector in a Schering bridge uses an unshielded cable, stray capacitance to ground acts in parallel with which bridge component, causing the largest measurement error?", options: ["The high voltage AC source", "The unknown capacitance Cx", "The low voltage detector arms (R3, C4/R4)", "The standard high-voltage capacitor C2"], answer: 2 },
      { q: "[Hard] Why does the Maxwell bridge suffer from 'sliding balance' when measuring coils with a high Q-factor (Q > 10)?", options: ["The independent balance controls (R and L) become highly interdependent, requiring continuous alternating adjustments that converge extremely slowly", "The standard capacitor cannot handle the resulting resonance voltage", "The null detector saturates completely", "The oscillator frequency drifts rapidly under high Q loads"], answer: 0 },
      { q: "[Hard] To completely avoid sliding balance issues when measuring high-Q coils, which bridge topology is preferred over the Maxwell bridge?", options: ["Schering Bridge", "Wien Bridge", "Hay Bridge", "Kelvin Double Bridge"], answer: 2 },
      { q: "[Hard] In the mathematical derivation of the Schering bridge balance, equating the imaginary parts of the admittance products directly yields which parameter?", options: ["The unknown resistance r1", "The unknown capacitance Cx", "The dissipation factor", "The oscillator frequency"], answer: 1 },
      { q: "[Hard] If a standard gas-filled capacitor C2 in a Schering bridge is strictly ideal and loss-free, its impedance phase angle is exactly:", options: ["0 degrees", "45 degrees", "-90 degrees", "90 degrees"], answer: 2 }
    ],
  },
  {
    id: "wheatstone-bridge", tag: "WB-03", title: "Wheatstone Bridge",
    aim: "To study the Wheatstone bridge as a method for precision resistance measurement.",
    objectives: ["Verify the bridge balance condition.", "Measure an unknown resistance using balance method.", "Study bridge sensitivity to small resistance changes."],
    theory: [
      "A Wheatstone bridge has four resistive arms R1, R2, R3, R4 with a galvanometer across the bridge diagonal.",
      "Balance condition: R1/R2 = R3/R4, which gives zero galvanometer deflection.",
      "An unknown resistance can be found precisely by adjusting a known arm until balance is achieved.",
      "When one arm's resistance changes slightly (as with a strain gauge), the bridge becomes unbalanced and produces an output proportional to that change.",
      "Bridge sensitivity depends on arm resistance ratios and the excitation voltage.",
    ],
    procedure: [
      "Set up the four-arm bridge with a known unknown resistor in one arm.",
      "Adjust the variable arm until the galvanometer reads zero.",
      "Compute the unknown resistance from the balance equation.",
      "Introduce a small resistance change and record the resulting unbalance voltage.",
      "Repeat for different excitation voltages and compare sensitivity.",
    ],
    references: ["Sawhney, A.K. — Electrical & Electronic Measurements"],
    pretest: [
      { q: "Wheatstone bridge balance condition is:", options: ["R1+R2 = R3+R4", "R1/R2 = R3/R4", "R1×R2 = R3×R4", "R1−R2 = R3"], answer: 1 },
      { q: "At balance, the galvanometer reads:", options: ["Maximum", "Zero", "Infinity", "Negative"], answer: 1 },
    ],
    posttest: [
      { q: "Bridge sensitivity increases with:", options: ["Lower excitation voltage", "Higher excitation voltage", "Removing one arm", "Using DC only"], answer: 1 },
    ],
  },
  {
    id: "thermocouple", tag: "TC-04", title: "Thermocouple",
    aim: "To study temperature measurement using the Seebeck effect in a thermocouple.",
    objectives: ["Plot thermocouple EMF vs. temperature.", "Understand cold-junction compensation.", "Compare linearity across thermocouple types."],
    theory: [
      "The Seebeck effect: a junction of two dissimilar metals generates an EMF proportional to the temperature difference between the junctions.",
      "One junction (measuring) is exposed to the process temperature; the other (reference/cold) is held at a known temperature.",
      "Cold-junction compensation corrects for reference-junction temperature drift so absolute temperature can be inferred.",
      "Common types — K, J, T — differ in metal pairs, usable range and linearity.",
      "Output is small (millivolt range) and mildly nonlinear over wide spans, requiring lookup tables or polynomial correction.",
    ],
    procedure: [
      "Set up the thermocouple with a known reference junction temperature.",
      "Heat the measuring junction through a series of known temperatures.",
      "Record the generated EMF at each temperature.",
      "Plot EMF vs. temperature and compare against standard reference tables.",
    ],
    references: ["Doebelin, E.O. — Measurement Systems", "ASTM thermocouple reference tables"],
    pretest: [
      { q: "Thermocouples work on the principle of:", options: ["Piezoelectric effect", "Seebeck effect", "Hall effect", "Photoelectric effect"], answer: 1 },
      { q: "Cold-junction compensation is needed because:", options: ["The hot junction is unstable", "Reference junction temperature affects the reading", "It increases EMF", "It is optional for accuracy"], answer: 1 },
    ],
    posttest: [
      { q: "Thermocouple output is typically in the range of:", options: ["Millivolts", "Kilovolts", "Amperes", "Ohms"], answer: 0 },
    ],
  },
  {
    id: "rtd", tag: "RT-05", title: "RTD (Pt100)",
    aim: "To study resistance-based temperature measurement using a Platinum RTD.",
    objectives: ["Plot RTD resistance vs. temperature.", "Compare 2-wire, 3-wire and 4-wire configurations."],
    theory: [
      "An RTD exploits the near-linear increase of a pure metal's (usually platinum) resistance with temperature.",
      "A Pt100 has a resistance of 100 Ω at 0 °C, rising by a well-characterized coefficient per degree.",
      "RTDs are more linear and accurate than thermocouples but have slower response and need excitation current.",
      "3-wire and 4-wire configurations cancel lead-wire resistance error present in simple 2-wire hookups.",
    ],
    procedure: [
      "Connect the Pt100 in a 2-wire configuration and record resistance at known temperatures.",
      "Repeat with 3-wire and 4-wire configurations.",
      "Compare measured resistance error across configurations.",
      "Plot resistance vs. temperature and verify near-linearity.",
    ],
    references: ["IEC 60751 — RTD standard", "Doebelin, E.O. — Measurement Systems"],
    pretest: [], posttest: [],
  },
  {
    id: "thermistor", tag: "TH-06", title: "Thermistor",
    aim: "To study the highly nonlinear resistance-temperature characteristic of a thermistor.",
    objectives: ["Plot NTC thermistor resistance vs. temperature.", "Fit the exponential characteristic equation."],
    theory: [
      "A thermistor is a semiconductor resistor with a large temperature coefficient of resistance.",
      "NTC (negative temperature coefficient) thermistors are most common — resistance falls sharply as temperature rises.",
      "Characteristic equation: R = R0 · exp[β(1/T − 1/T0)], where β is the material constant.",
      "Far more sensitive than RTDs over a narrow range, but strongly nonlinear and needs linearization circuitry for wide-range use.",
    ],
    procedure: [
      "Immerse the thermistor in a temperature-controlled bath.",
      "Record resistance at a series of known temperatures.",
      "Plot R vs. T and fit against the exponential model to extract β.",
    ],
    references: ["Doebelin, E.O. — Measurement Systems"],
    pretest: [], posttest: [],
  },
  {
    id: "photodiode-ldr", tag: "PD-07", title: "Photodiode & LDR",
    aim: "To compare photodiode and LDR as light-intensity sensors.",
    objectives: ["Plot photodiode current vs. light intensity.", "Plot LDR resistance vs. light intensity.", "Compare response speed of both devices."],
    theory: [
      "A photodiode is a reverse-biased PN junction; incident light generates electron-hole pairs producing a photocurrent proportional to intensity, with fast response.",
      "An LDR (light-dependent resistor) is a photoconductive cell whose resistance decreases as light intensity increases, with slower response.",
      "Photodiodes suit precision, high-speed sensing; LDRs suit simple light-level switching applications.",
    ],
    procedure: [
      "Expose the photodiode to a calibrated light source at varying intensities and record photocurrent.",
      "Repeat for the LDR, recording resistance instead.",
      "Plot both characteristics and compare linearity and response time.",
    ],
    references: ["Sze, S.M. — Physics of Semiconductor Devices"],
    pretest: [], posttest: [],
  },
  {
    id: "piezoelectric", tag: "PZ-08", title: "Piezoelectric Sensor",
    aim: "To study charge generation in a piezoelectric crystal under mechanical stress.",
    objectives: ["Observe output charge/voltage vs. applied dynamic force.", "Understand why piezoelectric sensors cannot measure static loads."],
    theory: [
      "Certain crystals (quartz, PZT) generate an electric charge proportional to applied mechanical stress — the piezoelectric effect.",
      "Because generated charge leaks away through the sensor and circuit impedance, piezoelectric sensors respond only to dynamic (changing) loads, not static DC force.",
      "A charge amplifier converts the tiny generated charge into a usable voltage signal.",
      "Common uses: vibration, dynamic force, and impact/pressure sensing.",
    ],
    procedure: [
      "Apply a series of dynamic (impulse) forces to the piezoelectric sensor.",
      "Record the charge-amplifier output for each impulse.",
      "Hold a constant static force and observe the output decay to zero.",
    ],
    references: ["Doebelin, E.O. — Measurement Systems"],
    pretest: [], posttest: [],
  },
  {
    id: "hall-effect", tag: "HE-09", title: "Hall Effect Sensor",
    aim: "To study the Hall effect for contactless magnetic field and position sensing.",
    objectives: ["Plot Hall voltage vs. magnetic flux density.", "Understand contactless current/position sensing applications."],
    theory: [
      "When a current-carrying conductor is placed in a magnetic field perpendicular to the current, a transverse voltage (Hall voltage) is produced.",
      "Hall voltage is proportional to current, magnetic flux density, and inversely proportional to carrier thickness.",
      "Because it requires no physical contact with the moving part, it is used for position, speed, and current sensing.",
    ],
    procedure: [
      "Pass a constant current through the Hall element.",
      "Vary the applied magnetic flux density using a calibrated magnet/coil.",
      "Record the Hall voltage at each flux level and plot the characteristic.",
    ],
    references: ["Sze, S.M. — Physics of Semiconductor Devices"],
    pretest: [], posttest: [],
  },
  {
    id: "load-cell", tag: "LC-10", title: "Load Cell",
    aim: "To study a strain-gauge based load cell for weight/force measurement.",
    objectives: ["Calibrate load cell output against known weights.", "Determine linearity and full-scale accuracy."],
    theory: [
      "A load cell bonds multiple strain gauges to an elastic structural element (beam or column) wired as a Wheatstone bridge.",
      "Applied force deforms the element; the resulting bridge imbalance is calibrated directly in force/weight units.",
      "Full-bridge designs give high sensitivity and inherent temperature compensation, making load cells accurate for weighing applications.",
    ],
    procedure: [
      "Zero the load cell with no weight applied.",
      "Apply a series of known calibrated weights.",
      "Record the bridge output for each weight and plot the calibration curve.",
      "Compute linearity error against an ideal straight line.",
    ],
    references: ["Doebelin, E.O. — Measurement Systems"],
    pretest: [], posttest: [],
  },
  {
    id: "capacitive-displacement", tag: "CD-11", title: "Capacitive Displacement Sensor",
    aim: "To study displacement sensing via capacitance change.",
    objectives: ["Plot capacitance vs. plate separation.", "Understand non-contact high-resolution sensing."],
    theory: [
      "Parallel-plate capacitance: C = εA / d, where A is overlap area, d is plate separation, ε is the dielectric permittivity.",
      "Displacement can be sensed by varying d (separation) or A (overlap area), producing a corresponding capacitance change.",
      "Capacitive sensors offer very high resolution and non-contact operation but are sensitive to humidity and dielectric variations.",
    ],
    procedure: [
      "Set an initial plate separation and record baseline capacitance.",
      "Vary separation in small known steps and record capacitance at each step.",
      "Plot capacitance vs. displacement and identify the usable linear range.",
    ],
    references: ["Doebelin, E.O. — Measurement Systems"],
    pretest: [], posttest: [],
  },
  {
    id: "op-amp", tag: "OA-12", title: "Op-Amp Characteristics",
    aim: "To characterize practical operational amplifier parameters against the ideal model.",
    objectives: ["Measure open-loop gain, CMRR and slew rate.", "Characterize inverting and non-inverting configurations."],
    theory: [
      "An ideal op-amp has infinite open-loop gain, infinite input impedance, zero output impedance and infinite bandwidth.",
      "Practical op-amps show finite open-loop gain, input offset voltage, limited common-mode rejection ratio (CMRR), finite slew rate, and bandwidth roll-off.",
      "Inverting and non-inverting amplifier configurations set closed-loop gain via feedback resistor ratios, trading gain for bandwidth and stability.",
    ],
    procedure: [
      "Measure open-loop gain by applying a small differential input and recording output.",
      "Configure as inverting amplifier; verify gain against Rf/Rin.",
      "Configure as non-inverting amplifier; verify gain against 1 + Rf/Rin.",
      "Apply a fast step input and measure slew rate from the output transition.",
    ],
    references: ["Sedra & Smith — Microelectronic Circuits"],
    pretest: [], posttest: [],
  },
];

const RATINGS = {
  "strain-gauge": 4.5, "lvdt": 4, "wheatstone-bridge": 4.5, "thermocouple": 3.5,
  "rtd": 4, "thermistor": 3.5, "photodiode-ldr": 4, "piezoelectric": 3.5,
  "hall-effect": 4, "load-cell": 4.5, "capacitive-displacement": 3.5, "op-amp": 4,
};

function StarRating({ rating, size = 15 }) {
  return (
    <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const pct = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span key={i} style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
            <Star size={size} color={C.border} style={{ position: "absolute", top: 0, left: 0 }} />
            <span style={{ position: "absolute", top: 0, left: 0, width: `${pct}%`, overflow: "hidden" }}>
              <Star size={size} color={C.copper} fill={C.copper} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const TABS = [
  { id: "aim", label: "Aim", icon: Target },
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "simulation", label: "Simulation", icon: Activity, badge: "BETA" },
  { id: "pretest", label: "Pretest", icon: ClipboardCheck },
  { id: "procedure", label: "Procedure", icon: ListOrdered },
  { id: "viva", label: "AI Viva Prep", icon: Sparkles, badge: "NEW" },
  { id: "posttest", label: "Posttest", icon: ClipboardCheck },
  { id: "references", label: "References", icon: Link2 },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

/* ---------------------------------------------------------------
   QUIZ
--------------------------------------------------------------- */
function Quiz({ questions }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div style={{ color: C.muted, fontSize: 14, padding: "24px 0" }}>
        Quiz for this experiment is being added — check back soon.
      </div>
    );
  }

  const score = questions.reduce((s, q, i) => s + (picked[i] === q.answer ? 1 : 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {questions.map((q, i) => (
        <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, background: C.card }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: C.ink }}>{i + 1}. {q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, oi) => {
              const isPicked = picked[i] === oi;
              const showResult = checked;
              const isCorrect = oi === q.answer;
              let border = C.border, bg = "transparent";
              if (showResult && isCorrect) { border = C.teal; bg = "#e8f5f3"; }
              else if (showResult && isPicked && !isCorrect) { border = "#c0392b"; bg = "#fbeae8"; }
              else if (isPicked) { border = C.copper; }
              return (
                <button
                  key={oi}
                  onClick={() => !checked && setPicked(p => ({ ...p, [i]: oi }))}
                  style={{
                    textAlign: "left", padding: "9px 12px", borderRadius: 8,
                    border: `1.5px solid ${border}`, background: bg, cursor: checked ? "default" : "pointer",
                    fontSize: 14, color: C.ink, display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {showResult && isCorrect && <CheckCircle2 size={15} color={C.teal} />}
                  {showResult && isPicked && !isCorrect && <XCircle size={15} color="#c0392b" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => setChecked(true)}
          disabled={Object.keys(picked).length < questions.length}
          style={{
            background: C.copper, color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            opacity: Object.keys(picked).length < questions.length ? 0.5 : 1,
          }}
        >
          Check answers
        </button>
        {checked && <span style={{ fontSize: 14, color: C.muted }}>Score: <b style={{ color: C.ink }}>{score}/{questions.length}</b></span>}
        {checked && (
          <button onClick={() => { setPicked({}); setChecked(false); }} style={{ background: "none", border: "none", color: C.teal, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   AI VIVA PREP
--------------------------------------------------------------- */
function VivaPrep({ exp }) {
  const [state, setState] = useState({ status: "idle" }); // idle | loading | done | error
  const [data, setData] = useState(null);

  async function generate() {
    setState({ status: "loading" });
    try {
      const prompt = `You are an engineering professor. Generate 6 viva-voce questions with concise (2-3 sentence) answers for an undergraduate Electrical Engineering lab experiment titled "${exp.title}". Also list 4 key concepts students must know, one short phrase each.
Return ONLY valid JSON, no markdown, no preamble, in this exact shape:
{"questions":[{"q":"...","a":"..."}],"concepts":["...","...","...","..."]}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await res.json();
      const text = (json.content || []).find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setData(parsed);
      setState({ status: "done" });
    } catch (e) {
      setState({ status: "error" });
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "#f4ece0", color: C.copperDark, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={13} /> AI-GENERATED
        </div>
        <span style={{ fontSize: 13, color: C.muted }}>Fresh viva questions for "{exp.title}", generated on demand.</span>
      </div>

      {state.status !== "done" && (
        <button
          onClick={generate}
          disabled={state.status === "loading"}
          style={{
            background: C.shell, color: "#fff", border: "none", borderRadius: 8,
            padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {state.status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {state.status === "loading" ? "Generating…" : "Generate viva questions"}
        </button>
      )}

      {state.status === "error" && (
        <div style={{ marginTop: 14, color: "#c0392b", fontSize: 14 }}>
          Couldn't generate questions right now. Please try again.
        </div>
      )}

      {state.status === "done" && data && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.copperDark, marginBottom: 8, letterSpacing: 0.4 }}>KEY CONCEPTS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(data.concepts || []).map((c, i) => (
                <span key={i} style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 13, color: C.ink }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(data.questions || []).map((qa, i) => (
              <details key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", background: C.card }}>
                <summary style={{ fontWeight: 600, cursor: "pointer", color: C.ink }}>{i + 1}. {qa.q}</summary>
                <p style={{ marginTop: 8, color: C.muted, fontSize: 14, lineHeight: 1.5 }}>{qa.a}</p>
              </details>
            ))}
          </div>
          <button onClick={generate} style={{ alignSelf: "flex-start", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.ink, cursor: "pointer" }}>
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   HOME
--------------------------------------------------------------- */
function Home({ onOpen, unlocked }) {
  return (
    <div style={{ background: C.canvas, minHeight: "100vh" }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: C.shell,
        padding: "40px",
        textAlign: "center",
        borderBottom: `1px solid ${C.border2}`,
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 72px)", // 72px is roughly the height of the top navbar
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/hero-bg.mp4" 
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, filter: "blur(4px)" }}
        />
        {/* Dark Overlay for Text Readability */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(18, 24, 38, 0.75)", zIndex: 1 }}></div>
        
        {/* Content Container */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Abstract background decorative elements */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(31,122,114,0.15) 0%, transparent 70%)", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", bottom: -150, right: -50, width: 500, height: 500, background: "radial-gradient(circle, rgba(193,113,47,0.1) 0%, transparent 70%)", borderRadius: "50%" }}></div>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ background: "rgba(193, 113, 47, 0.15)", border: `1px solid rgba(193, 113, 47, 0.3)`, color: C.copper, padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <Cpu size={16} /> ELECTRICAL & ELECTRONICS ENGINEERING
          </div>
        </div>
        
        <h1 style={{ fontSize: 56, fontWeight: 800, color: "#fff", margin: "0 auto 24px", lineHeight: 1.1, maxWidth: 900, letterSpacing: "-0.5px" }}>
          Sensors Modeling &amp; <span style={{ color: C.teal }}>Simulation Lab</span>
        </h1>
        
        <p style={{ color: "#a0abc0", fontSize: 18, lineHeight: 1.6, maxWidth: 650, margin: "0 auto 40px" }}>
          A premium virtual environment to explore the working principles, governing equations, and characteristics of physical sensors through interactive simulations.
        </p>
        
        <button 
          onClick={() => { document.getElementById("experiments-grid").scrollIntoView({ behavior: "smooth" }); }}
          style={{
            background: C.copper, color: "#fff", border: "none", borderRadius: 8,
            padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(193, 113, 47, 0.4)", display: "inline-flex", alignItems: "center", gap: 10,
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(193, 113, 47, 0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(193, 113, 47, 0.4)"; }}
        >
          Explore Experiments <ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} />
        </button>
        </div>

        {/* Floating Cover Sticker */}
        <div style={{
          position: "absolute", bottom: "50px", right: "50px", zIndex: 10,
          width: "120px", height: "120px", 
          background: "linear-gradient(135deg, #c1712f 0%, #8f5320 100%)", 
          borderRadius: "50%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.3)",
          transform: "rotate(-10deg)",
          border: "4px dashed rgba(255,255,255,0.3)",
          userSelect: "none"
        }}>
          <Zap size={32} style={{ marginBottom: 4 }} color="#fff" />
          <span style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "1px" }}>V-LAB</span>
          <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.9 }}>CERTIFIED</span>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 32, padding: "60px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {[
          { icon: Target, title: "Objective-Driven", desc: "Understand real-world deviations by plotting static and dynamic characteristics of ideal sensors." },
          { icon: Activity, title: "Interactive Simulations", desc: "Tweak physical parameters in real-time and observe immediate graph responses on virtual instruments." },
          { icon: Sparkles, title: "AI Viva Prep", desc: "Prepare for your practical exams with dynamically generated viva-voce questions and key concepts." }
        ].map((feature, i) => (
          <div key={i} style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#e8f5f3", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <feature.icon size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: "0 0 12px" }}>{feature.title}</h3>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Experiments Grid */}
      <div id="experiments-grid" className="reveal" style={{ padding: "20px 40px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>Available Experiments</h2>
            <p style={{ color: C.muted, fontSize: 16, margin: 0 }}>Select an experiment to begin the virtual lab session.</p>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.copperDark, background: "#f4ece0", padding: "6px 12px", borderRadius: 999 }}>
            {EXPERIMENTS.length} MODULES
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {EXPERIMENTS.map(exp => {
            const isLocked = !unlocked && exp.id !== "strain-gauge" && exp.id !== "bridge-circuits";
            return (
            <button
              key={exp.id}
              onClick={() => { if(!isLocked) onOpen(exp.id); }}
              style={{
                textAlign: "left", background: isLocked ? "rgba(240, 242, 245, 0.8)" : "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)",
                border: `1px solid rgba(255, 255, 255, 0.8)`, borderRadius: 16, padding: "24px",
                cursor: isLocked ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", gap: 12,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)", transition: "all 0.25s ease",
                opacity: isLocked ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if(isLocked) return;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.background = "#ffffff";
                const arrow = e.currentTarget.querySelector('.exp-arrow');
                if(arrow) {
                  arrow.style.transform = "translateX(4px)";
                  arrow.style.color = C.copper;
                }
              }}
              onMouseLeave={e => {
                if(isLocked) return;
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.03)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
                const arrow = e.currentTarget.querySelector('.exp-arrow');
                if(arrow) {
                  arrow.style.transform = "none";
                  arrow.style.color = C.muted;
                }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <span style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, fontWeight: 700,
                  color: isLocked ? C.muted : C.teal, background: isLocked ? "#e2e8f0" : "#e8f5f3", padding: "4px 10px", borderRadius: 6,
                }}>{exp.tag}</span>
                {!isLocked && <StarRating rating={RATINGS[exp.id] ?? 4} size={14} />}
                {isLocked && <Lock size={16} color={C.muted} />}
              </div>
              <div style={{ fontWeight: 800, color: C.ink, fontSize: 18, lineHeight: 1.3, marginTop: 4 }}>{exp.title}</div>
              <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{exp.aim}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 16, width: "100%" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: isLocked ? C.muted : C.ink }}>
                  {isLocked ? "Module Locked" : "Launch lab module"}
                </span>
                {!isLocked && <ArrowLeft className="exp-arrow" size={16} color={C.muted} style={{ transform: "rotate(180deg)", transition: "all 0.2s ease" }} />}
              </div>
            </button>
          )})}
        </div>
      </div>

      {/* Faculty Section */}
      <div className="reveal" style={{ background: "#f8f9fa", padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.ink, margin: "0 0 16px" }}>Faculty In-Charge</h2>
            <p style={{ color: C.muted, fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
              Our dedicated instructors ensure a rigorous and industry-aligned practical curriculum.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
            {[
              { name: "Dr. Sowmmiya U", role: "Faculty In-Charge", specialty: "Power Electronics" },
              { name: "Dr. Usha S", role: "Faculty In-Charge", specialty: "Electrical & Electronics Engineering" }
            ].map((faculty, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 32, width: 300, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#e8f5f3", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Users size={40} />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 20, color: C.ink }}>{faculty.name}</h3>
                <div style={{ color: C.copper, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{faculty.role}</div>
                <div style={{ color: C.muted, fontSize: 14 }}>Specialty: {faculty.specialty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   EXPERIMENT DETAIL
--------------------------------------------------------------- */
function Detail({ exp, tab, setTab, onBack, sidebarOpen, setSidebarOpen }) {
  return (
    <div>
      {/* Top Breadcrumb Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "20px 60px", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: C.muted }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer", fontSize: 14, padding: 0 }}>
          <ArrowLeft size={16} /> Course Overview
        </button>
        <span>/</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>Module {exp.id === "strain-gauge" ? "1" : "X"}: {exp.title}</span>
      </div>

      <div style={{ display: "flex", gap: 40, padding: "40px 60px 80px", alignItems: "flex-start", maxWidth: 1400, margin: "0 auto" }}>
        {/* sidebar */}
        <div style={{
          width: sidebarOpen ? 240 : 0, overflow: "hidden", flexShrink: 0, transition: "width 0.15s",
          position: "sticky", top: 116,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, paddingLeft: 16, marginBottom: 12 }}>
              Module Contents
            </div>
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8,
                    background: isActive ? "#f0fdfa" : "transparent", 
                    color: isActive ? "#0f766e" : "#64748b",
                    border: "none", cursor: "pointer", fontSize: 15, fontWeight: isActive ? 700 : 500, textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={18} style={{ color: isActive ? "#0d9488" : "#94a3b8" }} />
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {t.badge && !isActive && <span style={{ fontSize: 10, background: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>{t.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        {/* content */}
        <div style={{ flex: 1, minWidth: 0, background: "#fff", border: `1px solid #e2e8f0`, borderRadius: 16, padding: "56px 64px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, fontWeight: 700, color: "#475569", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: 6 }}>{exp.tag}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Required Module</span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 32px", letterSpacing: -0.5 }}>{exp.title}</h2>

          {tab === "aim" && (
            <div>
              <Section title="Aim">{exp.aim}</Section>
              <Section title="Objectives">
                <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.8 }}>
                  {exp.objectives.map((o, i) => <li key={i}>{o}</li>)}
                </ol>
              </Section>
            </div>
          )}

          {tab === "theory" && (
            <Section title="Theory">
              <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.theory.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              {exp.id === "bridge-circuits" && (
                <div style={{ marginTop: 24, padding: "20px", background: "#f8fafc", borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: C.ink, marginBottom: 4 }}>Original Lab Manual</div>
                    <div style={{ fontSize: 13, color: C.muted }}>View the source documentation and reference diagrams.</div>
                  </div>
                  <a 
                    href="/experiment_2_manual.pdf" 
                    target="_blank"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, color: C.primary, fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
                  >
                    <BookOpen size={18} />
                    Read PDF
                  </a>
                </div>
              )}
            </Section>
          )}

          {tab === "simulation" && (
            <Section title="Interactive Simulation">
              {exp.id === "strain-gauge" ? (
                <StrainGaugeSim />
              ) : exp.id === "bridge-circuits" ? (
                <BridgeSimWrapper />
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted, background: "#f8f9fa", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <Activity size={32} color={C.border} style={{ marginBottom: 12 }} />
                  <div>The interactive simulation for {exp.title} is currently under development.</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Check back soon!</div>
                </div>
              )}
            </Section>
          )}

          {tab === "pretest" && <Section title="Pretest"><Quiz questions={exp.pretest} /></Section>}
          {tab === "posttest" && <Section title="Posttest"><Quiz questions={exp.posttest} /></Section>}

          {tab === "procedure" && (
            <Section title="Procedure">
              <ol style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.procedure.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </Section>
          )}

          {tab === "viva" && <Section title="AI Viva Prep"><VivaPrep exp={exp} /></Section>}

          {tab === "references" && (
            <Section title="References">
              <ul style={{ paddingLeft: 20, color: C.ink, lineHeight: 1.9 }}>
                {exp.references.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Section>
          )}

          {tab === "feedback" && <Section title="Feedback"><Feedback /></Section>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>{title}</div>
      <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function BridgeSimWrapper() {
  const [type, setType] = useState("maxwell");
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button 
          onClick={() => setType("maxwell")} 
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, background: type === "maxwell" ? C.teal : "#f1f5f9", color: type === "maxwell" ? "#fff" : "#64748b" }}
        >
          Maxwell's Bridge
        </button>
        <button 
          onClick={() => setType("schering")} 
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, background: type === "schering" ? C.teal : "#f1f5f9", color: type === "schering" ? "#fff" : "#64748b" }}
        >
          Schering's Bridge
        </button>
      </div>
      {/* We use a key so it completely unmounts and remounts the simulator, resetting wires when switched */}
      <InteractiveWiringSim key={type} bridgeType={type} />
    </div>
  );
}

function Feedback() {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  if (sent) return <div style={{ color: C.teal, fontWeight: 600 }}>Thanks — your feedback helps improve this lab.</div>;
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Star size={22} fill={n <= rating ? C.copper : "none"} color={n <= rating ? C.copper : C.border} />
          </button>
        ))}
      </div>
      <textarea
        placeholder="Any comments about this experiment?"
        style={{ width: "100%", minHeight: 90, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
      />
      <button
        onClick={() => setSent(true)}
        style={{ marginTop: 12, background: C.copper, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
      >
        Submit feedback
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   APP SHELL
--------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState("home");
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("aim");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    const observerTimeout = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearTimeout(observerTimeout);
    };
  }, [view]);

  const active = EXPERIMENTS.find(e => e.id === activeId);

  function openExperiment(id) {
    setActiveId(id);
    setTab("aim");
    setView("detail");
  }

  return (
    <div style={{ background: C.canvas, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* Sticky Navbar */}
      <div style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: (scrolled || view !== "home") ? "rgba(18, 24, 38, 0.85)" : "transparent",
        backdropFilter: (scrolled || view !== "home") ? "blur(12px)" : "none",
        borderBottom: (scrolled || view !== "home") ? `3px solid ${C.copper}` : "3px solid transparent",
        transition: "all 0.3s ease"
      }}>
        <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <Menu size={28} />
            </button>
            <button onClick={() => setView("home")} style={{ display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: C.copper, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={24} color="#fff" />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>State University</div>
              <div style={{ color: "#c3c9d6", fontSize: 12, fontWeight: 600 }}>Dept. of Electrical Engineering</div>
            </div>
          </button>
          </div>
          <div style={{ display: "flex", gap: 28, fontSize: 14, color: "#c3c9d6", fontWeight: 600 }}>
            <span style={{ color: view === "home" ? "#fff" : "#c3c9d6", cursor: "pointer" }} onClick={() => setView("home")}>Home</span>
            <span style={{ cursor: "pointer" }}>About Lab</span>
            <span style={{ cursor: "pointer" }}>Faculty</span>
            <span style={{ cursor: "pointer" }}>Contact</span>
          </div>
        </div>
      </div>

      {view === "home" && <Home onOpen={openExperiment} unlocked={unlocked} />}
      {view === "detail" && active && (
        <div style={{ paddingTop: 76 }}>
          <Detail exp={active} tab={tab} setTab={setTab} onBack={() => setView("home")} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* Official Footer */}
      <div style={{ background: C.shell, color: "#c3c9d6", borderTop: `4px solid ${C.copper}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px", display: "flex", flexWrap: "wrap", gap: 60, justifyContent: "space-between" }}>
          
          {/* Branding & Contact */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.copper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Globe size={18} color="#fff" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>State University</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24, maxWidth: 280 }}>
              Empowering the next generation of engineers through cutting-edge practical education.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><MapPin size={16} color={C.copper} /> 123 University Road, Tech Campus</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Phone size={16} color={C.copper} /> +1 (555) 123-4567</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Mail size={16} color={C.copper} /> eeedepartment@state.edu</div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Admissions</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Academic Calendar</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Department Faculty</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Student Portal</a>
            </div>
          </div>

          {/* Legal */}
          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>Legal & Resources</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Shield size={14} /> Privacy Policy</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Terms of Service</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Accessibility Statement</a>
              <a href="#" style={{ color: "#c3c9d6", textDecoration: "none" }}>Lab Safety Guidelines</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: `1px solid ${C.border2}`, padding: "20px 40px", textAlign: "center", fontSize: 13, color: "#8891a3" }}>
          © {new Date().getFullYear()} State University, Department of Electrical & Electronics Engineering. All rights reserved.
        </div>
      </div>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Sidebar Menu */}
      <div style={{
        position: "fixed", top: 0, left: menuOpen ? 0 : "-350px", width: "350px", height: "100vh",
        background: "rgba(18, 24, 38, 0.75)", backdropFilter: "blur(24px)", zIndex: 1000, transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        boxShadow: menuOpen ? "20px 0 40px rgba(0,0,0,0.5)" : "none",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        <div style={{ padding: "32px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #c1712f 0%, #8f5320 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={18} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>V-Lab</span>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}><X size={18} /></button>
        </div>
        

        <div style={{ padding: "24px" }}>
          <h4 style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>Curriculum</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EXPERIMENTS.map((exp, i) => {
              const isLocked = !unlocked && exp.id !== "strain-gauge" && exp.id !== "bridge-circuits";
              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    if (!isLocked) {
                      openExperiment(exp.id);
                      setMenuOpen(false);
                    }
                  }}
                  style={{
                    background: isLocked ? "transparent" : "rgba(255,255,255,0.04)", 
                    border: isLocked ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: 12, textAlign: "left", padding: "12px",
                    display: "flex", alignItems: "center", gap: 14, cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.4 : 1, transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ 
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: isLocked ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)", 
                    color: isLocked ? "rgba(255,255,255,0.4)" : "#fff", 
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 
                  }}>
                    {isLocked ? <Lock size={14} /> : i + 1}
                  </div>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
