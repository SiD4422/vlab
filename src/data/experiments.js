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
      "A Strain Gauge is a resistive sensor whose resistance changes with applied force; it is essentially a resistor that stretches or compresses.",
      "Resistance is measured in Ohms (Ω), representing the opposition to current flow in the gauge.",
      "Stress is internal force per unit cross-sectional area; strain ε = ΔL / L is the resulting fractional deformation (dimensionless).",
      "Gauge factor GF = (ΔR/R) / ε. Metallic foil gauges typically have GF between 2 and 5.",
      "A Wheatstone bridge converts the small resistance change (ΔR) into a measurable output voltage (ΔV).",
      "Where: ΔV = Output voltage, V_in = Input excitation voltage, GF = Gauge Factor, ε = Strain.",
      "Formula: ΔV = V_in * (GF * ε) / 4 for a quarter-bridge setup."
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
      "A Resistor is a passive electrical component that limits or regulates the flow of electrical current.",
      "Resistance is measured in Ohms (Ω), which quantifies the opposition to the current flow.",
      "The Wheatstone bridge consists of four resistive arms together with a source of EMF and a null detector (galvanometer).",
      "When the bridge is balanced, no current flows through the galvanometer, indicating that the potential at both terminals is equal.",
      "Where: P and Q are known ratio arm resistances, R is a known adjustable standard resistance, and Rx is the unknown resistance.",
      "Balance Formula: P × Rx = Q × R",
      "This gives the unknown resistance as Rx = (Q × R) / P."
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
        "q": "Wheatstone bridge is primarily used for measuring:",
        "options": [
          "Very low resistance",
          "Medium resistance (1Ω to 1MΩ)",
          "Very high resistance",
          "Inductance"
        ],
        "answer": 1
      },
      {
        "q": "The balance condition of a Wheatstone bridge is:",
        "options": [
          "P/Q = R/S",
          "P+Q = R+S",
          "P-Q = R-S",
          "P*Q = R*S"
        ],
        "answer": 0
      },
      {
        "q": "At balance, the current through the galvanometer is:",
        "options": [
          "Maximum",
          "Minimum",
          "Zero",
          "Infinity"
        ],
        "answer": 2
      },
      {
        "q": "The sensitivity of a Wheatstone bridge depends on:",
        "options": [
          "Only the galvanometer",
          "Only the battery voltage",
          "The ratio arms and battery voltage",
          "The connecting wires"
        ],
        "answer": 2
      },
      {
        "q": "Which component is used as a null detector in DC Wheatstone bridge?",
        "options": [
          "Oscilloscope",
          "Voltmeter",
          "Galvanometer",
          "Ammeter"
        ],
        "answer": 2
      }
    ],
    "posttest": [
      {
        "q": "If the battery and galvanometer are interchanged at balance condition, the bridge:",
        "options": [
          "Becomes unbalanced",
          "Remains balanced",
          "Burns out",
          "Reverses polarity"
        ],
        "answer": 1
      },
      {
        "q": "Wheatstone bridge is NOT suitable for very low resistance measurement because:",
        "options": [
          "It requires high voltage",
          "Contact and lead resistances cause significant errors",
          "The galvanometer is too sensitive",
          "It only measures AC"
        ],
        "answer": 1
      },
      {
        "q": "To increase the sensitivity of the bridge, the resistance of the arms should be:",
        "options": [
          "Very high",
          "Very low",
          "Comparable to the unknown resistance",
          "Zero"
        ],
        "answer": 2
      },
      {
        "q": "In an unbalanced Wheatstone bridge, the current through the galvanometer can be found using:",
        "options": [
          "Ohm's Law only",
          "Faraday's Law",
          "Thevenin's Theorem",
          "Lenz's Law"
        ],
        "answer": 2
      },
      {
        "q": "A Wheatstone bridge is most sensitive when all four arms have:",
        "options": [
          "Equal resistance",
          "Zero resistance",
          "Infinite resistance",
          "Different resistances by factor of 10"
        ],
        "answer": 0
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
          "Peltier effect",
          "Seebeck effect",
          "Thomson effect",
          "Joule heating"
        ],
        "answer": 1
      },
      {
        "q": "The Seebeck effect states that an EMF is generated when:",
        "options": [
          "Two identical metals are heated",
          "Two dissimilar metals are joined at two junctions at different temperatures",
          "A current passes through a junction",
          "A magnetic field is applied"
        ],
        "answer": 1
      },
      {
        "q": "What is cold-junction compensation?",
        "options": [
          "Cooling the sensor with ice",
          "Correcting the EMF for the reference junction temperature",
          "Heating the measuring junction",
          "Removing the reference junction"
        ],
        "answer": 1
      },
      {
        "q": "Thermocouple output is typically in the range of:",
        "options": [
          "Microvolts to Millivolts",
          "Volts",
          "Kilovolts",
          "Amperes"
        ],
        "answer": 0
      },
      {
        "q": "Which thermocouple type is most common for general purpose (Nickel-Chromium / Nickel-Alumel)?",
        "options": [
          "Type J",
          "Type K",
          "Type T",
          "Type S"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Compared to RTDs, thermocouples are generally:",
        "options": [
          "More accurate and slower",
          "Less accurate but have a wider temperature range and faster response",
          "More linear",
          "Only used for cryogenic temperatures"
        ],
        "answer": 1
      },
      {
        "q": "If the reference junction is at 25°C instead of 0°C, the generated EMF will be:",
        "options": [
          "Higher than expected",
          "Lower than expected",
          "Exactly the same",
          "Zero"
        ],
        "answer": 1
      },
      {
        "q": "The relationship between temperature and EMF in a thermocouple is:",
        "options": [
          "Perfectly linear",
          "Exponential",
          "Non-linear over wide ranges",
          "Inversely proportional"
        ],
        "answer": 2
      },
      {
        "q": "Which law allows the use of extension wires of different materials?",
        "options": [
          "Law of Homogeneous Metals",
          "Law of Intermediate Metals",
          "Law of Intermediate Temperatures",
          "Ohm's Law"
        ],
        "answer": 1
      },
      {
        "q": "A Type K thermocouple produces approximately how much voltage per °C?",
        "options": [
          "1 V/°C",
          "41 µV/°C",
          "100 mV/°C",
          "1 nV/°C"
        ],
        "answer": 1
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
    "pretest": [
      {
        "q": "RTD stands for:",
        "options": [
          "Real Time Detector",
          "Resistance Temperature Detector",
          "Rapid Thermal Diode",
          "Resistor Tuning Device"
        ],
        "answer": 1
      },
      {
        "q": "The most common metal used for industrial RTDs is:",
        "options": [
          "Copper",
          "Nickel",
          "Platinum",
          "Gold"
        ],
        "answer": 2
      },
      {
        "q": "A Pt100 RTD has a resistance of 100 Ohms at what temperature?",
        "options": [
          "100 °C",
          "0 °C",
          "25 °C",
          "-100 °C"
        ],
        "answer": 1
      },
      {
        "q": "The temperature coefficient of resistance for platinum is approximately:",
        "options": [
          "Negative",
          "0.00385 Ω/Ω/°C",
          "0.1 Ω/Ω/°C",
          "Zero"
        ],
        "answer": 1
      },
      {
        "q": "An RTD requires which of the following to measure temperature?",
        "options": [
          "A magnetic field",
          "An excitation current",
          "A reference junction",
          "High voltage"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Why is a 3-wire or 4-wire RTD configuration used?",
        "options": [
          "To increase the RTD resistance",
          "To cancel out lead wire resistance errors",
          "To measure 3 or 4 different temperatures",
          "To provide mechanical support"
        ],
        "answer": 1
      },
      {
        "q": "Compared to a thermocouple, an RTD is:",
        "options": [
          "More accurate and more linear",
          "Faster responding",
          "Cheaper",
          "Capable of measuring much higher temperatures (>2000°C)"
        ],
        "answer": 0
      },
      {
        "q": "Self-heating in an RTD is caused by:",
        "options": [
          "The ambient environment",
          "The excitation current passing through it",
          "Friction",
          "The Seebeck effect"
        ],
        "answer": 1
      },
      {
        "q": "At 100°C, a Pt100 RTD will have a resistance of approximately:",
        "options": [
          "100 Ω",
          "138.5 Ω",
          "200 Ω",
          "0 Ω"
        ],
        "answer": 1
      },
      {
        "q": "Platinum is preferred for RTDs because:",
        "options": [
          "It is the cheapest metal",
          "It has the highest temperature coefficient",
          "It is chemically stable and highly linear",
          "It has a negative temperature coefficient"
        ],
        "answer": 2
      }
    ]
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
    "pretest": [
      {
        "q": "A thermistor is typically made from:",
        "options": [
          "Pure Platinum",
          "Semiconductor ceramic materials",
          "Copper-Nickel alloys",
          "Quartz crystals"
        ],
        "answer": 1
      },
      {
        "q": "Most common thermistors are NTC, which means:",
        "options": [
          "No Temperature Coefficient",
          "Negative Temperature Coefficient",
          "Neutral Temperature Coefficient",
          "Normal Temperature Coefficient"
        ],
        "answer": 1
      },
      {
        "q": "In an NTC thermistor, as temperature increases, resistance:",
        "options": [
          "Increases linearly",
          "Decreases exponentially",
          "Remains constant",
          "Increases exponentially"
        ],
        "answer": 1
      },
      {
        "q": "Compared to RTDs and Thermocouples, Thermistors have:",
        "options": [
          "Much lower sensitivity",
          "Much higher sensitivity over a narrow range",
          "Perfect linearity",
          "Higher maximum operating temperatures"
        ],
        "answer": 1
      },
      {
        "q": "Thermistors are often used for:",
        "options": [
          "Furnace temperature measurement (>1500°C)",
          "Cold junction compensation and biomedical measurements",
          "Measuring voltage",
          "Generating power"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "The Steinhart-Hart equation is used to:",
        "options": [
          "Calculate power dissipation",
          "Accurately model the non-linear Resistance-Temperature curve of a thermistor",
          "Determine the Seebeck coefficient",
          "Linearize an RTD"
        ],
        "answer": 1
      },
      {
        "q": "Which parameter defines the sensitivity of an NTC thermistor?",
        "options": [
          "Alpha (α)",
          "Beta (β) constant",
          "Gauge factor",
          "Young's modulus"
        ],
        "answer": 1
      },
      {
        "q": "To use a thermistor in a linear circuit, it is often:",
        "options": [
          "Heated externally",
          "Placed in parallel or series with a fixed resistor",
          "Operated at high voltage",
          "Cooled to absolute zero"
        ],
        "answer": 1
      },
      {
        "q": "A PTC thermistor is one where:",
        "options": [
          "Resistance increases with temperature",
          "Resistance decreases with temperature",
          "Resistance is independent of temperature",
          "Phase changes with temperature"
        ],
        "answer": 0
      },
      {
        "q": "Thermistors are generally NOT suitable for:",
        "options": [
          "Precision medical thermometers",
          "Battery pack temperature monitoring",
          "Very wide temperature spans (e.g. -200°C to 1000°C)",
          "Inrush current limiting"
        ],
        "answer": 2
      }
    ]
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
    "pretest": [
      {
        "q": "LDR stands for:",
        "options": [
          "Light Deflection Ray",
          "Light Dependent Resistor",
          "Laser Diode Rectifier",
          "Linear Distance Range"
        ],
        "answer": 1
      },
      {
        "q": "The resistance of an LDR:",
        "options": [
          "Increases with light intensity",
          "Decreases with light intensity",
          "Is independent of light",
          "Oscillates with light"
        ],
        "answer": 1
      },
      {
        "q": "A photodiode is typically operated in:",
        "options": [
          "Forward bias",
          "Reverse bias",
          "Zero bias only",
          "AC mode only"
        ],
        "answer": 1
      },
      {
        "q": "When light hits a photodiode, it generates:",
        "options": [
          "Heat",
          "Electron-hole pairs, causing a photocurrent",
          "Magnetic flux",
          "Resistance"
        ],
        "answer": 1
      },
      {
        "q": "Comparing LDR and Photodiode response times:",
        "options": [
          "LDR is much faster",
          "Photodiode is much faster (nanoseconds)",
          "They are identical",
          "Neither responds to light changes"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "LDRs are typically made from which material?",
        "options": [
          "Silicon",
          "Cadmium Sulfide (CdS)",
          "Platinum",
          "Quartz"
        ],
        "answer": 1
      },
      {
        "q": "In a photodiode, dark current is:",
        "options": [
          "Current flowing when there is maximum light",
          "Leakage current flowing in reverse bias when there is no light",
          "Current that emits dark light",
          "The current required to power the diode"
        ],
        "answer": 1
      },
      {
        "q": "Which sensor is better suited for high-speed optical communications?",
        "options": [
          "LDR",
          "Photodiode",
          "Thermistor",
          "Strain Gauge"
        ],
        "answer": 1
      },
      {
        "q": "The photocurrent in a photodiode is highly:",
        "options": [
          "Non-linear with respect to light intensity",
          "Linear with respect to light intensity",
          "Dependent on the ambient temperature only",
          "Unpredictable"
        ],
        "answer": 1
      },
      {
        "q": "An LDR's resistance-illuminance curve is typically:",
        "options": [
          "Linear",
          "Logarithmic / Exponential",
          "A step function",
          "Constant"
        ],
        "answer": 1
      }
    ]
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
    "pretest": [
      {
        "q": "The Piezoelectric effect is the generation of electrical charge due to:",
        "options": [
          "Heat",
          "Light",
          "Applied mechanical stress",
          "Magnetic fields"
        ],
        "answer": 2
      },
      {
        "q": "Which of the following materials is naturally piezoelectric?",
        "options": [
          "Copper",
          "Silicon",
          "Quartz",
          "Iron"
        ],
        "answer": 2
      },
      {
        "q": "Piezoelectric sensors generate an output only when:",
        "options": [
          "The applied force is constant (DC)",
          "The applied force is dynamic or changing (AC)",
          "The temperature changes",
          "Placed in a vacuum"
        ],
        "answer": 1
      },
      {
        "q": "The output of a bare piezoelectric crystal is a:",
        "options": [
          "High current signal",
          "High voltage, low charge signal",
          "Low voltage, high current signal",
          "Magnetic signal"
        ],
        "answer": 1
      },
      {
        "q": "A common application for piezoelectric sensors is:",
        "options": [
          "Weighing scales",
          "Vibration and shock measurement",
          "Temperature measurement",
          "Light sensing"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "Why can't piezoelectric sensors measure static (constant) forces?",
        "options": [
          "They break under static load",
          "The generated charge leaks away through the circuit insulation",
          "They only respond to gravity",
          "Static forces generate too much voltage"
        ],
        "answer": 1
      },
      {
        "q": "To measure the tiny charge from a piezoelectric sensor, we use a:",
        "options": [
          "Voltage divider",
          "Charge amplifier",
          "Current transformer",
          "Wheatstone bridge"
        ],
        "answer": 1
      },
      {
        "q": "PZT stands for:",
        "options": [
          "Piezo Zinc Titanate",
          "Lead Zirconate Titanate",
          "Phosphorus Zinc Tin",
          "Platinum Zirconium Tungsten"
        ],
        "answer": 1
      },
      {
        "q": "The inverse piezoelectric effect is used in:",
        "options": [
          "Accelerometers",
          "Microphones",
          "Ultrasonic transmitters / actuators",
          "Thermometers"
        ],
        "answer": 2
      },
      {
        "q": "The charge generated (Q) by a piezoelectric crystal is given by Q = d × F, where 'd' is:",
        "options": [
          "Distance",
          "Diameter",
          "Piezoelectric charge constant",
          "Density"
        ],
        "answer": 2
      }
    ]
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
    "pretest": [
      {
        "q": "The Hall Effect describes the generation of a voltage across a conductor when:",
        "options": [
          "It is heated",
          "Placed in a transverse magnetic field while carrying current",
          "Exposed to light",
          "Stretched physically"
        ],
        "answer": 1
      },
      {
        "q": "The generated Hall voltage is proportional to:",
        "options": [
          "Only the current",
          "Only the magnetic field",
          "Both the current and the magnetic field",
          "The length of the wire"
        ],
        "answer": 2
      },
      {
        "q": "Hall effect sensors are widely used for:",
        "options": [
          "Temperature measurement",
          "Contactless position and speed sensing",
          "Strain measurement",
          "Light intensity sensing"
        ],
        "answer": 1
      },
      {
        "q": "The Hall voltage is inversely proportional to the:",
        "options": [
          "Current density",
          "Magnetic flux density",
          "Charge carrier density and material thickness",
          "Temperature"
        ],
        "answer": 2
      },
      {
        "q": "Hall effect sensors are typically made from:",
        "options": [
          "Insulators",
          "Semiconductors (like GaAs or InSb)",
          "Pure copper",
          "Ferromagnetic metals"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "If the direction of the magnetic field is reversed, the Hall voltage:",
        "options": [
          "Remains the same",
          "Becomes zero",
          "Reverses polarity",
          "Doubles"
        ],
        "answer": 2
      },
      {
        "q": "A Hall effect sensor can measure DC current in a wire without breaking the circuit by:",
        "options": [
          "Measuring the heat generated",
          "Measuring the magnetic field generated around the wire",
          "Measuring the voltage drop across the insulation",
          "Inductive coupling"
        ],
        "answer": 1
      },
      {
        "q": "The Hall coefficient (Rh) is related to:",
        "options": [
          "The physical size of the magnet",
          "The type and density of charge carriers in the material",
          "The color of the material",
          "The resistance of the connecting wires"
        ],
        "answer": 1
      },
      {
        "q": "In a P-type semiconductor, the Hall voltage polarity is:",
        "options": [
          "Opposite to that of an N-type semiconductor",
          "The same as an N-type semiconductor",
          "Always zero",
          "Random"
        ],
        "answer": 0
      },
      {
        "q": "Which of the following is NOT an application of a Hall effect sensor?",
        "options": [
          "Anti-lock braking systems (ABS) speed sensors",
          "Brushless DC motor commutation",
          "Smartphone compass",
          "Measuring optical wavelength"
        ],
        "answer": 3
      }
    ]
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
    "pretest": [
      {
        "q": "A strain-gauge load cell measures weight by:",
        "options": [
          "Converting mass directly to voltage",
          "Deforming a structural element to strain the attached gauges",
          "Using piezoelectric crystals",
          "Measuring the capacitance of the object"
        ],
        "answer": 1
      },
      {
        "q": "Most industrial load cells use which bridge configuration?",
        "options": [
          "Quarter-bridge",
          "Half-bridge",
          "Full Wheatstone bridge",
          "Kelvin bridge"
        ],
        "answer": 2
      },
      {
        "q": "The output of a standard load cell is usually expressed in:",
        "options": [
          "Volts (V)",
          "Millivolts per Volt (mV/V)",
          "Amperes (A)",
          "Ohms (Ω)"
        ],
        "answer": 1
      },
      {
        "q": "Why are four active strain gauges used in a full-bridge load cell?",
        "options": [
          "To make it cheaper",
          "To maximize sensitivity and provide automatic temperature compensation",
          "To increase the resistance",
          "To allow AC excitation"
        ],
        "answer": 1
      },
      {
        "q": "Creep in a load cell refers to:",
        "options": [
          "The physical movement of the scale",
          "The change in output over time while the load remains constant",
          "The maximum weight it can measure",
          "The initial zero-balance error"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "If a 2 mV/V load cell is excited with 10V, what is the full-scale output voltage?",
        "options": [
          "2 mV",
          "10 mV",
          "20 mV",
          "200 mV"
        ],
        "answer": 2
      },
      {
        "q": "Non-linearity in a load cell is:",
        "options": [
          "The maximum deviation of the calibration curve from a straight line",
          "The effect of temperature on the output",
          "The failure of the strain gauge",
          "The zero offset"
        ],
        "answer": 0
      },
      {
        "q": "A load cell must be carefully protected from:",
        "options": [
          "Side loading and shock overloads",
          "DC voltage",
          "Darkness",
          "Radio waves"
        ],
        "answer": 0
      },
      {
        "q": "Hysteresis in a load cell means:",
        "options": [
          "It gets hot during use",
          "The reading for a given load differs depending on whether the load was increasing or decreasing",
          "It only measures AC forces",
          "The output is delayed in time"
        ],
        "answer": 1
      },
      {
        "q": "The elastic element inside a bending-beam load cell is usually made of:",
        "options": [
          "Plastic",
          "Glass",
          "High-strength aluminum or steel alloys",
          "Copper"
        ],
        "answer": 2
      }
    ]
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
    "pretest": [
      {
        "q": "The capacitance of a parallel plate capacitor is given by C = ?",
        "options": [
          "ε*A/d",
          "ε*d/A",
          "A/(ε*d)",
          "d/(ε*A)"
        ],
        "answer": 0
      },
      {
        "q": "Capacitive sensors can measure displacement by varying:",
        "options": [
          "Only the plate separation distance (d)",
          "Only the plate overlap area (A)",
          "The dielectric, distance, or overlap area",
          "The mass of the plates"
        ],
        "answer": 2
      },
      {
        "q": "When the distance (d) between the plates decreases, the capacitance:",
        "options": [
          "Decreases",
          "Increases",
          "Remains constant",
          "Becomes zero"
        ],
        "answer": 1
      },
      {
        "q": "Capacitive displacement sensors are advantageous because they are:",
        "options": [
          "Contacting and high friction",
          "Non-contacting and offer extremely high resolution",
          "Immune to stray capacitance",
          "Very cheap and low precision"
        ],
        "answer": 1
      },
      {
        "q": "A typical application of a capacitive displacement sensor is:",
        "options": [
          "Measuring fluid flow rate",
          "Measuring the thickness of a web/sheet during manufacturing",
          "Measuring high temperatures",
          "Detecting magnetic fields"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "A limitation of capacitive sensors is that they are sensitive to:",
        "options": [
          "Magnetic fields",
          "Changes in environmental humidity (which changes dielectric constant)",
          "Ambient light",
          "Gravity"
        ],
        "answer": 1
      },
      {
        "q": "To measure capacitance changes, the sensor is typically part of a:",
        "options": [
          "DC Wheatstone bridge",
          "AC bridge or an oscillator circuit",
          "Charge amplifier",
          "Thermocouple circuit"
        ],
        "answer": 1
      },
      {
        "q": "If a capacitive sensor works by changing the overlap area, its output is:",
        "options": [
          "Linearly proportional to displacement",
          "Inversely proportional to displacement",
          "Exponential",
          "Sinusoidal"
        ],
        "answer": 0
      },
      {
        "q": "If a capacitive sensor works by changing the distance (d), its output is:",
        "options": [
          "Linearly proportional to d",
          "Inversely proportional to d (non-linear)",
          "Independent of d",
          "Zero"
        ],
        "answer": 1
      },
      {
        "q": "Guard rings are used in precision capacitive sensors to:",
        "options": [
          "Protect the sensor from physical damage",
          "Eliminate fringing edge effects and ensure a uniform electric field",
          "Increase the capacitance artificially",
          "Prevent electric shocks"
        ],
        "answer": 1
      }
    ]
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
    "pretest": [
      {
        "q": "An ideal operational amplifier has an input impedance of:",
        "options": [
          "Zero",
          "100 Ohms",
          "Infinity",
          "Negative"
        ],
        "answer": 2
      },
      {
        "q": "The open-loop gain of an ideal op-amp is:",
        "options": [
          "1",
          "100",
          "Zero",
          "Infinite"
        ],
        "answer": 3
      },
      {
        "q": "CMRR stands for:",
        "options": [
          "Common Mode Rejection Ratio",
          "Current Measurement Resistance Ratio",
          "Closed-loop Maximum Response Rate",
          "Capacitive Mode Reduction Ratio"
        ],
        "answer": 0
      },
      {
        "q": "In an inverting amplifier configuration, if Rin=10kΩ and Rf=100kΩ, the voltage gain is:",
        "options": [
          "10",
          "-10",
          "11",
          "-0.1"
        ],
        "answer": 1
      },
      {
        "q": "Slew rate defines the op-amp's maximum rate of change of:",
        "options": [
          "Input voltage",
          "Output voltage",
          "Input bias current",
          "Offset null"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "A high CMRR means the op-amp is very good at:",
        "options": [
          "Amplifying high frequencies",
          "Rejecting noise that appears equally on both inputs",
          "Driving heavy loads",
          "Consuming very little power"
        ],
        "answer": 1
      },
      {
        "q": "Gain-Bandwidth Product (GBP) implies that:",
        "options": [
          "Gain and bandwidth are independent",
          "As closed-loop gain increases, bandwidth decreases proportionally",
          "Bandwidth is infinite regardless of gain",
          "Gain decreases at low frequencies"
        ],
        "answer": 1
      },
      {
        "q": "Input offset voltage is defined as:",
        "options": [
          "The maximum input voltage allowed",
          "The voltage required across the input terminals to drive the output to zero volts",
          "The voltage at the output when inputs are saturated",
          "The supply voltage"
        ],
        "answer": 1
      },
      {
        "q": "In a non-inverting amplifier, if Rin=10kΩ and Rf=100kΩ, the voltage gain is:",
        "options": [
          "10",
          "-10",
          "11",
          "-11"
        ],
        "answer": 2
      },
      {
        "q": "If an op-amp has a slew rate of 1 V/µs, how long will it take the output to change by 10V?",
        "options": [
          "1 µs",
          "10 µs",
          "0.1 µs",
          "100 µs"
        ],
        "answer": 1
      }
    ]
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
    ]
  }
];
