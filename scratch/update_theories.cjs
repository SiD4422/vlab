const fs = require('fs');
let code = fs.readFileSync('./src/data/experiments.js', 'utf-8');
const jsonStr = code.replace('export const EXPERIMENTS = ', '').replace(/;\s*$/, '');
const exps = JSON.parse(jsonStr);

const newTheories = {
  "strain-gauge": [
    "A Strain Gauge is a resistive sensor whose resistance changes with applied force; it is essentially a resistor that stretches or compresses.",
    "Resistance is measured in Ohms (Ω), representing the opposition to current flow in the gauge.",
    "Stress is internal force per unit cross-sectional area; strain ε = ΔL / L is the resulting fractional deformation (dimensionless).",
    "Gauge factor GF = (ΔR/R) / ε. Metallic foil gauges typically have GF between 2 and 5.",
    "A Wheatstone bridge converts the small resistance change (ΔR) into a measurable output voltage (ΔV).",
    "Where: ΔV = Output voltage, V_in = Input excitation voltage, GF = Gauge Factor, ε = Strain.",
    "Formula: ΔV = V_in * (GF * ε) / 4 for a quarter-bridge setup."
  ],
  "wheatstone-bridge": [
    "A Resistor is a passive electrical component that limits or regulates the flow of electrical current.",
    "Resistance is measured in Ohms (Ω), which quantifies the opposition to the current flow.",
    "The Wheatstone bridge consists of four resistive arms together with a source of EMF and a null detector (galvanometer).",
    "When the bridge is balanced, no current flows through the galvanometer, indicating that the potential at both terminals is equal.",
    "Where: P and Q are known ratio arm resistances, R is a known adjustable standard resistance, and Rx is the unknown resistance.",
    "Balance Formula: P × Rx = Q × R",
    "This gives the unknown resistance as Rx = (Q × R) / P."
  ],
  "kelvin-bridge": [
    "A Resistor restricts current flow, and in this experiment, we measure very low resistance values (fractions of an Ohm).",
    "Resistance is measured in Ohms (Ω). Low resistances require specialized techniques to avoid errors from lead wire resistances.",
    "The Kelvin Bridge is a modification of the Wheatstone bridge, specifically designed for accurately measuring unknown resistors below 1 Ω.",
    "It minimizes the effect of contact and lead resistances by using an additional set of ratio arms.",
    "Where: P and Q are known ratio arm resistances, S is a known standard low resistance, and Rx is the unknown low resistance.",
    "Balance Formula: P × Rx = Q × S",
    "This gives the unknown low resistance as Rx = (Q × S) / P."
  ],
  "kelvin-double-bridge": [
    "Resistors restrict current. When measuring ultra-low resistances (Ohms, Ω), the resistance of connecting wires and contacts can cause significant errors.",
    "The Kelvin Double Bridge uses two sets of ratio arms to completely eliminate lead resistance errors.",
    "When the ratio of the outer arms equals the ratio of the inner arms (P/Q = p/q), the effect of the connecting link is zeroed out.",
    "Where: P and Q are outer ratio arm resistances, p and q are inner ratio arm resistances, S is a known standard low resistance, Rx is the unknown low resistance, and r is the yoke (connecting link) resistance.",
    "Balance Formula: Rx = (P/Q) × S + [q×r / (p+q+r)] × (P/Q − p/q)",
    "If P/Q = p/q exactly, the formula simplifies perfectly to Rx = (P/Q) × S."
  ],
  "capacitance-comparison-bridge": [
    "A Capacitor is a passive electrical component that stores energy in an electric field between two conductive plates.",
    "Capacitance is measured in Farads (F). In practical circuits, microfarads (µF) are typically used (1 µF = 10^-6 F).",
    "The Capacitance Comparison Bridge measures an unknown capacitance by comparing it with a known standard loss-free capacitor.",
    "The bridge is balanced using an AC source and a headphone detector to find the null point (minimum audio signal).",
    "Where: C2 is a standard known capacitor, R3 and R4 are known adjustable non-inductive resistors, and Cx is the unknown capacitance.",
    "Balance Formula: Cx × R3 = C2 × R4",
    "This yields the unknown capacitance as Cx = (C2 × R4) / R3."
  ],
  "maxwell-inductance-bridge": [
    "An Inductor is a passive electrical component (usually a coil of wire) that stores energy in a magnetic field when electric current flows through it.",
    "Inductance is measured in Henrys (H). Practical coils are often measured in millihenrys (mH, 1 mH = 10^-3 H).",
    "The Maxwell Inductance Bridge compares an unknown inductor and its internal resistance against a standard variable inductor.",
    "AC bridges require balancing both the real (resistive) and imaginary (reactive) parts of the circuit impedance.",
    "Where: L2 is a standard variable inductor, r2 is the fixed internal resistance of L2, R2/R3/R4 are known adjustable resistors, L1 is the unknown inductance, and R1 is the internal resistance of L1.",
    "Balance Formula for Inductance: L1 = (R3 / R4) × L2",
    "Balance Formula for Resistance: R1 = (R3 / R4) × (R2 + r2)"
  ],
  "maxwell-lc-bridge": [
    "Inductance (Henrys, H or mH) represents a coil's opposition to changes in current. Capacitance (Farads, F or µF) represents the ability to store charge.",
    "The Maxwell LC Bridge (often just called Maxwell's Bridge) uniquely measures an unknown inductance using a standard variable capacitor instead of another inductor.",
    "This avoids the bulk and magnetic field interference problems of standard inductors. It is best suited for medium-Q coils.",
    "Where: C4 is a standard variable capacitor, R2/R3/R4 are known adjustable resistors, Lx is the unknown inductance, and Rx is the internal resistance of the unknown coil.",
    "Balance Formula for Inductance: Lx = R2 × R3 × C4",
    "Balance Formula for Coil Resistance: Rx = (R2 × R3) / R4"
  ],
  "hays-bridge": [
    "Inductance is measured in millihenrys (mH), and Capacitance in microfarads (µF).",
    "Hay's Bridge is a modification of Maxwell's LC Bridge. Instead of a parallel resistor-capacitor network, it uses a series resistor-capacitor network.",
    "This configuration is specifically suited for measuring high-Q coils (Quality factor Q > 10) because it allows for a much more practical value of R4.",
    "Where: C4 is a standard variable capacitor, R2/R3/R4 are known adjustable resistors, f is the frequency of the AC source, Lx is the unknown high-Q inductance, and Rx is the internal coil resistance.",
    "Balance Formula for Inductance: Lx = (R2 × R3 × C4) / (1 + X²), where X = 2π × f × C4 × R4",
    "Balance Formula for Coil Resistance: Rx = X² × (R2 × R3 / R4) / (1 + X²)"
  ],
  "anderson-bridge": [
    "Inductance is measured in millihenrys (mH) and Capacitance in microfarads (µF).",
    "The Anderson Bridge is a versatile modification of the Maxwell bridge that allows accurate measurement of a wide range of inductances.",
    "It uses a fixed standard capacitor and achieves balance by varying a resistor, removing the need for an expensive variable standard capacitor.",
    "Where: C is a fixed standard capacitor, P/Q/R are known resistors, S is a variable resistor for DC balance, m is a variable resistor for AC balance, and Lx is the unknown inductance.",
    "Balance Formula for Inductance: Lx = C × [ R × Q + (R + S) × m ]",
    "The DC balance for resistance is first achieved using S = (Q × R) / P."
  ],
  "schering-bridge": [
    "Capacitance is measured in microfarads (µF). The Dissipation Factor (D) is a dimensionless number representing the energy lost (as heat) inside a real capacitor.",
    "The Schering Bridge is one of the most important AC bridges used extensively for measuring the capacitance and the dissipation factor (dielectric loss) of capacitors.",
    "It is especially useful for high-voltage testing of cables and insulators.",
    "Where: C2 is a standard loss-free capacitor, C4 is a variable capacitor, R3/R4 are known adjustable resistors, f is the AC source frequency, Cx is the unknown capacitance, and D is the Dissipation Factor.",
    "Balance Formula for Capacitance: Cx = C2 × (R4 / R3)",
    "Balance Formula for Dissipation Factor: D = 2π × f × C4 × R4"
  ],
  "wiens-bridge": [
    "Resistors (Ohms, Ω) and Capacitors (microfarads, µF) can be combined to create frequency-selective filter networks.",
    "Wien's Bridge is primarily used to measure the frequency of an unknown AC source, rather than measuring component values.",
    "It balances only at a single specific frequency for a given set of R and C values.",
    "In a symmetric configuration, the ratio arms must be fixed such that R3 = 2 × R4.",
    "Where: R is the resistance of the equal decade boxes (R1=R2=R), C is the capacitance of the equal decade boxes (C1=C2=C), R3/R4 are fixed ratio resistors, and f is the unknown oscillator frequency.",
    "Balance Formula for Frequency: f = 1 / (2π × R × C) Hz"
  ],
  "transformer-ratio-bridge": [
    "Capacitance is measured in microfarads (µF).",
    "The Transformer Ratio Bridge replaces the standard resistive ratio arms of a classical bridge with a precision-tapped transformer.",
    "Transformer windings are highly stable, immune to temperature variations, and offer extremely precise voltage ratios compared to resistors.",
    "Where: Cs is a standard fixed capacitor (usually 1 µF), n is the turns ratio (N2 / N1) of the tapped transformer, and Cx is the unknown capacitance.",
    "Balance Formula: Cx = Cs × n"
  ]
};

exps.forEach(exp => {
  if (newTheories[exp.id]) {
    exp.theory = newTheories[exp.id];
  }
});

const output = 'export const EXPERIMENTS = ' + JSON.stringify(exps, null, 2) + ';\n';
fs.writeFileSync('./src/data/experiments.js', output, 'utf-8');
