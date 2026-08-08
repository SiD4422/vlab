export const EXPERIMENTS = [
  {
    "id": "kelvin-bridge",
    "tag": "DC-02",
    "title": "Kelvin Bridge",
    "aim": "To measure very low unknown resistances accurately using the Kelvin Bridge.",
    "objectives": [
      "Understand the limitation of Wheatstone bridge for low resistance.",
      "Measure unknown low resistance.",
      "Observe the effect of lead and contact resistances."
    ],
    "theory": [
      "A Resistor restricts current flow, and in this experiment, we measure very low resistance values (fractions of an Ohm).",
      "Resistance is measured in Ohms (Ω). Low resistances require specialized techniques to avoid errors from lead wire resistances.",
      "The Kelvin Bridge is a modification of the Wheatstone bridge, specifically designed for accurately measuring unknown resistors below 1 Ω.",
      "It minimizes the effect of contact and lead resistances by using an additional set of ratio arms.",
      "Where: P and Q are known ratio arm resistances, S is a known standard low resistance, and Rx is the unknown low resistance.",
      "Balance Formula: P × Rx = Q × S",
      "This gives the unknown low resistance as Rx = (Q × S) / P."
    ],
    "procedure": [
      "Connect the unknown low resistance to the bridge terminals.",
      "Set the main ratio dial to a suitable multiplier.",
      "Adjust the standard variable resistor until the galvanometer shows zero deflection.",
      "Calculate the unknown resistance using the balance formula."
    ],
    "references": [
      "A.K. Sawhney - Electrical Measurements"
    ],
    "pretest": [
      {
        "q": "Kelvin bridge is primarily used for measuring:",
        "options": [
          "High resistance",
          "Medium resistance",
          "Low resistance",
          "Capacitance"
        ],
        "answer": 2
      },
      {
        "q": "The main advantage of Kelvin bridge over Wheatstone bridge is:",
        "options": [
          "Measures higher voltage",
          "Eliminates lead and contact resistance errors",
          "Uses AC supply",
          "Is cheaper to build"
        ],
        "answer": 1
      },
      {
        "q": "Kelvin bridge is a modification of:",
        "options": [
          "Maxwell bridge",
          "Schering bridge",
          "Wheatstone bridge",
          "Wien bridge"
        ],
        "answer": 2
      },
      {
        "q": "The value of low resistance measured is typically below:",
        "options": [
          "1 ohm",
          "10 ohms",
          "100 ohms",
          "1000 ohms"
        ],
        "answer": 0
      },
      {
        "q": "The accuracy of Kelvin bridge depends on:",
        "options": [
          "Voltage source",
          "Ratio arms matching",
          "Capacitors",
          "Inductors"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "At balance in a Kelvin double bridge, the current through the galvanometer is:",
        "options": [
          "Maximum",
          "Minimum",
          "Zero",
          "Infinite"
        ],
        "answer": 2
      },
      {
        "q": "For accurate measurement, the ratio of outer arms (R1/R2) must be equal to:",
        "options": [
          "Inner arms (a/b)",
          "Standard resistance (S)",
          "Unknown resistance (R)",
          "Galvanometer resistance"
        ],
        "answer": 0
      },
      {
        "q": "Which is used as a null detector in a DC Kelvin bridge?",
        "options": [
          "Oscilloscope",
          "Galvanometer",
          "Headphones",
          "Vibration Galvanometer"
        ],
        "answer": 1
      },
      {
        "q": "The bridge has how many sets of ratio arms?",
        "options": [
          "One",
          "Two",
          "Three",
          "Four"
        ],
        "answer": 1
      },
      {
        "q": "What happens if the contact resistance is too high?",
        "options": [
          "The bridge burns",
          "Balance is impossible",
          "No effect on balance condition if inner and outer ratios are perfectly matched",
          "Current increases"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
            "id": "kb_q1",
            "question": "Why is the Kelvin Bridge preferred over the Wheatstone Bridge for measuring very low resistances (below 1 Ω)?",
            "options": [
                  "It uses a higher voltage source to push more current.",
                  "It eliminates the effect of lead and contact resistances.",
                  "It does not require a galvanometer to find the balance point.",
                  "It amplifies the small resistance values electronically."
            ],
            "correctIndex": 1
      },
      {
            "id": "kb_q2",
            "question": "How does doubling the DC excitation voltage affect the balance condition of the bridge?",
            "options": [
                  "The balance point shifts exactly to the middle of the slide wire.",
                  "The bridge becomes unbalanced and requires recalibration.",
                  "The balance condition remains completely unaffected.",
                  "The measured unknown resistance value is halved."
            ],
            "correctIndex": 2
      },
      {
            "id": "kb_q3",
            "question": "What is the primary purpose of the slide wire in a practical Kelvin Bridge setup?",
            "options": [
                  "To act as a variable voltage divider for the power supply.",
                  "To balance the bridge and precisely read the fractional resistance ratio.",
                  "To limit the current flowing through the sensitive galvanometer.",
                  "To cancel out external magnetic fields."
            ],
            "correctIndex": 1
      },
      {
            "id": "kb_q4",
            "question": "What defines a low resistance measurement typically suited for this bridge?",
            "options": [
                  "Resistances between 1 kΩ and 100 kΩ.",
                  "Resistances between 10 Ω and 100 Ω.",
                  "Resistances below 1 Ω.",
                  "Purely inductive components."
            ],
            "correctIndex": 2
      },
      {
            "id": "kb_q5",
            "question": "What error occurs if thermoelectric EMFs are present in the bridge circuit, and how is it mitigated?",
            "options": [
                  "It causes false balance points; eliminated by taking the average of readings with reversed battery polarity.",
                  "It melts the slide wire; eliminated by using AC instead of DC.",
                  "It causes the galvanometer to freeze; mitigated by adding a series capacitor.",
                  "It increases the lead resistance; mitigated by using thicker wires."
            ],
            "correctIndex": 0
      }
]
  },
  {
    "id": "kelvin-double-bridge",
    "tag": "DC-03",
    "title": "Kelvin Double Bridge",
    "aim": "To achieve extreme precision in sub-ohm resistance measurement using the Kelvin Double Bridge.",
    "objectives": [
      "Calibrate standard shunts.",
      "Measure resistivity of conductors.",
      "Eliminate thermoelectric EMF errors."
    ],
    "theory": [
      "Resistors restrict current. When measuring ultra-low resistances (Ohms, Ω), the resistance of connecting wires and contacts can cause significant errors.",
      "The Kelvin Double Bridge uses two sets of ratio arms to completely eliminate lead resistance errors.",
      "When the ratio of the outer arms equals the ratio of the inner arms (P/Q = p/q), the effect of the connecting link is zeroed out.",
      "Where: P and Q are outer ratio arm resistances, p and q are inner ratio arm resistances, S is a known standard low resistance, Rx is the unknown low resistance, and r is the yoke (connecting link) resistance.",
      "Balance Formula: Rx = (P/Q) × S + [q×r / (p+q+r)] × (P/Q − p/q)",
      "If P/Q = p/q exactly, the formula simplifies perfectly to Rx = (P/Q) × S."
    ],
    "procedure": [
      "Connect the massive current leads and separate potential leads to the unknown resistor (4-terminal measurement).",
      "Balance the bridge with normal supply polarity.",
      "Reverse the DC supply and re-balance.",
      "Average the readings to compute the true resistance free from thermal EMF errors."
    ],
    "references": [
      "Golding & Widdis - Electrical Measurements"
    ],
    "pretest": [
      {
        "q": "A Kelvin Double bridge requires the unknown resistor to have:",
        "options": [
          "2 terminals",
          "3 terminals",
          "4 terminals",
          "No terminals"
        ],
        "answer": 2
      },
      {
        "q": "The term \"double\" refers to:",
        "options": [
          "Double voltage",
          "Double current",
          "Two sets of ratio arms",
          "Two galvanometers"
        ],
        "answer": 2
      },
      {
        "q": "What is the main purpose of the Kelvin Double Bridge?",
        "options": [
          "Measure capacitance",
          "Measure inductance",
          "Measure very low resistance",
          "Measure frequency"
        ],
        "answer": 2
      },
      {
        "q": "The connecting link between the standard and unknown resistor is called:",
        "options": [
          "Yoke",
          "Arm",
          "Ratio",
          "Galvanometer"
        ],
        "answer": 0
      },
      {
        "q": "Is the Kelvin Double Bridge an AC or DC bridge?",
        "options": [
          "AC",
          "DC",
          "Both",
          "Neither"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Reversing the battery polarity in a Kelvin double bridge helps eliminate errors due to:",
        "options": [
          "Lead resistance",
          "Stray capacitance",
          "Thermoelectric EMFs",
          "Galvanometer friction"
        ],
        "answer": 2
      },
      {
        "q": "The four-terminal connection eliminates the effect of:",
        "options": [
          "Temperature",
          "Voltage drop in current leads",
          "Frequency",
          "Inductance"
        ],
        "answer": 1
      },
      {
        "q": "If the inner and outer ratio arms are not exactly equal, the error depends on:",
        "options": [
          "Voltage",
          "Yoke resistance",
          "Current",
          "Galvanometer"
        ],
        "answer": 1
      },
      {
        "q": "Standard shunts are calibrated using:",
        "options": [
          "Wheatstone bridge",
          "Kelvin Double Bridge",
          "Maxwell bridge",
          "Schering bridge"
        ],
        "answer": 1
      },
      {
        "q": "The minimum resistance accurately measurable is around:",
        "options": [
          "1 ohm",
          "1 milli-ohm",
          "1 micro-ohm",
          "1 nano-ohm"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
            "id": "kdb_q1",
            "question": "In a Kelvin Double Bridge, why is a second set of ratio arms (inner arms p and q) used?",
            "options": [
                  "To increase the maximum resistance limit that can be measured.",
                  "To provide a backup measurement path if the main arms fail.",
                  "To cancel out the effect of the connecting lead (yoke) resistance between the standard and unknown resistors.",
                  "To double the sensitivity of the galvanometer."
            ],
            "correctIndex": 2
      },
      {
            "id": "kdb_q2",
            "question": "What must be true about the ratio of the inner arms (p/q) and outer arms (P/Q) for the exact balance equation to hold true?",
            "options": [
                  "They must be exactly inverse (p/q = Q/P).",
                  "They must be completely unequal.",
                  "They must be kept exactly equal (p/q = P/Q).",
                  "The inner arms must be ten times the outer arms."
            ],
            "correctIndex": 2
      },
      {
            "id": "kdb_q3",
            "question": "If the heavy copper yoke connecting the standard and unknown resistor breaks, what happens?",
            "options": [
                  "The measurement becomes twice as accurate.",
                  "The current stops flowing through the main circuit and the bridge cannot be balanced.",
                  "The galvanometer deflection reverses direction.",
                  "The bridge automatically acts like a Wheatstone bridge."
            ],
            "correctIndex": 1
      },
      {
            "id": "kdb_q4",
            "question": "What type of detector is most suitable for finding the null point in this highly precise DC bridge?",
            "options": [
                  "A cathode ray oscilloscope (CRO).",
                  "A high-frequency vibration galvanometer.",
                  "A highly sensitive DC DArsonval galvanometer.",
                  "A digital multimeter set to AC voltage."
            ],
            "correctIndex": 2
      },
      {
            "id": "kdb_q5",
            "question": "Why is a heavy current usually passed through the standard and unknown resistors?",
            "options": [
                  "To ensure the resistors reach their maximum operating temperature.",
                  "To produce a measurable voltage drop across the very low resistances.",
                  "To burn off any oxidation on the contact terminals.",
                  "To generate a strong magnetic field for the galvanometer."
            ],
            "correctIndex": 1
      }
]
  },
  {
    "id": "capacitance-comparison-bridge",
    "tag": "AC-01",
    "title": "Capacitance Comparison Bridge",
    "aim": "To determine an unknown capacitance by comparing it with a known standard capacitance.",
    "objectives": [
      "Balance a simple AC bridge.",
      "Calculate unknown C and its equivalent series resistance.",
      "Analyze dielectric losses."
    ],
    "theory": [
      "A Capacitor is a passive electrical component that stores energy in an electric field between two conductive plates.",
      "Capacitance is measured in Farads (F). In practical circuits, microfarads (µF) are typically used (1 µF = 10^-6 F).",
      "The Capacitance Comparison Bridge measures an unknown capacitance by comparing it with a known standard loss-free capacitor.",
      "The bridge is balanced using an AC source and a headphone detector to find the null point (minimum audio signal).",
      "Where: C2 is a standard known capacitor, R3 and R4 are known adjustable non-inductive resistors, and Cx is the unknown capacitance.",
      "Balance Formula: Cx × R3 = C2 × R4",
      "This yields the unknown capacitance as Cx = (C2 × R4) / R3."
    ],
    "procedure": [
      "Apply an AC sinusoidal excitation (e.g., 1 kHz).",
      "Connect the unknown capacitor in arm 4.",
      "Adjust the ratio arms R1 and R2 iteratively until the headphone/null-detector is silent.",
      "Calculate Cx and rx."
    ],
    "references": [
      "Helfrick & Cooper - Modern Electronic Instrumentation"
    ],
    "pretest": [
      {
        "q": "A capacitance comparison bridge uses:",
        "options": [
          "DC supply",
          "AC supply",
          "Both",
          "None"
        ],
        "answer": 1
      },
      {
        "q": "What kind of detector is typically used for audio frequency AC bridges?",
        "options": [
          "D'Arsonval galvanometer",
          "Headphones",
          "DC Voltmeter",
          "Ammeter"
        ],
        "answer": 1
      },
      {
        "q": "The bridge measures:",
        "options": [
          "Only capacitance magnitude",
          "Capacitance and equivalent series resistance",
          "Inductance",
          "Frequency"
        ],
        "answer": 1
      },
      {
        "q": "Standard capacitors are usually:",
        "options": [
          "Lossy",
          "Loss-free (high quality)",
          "Variable inductors",
          "Electrolytic"
        ],
        "answer": 1
      },
      {
        "q": "The balance conditions require adjusting:",
        "options": [
          "One component",
          "Two components",
          "Three components",
          "Four components"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "At balance, the unknown capacitance Cx is proportional to:",
        "options": [
          "Standard Inductance",
          "Standard Capacitance",
          "Standard Voltage",
          "Standard Frequency"
        ],
        "answer": 1
      },
      {
        "q": "If the standard capacitor is assumed completely loss-free (r_std = 0), then rx is:",
        "options": [
          "Infinity",
          "Zero",
          "Negative",
          "Unchanged"
        ],
        "answer": 1
      },
      {
        "q": "The balance condition implies that:",
        "options": [
          "Voltages across detectors are in phase",
          "Voltage across detector is zero",
          "Current is maximum",
          "Impedance is zero"
        ],
        "answer": 1
      },
      {
        "q": "Which component represents dielectric losses?",
        "options": [
          "Equivalent series resistance",
          "Inductance",
          "Voltage",
          "Frequency"
        ],
        "answer": 0
      },
      {
        "q": "What frequency is commonly used for audio bridges?",
        "options": [
          "1 Hz",
          "50 Hz",
          "1 kHz",
          "1 MHz"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
            "id": "ccb_q1",
            "question": "What is the main purpose of the Capacitance Comparison Bridge?",
            "options": [
                  "To measure the self-inductance of a coil.",
                  "To determine the exact frequency of an AC source.",
                  "To determine an unknown capacitance by comparing it with a known standard capacitor.",
                  "To measure the DC resistance of an insulator."
            ],
            "correctIndex": 2
      },
      {
            "id": "ccb_q2",
            "question": "What happens if the dielectric of the unknown capacitor is very lossy (has high equivalent series resistance)?",
            "options": [
                  "A perfect null cannot be achieved unless a variable resistive arm is added to balance the real power loss.",
                  "The bridge balances much faster than with a perfect capacitor.",
                  "The standard capacitor will overheat and get damaged.",
                  "The excitation frequency automatically drops to zero."
            ],
            "correctIndex": 0
      },
      {
            "id": "ccb_q3",
            "question": "Which detector is commonly used for an audio-frequency AC capacitance bridge?",
            "options": [
                  "A standard moving-coil DC galvanometer.",
                  "A compass needle.",
                  "Headphones or an AC tuned detector.",
                  "An ammeter."
            ],
            "correctIndex": 2
      },
      {
            "id": "ccb_q4",
            "question": "In an ideal lossless capacitance comparison bridge, the balance condition depends on:",
            "options": [
                  "The absolute voltage of the AC supply.",
                  "The ratio of the adjacent resistive arms.",
                  "The phase angle of the detector.",
                  "The ambient temperature of the room."
            ],
            "correctIndex": 1
      },
      {
            "id": "ccb_q5",
            "question": "How are stray electrostatic capacitances between bridge arms and ground mitigated in high-precision AC bridges?",
            "options": [
                  "By submerging the bridge in distilled water.",
                  "By using a Wagner earth connection and electrostatic shielding.",
                  "By increasing the supply voltage to overpower the stray signals.",
                  "By replacing all capacitors with inductors."
            ],
            "correctIndex": 1
      }
]
  },
  {
    "id": "maxwell-inductance-bridge",
    "tag": "AC-02",
    "title": "Maxwell’s Inductance Bridge",
    "aim": "To determine an unknown inductance by comparing it with a known standard self-inductance.",
    "objectives": [
      "Measure unknown L.",
      "Determine internal resistance of the coil."
    ],
    "theory": [
      "An Inductor is a passive electrical component (usually a coil of wire) that stores energy in a magnetic field when electric current flows through it.",
      "Inductance is measured in Henrys (H). Practical coils are often measured in millihenrys (mH, 1 mH = 10^-3 H).",
      "The Maxwell Inductance Bridge compares an unknown inductor and its internal resistance against a standard variable inductor.",
      "AC bridges require balancing both the real (resistive) and imaginary (reactive) parts of the circuit impedance.",
      "Where: L2 is a standard variable inductor, r2 is the fixed internal resistance of L2, R2/R3/R4 are known adjustable resistors, L1 is the unknown inductance, and R1 is the internal resistance of L1.",
      "Balance Formula for Inductance: L1 = (R3 / R4) × L2",
      "Balance Formula for Resistance: R1 = (R3 / R4) × (R2 + r2)"
    ],
    "procedure": [
      "Connect the unknown coil.",
      "Adjust the standard variable inductor and variable resistor alternately.",
      "Find the point of absolute minimum sound in the detector.",
      "Calculate Lx and Rx."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Maxwell inductance bridge compares unknown L against:",
        "options": [
          "Standard C",
          "Standard L",
          "Standard R",
          "Standard V"
        ],
        "answer": 1
      },
      {
        "q": "The bridge measures:",
        "options": [
          "Only L",
          "Only R",
          "Both L and its internal resistance R",
          "Capacitance"
        ],
        "answer": 2
      },
      {
        "q": "A standard variable inductor is called a:",
        "options": [
          "Variac",
          "Variometer",
          "Varactor",
          "Varistor"
        ],
        "answer": 1
      },
      {
        "q": "Maxwell inductance bridge requires a standard inductor which is:",
        "options": [
          "Cheap and small",
          "Bulky and expensive",
          "Always fixed",
          "Loss-free"
        ],
        "answer": 1
      },
      {
        "q": "The balance equations are independent of:",
        "options": [
          "Frequency",
          "Resistance",
          "Inductance",
          "Voltage source amplitude"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "Why is standard L rarely used?",
        "options": [
          "Too small",
          "Bulky and prone to magnetic errors",
          "Too cheap",
          "Does not work with AC"
        ],
        "answer": 1
      },
      {
        "q": "To achieve balance, one must usually adjust:",
        "options": [
          "Only one arm",
          "Two components alternately",
          "The frequency",
          "The voltage"
        ],
        "answer": 1
      },
      {
        "q": "The internal resistance of the coil is calculated using:",
        "options": [
          "Rx = R_std * (R2/R3)",
          "Rx = R_std / (R2/R3)",
          "Rx = R_std * (R3/R2)",
          "Rx = L_std * (R2/R3)"
        ],
        "answer": 0
      },
      {
        "q": "What is the phase difference between the arms at balance?",
        "options": [
          "90 degrees",
          "180 degrees",
          "They have equal phase angles in opposite arms",
          "Zero"
        ],
        "answer": 2
      },
      {
        "q": "The sensitivity of the bridge is maximum when:",
        "options": [
          "Ratio arms are equal",
          "Ratio arms are zero",
          "Frequency is infinite",
          "Voltage is zero"
        ],
        "answer": 0
      }
    ],
    "viva": [
      {
            "id": "mib_q1",
            "question": "What does Maxwells Inductance Bridge primarily compare the unknown inductance against?",
            "options": [
                  "A standard variable capacitor.",
                  "A standard variable inductor.",
                  "A highly stable DC voltage source.",
                  "A precision frequency oscillator."
            ],
            "correctIndex": 1
      },
      {
            "id": "mib_q2",
            "question": "Why is the Maxwell Inductance Bridge rarely used for highly precise laboratory measurements compared to the Maxwell-Wien bridge?",
            "options": [
                  "It requires a DC supply which is hard to stabilize.",
                  "Standard variable inductors are bulky, expensive, and prone to external magnetic field errors.",
                  "It can only measure inductances above 100 Henrys.",
                  "It requires a perfectly lossless standard inductor, which does not exist."
            ],
            "correctIndex": 1
      },
      {
            "id": "mib_q3",
            "question": "To achieve balance in a Maxwell Inductance Bridge, which components are typically adjusted?",
            "options": [
                  "A variable capacitor and a fixed resistor.",
                  "The AC source frequency and amplitude.",
                  "A variable standard inductor and a variable resistor in series with it.",
                  "Two variable capacitors."
            ],
            "correctIndex": 2
      },
      {
            "id": "mib_q4",
            "question": "What is the effect of mutual inductance between the standard reference coil and the unknown coil?",
            "options": [
                  "It speeds up the balancing process.",
                  "It causes significant measurement errors; hence coils must be magnetically shielded or placed far apart.",
                  "It cancels out the resistive losses in both coils.",
                  "It doubles the sensitivity of the detector."
            ],
            "correctIndex": 1
      },
      {
            "id": "mib_q5",
            "question": "If the unknown inductor has a very high internal resistance, what happens to the balance?",
            "options": [
                  "The bridge becomes a Wheatstone bridge.",
                  "The standard variable resistor must be adjusted to a high value to achieve real balance.",
                  "The inductance measurement becomes perfectly accurate.",
                  "The AC supply will short circuit."
            ],
            "correctIndex": 1
      }
]
  },
  {
    "id": "maxwell-lc-bridge",
    "tag": "AC-03",
    "title": "Maxwell’s Inductance-Capacitance Bridge",
    "aim": "To determine unknown inductance using a standard variable capacitance.",
    "objectives": [
      "Measure medium Q coils.",
      "Eliminate the need for standard inductors."
    ],
    "theory": [
      "Inductance (Henrys, H or mH) represents a coil's opposition to changes in current. Capacitance (Farads, F or µF) represents the ability to store charge.",
      "The Maxwell LC Bridge (often just called Maxwell's Bridge) uniquely measures an unknown inductance using a standard variable capacitor instead of another inductor.",
      "This avoids the bulk and magnetic field interference problems of standard inductors. It is best suited for medium-Q coils.",
      "Where: C4 is a standard variable capacitor, R2/R3/R4 are known adjustable resistors, Lx is the unknown inductance, and Rx is the internal resistance of the unknown coil.",
      "Balance Formula for Inductance: Lx = R2 × R3 × C4",
      "Balance Formula for Coil Resistance: Rx = (R2 × R3) / R4"
    ],
    "procedure": [
      "Connect the unknown coil in arm 1.",
      "Adjust the variable capacitor C4 and resistor R4 to achieve balance.",
      "Calculate the inductance using Lx = R2*R3*C4."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Maxwell LC bridge is suited for:",
        "options": [
          "Low Q coils",
          "Medium Q coils",
          "High Q coils",
          "Capacitors"
        ],
        "answer": 1
      },
      {
        "q": "The bridge measures inductance in terms of:",
        "options": [
          "Standard inductance",
          "Standard capacitance",
          "Standard frequency",
          "Standard voltage"
        ],
        "answer": 1
      },
      {
        "q": "What is a \"medium Q\" coil?",
        "options": [
          "1 < Q < 10",
          "Q < 1",
          "Q > 10",
          "Q = 0"
        ],
        "answer": 0
      },
      {
        "q": "Using a capacitor instead of an inductor is better because:",
        "options": [
          "Capacitors are heavier",
          "Capacitors have magnetic fields",
          "Capacitors are more compact and have less loss",
          "Capacitors change with frequency more"
        ],
        "answer": 2
      },
      {
        "q": "The balance equations are:",
        "options": [
          "Dependent on frequency",
          "Independent of frequency",
          "Dependent on voltage",
          "Dependent on time"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "The balance equation for Lx is independent of:",
        "options": [
          "Frequency",
          "R2",
          "R3",
          "C4"
        ],
        "answer": 0
      },
      {
        "q": "In Maxwell LC bridge, the standard capacitor is in:",
        "options": [
          "Series with a resistor",
          "Parallel with a resistor",
          "Isolated arm",
          "Short circuited"
        ],
        "answer": 1
      },
      {
        "q": "Why is it unsuitable for high Q coils?",
        "options": [
          "Requires very large resistance R4",
          "Requires very small capacitance",
          "Frequency dependence",
          "Burns the coil"
        ],
        "answer": 0
      },
      {
        "q": "Why is it unsuitable for low Q coils (Q < 1)?",
        "options": [
          "Sliding balance problem",
          "Burns the capacitor",
          "Resistance becomes negative",
          "Frequency becomes zero"
        ],
        "answer": 0
      },
      {
        "q": "If R2 and R3 are fixed, Lx is directly proportional to:",
        "options": [
          "C4",
          "1/C4",
          "R4",
          "1/R4"
        ],
        "answer": 0
      }
    ],
    "viva": [
      {
            "id": "mlcb_q1",
            "question": "Maxwells Inductance-Capacitance (Maxwell-Wien) Bridge is best suited for measuring coils with which range of Q (Quality) factor?",
            "options": [
                  "High Q coils (Q > 10)",
                  "Medium Q coils (1 < Q < 10)",
                  "Low Q coils (Q < 1)",
                  "It measures pure inductance irrespective of Q factor."
            ],
            "correctIndex": 1
      },
      {
            "id": "mlcb_q2",
            "question": "Which component is used as the standard reference to measure the unknown inductance in a Maxwell-Wien Bridge?",
            "options": [
                  "A standard variable inductor.",
                  "A standard variable capacitor.",
                  "A standard high-wattage resistor.",
                  "A standard step-down transformer."
            ],
            "correctIndex": 1
      },
      {
            "id": "mlcb_q3",
            "question": "What practical difficulty arises if a Maxwells bridge is used to measure a very low-Q coil (Q < 1)?",
            "options": [
                  "The standard capacitor value required would be impractically small.",
                  "The required balancing resistance becomes impractically large.",
                  "Balancing becomes a slow, iterative process because adjusting for resistive balance disturbs the inductive balance, causing a sliding balance.",
                  "The bridge excitation frequency must be drastically increased to achieve balance."
            ],
            "correctIndex": 2
      },
      {
            "id": "mlcb_q4",
            "question": "In an AC bridge like Maxwells, what two conditions must be satisfied simultaneously to achieve a true null balance?",
            "options": [
                  "Voltage and Current must balance independently.",
                  "Real (resistive) and Imaginary (reactive) components must balance independently.",
                  "Frequency and Phase must balance independently.",
                  "Inductive and Capacitive reactances must completely cancel each other out."
            ],
            "correctIndex": 1
      },
      {
            "id": "mlcb_q5",
            "question": "Why are headphones, vibration galvanometers, or CROs used instead of a standard moving-coil galvanometer in Maxwells Bridge?",
            "options": [
                  "Because the bridge operates on an AC supply and a standard DC galvanometer cannot detect alternating current.",
                  "Because headphones amplify the weak signals better than a galvanometer.",
                  "Because they can measure the exact RMS voltage value across the bridge arms.",
                  "Because AC bridges require audio-frequency tuning to establish resonance."
            ],
            "correctIndex": 0
      }
]
  },
  {
    "id": "hays-bridge",
    "tag": "AC-04",
    "title": "Hay’s Bridge",
    "aim": "To measure the inductance of high-Q coils.",
    "objectives": [
      "Understand sliding balance in Maxwell bridge.",
      "Measure coils with Q > 10."
    ],
    "theory": [
      "Inductance is measured in millihenrys (mH), and Capacitance in microfarads (µF).",
      "Hay's Bridge is a modification of Maxwell's LC Bridge. Instead of a parallel resistor-capacitor network, it uses a series resistor-capacitor network.",
      "This configuration is specifically suited for measuring high-Q coils (Quality factor Q > 10) because it allows for a much more practical value of R4.",
      "Where: C4 is a standard variable capacitor, R2/R3/R4 are known adjustable resistors, f is the frequency of the AC source, Lx is the unknown high-Q inductance, and Rx is the internal coil resistance.",
      "Balance Formula for Inductance: Lx = (R2 × R3 × C4) / (1 + X²), where X = 2π × f × C4 × R4",
      "Balance Formula for Coil Resistance: Rx = X² × (R2 × R3 / R4) / (1 + X²)"
    ],
    "procedure": [
      "Connect a high-Q inductor.",
      "Adjust the series R and C until the null is found.",
      "Calculate Lx."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Hay bridge is preferred over Maxwell bridge for measuring:",
        "options": [
          "High Q coils",
          "Low Q coils",
          "Capacitors",
          "Resistors"
        ],
        "answer": 0
      },
      {
        "q": "In Hay bridge, the standard capacitor is connected in:",
        "options": [
          "Parallel with R",
          "Series with R",
          "Separate arm",
          "Short circuit"
        ],
        "answer": 1
      },
      {
        "q": "High Q coils typically have Q greater than:",
        "options": [
          "1",
          "5",
          "10",
          "100"
        ],
        "answer": 2
      },
      {
        "q": "The modification from Maxwell to Hay involves changing the capacitor from:",
        "options": [
          "Parallel to Series",
          "Series to Parallel",
          "Fixed to Variable",
          "AC to DC"
        ],
        "answer": 0
      },
      {
        "q": "Does the true Hay bridge balance equation depend on frequency?",
        "options": [
          "Yes",
          "No",
          "Only for low frequencies",
          "Only for DC"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "For very high Q coils, the frequency term in the equation:",
        "options": [
          "Dominates",
          "Becomes negligible",
          "Causes oscillation",
          "Burns the bridge"
        ],
        "answer": 1
      },
      {
        "q": "If Hay bridge is used for low Q coils, what happens?",
        "options": [
          "Accurate results",
          "Equations become strongly dependent on frequency",
          "Detector explodes",
          "No balance possible"
        ],
        "answer": 1
      },
      {
        "q": "Which is the balance equation for Lx for very high Q?",
        "options": [
          "Lx = R2*R3*C4",
          "Lx = R2*R3/C4",
          "Lx = C4/(R2*R3)",
          "Lx = R2/(R3*C4)"
        ],
        "answer": 0
      },
      {
        "q": "The series resistor in the capacitive arm of a Hay bridge usually takes a:",
        "options": [
          "High value",
          "Low value",
          "Zero value",
          "Infinite value"
        ],
        "answer": 1
      },
      {
        "q": "Hay bridge avoids the requirement of what component found in Maxwell bridge for high Q coils?",
        "options": [
          "Small capacitor",
          "Large parallel resistor",
          "High voltage source",
          "Inductor"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
            "id": "hb_q1",
            "question": "Hays Bridge is a modification of Maxwells Bridge specifically designed to measure what?",
            "options": [
                  "Extremely low resistances.",
                  "Low Q coils (Q < 1).",
                  "High Q coils (Q > 10).",
                  "Unknown frequencies."
            ],
            "correctIndex": 2
      },
      {
            "id": "hb_q2",
            "question": "In Hays Bridge, how is the standard capacitor connected in the reference arm?",
            "options": [
                  "In parallel with a standard resistor (like Maxwells).",
                  "In series with a standard resistor.",
                  "Directly across the AC supply.",
                  "In parallel with the unknown inductor."
            ],
            "correctIndex": 1
      },
      {
            "id": "hb_q3",
            "question": "What is a major mathematical disadvantage of Hays Bridge when calculating the exact inductance?",
            "options": [
                  "The balance equation for inductance contains the AC source frequency, making it frequency-dependent.",
                  "The equation requires complex integration.",
                  "It produces a negative inductance value.",
                  "It requires knowing the exact phase angle of the detector."
            ],
            "correctIndex": 0
      },
      {
            "id": "hb_q4",
            "question": "Why is the series R-C arrangement in Hays bridge better for high-Q coils than Maxwells parallel R-C?",
            "options": [
                  "Because high-Q coils require a larger current to balance.",
                  "For high-Q, Maxwells bridge requires an impractically large parallel resistance, whereas Hays requires a manageable small series resistance.",
                  "Because series circuits do not suffer from stray capacitance.",
                  "Because series capacitors are cheaper than parallel capacitors."
            ],
            "correctIndex": 1
      },
      {
            "id": "hb_q5",
            "question": "If Hays bridge is incorrectly used to measure a very low-Q coil, what problem occurs?",
            "options": [
                  "The calculated inductance becomes highly sensitive to frequency variations and small errors.",
                  "The standard capacitor will explode due to high current.",
                  "The bridge balances instantly but gives a zero reading.",
                  "The detector will indicate a perfect null regardless of the component values."
            ],
            "correctIndex": 0
      }
]
  },
  {
    "id": "anderson-bridge",
    "tag": "AC-05",
    "title": "Anderson Bridge",
    "aim": "To measure a wide range of inductances with high precision.",
    "objectives": [
      "Measure low Q coils accurately.",
      "Understand 6-node bridge circuits."
    ],
    "theory": [
      "Inductance is measured in millihenrys (mH) and Capacitance in microfarads (µF).",
      "The Anderson Bridge is a versatile modification of the Maxwell bridge that allows accurate measurement of a wide range of inductances.",
      "It uses a fixed standard capacitor and achieves balance by varying a resistor, removing the need for an expensive variable standard capacitor.",
      "Where: C is a fixed standard capacitor, P/Q/R are known resistors, S is a variable resistor for DC balance, m is a variable resistor for AC balance, and Lx is the unknown inductance.",
      "Balance Formula for Inductance: Lx = C × [ R × Q + (R + S) × m ]",
      "The DC balance for resistance is first achieved using S = (Q × R) / P."
    ],
    "procedure": [
      "Connect the circuit involving the 5th intermediate node.",
      "Iteratively adjust the variable resistor r until null is achieved.",
      "Use the complex Anderson formula to compute Lx."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Anderson bridge is a modification of:",
        "options": [
          "Schering bridge",
          "Maxwell-Wien bridge",
          "Wien bridge",
          "Hay bridge"
        ],
        "answer": 1
      },
      {
        "q": "The main advantage of Anderson bridge is that it uses a:",
        "options": [
          "Fixed capacitor",
          "Variable capacitor",
          "Fixed inductor",
          "Variable inductor"
        ],
        "answer": 0
      },
      {
        "q": "Anderson bridge is best suited for:",
        "options": [
          "High Q coils",
          "Low Q coils",
          "Capacitors",
          "Frequencies"
        ],
        "answer": 1
      },
      {
        "q": "How many nodes does a typical Anderson bridge have compared to a standard 4-node bridge?",
        "options": [
          "3",
          "4",
          "5 or 6",
          "10"
        ],
        "answer": 2
      },
      {
        "q": "To achieve balance, which component is usually varied?",
        "options": [
          "Capacitor",
          "Variable resistor in series with C",
          "Voltage source",
          "Inductor"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "The balance equations for Anderson bridge are:",
        "options": [
          "Simple",
          "Complex",
          "Independent of R",
          "Dependent on voltage"
        ],
        "answer": 1
      },
      {
        "q": "Because it uses a fixed capacitor, it is:",
        "options": [
          "Cheaper and more accurate",
          "More expensive",
          "Less accurate",
          "Bulkier"
        ],
        "answer": 0
      },
      {
        "q": "Can Anderson bridge be used to measure capacitance?",
        "options": [
          "Yes, theoretically",
          "No, only inductance",
          "Only for electrolytic",
          "Only at DC"
        ],
        "answer": 0
      },
      {
        "q": "What is the main disadvantage of Anderson bridge?",
        "options": [
          "Inaccurate",
          "Requires shielding and has complex equations",
          "Requires DC",
          "Requires high voltage"
        ],
        "answer": 1
      },
      {
        "q": "Sliding balance in Anderson bridge is:",
        "options": [
          "Difficult to achieve",
          "Easier to achieve than Maxwell for low Q",
          "Impossible",
          "Dependent on frequency"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
            "id": "ab_q1",
            "question": "Anderson Bridge is a modification of Maxwells Bridge primarily used to measure what?",
            "options": [
                  "Very high Q coils.",
                  "The inductance of low Q coils precisely.",
                  "Extremely small capacitances.",
                  "High voltage dielectric loss."
            ],
            "correctIndex": 1
      },
      {
            "id": "ab_q2",
            "question": "How does the topology of Andersons Bridge differ from standard four-arm bridges like Maxwells L-C bridge?",
            "options": [
                  "It operates on DC instead of AC.",
                  "It uses two standard inductors instead of one.",
                  "It is a 5-point network (effectively a 6-arm bridge) with an extra variable resistor node.",
                  "It places the detector in series with the AC supply."
            ],
            "correctIndex": 2
      },
      {
            "id": "ab_q3",
            "question": "What is the main practical advantage of Andersons Bridge over Maxwells Bridge?",
            "options": [
                  "It balances instantly without any manual adjustment.",
                  "It achieves balance using only fixed capacitors and variable resistors, avoiding expensive precision variable capacitors.",
                  "It requires no detector to find the null point.",
                  "It operates independently of the real resistive balance."
            ],
            "correctIndex": 1
      },
      {
            "id": "ab_q4",
            "question": "What is a significant drawback of using the Anderson Bridge?",
            "options": [
                  "The balance equations are extremely complex and balancing is tedious due to multiple interacting resistive adjustments.",
                  "It can only be used at frequencies above 1 MHz.",
                  "It requires a massive standard inductor.",
                  "It is highly dangerous due to high voltage requirements."
            ],
            "correctIndex": 0
      },
      {
            "id": "ab_q5",
            "question": "In Andersons bridge, the balance condition for the unknown inductance depends on:",
            "options": [
                  "Only the fixed capacitor and one resistor.",
                  "The fixed capacitor and multiple resistive arms in the network.",
                  "The frequency of the AC source.",
                  "The internal resistance of the detector."
            ],
            "correctIndex": 1
      }
]
  },
  {
    "id": "schering-bridge",
    "tag": "AC-06",
    "title": "Schering Bridge",
    "aim": "To measure unknown capacitance and dissipation factor.",
    "objectives": [
      "Measure capacitance.",
      "Determine dielectric loss.",
      "Understand high-voltage AC bridges."
    ],
    "theory": [
      "Capacitance is measured in microfarads (µF). The Dissipation Factor (D) is a dimensionless number representing the energy lost (as heat) inside a real capacitor.",
      "The Schering Bridge is one of the most important AC bridges used extensively for measuring the capacitance and the dissipation factor (dielectric loss) of capacitors.",
      "It is especially useful for high-voltage testing of cables and insulators.",
      "Where: C2 is a standard loss-free capacitor, C4 is a variable capacitor, R3/R4 are known adjustable resistors, f is the AC source frequency, Cx is the unknown capacitance, and D is the Dissipation Factor.",
      "Balance Formula for Capacitance: Cx = C2 × (R4 / R3)",
      "Balance Formula for Dissipation Factor: D = 2π × f × C4 × R4"
    ],
    "procedure": [
      "Connect the unknown capacitor (Cx).",
      "Adjust R3 and C4 until the bridge is balanced.",
      "Calculate Cx and D."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Schering bridge is used to measure:",
        "options": [
          "Inductance",
          "Capacitance and Dissipation Factor",
          "Frequency",
          "Resistance"
        ],
        "answer": 1
      },
      {
        "q": "High voltage Schering bridges are used to test:",
        "options": [
          "Resistors",
          "Inductors",
          "Insulating cables and high voltage capacitors",
          "Batteries"
        ],
        "answer": 2
      },
      {
        "q": "What is dissipation factor (D)?",
        "options": [
          "Ratio of resistive to reactive current",
          "Ratio of reactive to resistive current",
          "Voltage drop",
          "Frequency"
        ],
        "answer": 0
      },
      {
        "q": "The standard capacitor in a high voltage Schering bridge is usually:",
        "options": [
          "Electrolytic",
          "Air or gas-filled (loss-free)",
          "Ceramic",
          "Tantalum"
        ],
        "answer": 1
      },
      {
        "q": "For safety, the controls of a high-voltage Schering bridge are placed:",
        "options": [
          "At high voltage",
          "Near ground potential",
          "In series with the supply",
          "Disconnected"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Dissipation factor in Schering bridge is calculated as:",
        "options": [
          "w*C4*R4",
          "1/(w*C4*R4)",
          "w*L/R",
          "R/(w*L)"
        ],
        "answer": 0
      },
      {
        "q": "The balance equation for Cx is:",
        "options": [
          "Dependent on frequency",
          "Independent of frequency",
          "Dependent on voltage",
          "Dependent on D"
        ],
        "answer": 1
      },
      {
        "q": "If a capacitor is perfect (loss-less), its dissipation factor is:",
        "options": [
          "Infinity",
          "Zero",
          "1",
          "100"
        ],
        "answer": 1
      },
      {
        "q": "Schering bridge uses how many capacitors?",
        "options": [
          "One",
          "Two (Standard and Unknown)",
          "Three",
          "Four"
        ],
        "answer": 1
      },
      {
        "q": "A Wagner earth device is sometimes used with Schering bridge to:",
        "options": [
          "Increase voltage",
          "Eliminate stray capacitance errors",
          "Provide AC power",
          "Cool the resistors"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
            "id": "sb_q1",
            "question": "What is the primary industrial application of the Schering Bridge?",
            "options": [
                  "Measuring unknown inductance of high Q coils.",
                  "Measuring extremely low DC contact resistances.",
                  "Measuring unknown capacitance and the dielectric loss angle (dissipation factor) of insulators.",
                  "Measuring the exact frequency of an unknown AC source."
            ],
            "correctIndex": 2
      },
      {
            "id": "sb_q2",
            "question": "In a high-voltage Schering Bridge, why is the standard reference capacitor typically a gas-filled or air capacitor?",
            "options": [
                  "It is cheaper to manufacture and maintain.",
                  "It has virtually zero dielectric loss, serving as a perfect lossless reference.",
                  "It can handle significantly higher steady-state DC currents.",
                  "It automatically adjusts its capacitance based on ambient temperature."
            ],
            "correctIndex": 1
      },
      {
            "id": "sb_q3",
            "question": "What safety precaution is specifically utilized in the structural layout of a high-voltage Schering Bridge?",
            "options": [
                  "The detector and standard adjustable components are placed in the lower arms and grounded to protect the operator.",
                  "The entire bridge circuit must be submerged in insulating transformer oil.",
                  "It must be operated inside a Faraday cage to prevent RF interference.",
                  "A high-voltage fuse is placed directly in series with the unknown test capacitor."
            ],
            "correctIndex": 0
      },
      {
            "id": "sb_q4",
            "question": "The dissipation factor (tan δ) measured by a Schering Bridge is an indicator of:",
            "options": [
                  "The maximum peak voltage the capacitor can withstand before breakdown.",
                  "The quality of the dielectric material and the power lost as heat within it.",
                  "The physical size and distance between the capacitor plates.",
                  "The self-resonant frequency of the capacitor under test."
            ],
            "correctIndex": 1
      },
      {
            "id": "sb_q5",
            "question": "How does the presence of stray capacitance affect Schering Bridge measurements at higher frequencies?",
            "options": [
                  "It artificially improves the accuracy of the dissipation factor measurement.",
                  "It has absolutely no effect because the bridge naturally operates on AC.",
                  "It causes significant errors in both capacitance and loss angle, often requiring a Wagner Earth connection to mitigate.",
                  "It only affects the inductance measurements of the connecting leads."
            ],
            "correctIndex": 2
      }
]
  },
  {
    "id": "wiens-bridge",
    "tag": "AC-07",
    "title": "Wien’s Bridge",
    "aim": "To measure unknown audio frequencies accurately.",
    "objectives": [
      "Determine the frequency of an AC source.",
      "Design a Wien bridge oscillator."
    ],
    "theory": [
      "Resistors (Ohms, Ω) and Capacitors (microfarads, µF) can be combined to create frequency-selective filter networks.",
      "Wien's Bridge is primarily used to measure the frequency of an unknown AC source, rather than measuring component values.",
      "It balances only at a single specific frequency for a given set of R and C values.",
      "In a symmetric configuration, the ratio arms must be fixed such that R3 = 2 × R4.",
      "Where: R is the resistance of the equal decade boxes (R1=R2=R), C is the capacitance of the equal decade boxes (C1=C2=C), R3/R4 are fixed ratio resistors, and f is the unknown oscillator frequency.",
      "Balance Formula for Frequency: f = 1 / (2π × R × C) Hz"
    ],
    "procedure": [
      "Apply the unknown frequency source.",
      "Vary the ganged resistors/capacitors simultaneously until the null detector reads zero.",
      "Calculate the frequency using the Wien formula."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Wien bridge is primarily used to measure:",
        "options": [
          "Inductance",
          "Capacitance",
          "Frequency",
          "Voltage"
        ],
        "answer": 2
      },
      {
        "q": "Wien bridge has a series RC combination in one arm and:",
        "options": [
          "Series RC in another",
          "Parallel RC in adjoining arm",
          "Only R",
          "Only L"
        ],
        "answer": 1
      },
      {
        "q": "Wien bridge is commonly used in:",
        "options": [
          "Audio frequency oscillators",
          "Radio frequency transmitters",
          "DC power supplies",
          "Transformers"
        ],
        "answer": 0
      },
      {
        "q": "At balance, the phase shift across the RC arms is:",
        "options": [
          "90 degrees",
          "180 degrees",
          "0 degrees",
          "45 degrees"
        ],
        "answer": 2
      },
      {
        "q": "Is Wien bridge sensitive to harmonics?",
        "options": [
          "Yes",
          "No",
          "Only at DC",
          "Only above 1 MHz"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "If R1=R2=R and C1=C2=C, the balance frequency is:",
        "options": [
          "1/(2πRC)",
          "2πRC",
          "1/(RC)",
          "RC"
        ],
        "answer": 0
      },
      {
        "q": "To maintain balance over a range of frequencies, we typically vary:",
        "options": [
          "L and C",
          "R1 and R2 simultaneously (ganged)",
          "Voltage",
          "Detector sensitivity"
        ],
        "answer": 1
      },
      {
        "q": "If a harmonic is present in the source, the Wien bridge will:",
        "options": [
          "Balance perfectly",
          "Not balance for the harmonic",
          "Destroy the detector",
          "Double the reading"
        ],
        "answer": 1
      },
      {
        "q": "The ratio of the resistive arms (R3/R4) for the simplified Wien bridge is:",
        "options": [
          "1",
          "2",
          "3",
          "0.5"
        ],
        "answer": 1
      },
      {
        "q": "Wien bridge can also be used to measure capacitance if:",
        "options": [
          "Frequency is known",
          "Voltage is known",
          "Inductance is known",
          "It cannot measure capacitance"
        ],
        "answer": 0
      }
    ],
    "viva": [
      {
            "id": "wb_q1",
            "question": "What is the primary use of the Wien Bridge as a measurement device in AC circuits?",
            "options": [
                  "Measuring very high inductances.",
                  "Measuring the exact frequency of the AC source.",
                  "Measuring dielectric loss of insulators.",
                  "Measuring low DC resistances."
            ],
            "correctIndex": 1
      },
      {
            "id": "wb_q2",
            "question": "What is required for the Wien Bridge to achieve balance if the components in the reactive arms are exactly matched (R1=R2=R, C1=C2=C)?",
            "options": [
                  "The supply voltage must be exactly 10V.",
                  "The ratio arms must be set to 2:1 (so the overall gain balances).",
                  "The excitation frequency must exactly equal 1 / (2πRC).",
                  "The detector must have zero internal resistance."
            ],
            "correctIndex": 2
      },
      {
            "id": "wb_q3",
            "question": "Apart from frequency measurement, what is a very common commercial application of the Wien Bridge network?",
            "options": [
                  "Used as the frequency-determining feedback network in audio-frequency oscillators (Wien-bridge oscillator).",
                  "Used as a high-voltage step-up transformer.",
                  "Used to measure the speed of DC motors.",
                  "Used as a DC voltage regulator."
            ],
            "correctIndex": 0
      },
      {
            "id": "wb_q4",
            "question": "Why is the Wien Bridge highly sensitive to harmonics present in the AC supply voltage?",
            "options": [
                  "Because harmonics cause the resistors to overheat.",
                  "Because the balance condition is strictly frequency-dependent; harmonics will not balance and will produce a residual signal at the detector.",
                  "Because harmonics damage the capacitors dielectric.",
                  "Because harmonics reverse the phase of the galvanometer."
            ],
            "correctIndex": 1
      },
      {
            "id": "wb_q5",
            "question": "What type of detector is most suitable for a Wien Bridge operating at an audio frequency of 1 kHz?",
            "options": [
                  "A DC moving-coil galvanometer.",
                  "A vibration galvanometer tuned to 50 Hz.",
                  "Headphones or a tuned audio-frequency detector.",
                  "A digital logic probe."
            ],
            "correctIndex": 2
      }
]
  },
  {
    "id": "transformer-ratio-bridge",
    "tag": "AC-08",
    "title": "Transformer Ratio Bridge",
    "aim": "To measure impedance with extreme precision using ratio transformers.",
    "objectives": [
      "Understand inductive voltage dividers.",
      "Eliminate stray capacitance errors completely."
    ],
    "theory": [
      "Capacitance is measured in microfarads (µF).",
      "The Transformer Ratio Bridge replaces the standard resistive ratio arms of a classical bridge with a precision-tapped transformer.",
      "Transformer windings are highly stable, immune to temperature variations, and offer extremely precise voltage ratios compared to resistors.",
      "Where: Cs is a standard fixed capacitor (usually 1 µF), n is the turns ratio (N2 / N1) of the tapped transformer, and Cx is the unknown capacitance.",
      "Balance Formula: Cx = Cs × n"
    ],
    "procedure": [
      "Connect the unknown impedance and the standard impedance to the transformer taps.",
      "Adjust the tap turns-ratio until the detector reads zero.",
      "Calculate Zx = Z_std * (N1/N2)."
    ],
    "references": [
      "Sawhney A.K."
    ],
    "pretest": [
      {
        "q": "Transformer ratio bridges replace resistive arms with:",
        "options": [
          "Capacitors",
          "Inductive voltage dividers",
          "Diodes",
          "Op-amps"
        ],
        "answer": 1
      },
      {
        "q": "What is the main advantage of an inductive voltage divider?",
        "options": [
          "Cheap",
          "High accuracy and low output impedance",
          "Works on DC",
          "Generates power"
        ],
        "answer": 1
      },
      {
        "q": "Transformer ratio bridges are immune to:",
        "options": [
          "Temperature",
          "Stray capacitance to ground",
          "Magnetic fields",
          "Harmonics"
        ],
        "answer": 1
      },
      {
        "q": "The balance condition depends on the:",
        "options": [
          "Turns ratio (N1/N2)",
          "Resistance ratio",
          "Capacitance ratio",
          "Voltage amplitude"
        ],
        "answer": 0
      },
      {
        "q": "These bridges are typically used in:",
        "options": [
          "Basic schools",
          "National standards laboratories",
          "DC circuits",
          "Microwave frequencies"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "The stray capacitance from a tap to ground does not affect the balance because:",
        "options": [
          "It is cancelled by inductance",
          "The transformer has very low leakage impedance",
          "It is bypassed by a resistor",
          "It is infinite"
        ],
        "answer": 1
      },
      {
        "q": "At balance, Zx is calculated as:",
        "options": [
          "Z_std * (N1/N2)",
          "Z_std * (N2/N1)",
          "Z_std + N1",
          "Z_std - N2"
        ],
        "answer": 0
      },
      {
        "q": "The core of the transformer is usually made of:",
        "options": [
          "Wood",
          "High permeability material (e.g., Mu-metal)",
          "Air",
          "Aluminum"
        ],
        "answer": 1
      },
      {
        "q": "Can a transformer ratio bridge operate on DC?",
        "options": [
          "Yes",
          "No, transformers require AC",
          "Only at 0 Hz",
          "Only with batteries"
        ],
        "answer": 1
      },
      {
        "q": "The accuracy of the ratio depends primarily on:",
        "options": [
          "Temperature",
          "Exact turns ratio",
          "Resistor aging",
          "Detector sensitivity"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
            "id": "trb_q1",
            "question": "What replaces the standard resistive ratio arms in a Transformer Ratio Bridge?",
            "options": [
                  "Two standard variable capacitors.",
                  "A tapped precision transformer or autotransformer.",
                  "High wattage precision resistors.",
                  "A balanced diode bridge."
            ],
            "correctIndex": 1
      },
      {
            "id": "trb_q2",
            "question": "What is a major advantage of using transformer ratio arms instead of resistive ratio arms?",
            "options": [
                  "They are much lighter and cheaper to manufacture.",
                  "They provide highly stable and precise ratios that are largely immune to temperature changes and aging.",
                  "They allow the bridge to operate on pure DC.",
                  "They automatically amplify the detector signal."
            ],
            "correctIndex": 1
      },
      {
            "id": "trb_q3",
            "question": "How is balance typically achieved in a Transformer Ratio Bridge?",
            "options": [
                  "By altering the frequency of the AC supply until null is reached.",
                  "By adjusting a slide wire resistance.",
                  "By selecting the appropriate taps on the transformer windings to change the voltage ratio.",
                  "By moving the detector along a magnetic core."
            ],
            "correctIndex": 2
      },
      {
            "id": "trb_q4",
            "question": "Why are stray capacitances from the bridge arms to ground significantly less problematic in a Transformer Ratio Bridge?",
            "options": [
                  "Because transformers operate at frequencies where stray capacitance does not exist.",
                  "Because the very low impedance of the transformer windings shunts the stray capacitance to ground, minimizing error voltage.",
                  "Because the transformer core absorbs all stray electrostatic fields.",
                  "Because the bridge is operated entirely in a vacuum."
            ],
            "correctIndex": 1
      },
      {
            "id": "trb_q5",
            "question": "Which fundamental property of an ideal transformer ensures that its voltage ratio remains highly accurate?",
            "options": [
                  "The core temperature.",
                  "The exact turns ratio of the windings, which is physically fixed.",
                  "The gauge of the wire used for the primary winding.",
                  "The frequency of the input voltage."
            ],
            "correctIndex": 1
      }
]
  }
];