export const EXPERIMENTS = [
  {
    "id": "strain-gauge",
    "tag": "SG-01",
    "title": "Strain Gauge Sensor",
    "aim": "To understand the working principle and characteristics of a resistive strain gauge sensor.",
    "objectives": [
      "Plot strain gauge output voltage against applied load.",
      "Determine the gauge factor experimentally.",
      "Compare quarter, half and full bridge configurations."
    ],
    "theory": [
      "Stress is internal force per unit cross-sectional area; strain ε = ΔL / L is the resulting fractional deformation (dimensionless).",
      "A strain gauge is a resistive element bonded to a surface — as the surface strains, the gauge's resistance changes proportionally.",
      "Gauge factor GF = (ΔR/R) / ε. Metallic foil gauges typically have GF between 2 and 5.",
      "A Wheatstone bridge converts the small resistance change into a measurable output voltage. Full-bridge (4 active arms) gives the highest sensitivity and cancels temperature drift.",
      "A dummy (unstrained) gauge on an adjacent arm is used for temperature compensation."
    ],
    "procedure": [
      "Connect the active gauge in a quarter-bridge configuration with the bridge supply.",
      "Zero-balance the bridge with no load applied.",
      "Apply a series of known calibrated loads to the cantilever beam.",
      "Record the bridge output voltage for each load.",
      "Repeat with half and full bridge wiring and compare sensitivity.",
      "Plot load vs. output voltage and compute the gauge factor from the slope."
    ],
    "references": [
      "Doebelin, E.O. — Measurement Systems: Application & Design",
      "COEP Virtual Labs — Sensors Modeling & Simulation Lab"
    ],
    "pretest": [
      {
        "q": "What does a strain gauge primarily convert?",
        "options": [
          "Voltage to current",
          "Mechanical strain to resistance change",
          "Light to voltage",
          "Temperature to frequency"
        ],
        "answer": 1
      },
      {
        "q": "Strain (ε) is defined as:",
        "options": [
          "Force / Area",
          "ΔL / L",
          "R / V",
          "P × t"
        ],
        "answer": 1
      },
      {
        "q": "A Wheatstone bridge is used with strain gauges to:",
        "options": [
          "Amplify light",
          "Convert ΔR into a measurable voltage",
          "Store charge",
          "Generate heat"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Full-bridge configuration compared to quarter-bridge is:",
        "options": [
          "Less sensitive",
          "More sensitive & temperature compensated",
          "Only used for AC signals",
          "Unrelated to sensitivity"
        ],
        "answer": 1
      },
      {
        "q": "A dummy gauge is added mainly to:",
        "options": [
          "Increase cost",
          "Compensate for temperature effects",
          "Reduce gauge factor",
          "Add noise"
        ],
        "answer": 1
      },
      {
        "q": "Typical gauge factor for metallic foil gauges is:",
        "options": [
          "0.1–0.5",
          "2–5",
          "50–100",
          "1000+"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": "wheatstone-bridge",
    "tag": "WB-03",
    "title": "Wheatstone Bridge",
    "aim": "To study the Wheatstone bridge as a method for precision resistance measurement.",
    "objectives": [
      "Verify the bridge balance condition.",
      "Measure an unknown resistance using balance method.",
      "Study bridge sensitivity to small resistance changes."
    ],
    "theory": [
      "A Wheatstone bridge has four resistive arms R1, R2, R3, R4 with a galvanometer across the bridge diagonal.",
      "Balance condition: R1/R2 = R3/R4, which gives zero galvanometer deflection.",
      "An unknown resistance can be found precisely by adjusting a known arm until balance is achieved.",
      "When one arm's resistance changes slightly (as with a strain gauge), the bridge becomes unbalanced and produces an output proportional to that change.",
      "Bridge sensitivity depends on arm resistance ratios and the excitation voltage."
    ],
    "procedure": [
      "Set up the four-arm bridge with a known unknown resistor in one arm.",
      "Adjust the variable arm until the galvanometer reads zero.",
      "Compute the unknown resistance from the balance equation.",
      "Introduce a small resistance change and record the resulting unbalance voltage.",
      "Repeat for different excitation voltages and compare sensitivity."
    ],
    "references": [
      "Sawhney, A.K. — Electrical & Electronic Measurements"
    ],
    "pretest": [
      {
        "q": "Wheatstone bridge balance condition is:",
        "options": [
          "R1+R2 = R3+R4",
          "R1/R2 = R3/R4",
          "R1×R2 = R3×R4",
          "R1−R2 = R3"
        ],
        "answer": 1
      },
      {
        "q": "At balance, the galvanometer reads:",
        "options": [
          "Maximum",
          "Zero",
          "Infinity",
          "Negative"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Bridge sensitivity increases with:",
        "options": [
          "Lower excitation voltage",
          "Higher excitation voltage",
          "Removing one arm",
          "Using DC only"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": "thermocouple",
    "tag": "TC-04",
    "title": "Thermocouple",
    "aim": "To study temperature measurement using the Seebeck effect in a thermocouple.",
    "objectives": [
      "Plot thermocouple EMF vs. temperature.",
      "Understand cold-junction compensation.",
      "Compare linearity across thermocouple types."
    ],
    "theory": [
      "The Seebeck effect: a junction of two dissimilar metals generates an EMF proportional to the temperature difference between the junctions.",
      "One junction (measuring) is exposed to the process temperature; the other (reference/cold) is held at a known temperature.",
      "Cold-junction compensation corrects for reference-junction temperature drift so absolute temperature can be inferred.",
      "Common types — K, J, T — differ in metal pairs, usable range and linearity.",
      "Output is small (millivolt range) and mildly nonlinear over wide spans, requiring lookup tables or polynomial correction."
    ],
    "procedure": [
      "Set up the thermocouple with a known reference junction temperature.",
      "Heat the measuring junction through a series of known temperatures.",
      "Record the generated EMF at each temperature.",
      "Plot EMF vs. temperature and compare against standard reference tables."
    ],
    "references": [
      "Doebelin, E.O. — Measurement Systems",
      "ASTM thermocouple reference tables"
    ],
    "pretest": [
      {
        "q": "Thermocouples work on the principle of:",
        "options": [
          "Piezoelectric effect",
          "Seebeck effect",
          "Hall effect",
          "Photoelectric effect"
        ],
        "answer": 1
      },
      {
        "q": "Cold-junction compensation is needed because:",
        "options": [
          "The hot junction is unstable",
          "Reference junction temperature affects the reading",
          "It increases EMF",
          "It is optional for accuracy"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Thermocouple output is typically in the range of:",
        "options": [
          "Millivolts",
          "Kilovolts",
          "Amperes",
          "Ohms"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "rtd",
    "tag": "RT-05",
    "title": "RTD (Pt100)",
    "aim": "To study resistance-based temperature measurement using a Platinum RTD.",
    "objectives": [
      "Plot RTD resistance vs. temperature.",
      "Compare 2-wire, 3-wire and 4-wire configurations."
    ],
    "theory": [
      "An RTD exploits the near-linear increase of a pure metal's (usually platinum) resistance with temperature.",
      "A Pt100 has a resistance of 100 Ω at 0 °C, rising by a well-characterized coefficient per degree.",
      "RTDs are more linear and accurate than thermocouples but have slower response and need excitation current.",
      "3-wire and 4-wire configurations cancel lead-wire resistance error present in simple 2-wire hookups."
    ],
    "procedure": [
      "Connect the Pt100 in a 2-wire configuration and record resistance at known temperatures.",
      "Repeat with 3-wire and 4-wire configurations.",
      "Compare measured resistance error across configurations.",
      "Plot resistance vs. temperature and verify near-linearity."
    ],
    "references": [
      "IEC 60751 — RTD standard",
      "Doebelin, E.O. — Measurement Systems"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "thermistor",
    "tag": "TH-06",
    "title": "Thermistor",
    "aim": "To study the highly nonlinear resistance-temperature characteristic of a thermistor.",
    "objectives": [
      "Plot NTC thermistor resistance vs. temperature.",
      "Fit the exponential characteristic equation."
    ],
    "theory": [
      "A thermistor is a semiconductor resistor with a large temperature coefficient of resistance.",
      "NTC (negative temperature coefficient) thermistors are most common — resistance falls sharply as temperature rises.",
      "Characteristic equation: R = R0 · exp[β(1/T − 1/T0)], where β is the material constant.",
      "Far more sensitive than RTDs over a narrow range, but strongly nonlinear and needs linearization circuitry for wide-range use."
    ],
    "procedure": [
      "Immerse the thermistor in a temperature-controlled bath.",
      "Record resistance at a series of known temperatures.",
      "Plot R vs. T and fit against the exponential model to extract β."
    ],
    "references": [
      "Doebelin, E.O. — Measurement Systems"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "photodiode-ldr",
    "tag": "PD-07",
    "title": "Photodiode & LDR",
    "aim": "To compare photodiode and LDR as light-intensity sensors.",
    "objectives": [
      "Plot photodiode current vs. light intensity.",
      "Plot LDR resistance vs. light intensity.",
      "Compare response speed of both devices."
    ],
    "theory": [
      "A photodiode is a reverse-biased PN junction; incident light generates electron-hole pairs producing a photocurrent proportional to intensity, with fast response.",
      "An LDR (light-dependent resistor) is a photoconductive cell whose resistance decreases as light intensity increases, with slower response.",
      "Photodiodes suit precision, high-speed sensing; LDRs suit simple light-level switching applications."
    ],
    "procedure": [
      "Expose the photodiode to a calibrated light source at varying intensities and record photocurrent.",
      "Repeat for the LDR, recording resistance instead.",
      "Plot both characteristics and compare linearity and response time."
    ],
    "references": [
      "Sze, S.M. — Physics of Semiconductor Devices"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "piezoelectric",
    "tag": "PZ-08",
    "title": "Piezoelectric Sensor",
    "aim": "To study charge generation in a piezoelectric crystal under mechanical stress.",
    "objectives": [
      "Observe output charge/voltage vs. applied dynamic force.",
      "Understand why piezoelectric sensors cannot measure static loads."
    ],
    "theory": [
      "Certain crystals (quartz, PZT) generate an electric charge proportional to applied mechanical stress — the piezoelectric effect.",
      "Because generated charge leaks away through the sensor and circuit impedance, piezoelectric sensors respond only to dynamic (changing) loads, not static DC force.",
      "A charge amplifier converts the tiny generated charge into a usable voltage signal.",
      "Common uses: vibration, dynamic force, and impact/pressure sensing."
    ],
    "procedure": [
      "Apply a series of dynamic (impulse) forces to the piezoelectric sensor.",
      "Record the charge-amplifier output for each impulse.",
      "Hold a constant static force and observe the output decay to zero."
    ],
    "references": [
      "Doebelin, E.O. — Measurement Systems"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "hall-effect",
    "tag": "HE-09",
    "title": "Hall Effect Sensor",
    "aim": "To study the Hall effect for contactless magnetic field and position sensing.",
    "objectives": [
      "Plot Hall voltage vs. magnetic flux density.",
      "Understand contactless current/position sensing applications."
    ],
    "theory": [
      "When a current-carrying conductor is placed in a magnetic field perpendicular to the current, a transverse voltage (Hall voltage) is produced.",
      "Hall voltage is proportional to current, magnetic flux density, and inversely proportional to carrier thickness.",
      "Because it requires no physical contact with the moving part, it is used for position, speed, and current sensing."
    ],
    "procedure": [
      "Pass a constant current through the Hall element.",
      "Vary the applied magnetic flux density using a calibrated magnet/coil.",
      "Record the Hall voltage at each flux level and plot the characteristic."
    ],
    "references": [
      "Sze, S.M. — Physics of Semiconductor Devices"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "load-cell",
    "tag": "LC-10",
    "title": "Load Cell",
    "aim": "To study a strain-gauge based load cell for weight/force measurement.",
    "objectives": [
      "Calibrate load cell output against known weights.",
      "Determine linearity and full-scale accuracy."
    ],
    "theory": [
      "A load cell bonds multiple strain gauges to an elastic structural element (beam or column) wired as a Wheatstone bridge.",
      "Applied force deforms the element; the resulting bridge imbalance is calibrated directly in force/weight units.",
      "Full-bridge designs give high sensitivity and inherent temperature compensation, making load cells accurate for weighing applications."
    ],
    "procedure": [
      "Zero the load cell with no weight applied.",
      "Apply a series of known calibrated weights.",
      "Record the bridge output for each weight and plot the calibration curve.",
      "Compute linearity error against an ideal straight line."
    ],
    "references": [
      "Doebelin, E.O. — Measurement Systems"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "capacitive-displacement",
    "tag": "CD-11",
    "title": "Capacitive Displacement Sensor",
    "aim": "To study displacement sensing via capacitance change.",
    "objectives": [
      "Plot capacitance vs. plate separation.",
      "Understand non-contact high-resolution sensing."
    ],
    "theory": [
      "Parallel-plate capacitance: C = εA / d, where A is overlap area, d is plate separation, ε is the dielectric permittivity.",
      "Displacement can be sensed by varying d (separation) or A (overlap area), producing a corresponding capacitance change.",
      "Capacitive sensors offer very high resolution and non-contact operation but are sensitive to humidity and dielectric variations."
    ],
    "procedure": [
      "Set an initial plate separation and record baseline capacitance.",
      "Vary separation in small known steps and record capacitance at each step.",
      "Plot capacitance vs. displacement and identify the usable linear range."
    ],
    "references": [
      "Doebelin, E.O. — Measurement Systems"
    ],
    "pretest": [],
    "posttest": []
  },
  {
    "id": "op-amp",
    "tag": "OA-12",
    "title": "Op-Amp Characteristics",
    "aim": "To characterize practical operational amplifier parameters against the ideal model.",
    "objectives": [
      "Measure open-loop gain, CMRR and slew rate.",
      "Characterize inverting and non-inverting configurations."
    ],
    "theory": [
      "An ideal op-amp has infinite open-loop gain, infinite input impedance, zero output impedance and infinite bandwidth.",
      "Practical op-amps show finite open-loop gain, input offset voltage, limited common-mode rejection ratio (CMRR), finite slew rate, and bandwidth roll-off.",
      "Inverting and non-inverting amplifier configurations set closed-loop gain via feedback resistor ratios, trading gain for bandwidth and stability."
    ],
    "procedure": [
      "Measure open-loop gain by applying a small differential input and recording output.",
      "Configure as inverting amplifier; verify gain against Rf/Rin.",
      "Configure as non-inverting amplifier; verify gain against 1 + Rf/Rin.",
      "Apply a fast step input and measure slew rate from the output transition."
    ],
    "references": [
      "Sedra & Smith — Microelectronic Circuits"
    ],
    "pretest": [],
    "posttest": []
  },
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
      "The Kelvin bridge is a modification of the Wheatstone bridge and provides greatly increased accuracy in the measurement of low value resistances (typically below 1 ohm).",
      "It uses a second set of ratio arms to compensate for the resistance of the connecting leads and contacts, which would otherwise introduce significant error.",
      "At balance, the unknown resistance Rx is given by Rx = R3 * (R1/R2) = R3 * (a/b) where R1/R2 and a/b are the primary and secondary ratio arms respectively."
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
      "The Kelvin Double Bridge incorporates two sets of ratio arms. It is the industrial standard for measuring resistances from 1 micro-ohm to 1 ohm.",
      "By reversing the DC supply and taking the average of the two balance readings, thermoelectric EMFs generated at junctions can be perfectly canceled out.",
      "The condition for balance remains independent of the yoke resistance connecting the standard and unknown resistors if the inner and outer ratios are perfectly matched."
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
      "In its simplest form, the capacitance comparison bridge consists of two resistive arms and two capacitive arms.",
      "By adjusting the resistive arms, both the magnitude and the phase angle of the unknown capacitor can be balanced against a standard loss-free capacitor.",
      "At balance: Cx = C_std * (R1/R2) and rx = r_std * (R2/R1)."
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
      "This bridge compares an unknown inductance with a standard variable inductance.",
      "Because it uses a standard inductor, it is rarely used for precise measurements due to the bulkiness and magnetic interference of standard inductors.",
      "At balance: Lx = L_std * (R2/R3) and Rx = R_std * (R2/R3)."
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
      "Also known as the Maxwell-Wien bridge, this circuit measures an unknown inductance in terms of a known capacitance.",
      "This is highly advantageous because standard capacitors are compact, perfectly shielded, and nearly loss-free compared to standard inductors.",
      "At balance: Lx = R2 * R3 * C4 and Rx = (R2 * R3) / R4."
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
      "Hay’s bridge is a modification of Maxwell’s bridge. It connects the standard capacitor in series with a resistor rather than in parallel.",
      "This series configuration makes the bridge perfectly suited for measuring high-Q coils (where the inductive reactance is much larger than the resistance).",
      "For high Q coils, the balance equations become nearly independent of frequency."
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
      "The Anderson bridge is an AC bridge used to measure self-inductance in terms of a standard capacitor. It is a modification of the Maxwell-Wien bridge.",
      "Unlike the Maxwell bridge which requires a variable capacitor, the Anderson bridge achieves balance by using a fixed standard capacitor and a variable resistor.",
      "It is highly accurate for measuring low-Q coils, though the balance equations are significantly more complex."
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
      "Schering bridge is extensively used for measuring capacitance and the dielectric loss (dissipation factor) of capacitors and insulating cables.",
      "At balance: Cx = C2 * (R4/R3).",
      "The dissipation factor D = ω * C4 * R4."
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
      "Wien’s bridge is primarily used for the precision measurement of audio frequencies.",
      "The bridge consists of a series RC combination in one arm and a parallel RC combination in the adjoining arm.",
      "At balance, the frequency is given by f = 1 / (2 * π * √(R1*R2*C1*C2)). If R1=R2=R and C1=C2=C, then f = 1 / (2πRC)."
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
      "Transformer ratio arm bridges replace the conventional resistive ratio arms with an inductive voltage divider (a tightly coupled transformer).",
      "This design offers incredible accuracy (up to 1 part in 10^8) and completely immunizes the bridge against stray capacitances to ground.",
      "It is widely used in national standards laboratories for calibrating capacitors and inductors."
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
    ]
  }
];