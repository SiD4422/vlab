export const EXPERIMENTS = [
  {
    "id": "wheatstone-bridge",
    "tag": "DC-01",
    "title": "Wheatstone Bridge",
    "aim": "To determine the value of an unknown resistance using a Wheatstone bridge.",
    "objectives": [
      "Understand the principle of a Wheatstone bridge.",
      "Balance the bridge to find the null point.",
      "Calculate unknown resistance accurately."
    ],
    "theory": [
      "A Wheatstone bridge is an electrical circuit used to measure an unknown electrical resistance by balancing two legs of a bridge circuit.",
      "It consists of four resistors forming a quadrilateral. A galvanometer is connected between two opposite junctions, and a voltage source is connected across the other two.",
      "The bridge is balanced when the current through the galvanometer is zero.",
      "At balance, the ratio of the resistances in one leg equals the ratio in the other leg: R1/R2 = R3/Rx.",
      "The unknown resistance Rx can be calculated as: Rx = (R3 × R2) / R1."
    ],
    "procedure": [
      "Open the Circuit Sandbox and place four resistors in a diamond shape.",
      "Place an unknown resistor (Rx) as one of the arms.",
      "Connect a galvanometer across the middle of the bridge and a 9V battery across the ends.",
      "Adjust the standard resistors until the galvanometer reads exactly 0 mA.",
      "Use the balance equation to calculate the value of Rx and verify it in the inspector."
    ],
    "references": [
      "A.K. Sawhney - Electrical Measurements"
    ],
    "pretest": [
      {
        "q": "Info: The Wheatstone Bridge measures unknown electrical resistance by balancing two legs of a bridge circuit. Prerequisite: Ohm's law, Kirchhoff's laws, and galvanometer operation. What is the fundamental principle used to derive the balance equation?",
        "options": [
          "Kirchhoff's Current Law at the source",
          "Kirchhoff's Voltage Law around the loops",
          "Faraday's Law of Induction",
          "Ampere's Circuital Law"
        ],
        "answer": 1
      },
      {
        "q": "In a precision Wheatstone bridge, which factor most severely limits the accuracy when measuring resistances below 1Ω?",
        "options": [
          "Thermoelectric EMFs",
          "Galvanometer sensitivity",
          "Contact and lead wire resistances",
          "Source voltage fluctuations"
        ],
        "answer": 2
      },
      {
        "q": "If the battery voltage in a Wheatstone bridge is increased by 50%, the balance point will:",
        "options": [
          "Shift to the right",
          "Shift to the left",
          "Remain unaffected",
          "Fluctuate continuously"
        ],
        "answer": 2
      },
      {
        "q": "Why is a Wheatstone bridge unsuitable for measuring resistances in the mega-ohm range?",
        "options": [
          "The battery cannot provide enough voltage",
          "Leakage currents through insulation become comparable to the measured current",
          "The galvanometer becomes too sensitive",
          "Thermoelectric EMFs dominate the reading"
        ],
        "answer": 1
      },
      {
        "q": "The sensitivity of a Wheatstone bridge is maximum when:",
        "options": [
          "The ratio arms P and Q are very large",
          "The unknown resistance Rx is very small",
          "All four arms have equal resistance",
          "The galvanometer resistance is zero"
        ],
        "answer": 2
      },
      {
        "q": "If a Wheatstone bridge is balanced with DC, what happens if an AC source of the same RMS voltage is used instead (assuming purely resistive arms)?",
        "options": [
          "The bridge becomes unbalanced due to skin effect",
          "The bridge remains balanced, but a DC galvanometer must be replaced with an AC detector",
          "The bridge oscillates",
          "The balance point shifts slightly"
        ],
        "answer": 1
      },
      {
        "q": "Which of the following errors is NOT eliminated by taking two readings with reversed battery polarity?",
        "options": [
          "Thermoelectric EMFs",
          "Zero error of the galvanometer",
          "Contact resistance",
          "Asymmetry in ratio arms"
        ],
        "answer": 2
      },
      {
        "q": "In a Carey Foster bridge (a modification of Wheatstone), the balance condition primarily depends on:",
        "options": [
          "The absolute resistance of all four arms",
          "The difference between two nearly equal resistances and the resistance per unit length of the slide wire",
          "The voltage of the battery",
          "The internal resistance of the galvanometer"
        ],
        "answer": 1
      },
      {
        "q": "Why is a high-resistance galvanometer preferred over a low-resistance one for a high-impedance Wheatstone bridge?",
        "options": [
          "To draw less current and provide better voltage sensitivity matching the Thevenin impedance",
          "To prevent burning out the battery",
          "To increase the current through the unknown resistance",
          "To reduce the effects of temperature"
        ],
        "answer": 0
      },
      {
        "q": "If the standard arm 'S' in a Wheatstone bridge is a decade resistance box with a minimum step of 1Ω, how can you measure Rx = 0.5Ω accurately?",
        "options": [
          "It is impossible",
          "Set the ratio arms P/Q to 10 or 100",
          "Set the ratio arms P/Q to 0.1 or 0.01",
          "Use a larger battery"
        ],
        "answer": 2
      }
    ],
    "posttest": [
      {
        "q": "A Wheatstone bridge has ratio arms P=1000Ω, Q=10Ω. The bridge is balanced when standard arm S=24.5Ω. What is the value of Rx?",
        "options": [
          "0.245 Ω",
          "2.45 Ω",
          "2450 Ω",
          "24.5 kΩ"
        ],
        "answer": 0
      },
      {
        "q": "If the galvanometer and battery are swapped in a balanced Wheatstone bridge, the bridge:",
        "options": [
          "Becomes unbalanced",
          "Burns out",
          "Remains balanced",
          "Oscillates"
        ],
        "answer": 2
      },
      {
        "q": "A Wheatstone bridge is slightly unbalanced. The Thevenin equivalent resistance looking into the galvanometer terminals is:",
        "options": [
          "The sum of all four bridge resistors",
          "The parallel combination of the adjacent arms",
          "Dependent on the battery's internal resistance",
          "The series-parallel equivalent of the four bridge arms"
        ],
        "answer": 3
      },
      {
        "q": "If a 100Ω resistor in the ratio arm has a temperature coefficient of 50 ppm/°C, and its temperature rises by 10°C, the percentage error introduced in the measurement is:",
        "options": [
          "0.05%",
          "0.5%",
          "0.005%",
          "5%"
        ],
        "answer": 0
      },
      {
        "q": "Which of the following modifications converts a Wheatstone bridge into a Carey Foster bridge?",
        "options": [
          "Adding capacitors in parallel",
          "Including a slide wire to measure the difference between two nearly equal resistances",
          "Replacing the DC source with an AC oscillator",
          "Using two galvanometers"
        ],
        "answer": 1
      },
      {
        "q": "A Wheatstone bridge is balanced with P=100Ω, Q=1000Ω, S=120Ω. If P and Q are inadvertently swapped, what must S be changed to in order to restore balance?",
        "options": [
          "1.2 Ω",
          "12 Ω",
          "1200 Ω",
          "12000 Ω"
        ],
        "answer": 0
      },
      {
        "q": "Calculate the Thevenin equivalent voltage across the galvanometer terminals if V_battery = 10V, P=10Ω, Q=10Ω, R=10Ω, S=11Ω (slightly unbalanced).",
        "options": [
          "~0.24 V",
          "~0.5 V",
          "~1.0 V",
          "~0.024 V"
        ],
        "answer": 0
      },
      {
        "q": "If the galvanometer has a resistance of 50Ω and a current sensitivity of 1 µA/div, what is the minimum unbalanced voltage it can detect?",
        "options": [
          "50 µV",
          "5 µV",
          "0.5 µV",
          "500 µV"
        ],
        "answer": 0
      },
      {
        "q": "In a bridge with P=100Ω±1% and Q=100Ω±1%, what is the worst-case percentage error in the ratio P/Q?",
        "options": [
          "0%",
          "1%",
          "2%",
          "4%"
        ],
        "answer": 2
      },
      {
        "q": "A 100Ω resistor has a self-heating coefficient of 0.1°C/mW. If the bridge current through it is 100mA, what is its temperature rise?",
        "options": [
          "1°C",
          "10°C",
          "100°C",
          "1000°C"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "wb_q3",
        "question": "What is the condition for a Wheatstone bridge to be balanced?",
        "options": [
          "Galvanometer shows maximum deflection",
          "Current through the galvanometer is zero",
          "All resistors have equal value",
          "Voltage across all resistors is zero"
        ],
        "correctIndex": 1
      },
      {
        "id": "wb_q4",
        "question": "Which component is typically used to detect the null point in a Wheatstone bridge?",
        "options": [
          "Ammeter",
          "Voltmeter",
          "Galvanometer",
          "Oscilloscope"
        ],
        "correctIndex": 2
      },
      {
        "id": "wb_q5",
        "question": "Wheatstone bridge is most suitable for measuring:",
        "options": [
          "Very high resistances",
          "Medium resistances",
          "Very low resistances",
          "Insulation resistances"
        ],
        "correctIndex": 1
      },
      {
        "id": "wb_q6",
        "question": "If the battery and galvanometer are interchanged in a balanced Wheatstone bridge, the bridge:",
        "options": [
          "Remains balanced",
          "Becomes unbalanced",
          "Shows maximum deflection",
          "Burns out"
        ],
        "correctIndex": 0
      },
      {
        "id": "wb_q7",
        "question": "What causes errors in Wheatstone bridge measurements?",
        "options": [
          "Lead resistance",
          "Thermoelectric EMFs",
          "Contact resistance",
          "All of the above"
        ],
        "correctIndex": 3
      },
      {
        "id": "wb_q8",
        "question": "The sensitivity of a Wheatstone bridge depends on:",
        "options": [
          "Voltage of the battery",
          "Resistance of the galvanometer",
          "Values of the ratio arms",
          "All of the above"
        ],
        "correctIndex": 3
      },
      {
        "id": "wb_q9",
        "question": "In a Wheatstone bridge, if P/Q = R/S, which arm is the unknown resistance usually connected to?",
        "options": [
          "P",
          "Q",
          "R",
          "S"
        ],
        "correctIndex": 3
      },
      {
        "id": "wb_q10",
        "question": "A Wheatstone bridge cannot be used for precision measurement of low resistances because of:",
        "options": [
          "Thermoelectric EMF",
          "Contact and lead resistances",
          "High sensitivity of galvanometer",
          "Battery voltage fluctuations"
        ],
        "correctIndex": 1
      },
      {
        "id": "wb_q1",
        "question": "Why is a standard Wheatstone bridge not suitable for measuring very low resistances (below 1 ohm)?",
        "options": [
          "It is too sensitive for low values.",
          "Contact and lead resistances cause significant measurement errors.",
          "It requires an AC supply for low resistance.",
          "The galvanometer will draw too much current and burn."
        ],
        "correctIndex": 1
      },
      {
        "id": "wb_q2",
        "question": "What happens to the balance point if the voltage of the battery driving the bridge is doubled?",
        "options": [
          "The balance point shifts.",
          "The bridge cannot be balanced.",
          "The balance condition remains completely unaffected.",
          "The sensitivity decreases."
        ],
        "correctIndex": 2
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
        "q": "Info: The Kelvin Bridge measures sub-ohm resistances (down to micro-ohms) by eliminating lead and contact resistances using an extra set of ratio arms. Prerequisite: Wheatstone bridge principles. Why are four-terminal connections used in low-resistance components?",
        "options": [
          "To increase current capacity",
          "To separate current injection from voltage sensing",
          "To provide mechanical stability",
          "To double the resistance value"
        ],
        "answer": 1
      },
      {
        "q": "What is the condition for eliminating the yoke resistance (r) effect in a Kelvin Double Bridge?",
        "options": [
          "P/p = Q/q",
          "P/Q = p/q",
          "P = Q",
          "p = q"
        ],
        "answer": 1
      },
      {
        "q": "In low resistance measurement, contact resistance is typically in the order of:",
        "options": [
          "Micro-ohms",
          "Milli-ohms",
          "Ohms",
          "Kilo-ohms"
        ],
        "answer": 1
      },
      {
        "q": "Which type of galvanometer is best suited for detecting the null point in a DC Kelvin Bridge?",
        "options": [
          "Ballistic galvanometer",
          "D'Arsonval galvanometer",
          "Vibration galvanometer",
          "Electrodynamometer"
        ],
        "answer": 1
      },
      {
        "q": "The current rating of the standard resistor used in a Kelvin bridge must be high because:",
        "options": [
          "Low resistance measurements require high test currents to generate a measurable voltage drop",
          "High currents eliminate thermoelectric EMFs",
          "It reduces the contact resistance",
          "It balances the bridge faster"
        ],
        "answer": 0
      },
      {
        "q": "The Kelvin bridge overcomes the limitation of the Wheatstone bridge for low resistances by:",
        "options": [
          "Using a higher voltage battery",
          "Using an extremely sensitive galvanometer",
          "Adding a second set of ratio arms to eliminate the effect of the connecting lead resistance",
          "Using AC instead of DC"
        ],
        "answer": 2
      },
      {
        "q": "In a four-terminal resistor, the potential terminals are placed:",
        "options": [
          "Outside the current terminals",
          "Inside the current terminals (between them)",
          "On top of the current terminals",
          "On the battery"
        ],
        "answer": 1
      },
      {
        "q": "What happens if the contact resistance at the current terminals of a four-terminal standard resistor changes slightly during a Kelvin bridge measurement?",
        "options": [
          "The balance point shifts drastically",
          "The balance point is unaffected because the potential is measured entirely inside these contacts",
          "The galvanometer burns out",
          "The ratio arms must be readjusted"
        ],
        "answer": 1
      },
      {
        "q": "The yoke connecting the standard and unknown resistors in a Kelvin bridge should ideally have:",
        "options": [
          "Zero resistance",
          "Infinite resistance",
          "Exactly 1 Ohm",
          "Resistance equal to the standard"
        ],
        "answer": 0
      },
      {
        "q": "Why is a reversing switch often used in the battery circuit of a Kelvin bridge?",
        "options": [
          "To check the battery health",
          "To eliminate the effect of parasitic thermoelectric EMFs by averaging",
          "To prevent overheating",
          "To double the sensitivity"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "In a Kelvin Double Bridge, P=100Ω, Q=10Ω, p=100Ω, q=10Ω. The standard resistance S is 0.01Ω. Calculate the unknown resistance Rx.",
        "options": [
          "0.001 Ω",
          "0.01 Ω",
          "0.1 Ω",
          "1.0 Ω"
        ],
        "answer": 0
      },
      {
        "q": "If the inner ratio arms (p,q) are not exactly proportional to the outer ratio arms (P,Q), the resulting error is proportional to:",
        "options": [
          "The battery voltage",
          "The yoke resistance",
          "The standard resistance",
          "The galvanometer resistance"
        ],
        "answer": 1
      },
      {
        "q": "During a Kelvin bridge measurement, a parasitic thermoelectric EMF of 10µV is generated at the junctions. To eliminate this error, one should:",
        "options": [
          "Increase the galvanometer resistance",
          "Take two readings with reversed battery polarity and average them",
          "Cool the bridge with a fan",
          "Use a higher AC frequency"
        ],
        "answer": 1
      },
      {
        "q": "If the test current in a Kelvin bridge is 10A, and the unknown resistance is 0.001Ω, the power dissipated in the unknown resistor is:",
        "options": [
          "0.01 W",
          "0.1 W",
          "1.0 W",
          "10 W"
        ],
        "answer": 1
      },
      {
        "q": "Why are thick copper busbars often used to connect the standard and unknown resistors in a Kelvin bridge?",
        "options": [
          "To prevent them from moving",
          "To minimize the yoke resistance, reducing the error term",
          "To dissipate heat",
          "To act as a magnetic shield"
        ],
        "answer": 1
      },
      {
        "q": "A Kelvin bridge balances with outer ratio arms P=1000Ω, Q=100Ω, inner arms p=1000Ω, q=100Ω. If S=0.001Ω, what is Rx?",
        "options": [
          "0.01 Ω",
          "0.001 Ω",
          "0.0001 Ω",
          "0.1 Ω"
        ],
        "answer": 0
      },
      {
        "q": "If the inner ratio arms p and q are disconnected (infinite resistance), the circuit behaves like:",
        "options": [
          "A short circuit",
          "A standard Wheatstone bridge",
          "An Anderson bridge",
          "A potentiometer"
        ],
        "answer": 1
      },
      {
        "q": "If the yoke resistance is r=0.01Ω, and P/Q = 10, but p/q = 9.9, calculate the error term [qr/(p+q+r)](P/Q - p/q) given q=100Ω.",
        "options": [
          "~9.9x10^-6 Ω",
          "~9.9x10^-5 Ω",
          "~9.9x10^-4 Ω",
          "0"
        ],
        "answer": 1
      },
      {
        "q": "If a test current of 50A is used to measure a 100 µΩ shunt, what is the voltage drop across the shunt?",
        "options": [
          "5 mV",
          "50 mV",
          "500 mV",
          "5 V"
        ],
        "answer": 0
      },
      {
        "q": "Which of the following is NOT a source of error in a perfectly balanced Kelvin bridge?",
        "options": [
          "Thermoelectric EMFs",
          "Heating of the standard resistor (I²R)",
          "Stray magnetic fields",
          "The resistance of the galvanometer"
        ],
        "answer": 3
      }
    ],
    "viva": [
      {
        "id": "kb_q6",
        "question": "A Kelvin bridge is a modification of:",
        "options": [
          "Maxwell bridge",
          "Schering bridge",
          "Wheatstone bridge",
          "Wien bridge"
        ],
        "correctIndex": 2
      },
      {
        "id": "kb_q7",
        "question": "The main purpose of the Kelvin bridge is to eliminate the effect of:",
        "options": [
          "Contact and lead resistances",
          "Thermoelectric EMF",
          "Stray capacitance",
          "Inductive coupling"
        ],
        "correctIndex": 0
      },
      {
        "id": "kb_q8",
        "question": "In a Kelvin double bridge, how many ratio arms are used?",
        "options": [
          "One set",
          "Two sets",
          "Three sets",
          "Four sets"
        ],
        "correctIndex": 1
      },
      {
        "id": "kb_q9",
        "question": "The unknown resistance in a Kelvin bridge is usually a:",
        "options": [
          "Four-terminal resistor",
          "Two-terminal resistor",
          "Capacitor",
          "Inductor"
        ],
        "correctIndex": 0
      },
      {
        "id": "kb_q10",
        "question": "The ratio of the outer arms in a balanced Kelvin bridge must be equal to:",
        "options": [
          "The sum of the inner arms",
          "The ratio of the inner arms",
          "The product of the inner arms",
          "Zero"
        ],
        "correctIndex": 1
      },
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
        "q": "Info: The Kelvin Double Bridge is an enhancement of the Kelvin Bridge, achieving extreme precision in sub-ohm ranges by strictly enforcing P/Q = p/q. Prerequisite: Four-terminal measurement theory. The 'double' in Kelvin Double Bridge refers to:",
        "options": [
          "Two batteries used",
          "Two galvanometers used",
          "Two sets of ratio arms",
          "Two unknown resistors"
        ],
        "answer": 2
      },
      {
        "q": "The yoke (heavy copper link) connecting the standard and unknown resistors must have:",
        "options": [
          "Very high resistance",
          "Very low resistance",
          "Infinite resistance",
          "Zero capacitance"
        ],
        "answer": 1
      },
      {
        "q": "To achieve exact proportionality (P/Q = p/q) in a Kelvin Double Bridge, the ratio arms are typically:",
        "options": [
          "Adjusted independently",
          "Mechanically ganged together to vary simultaneously",
          "Fixed at 1 Ohm",
          "Made of different materials"
        ],
        "answer": 1
      },
      {
        "q": "A 'four-terminal' resistor has two current terminals and two potential terminals. The resistance measured is strictly between:",
        "options": [
          "The two current terminals",
          "The two potential terminals",
          "One current and one potential terminal",
          "The battery and the galvanometer"
        ],
        "answer": 1
      },
      {
        "q": "If the yoke resistance 'r' becomes infinite (i.e., the link breaks), the Kelvin Double Bridge degenerates into:",
        "options": [
          "A Wheatstone bridge",
          "A Maxwell bridge",
          "An open circuit (no current flows to the galvanometer)",
          "A short circuit"
        ],
        "answer": 0
      },
      {
        "q": "The 'Double' in Kelvin Double Bridge refers to:",
        "options": [
          "Two standard resistors",
          "Two batteries in parallel",
          "Two pairs of ratio arms (outer P,Q and inner p,q)",
          "Two galvanometers"
        ],
        "answer": 2
      },
      {
        "q": "To ensure P/Q = p/q at all times, commercial Kelvin Double Bridges often use:",
        "options": [
          "Independent decade boxes",
          "A mechanically coupled dual-dial switch",
          "Two separate operators",
          "A computer-controlled feedback loop"
        ],
        "answer": 1
      },
      {
        "q": "If the yoke (link) resistance 'r' is completely eliminated (r=0), the Kelvin Double Bridge equation Rx = S(P/Q) + [qr/(p+q+r)](P/Q - p/q) simplifies to:",
        "options": [
          "Rx = S(P/Q)",
          "Rx = S(P/Q) + p/q",
          "Rx = S",
          "Rx = 0"
        ],
        "answer": 0
      },
      {
        "q": "The leads connecting the inner ratio arms (p,q) to the potential terminals of Rx and S:",
        "options": [
          "Must have zero resistance",
          "Their resistance is absorbed into p and q, so it must be accounted for if p and q are small",
          "Do not carry any current at balance",
          "Both B and C"
        ],
        "answer": 3
      },
      {
        "q": "When measuring a 10 µΩ resistor with a 100A test current, the power dissipation in the unknown resistor is:",
        "options": [
          "0.1 W",
          "1 W",
          "10 W",
          "100 W"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "A Kelvin Double Bridge has P=1000Ω, Q=100Ω, p=1000Ω, q=100Ω. The standard S is set to 0.05Ω. The yoke resistance is 0.02Ω. What is Rx?",
        "options": [
          "0.005 Ω",
          "0.05 Ω",
          "0.5 Ω",
          "5.0 Ω"
        ],
        "answer": 0
      },
      {
        "q": "In the balance equation Rx = (P/Q)S + [qr/(p+q+r)](P/Q - p/q), if P/Q is exactly equal to p/q, the second term becomes:",
        "options": [
          "Infinite",
          "Zero",
          "Negative",
          "One"
        ],
        "answer": 1
      },
      {
        "q": "In a precision measurement, if P/Q = 100 and p/q = 99, the error term [qr/(p+q+r)](P/Q - p/q) evaluates to a non-zero value. If r=0.01Ω, q=10Ω, p=990Ω, the error added to the standard reading is:",
        "options": [
          "0.0001 Ω",
          "0.001 Ω",
          "0.01 Ω",
          "0.1 Ω"
        ],
        "answer": 0
      },
      {
        "q": "The standard resistor in a Kelvin Double Bridge is usually a variable low-resistance standard. It is typically constructed as:",
        "options": [
          "A carbon composition pot",
          "A Manganin slide wire or decade shunt",
          "A ceramic thermistor",
          "A wire-wound inductor"
        ],
        "answer": 1
      },
      {
        "q": "What limits the ultimate resolution of a Kelvin Double Bridge at the micro-ohm level?",
        "options": [
          "Galvanometer thermal noise and Johnson-Nyquist noise",
          "The speed of light",
          "The mass of the electrons",
          "The dielectric constant of air"
        ],
        "answer": 0
      },
      {
        "q": "In a Kelvin Double Bridge, S=0.01Ω, P=500Ω, Q=1000Ω, p=500Ω, q=1000Ω. What is Rx?",
        "options": [
          "0.005 Ω",
          "0.02 Ω",
          "0.05 Ω",
          "0.01 Ω"
        ],
        "answer": 0
      },
      {
        "q": "If the outer ratio P/Q is exactly 1.000, but the inner ratio p/q is 1.010, the yoke resistance is 1mΩ, and q=100Ω. What is the approximate error magnitude?",
        "options": [
          "~5 µΩ",
          "~10 µΩ",
          "~50 µΩ",
          "~100 µΩ"
        ],
        "answer": 0
      },
      {
        "q": "A 100A standard shunt has a resistance of 500 µΩ. What is its rated voltage drop?",
        "options": [
          "50 mV",
          "75 mV",
          "100 mV",
          "500 mV"
        ],
        "answer": 0
      },
      {
        "q": "If the galvanometer sensitivity is 1mm/µV, and the bridge is unbalanced by 1 µΩ with a 10A current, what is the galvanometer deflection? (Assume matching impedance)",
        "options": [
          "1 mm",
          "10 mm",
          "100 mm",
          "0.1 mm"
        ],
        "answer": 1
      },
      {
        "q": "Which material is predominantly used for the standard resistor 'S' due to its near-zero temperature coefficient?",
        "options": [
          "Copper",
          "Aluminum",
          "Manganin",
          "Tungsten"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "kdb_q6",
        "question": "Why is it called a \"double\" bridge?",
        "options": [
          "It uses two power supplies",
          "It incorporates a second set of ratio arms",
          "It measures two resistances at once",
          "It uses two galvanometers"
        ],
        "correctIndex": 1
      },
      {
        "id": "kdb_q7",
        "question": "Which errors are minimized by a Kelvin Double Bridge?",
        "options": [
          "High frequency errors",
          "Lead and contact resistance errors",
          "Capacitive coupling errors",
          "Hysteresis errors"
        ],
        "correctIndex": 1
      },
      {
        "id": "kdb_q8",
        "question": "A Kelvin Double Bridge is typically used to measure resistance in the range of:",
        "options": [
          "1 ohm to 1 micro-ohm",
          "1 kilo-ohm to 1 mega-ohm",
          "1 mega-ohm to 1 giga-ohm",
          "100 ohms to 1 kilo-ohm"
        ],
        "correctIndex": 0
      },
      {
        "id": "kdb_q9",
        "question": "At balance, the current through the galvanometer in a Kelvin Double Bridge is:",
        "options": [
          "Maximum",
          "Minimum",
          "Zero",
          "Equal to source current"
        ],
        "correctIndex": 2
      },
      {
        "id": "kdb_q10",
        "question": "The connecting link between the standard and unknown resistance is called:",
        "options": [
          "The yoke",
          "The ratio arm",
          "The multiplier",
          "The shunt"
        ],
        "correctIndex": 0
      },
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
        "q": "Info: This AC bridge determines unknown capacitance by comparing it against a known standard capacitor. Prerequisite: AC circuit theory, impedance (Z = 1/jωC). The detector used in AC bridges at 1 kHz is typically a:",
        "options": [
          "D'Arsonval Galvanometer",
          "Ballistic Galvanometer",
          "Headphones / Tuned Null Detector",
          "DC Voltmeter"
        ],
        "answer": 2
      },
      {
        "q": "In a pure capacitance comparison bridge at balance (Cx/C2 = R4/R3), the balance condition depends on:",
        "options": [
          "Frequency of the AC source",
          "Voltage of the AC source",
          "Ratio of the resistance arms",
          "Phase angle of the oscillator"
        ],
        "answer": 2
      },
      {
        "q": "If the unknown capacitor has significant leakage (parallel resistance), a simple capacitance comparison bridge will:",
        "options": [
          "Balance instantly",
          "Never achieve a perfect null",
          "Read a negative capacitance",
          "Burn out the detector"
        ],
        "answer": 1
      },
      {
        "q": "In AC bridges, Wagner Earth devices are sometimes used to:",
        "options": [
          "Provide a physical ground for safety",
          "Eliminate errors due to stray capacitances between bridge nodes and ground",
          "Cool the oscillator",
          "Measure the earth's magnetic field"
        ],
        "answer": 1
      },
      {
        "q": "The balance condition for an AC bridge requires that:",
        "options": [
          "Only the real parts of the impedances balance",
          "Only the imaginary parts balance",
          "Both magnitude and phase angle of the arms must balance simultaneously",
          "The frequency must be exactly 50 Hz"
        ],
        "answer": 2
      },
      {
        "q": "In a simple AC capacitance bridge, what happens if the unknown capacitor has a significant equivalent series resistance (ESR)?",
        "options": [
          "The bridge balances perfectly",
          "The null point becomes 'blurry' or impossible to find because phase angles don't match",
          "The capacitor explodes",
          "The frequency shifts"
        ],
        "answer": 1
      },
      {
        "q": "A Wagner Earth connection is used in AC bridges to:",
        "options": [
          "Ground the operator",
          "Eliminate errors caused by stray capacitances from the bridge nodes to ground",
          "Increase the supply voltage",
          "Filter out harmonics"
        ],
        "answer": 1
      },
      {
        "q": "Which detector is most appropriate for a 1 kHz AC bridge?",
        "options": [
          "D'Arsonval Galvanometer",
          "Cathode Ray Oscilloscope or Tuned Audio Headphones",
          "Digital DC Voltmeter",
          "Electrometer"
        ],
        "answer": 1
      },
      {
        "q": "For a pure capacitance comparison bridge at balance, Rx*C2 = R3*Cx. If R3 is doubled, Cx will:",
        "options": [
          "Double",
          "Halve",
          "Remain the same",
          "Quadruple"
        ],
        "answer": 1
      },
      {
        "q": "Dielectric loss in a capacitor is often represented by:",
        "options": [
          "The Q factor",
          "The Dissipation Factor (tan δ)",
          "The relative permeability",
          "The Seebeck coefficient"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "An AC bridge is balanced with R3=1000Ω, R4=2000Ω, and C2=0.1µF. What is the value of the unknown capacitor Cx?",
        "options": [
          "0.05 µF",
          "0.1 µF",
          "0.2 µF",
          "0.4 µF"
        ],
        "answer": 2
      },
      {
        "q": "If the standard capacitor has a small dielectric loss (series resistance), how must the bridge be modified to achieve a perfect null?",
        "options": [
          "Add an inductor in series",
          "Add a variable resistor in series with Cx",
          "Change the AC frequency",
          "Increase the supply voltage"
        ],
        "answer": 1
      },
      {
        "q": "A capacitance comparison bridge uses a standard C=1µF with an ESR of 0.01Ω. The unknown C has an ESR of 5Ω. To balance both magnitude and phase, the bridge must incorporate:",
        "options": [
          "A series variable resistor in the standard arm",
          "An inductor in parallel with the unknown",
          "A larger battery",
          "A DC galvanometer"
        ],
        "answer": 0
      },
      {
        "q": "If the AC source frequency is 1 kHz, what is the capacitive reactance of a 1µF standard capacitor? (Xc = 1/2πfC)",
        "options": [
          "~159 Ω",
          "~318 Ω",
          "~1.59 kΩ",
          "~15.9 Ω"
        ],
        "answer": 0
      },
      {
        "q": "When using headphones as a null detector in an audio-frequency AC bridge, the operator listens for:",
        "options": [
          "Maximum volume",
          "A change in pitch",
          "Absolute silence or minimum tone",
          "A clicking sound"
        ],
        "answer": 2
      },
      {
        "q": "A bridge balances with R3=1kΩ, R4=2kΩ, and standard C2=0.5µF. What is Cx?",
        "options": [
          "0.25 µF",
          "1.0 µF",
          "0.5 µF",
          "2.0 µF"
        ],
        "answer": 0
      },
      {
        "q": "If the standard capacitor has a small series resistance r2, the balance equation for the unknown series resistance rx is:",
        "options": [
          "rx = r2 * (R3/R4)",
          "rx = r2 * (R4/R3)",
          "rx = r2",
          "rx = R3*R4/r2"
        ],
        "answer": 0
      },
      {
        "q": "At 1 kHz, what is the reactance of a 1 µF capacitor?",
        "options": [
          "~15.9 Ω",
          "~159 Ω",
          "~1590 Ω",
          "~0.159 Ω"
        ],
        "answer": 1
      },
      {
        "q": "If an AC bridge is balanced at the fundamental frequency (1 kHz), but the oscillator has 3rd harmonic distortion (3 kHz), what will the operator hear in the headphones?",
        "options": [
          "Absolute silence",
          "A faint 3 kHz tone, because the bridge may not be balanced for harmonics",
          "A loud 1 kHz tone",
          "White noise"
        ],
        "answer": 1
      },
      {
        "q": "Which bridge topology is better suited for measuring capacitors with very high leakage (high dissipation factor)?",
        "options": [
          "Series Resistance Capacitance Bridge",
          "Parallel Resistance Capacitance Bridge",
          "Maxwell Bridge",
          "Kelvin Bridge"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
        "id": "ccb_q6",
        "question": "A capacitance comparison bridge uses which type of source?",
        "options": [
          "DC Battery",
          "AC Oscillator",
          "Pulse Generator",
          "Current source"
        ],
        "correctIndex": 1
      },
      {
        "id": "ccb_q7",
        "question": "What is typically used as a null detector in AC bridges at audio frequencies?",
        "options": [
          "D'Arsonval galvanometer",
          "Headphones or tuned AC detector",
          "DC Voltmeter",
          "Electrometer"
        ],
        "correctIndex": 1
      },
      {
        "id": "ccb_q8",
        "question": "In a simple capacitance bridge, the condition for balance involves:",
        "options": [
          "Only magnitudes of impedances",
          "Magnitudes and phase angles of impedances",
          "Only purely resistive components",
          "Only inductances"
        ],
        "correctIndex": 1
      },
      {
        "id": "ccb_q9",
        "question": "What causes the dissipation factor in a real capacitor?",
        "options": [
          "Dielectric losses and equivalent series resistance",
          "Lead inductance",
          "Plate area",
          "Distance between plates"
        ],
        "correctIndex": 0
      },
      {
        "id": "ccb_q10",
        "question": "The balance condition equation for an AC bridge is:",
        "options": [
          "Z1*Z4 = Z2*Z3",
          "Z1/Z2 = Z3/Z4",
          "Z1+Z4 = Z2+Z3",
          "Z1-Z4 = Z2-Z3"
        ],
        "correctIndex": 0
      },
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
        "q": "Info: Maxwell's Inductance Bridge determines unknown inductance by comparing it with a standard self-inductance. Prerequisite: Phasor diagrams and AC impedances. Why is this bridge rarely used for high-Q coils?",
        "options": [
          "It requires a massive standard inductor",
          "Balance equations are dependent on frequency",
          "Sliding balance occurs due to interacting resistive and inductive controls",
          "It is only suitable for DC"
        ],
        "answer": 2
      },
      {
        "q": "For a Maxwell Inductance Bridge, the unknown inductance L1 is given by:",
        "options": [
          "L1 = (R3/R4)*L2",
          "L1 = (R4/R3)*L2",
          "L1 = R2*R3*L2",
          "L1 = L2/(R3*R4)"
        ],
        "answer": 0
      },
      {
        "q": "Maxwell's Inductance Bridge compares an unknown inductor with a standard inductor. Standard inductors are generally avoided in precision work because:",
        "options": [
          "They are too cheap",
          "They have significant stray magnetic fields and inherent resistance",
          "They cannot carry any current",
          "They break easily"
        ],
        "answer": 1
      },
      {
        "q": "If the unknown coil has a very low resistance (high Q), the resistive balance control will need to be:",
        "options": [
          "Very large",
          "Very precise and small",
          "Removed from the circuit",
          "Replaced with a capacitor"
        ],
        "answer": 1
      },
      {
        "q": "The condition for balance in any four-arm AC bridge (Z1, Z2, Z3, Z4) is:",
        "options": [
          "Z1+Z4 = Z2+Z3",
          "Z1/Z2 = Z3/Z4",
          "Z1*Z4 = Z2*Z3",
          "Z1-Z4 = Z2-Z3"
        ],
        "answer": 2
      },
      {
        "q": "Maxwell's Inductance Bridge compares an unknown inductance against:",
        "options": [
          "A standard capacitor",
          "A standard inductor",
          "A standard resistor",
          "A standard frequency"
        ],
        "answer": 1
      },
      {
        "q": "Why are standard inductors rarely used in high-precision metrology compared to standard capacitors?",
        "options": [
          "Standard inductors are bulky, have stray magnetic fields, and significant resistive losses",
          "Standard inductors are too fragile",
          "Standard inductors only work at DC",
          "Standard inductors have negative resistance"
        ],
        "answer": 0
      },
      {
        "q": "In a Maxwell Inductance Bridge, the resistive balance and inductive balance controls are often:",
        "options": [
          "Completely independent",
          "Interdependent, leading to a 'sliding null' if the Q-factor is low",
          "Digital",
          "Fixed"
        ],
        "answer": 1
      },
      {
        "q": "To shield the standard inductor from external magnetic fields, it is often enclosed in:",
        "options": [
          "A plastic box",
          "A Mu-metal or heavy copper shield",
          "A vacuum chamber",
          "A glass tube"
        ],
        "answer": 1
      },
      {
        "q": "If the frequency of the AC source changes slightly during measurement, the balance point of a true Maxwell Inductance Bridge (L vs L):",
        "options": [
          "Remains unchanged because the frequency cancels out in the balance equations",
          "Shifts drastically",
          "Becomes undefined",
          "Oscillates"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "Given R3=100Ω, R4=1000Ω, and a standard inductor L2=10mH with internal resistance r2=15Ω. If R2=85Ω, what are L1 and R1?",
        "options": [
          "L1=1mH, R1=10Ω",
          "L1=100mH, R1=10Ω",
          "L1=1mH, R1=100Ω",
          "L1=10mH, R1=85Ω"
        ],
        "answer": 0
      },
      {
        "q": "If the frequency of the AC source is doubled, the balance point of a perfect Maxwell Inductance Bridge will:",
        "options": [
          "Shift drastically",
          "Remain unchanged",
          "Become impossible to find",
          "Cause the detector to overload"
        ],
        "answer": 1
      },
      {
        "q": "In a Maxwell Inductance Bridge, if the standard inductor Ls has a known series resistance Rs, the total resistance of that arm is Rs + Rv (variable resistor). The unknown resistance Rx is calculated as:",
        "options": [
          "Rx = (R2/R3) * (Rs + Rv)",
          "Rx = R2 * R3 * (Rs + Rv)",
          "Rx = (Rs + Rv) / (R2*R3)",
          "Rx = R2/R3"
        ],
        "answer": 0
      },
      {
        "q": "Two interacting balance controls (e.g., both affecting the real and imaginary balance equations) lead to:",
        "options": [
          "Instant balance",
          "A 'sliding null' where multiple adjustments are needed",
          "Bridge destruction",
          "Infinite Q factor"
        ],
        "answer": 1
      },
      {
        "q": "To minimize mutual inductance between the standard and unknown coils in the bridge setup, one should:",
        "options": [
          "Place them physically far apart or orient them at 90 degrees",
          "Wrap them around the same core",
          "Connect them with thick wires",
          "Submerge them in oil"
        ],
        "answer": 0
      },
      {
        "q": "Given R3=200Ω, R4=1000Ω, L2=50mH. What is the unknown inductance L1?",
        "options": [
          "10 mH",
          "50 mH",
          "250 mH",
          "100 mH"
        ],
        "answer": 0
      },
      {
        "q": "If the standard inductor L2 has an internal resistance of 20Ω, and a series variable resistor Rv is set to 80Ω to achieve balance (total R2 = 100Ω). R3=200Ω, R4=1000Ω. What is the internal resistance R1 of the unknown inductor?",
        "options": [
          "10 Ω",
          "20 Ω",
          "50 Ω",
          "100 Ω"
        ],
        "answer": 1
      },
      {
        "q": "If the unknown coil has a very high Q factor, its internal resistance R1 is very small. In the Maxwell Inductance Bridge, this requires R2 to be:",
        "options": [
          "Very small",
          "Very large",
          "Negative",
          "Equal to R4"
        ],
        "answer": 0
      },
      {
        "q": "Calculate the Q factor of a 10mH coil with 10Ω internal resistance at 1kHz.",
        "options": [
          "~1.59",
          "~6.28",
          "~15.9",
          "~62.8"
        ],
        "answer": 1
      },
      {
        "q": "What happens if mutual inductance exists between L1 and L2 in the bridge setup?",
        "options": [
          "Nothing",
          "The effective inductance changes, introducing a massive systematic error",
          "The bridge balances faster",
          "The frequency doubles"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
        "id": "mib_q6",
        "question": "The Maxwell Inductance Bridge compares an unknown inductance with:",
        "options": [
          "A known standard capacitance",
          "A known standard inductance",
          "A known standard resistance",
          "A frequency source"
        ],
        "correctIndex": 1
      },
      {
        "id": "mib_q7",
        "question": "Why is the Maxwell Inductance bridge rarely used for high Q coils?",
        "options": [
          "It requires an impractically large resistance for balance",
          "It is unstable",
          "The equations become non-linear",
          "It requires high voltages"
        ],
        "correctIndex": 0
      },
      {
        "id": "mib_q8",
        "question": "Which detector is suitable for a Maxwell bridge operating at 1 kHz?",
        "options": [
          "Vibration galvanometer",
          "Headphones",
          "DC galvanometer",
          "Electrometer"
        ],
        "correctIndex": 1
      },
      {
        "id": "mib_q9",
        "question": "The quality factor (Q) of a coil is defined as:",
        "options": [
          "wL / R",
          "R / wL",
          "w / RC",
          "1 / wLC"
        ],
        "correctIndex": 0
      },
      {
        "id": "mib_q10",
        "question": "In the balance equations, the unknown resistance Rx is dependent on:",
        "options": [
          "Frequency",
          "Only the bridge arm resistances",
          "The source voltage",
          "The detector sensitivity"
        ],
        "correctIndex": 1
      },
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
        "q": "Info: Maxwell's L-C bridge measures unknown inductance using a standard variable capacitance. Prerequisite: Resonance and Q-factor. Why is a standard capacitor preferred over a standard inductor?",
        "options": [
          "Capacitors are heavier",
          "Standard capacitors are less lossy and more compact than standard inductors",
          "Capacitors generate magnetic fields",
          "Inductors are cheaper"
        ],
        "answer": 1
      },
      {
        "q": "Maxwell's L-C bridge is most suitable for measuring coils with a Q-factor of:",
        "options": [
          "Q < 1",
          "1 < Q < 10",
          "Q > 10",
          "Q > 100"
        ],
        "answer": 1
      },
      {
        "q": "Maxwell's LC bridge (Maxwell-Wien bridge) is ideal for measuring:",
        "options": [
          "High-Q coils (Q > 10)",
          "Medium-Q coils (1 < Q < 10)",
          "Low-Q coils (Q < 1)",
          "Pure resistors"
        ],
        "answer": 1
      },
      {
        "q": "In the standard arm of the Maxwell LC bridge, the capacitor and resistor are connected in:",
        "options": [
          "Series",
          "Parallel",
          "Star",
          "Delta"
        ],
        "answer": 1
      },
      {
        "q": "Why does the Maxwell LC bridge struggle with high-Q coils?",
        "options": [
          "The capacitor required becomes too small",
          "The parallel resistor R4 required to achieve phase balance becomes impractically large",
          "The inductor overheats",
          "The frequency must be zero"
        ],
        "answer": 1
      },
      {
        "q": "Maxwell's LC bridge determines an unknown inductance by comparing it to:",
        "options": [
          "A standard inductor",
          "A standard variable capacitor",
          "A known frequency",
          "A standard battery"
        ],
        "answer": 1
      },
      {
        "q": "Why is a standard capacitor preferred over a standard inductor in AC bridges?",
        "options": [
          "It is smaller, cheaper, and its electrical field is easily contained by shielding, unlike magnetic fields",
          "It can handle more current",
          "It generates less heat",
          "It is heavier and more stable"
        ],
        "answer": 0
      },
      {
        "q": "Maxwell's LC bridge is highly suitable for coils with a Q-factor in the range of:",
        "options": [
          "0.1 to 1",
          "1 to 10",
          "10 to 100",
          "> 100"
        ],
        "answer": 1
      },
      {
        "q": "In the standard arm of the Maxwell LC bridge, the standard capacitor and variable resistor are connected in:",
        "options": [
          "Series",
          "Parallel",
          "Anti-parallel",
          "Delta"
        ],
        "answer": 1
      },
      {
        "q": "If the unknown coil has a Q factor > 100, what practical difficulty arises in the Maxwell LC bridge?",
        "options": [
          "The capacitor required becomes too large",
          "The parallel resistor R4 required for balance becomes impractically large (e.g., several MΩ) causing leakage issues",
          "The inductor burns out",
          "The frequency must be zero"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "At balance, R2=100Ω, R3=1000Ω, C4=1µF, R4=500Ω. Calculate the unknown inductance Lx and its resistance Rx.",
        "options": [
          "Lx=100mH, Rx=200Ω",
          "Lx=10mH, Rx=50Ω",
          "Lx=0.1H, Rx=200Ω",
          "Lx=1H, Rx=500Ω"
        ],
        "answer": 0
      },
      {
        "q": "If a very high-Q coil (Q > 100) is measured using a Maxwell L-C bridge, what practical difficulty arises?",
        "options": [
          "R4 becomes impractically small",
          "R4 becomes impractically large",
          "C4 must be very large",
          "The bridge oscillates"
        ],
        "answer": 1
      },
      {
        "q": "Given the balance equations Lx = R2*R3*C4 and Rx = R2*R3/R4, what is the Q-factor of the unknown coil in terms of the bridge components?",
        "options": [
          "Q = ω*C4*R4",
          "Q = ω*Lx/Rx",
          "Q = 1 / (ω*C4*R4)",
          "Both A and B are correct"
        ],
        "answer": 3
      },
      {
        "q": "If the supply frequency is exactly 1000 Hz, R4 is 10 kΩ, and C4 is 0.1 µF, what is the Q-factor of the coil at balance?",
        "options": [
          "~0.628",
          "~6.28",
          "~62.8",
          "~628"
        ],
        "answer": 1
      },
      {
        "q": "A major advantage of the Maxwell LC bridge is that the balance equations for Lx and Rx are:",
        "options": [
          "Dependent on frequency",
          "Independent of frequency",
          "Dependent on the supply voltage",
          "Non-linear"
        ],
        "answer": 1
      },
      {
        "q": "At balance, R2=100Ω, R3=1000Ω, C4=0.1µF. What is Lx?",
        "options": [
          "1 mH",
          "10 mH",
          "100 mH",
          "1 H"
        ],
        "answer": 1
      },
      {
        "q": "At balance, R2=100Ω, R3=1000Ω, R4=5000Ω. What is Rx?",
        "options": [
          "10 Ω",
          "20 Ω",
          "50 Ω",
          "100 Ω"
        ],
        "answer": 1
      },
      {
        "q": "Calculate the Q factor of the unknown coil in terms of the bridge components.",
        "options": [
          "Q = ω*C4*R4",
          "Q = 1 / (ω*C4*R4)",
          "Q = ω*C4 / R4",
          "Q = R4 / (ω*C4)"
        ],
        "answer": 0
      },
      {
        "q": "If f=1kHz, C4=0.1µF, R4=15.9kΩ. What is the Q factor?",
        "options": [
          "~1",
          "~10",
          "~100",
          "~1000"
        ],
        "answer": 1
      },
      {
        "q": "A major advantage of Maxwell's LC bridge is that the balance equations for Lx and Rx are independent of:",
        "options": [
          "The value of C4",
          "The supply frequency",
          "The value of R2",
          "The value of R3"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
        "id": "mlcb_q6",
        "question": "The Maxwell LC bridge (Maxwell-Wien bridge) measures an unknown inductance in terms of:",
        "options": [
          "A standard inductance",
          "A standard capacitance",
          "A standard frequency",
          "A standard voltage"
        ],
        "correctIndex": 1
      },
      {
        "id": "mlcb_q7",
        "question": "A major advantage of the Maxwell-Wien bridge is that its balance equations are:",
        "options": [
          "Dependent on frequency",
          "Independent of frequency",
          "Highly non-linear",
          "Only valid for DC"
        ],
        "correctIndex": 1
      },
      {
        "id": "mlcb_q8",
        "question": "The Maxwell LC bridge is best suited for measuring coils with:",
        "options": [
          "Very low Q (Q < 1)",
          "Medium Q (1 < Q < 10)",
          "High Q (Q > 10)",
          "Infinite Q"
        ],
        "correctIndex": 1
      },
      {
        "id": "mlcb_q9",
        "question": "For high Q coils, which bridge is preferred over the Maxwell bridge?",
        "options": [
          "Schering bridge",
          "Kelvin bridge",
          "Hay bridge",
          "Wien bridge"
        ],
        "correctIndex": 2
      },
      {
        "id": "mlcb_q10",
        "question": "In a Maxwell LC bridge, the capacitor is placed in:",
        "options": [
          "Series with a resistor",
          "Parallel with a resistor",
          "Series with an inductor",
          "Parallel with the unknown coil"
        ],
        "correctIndex": 1
      },
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
        "q": "Info: Hay's Bridge is a modification of Maxwell's bridge designed specifically for high-Q coils. Prerequisite: Quality factor (Q = ωL/R). How does Hay's bridge differ from Maxwell's bridge?",
        "options": [
          "Capacitor is in parallel with the resistor",
          "Capacitor is in series with the resistor in the standard arm",
          "It uses two inductors",
          "It requires DC supply"
        ],
        "answer": 1
      },
      {
        "q": "For a high-Q coil (Q > 10), the balance equation for inductance Lx in Hay's bridge approximates to:",
        "options": [
          "Lx ≈ R2*R3/C4",
          "Lx ≈ R2*R3*C4",
          "Lx ≈ C4/(R2*R3)",
          "Lx ≈ R2/R3"
        ],
        "answer": 1
      },
      {
        "q": "Hay's bridge is preferred over Maxwell's LC bridge for:",
        "options": [
          "Low-Q coils",
          "Medium-Q coils",
          "High-Q coils (Q > 10)",
          "Capacitors"
        ],
        "answer": 2
      },
      {
        "q": "In the standard arm of Hay's bridge, the resistor and capacitor are connected in:",
        "options": [
          "Parallel",
          "Series",
          "Anti-parallel",
          "Bridge format"
        ],
        "answer": 1
      },
      {
        "q": "Because the standard arm uses a series RC circuit, Hay's bridge is better suited for measuring:",
        "options": [
          "Inductors with high series resistance",
          "Inductors with very low series resistance",
          "Lossless capacitors",
          "Semiconductors"
        ],
        "answer": 1
      },
      {
        "q": "Hay's bridge is specifically designed as a modification of Maxwell's bridge to measure:",
        "options": [
          "High-Q coils (Q > 10)",
          "Low-Q coils (Q < 1)",
          "Pure capacitors",
          "High-frequency resistors"
        ],
        "answer": 0
      },
      {
        "q": "In Hay's bridge, the standard capacitor and its associated balance resistor are connected in:",
        "options": [
          "Parallel",
          "Series",
          "A Pi network",
          "A T network"
        ],
        "answer": 1
      },
      {
        "q": "For a very high-Q coil measured using Hay's bridge, the balance equation for Lx approximates to:",
        "options": [
          "Lx ≈ R2*R3*C4",
          "Lx ≈ R2*R3/C4",
          "Lx ≈ C4/(R2*R3)",
          "Lx ≈ R2/R3"
        ],
        "answer": 0
      },
      {
        "q": "Unlike Maxwell's LC bridge, the exact balance equations for Hay's bridge contain the term ω (angular frequency). This implies:",
        "options": [
          "The bridge can only be balanced with DC",
          "The balance is frequency-dependent, requiring a highly stable AC oscillator with low harmonic distortion",
          "The bridge works best with square waves",
          "The frequency must be completely unknown"
        ],
        "answer": 1
      },
      {
        "q": "Why does Hay's bridge solve the 'large resistor' problem of Maxwell's bridge for high-Q coils?",
        "options": [
          "Because high Q in a series RC configuration requires a very SMALL resistance, which is practical to build",
          "Because it uses two capacitors",
          "Because it operates at higher voltages",
          "Because it uses an inductor instead"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "In a Hay's Bridge, R2=1000Ω, R3=1000Ω, C4=0.1µF, and f=1000Hz. If the coil has very high Q, the approximate inductance Lx is:",
        "options": [
          "10 mH",
          "100 mH",
          "1 H",
          "10 H"
        ],
        "answer": 1
      },
      {
        "q": "Unlike Maxwell's bridge, the exact balance equations for Hay's bridge contain the term ω (frequency). This means:",
        "options": [
          "It cannot be balanced",
          "The balance is highly frequency-dependent, requiring a pure sine wave source",
          "It works best with square waves",
          "Frequency must be zero"
        ],
        "answer": 1
      },
      {
        "q": "The exact expression for Lx in Hay's bridge is Lx = (R2*R3*C4) / (1 + (ω*C4*R4)²). For a high-Q coil where Q = 1/(ω*C4*R4) > 10, the term (ω*C4*R4)² is:",
        "options": [
          "Very large",
          "Exactly 1",
          "Less than 0.01 (can be neglected)",
          "Negative"
        ],
        "answer": 2
      },
      {
        "q": "If Hay's bridge is used to measure a medium-Q coil (Q = 2), neglecting the frequency-dependent term will cause an error of approximately:",
        "options": [
          "1%",
          "5%",
          "20%",
          "50%"
        ],
        "answer": 2
      },
      {
        "q": "Which component in Hay's bridge determines the resistive balance (Rx)?",
        "options": [
          "It depends solely on R4 and is directly proportional to it",
          "It depends on C4 only",
          "It requires adjusting the frequency",
          "It depends on the battery voltage"
        ],
        "answer": 0
      },
      {
        "q": "The exact equation for Lx in Hay's bridge is Lx = (R2*R3*C4) / (1 + (ω*C4*R4)²). If the coil has a Q of 50 at 1 kHz, what is the value of the error term (ω*C4*R4)²?",
        "options": [
          "1/2500 (negligible)",
          "2500 (dominant)",
          "1",
          "0"
        ],
        "answer": 0
      },
      {
        "q": "In a Hay's bridge, R2=1kΩ, R3=1kΩ, C4=1µF, f=1kHz. For a very high Q coil, what is the approximate Lx?",
        "options": [
          "0.1 H",
          "1 H",
          "10 H",
          "100 H"
        ],
        "answer": 1
      },
      {
        "q": "If Hay's bridge is used to measure a low-Q coil (Q=1), and the approximate formula Lx = R2*R3*C4 is used, the error will be:",
        "options": [
          "1%",
          "10%",
          "50%",
          "100% (The calculated value will be double the actual)"
        ],
        "answer": 2
      },
      {
        "q": "The balance equation for the internal resistance of the coil is Rx = (ω² * C4² * R4 * R2 * R3) / (1 + (ω*C4*R4)²). This shows Rx is heavily dependent on:",
        "options": [
          "Frequency",
          "Only DC values",
          "Battery voltage",
          "Galvanometer sensitivity"
        ],
        "answer": 0
      },
      {
        "q": "For a coil with Q=100, the phase angle between voltage and current is approximately:",
        "options": [
          "0°",
          "45°",
          "89.4°",
          "180°"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "hb_q6",
        "question": "Hay's bridge is a modification of which bridge?",
        "options": [
          "Schering bridge",
          "Maxwell-Wien bridge",
          "Anderson bridge",
          "Kelvin bridge"
        ],
        "correctIndex": 1
      },
      {
        "id": "hb_q7",
        "question": "Hay's bridge is preferred for measuring inductances with:",
        "options": [
          "Low Q (Q < 1)",
          "Medium Q (1 < Q < 10)",
          "High Q (Q > 10)",
          "Negative Q"
        ],
        "correctIndex": 2
      },
      {
        "id": "hb_q8",
        "question": "In Hay's bridge, the standard capacitor is connected in:",
        "options": [
          "Parallel with a resistor",
          "Series with a resistor",
          "Parallel with the unknown inductor",
          "Series with the source"
        ],
        "correctIndex": 1
      },
      {
        "id": "hb_q9",
        "question": "The balance equations for Hay's bridge are:",
        "options": [
          "Independent of frequency for high Q coils",
          "Independent of frequency for all coils",
          "Dependent on frequency",
          "Only applicable at DC"
        ],
        "correctIndex": 2
      },
      {
        "id": "hb_q10",
        "question": "For a very high Q coil, the term (1/Q)^2 in Hay's bridge equations can be:",
        "options": [
          "Approximated to 1",
          "Neglected",
          "Multiplied by infinity",
          "Replaced by Q"
        ],
        "correctIndex": 1
      },
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
        "q": "Info: Anderson's Bridge is a 5-node AC bridge used for precise measurement of self-inductance over a wide range. Prerequisite: Star-delta transformation. What is the main advantage of Anderson's bridge?",
        "options": [
          "It requires only one variable resistor to achieve balance",
          "It uses no capacitors",
          "It is independent of frequency",
          "It has only 3 arms"
        ],
        "answer": 0
      },
      {
        "q": "Because of the additional node, deriving the balance equations typically requires:",
        "options": [
          "Norton's Theorem",
          "Star-Delta (Wye-Delta) transformation",
          "Coulomb's Law",
          "Maxwell's Equations"
        ],
        "answer": 1
      },
      {
        "q": "Anderson's bridge is widely used for precise measurement of self-inductance because:",
        "options": [
          "It uses a variable capacitor",
          "It achieves balance using only variable resistors, keeping the standard capacitor fixed",
          "It has no resistive arms",
          "It uses two galvanometers"
        ],
        "answer": 1
      },
      {
        "q": "The circuit topology of Anderson's bridge contains how many nodes (junctions)?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "answer": 2
      },
      {
        "q": "In the derivation of Anderson's bridge balance, the delta formed by the capacitor and two resistors is transformed into a:",
        "options": [
          "Star (Wye)",
          "Pi network",
          "Square",
          "Hexagon"
        ],
        "answer": 0
      },
      {
        "q": "Anderson's bridge is a modification of Maxwell's LC bridge. It uses:",
        "options": [
          "A variable capacitor",
          "A fixed capacitor and an extra variable resistor to achieve balance",
          "Two standard inductors",
          "A high-voltage transformer"
        ],
        "answer": 1
      },
      {
        "q": "The primary advantage of Anderson's bridge is:",
        "options": [
          "It requires only one variable resistor to find the precise balance point without changing the capacitance",
          "It is much simpler to construct than Wheatstone",
          "It uses only DC",
          "It works perfectly for RF frequencies > 1 GHz"
        ],
        "answer": 0
      },
      {
        "q": "Because Anderson's bridge has 5 nodes, deriving its balance equations mathematically requires:",
        "options": [
          "Kirchhoff's Laws directly or a Star-Delta transformation",
          "Ohm's Law only",
          "Faraday's Law",
          "Ampere's Law"
        ],
        "answer": 0
      },
      {
        "q": "A major disadvantage of Anderson's bridge compared to Maxwell's is:",
        "options": [
          "It requires a standard inductor",
          "It has a sliding null",
          "The circuit is more complex, making electrostatic shielding very difficult",
          "It cannot measure resistance"
        ],
        "answer": 2
      },
      {
        "q": "Anderson's bridge is particularly well-suited for measuring:",
        "options": [
          "Very high Q coils",
          "Capacitors",
          "A wide range of inductances with high precision using a single fixed capacitor",
          "Semiconductors"
        ],
        "answer": 2
      }
    ],
    "posttest": [
      {
        "q": "A perfectly balanced Anderson bridge has C=1µF, R3=1000Ω, R2=1000Ω, R4=1000Ω, and variable resistor r=500Ω. Calculate Lx using Lx = C*R3*[r*(R4+R2)/R4 + R2].",
        "options": [
          "1 H",
          "1.5 H",
          "2 H",
          "0.5 H"
        ],
        "answer": 1
      },
      {
        "q": "What is a major disadvantage of the Anderson Bridge compared to Maxwell's bridge?",
        "options": [
          "It requires a standard inductor",
          "It is only for low-Q coils",
          "The circuit is more complex and shielding is difficult",
          "It cannot be balanced at 1 kHz"
        ],
        "answer": 2
      },
      {
        "q": "If the standard capacitor in an Anderson bridge has a leakage resistance, it will primarily affect:",
        "options": [
          "The inductance calculation",
          "The resistance (Q-factor) calculation of the unknown coil",
          "The frequency of the source",
          "The physical temperature of the bridge"
        ],
        "answer": 1
      },
      {
        "q": "The balance equation for Anderson's bridge is Lx = C*R3*[r*(1 + R2/R4) + R2]. If r=0, the equation reduces exactly to:",
        "options": [
          "Hay's bridge",
          "Wien's bridge",
          "Maxwell's LC bridge (Lx = C*R2*R3)",
          "Schering bridge"
        ],
        "answer": 2
      },
      {
        "q": "The 'sliding null' effect in Anderson's bridge is minimized because:",
        "options": [
          "The independent adjustment of 'r' affects only the imaginary balance without disturbing the real balance",
          "The frequency is fixed",
          "The capacitor is variable",
          "The detector is a DC voltmeter"
        ],
        "answer": 0
      },
      {
        "q": "The balance equation for Lx is Lx = C*R3*[r*(1 + R2/R4) + R2]. If the variable resistor r is set to 0, this equation perfectly matches which other bridge?",
        "options": [
          "Hay's Bridge",
          "Maxwell's LC Bridge",
          "Schering Bridge",
          "Wien's Bridge"
        ],
        "answer": 1
      },
      {
        "q": "If C=1µF, R3=1000Ω, R2=1000Ω, R4=1000Ω, and r=500Ω. Calculate Lx.",
        "options": [
          "1 H",
          "1.5 H",
          "2 H",
          "0.5 H"
        ],
        "answer": 2
      },
      {
        "q": "The real (resistive) balance equation for Anderson's bridge is Rx = R2*R3/R4. Notice that it does NOT contain 'r'. This means:",
        "options": [
          "The bridge cannot be balanced",
          "Adjusting 'r' does not disturb the resistive balance, practically eliminating the 'sliding null' effect",
          "Rx is dependent on frequency",
          "Rx is zero"
        ],
        "answer": 1
      },
      {
        "q": "If the standard capacitor 'C' has a small dielectric loss (equivalent to a series resistance), how does it affect the Lx measurement?",
        "options": [
          "It adds a significant error to Lx",
          "It mostly affects the calculation of Rx, while the effect on Lx is secondary and often negligible",
          "It causes the bridge to oscillate",
          "It burns the capacitor"
        ],
        "answer": 1
      },
      {
        "q": "For a perfectly balanced Anderson bridge, the voltage across the detector is:",
        "options": [
          "Maximum",
          "Exactly equal to the supply voltage",
          "Zero (both in magnitude and phase)",
          "Infinity"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "ab_q6",
        "question": "Anderson bridge is a modification of which bridge?",
        "options": [
          "Maxwell-Wien bridge",
          "Maxwell Inductance bridge",
          "Hay bridge",
          "Schering bridge"
        ],
        "correctIndex": 1
      },
      {
        "id": "ab_q7",
        "question": "What is the main advantage of the Anderson bridge?",
        "options": [
          "It requires no variable capacitor",
          "It can measure very high Q coils",
          "It uses only three arms",
          "It operates on DC"
        ],
        "correctIndex": 0
      },
      {
        "id": "ab_q8",
        "question": "How many nodes (junctions) are present in the Anderson bridge circuit?",
        "options": [
          "Three",
          "Four",
          "Five",
          "Six"
        ],
        "correctIndex": 2
      },
      {
        "id": "ab_q9",
        "question": "The balance condition of the Anderson bridge requires adjusting:",
        "options": [
          "A variable capacitor",
          "A variable resistor",
          "The source frequency",
          "The source voltage"
        ],
        "correctIndex": 1
      },
      {
        "id": "ab_q10",
        "question": "Compared to Maxwell's bridge, the balance equations of Anderson's bridge are:",
        "options": [
          "Much simpler",
          "More complex",
          "Exactly the same",
          "Independent of resistance"
        ],
        "correctIndex": 1
      },
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
        "q": "Info: Schering Bridge is universally used for precision measurement of capacitance and dielectric loss. Prerequisite: Dissipation factor (D = tan δ). What is the primary industrial application of the Schering bridge?",
        "options": [
          "Measuring motor speed",
          "Testing high-voltage cables and insulators for dielectric breakdown",
          "Measuring antenna impedance",
          "Calibrating ammeters"
        ],
        "answer": 1
      },
      {
        "q": "The dissipation factor (D) of a capacitor measured by a Schering bridge is proportional to:",
        "options": [
          "The frequency of the source",
          "The standard capacitance",
          "The parallel capacitance C4 in the ratio arm",
          "The supply voltage"
        ],
        "answer": 2
      },
      {
        "q": "A Schering bridge uses a standard capacitor C2 which is usually:",
        "options": [
          "An electrolytic capacitor",
          "A loss-free high-voltage compressed gas capacitor",
          "A ceramic disk capacitor",
          "A supercapacitor"
        ],
        "answer": 1
      },
      {
        "q": "When testing high-voltage cables using a Schering bridge, the bridge arms must be protected because:",
        "options": [
          "High voltages are applied across the test object and standard capacitor, requiring safety spark gaps across the lower arms",
          "The cables are heavy",
          "The frequency is in the GHz range",
          "The galvanometer requires 1000V to operate"
        ],
        "answer": 0
      },
      {
        "q": "The dissipation factor of a dielectric represents:",
        "options": [
          "The energy stored per cycle",
          "The ratio of energy dissipated as heat to the energy stored per cycle",
          "The physical thickness of the dielectric",
          "The voltage breakdown limit"
        ],
        "answer": 1
      },
      {
        "q": "Schering Bridge is the industry standard for measuring:",
        "options": [
          "Inductance",
          "High-voltage capacitance and dielectric loss (tan δ) of insulators",
          "Frequency",
          "Temperature"
        ],
        "answer": 1
      },
      {
        "q": "In a high-voltage Schering bridge, the standard capacitor C2 is typically:",
        "options": [
          "An electrolytic capacitor",
          "A loss-free compressed gas (e.g., SF6) standard capacitor",
          "A ceramic disk",
          "A supercapacitor"
        ],
        "answer": 1
      },
      {
        "q": "For safety in a high-voltage Schering bridge, the operator manipulates controls located in:",
        "options": [
          "The high-voltage arms (C1, C2)",
          "The low-voltage, grounded arms (R3, C4/R4)",
          "The power supply",
          "The transformer core"
        ],
        "answer": 1
      },
      {
        "q": "The dissipation factor (D or tan δ) measures:",
        "options": [
          "The voltage rating of the capacitor",
          "The ratio of energy dissipated as heat to the energy stored in the electric field",
          "The physical size of the dielectric",
          "The inductance of the leads"
        ],
        "answer": 1
      },
      {
        "q": "What happens if a high-voltage cable under test in a Schering bridge suffers a dielectric breakdown?",
        "options": [
          "The bridge balances automatically",
          "Spark gaps across the low-voltage arms safely route the massive fault current to ground, protecting the operator",
          "The frequency drops to zero",
          "The standard capacitor explodes"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "In a Schering bridge, R4=1000Ω, C2=100pF (loss-free standard), R3=2000Ω. Calculate the unknown capacitance Cx.",
        "options": [
          "50 pF",
          "100 pF",
          "200 pF",
          "500 pF"
        ],
        "answer": 0
      },
      {
        "q": "At 50 Hz, the parallel capacitor C4 required to balance the bridge is 0.1µF, and R4 is 1000Ω. What is the dissipation factor (tan δ) of the unknown dielectric? (D = ω*C4*R4)",
        "options": [
          "0.0314",
          "0.314",
          "3.14",
          "0.00314"
        ],
        "answer": 0
      },
      {
        "q": "The dissipation factor (tan δ) in a Schering bridge is calculated as ω*C4*R4. If R4 is fixed, the dial of variable capacitor C4 can be directly calibrated to read:",
        "options": [
          "Inductance",
          "Quality factor Q",
          "Dissipation factor (Dielectric loss)",
          "Frequency"
        ],
        "answer": 2
      },
      {
        "q": "A high-voltage Schering bridge is balanced with C2 = 50 pF, R3 = 1000/π Ω, C4 = 0.5 µF, R4 = 300 Ω. The source frequency is 50 Hz. What is the dissipation factor?",
        "options": [
          "0.015",
          "0.047",
          "0.15",
          "0.47"
        ],
        "answer": 0
      },
      {
        "q": "In a high-voltage Schering bridge, the detector and the lower arms (R3, C4-R4) are kept at:",
        "options": [
          "Extremely high potential",
          "Earth potential (grounded) to ensure operator safety",
          "Floating potential",
          "Negative potential"
        ],
        "answer": 1
      },
      {
        "q": "The balance equation for the unknown capacitance is Cx = C2 * (R4/R3). If C2=100pF, R4=1000Ω, R3=2000Ω, what is Cx?",
        "options": [
          "50 pF",
          "100 pF",
          "200 pF",
          "500 pF"
        ],
        "answer": 0
      },
      {
        "q": "The dissipation factor tan δ is given by ω*C4*R4. If R4 is fixed at 1000/π Ω, and f=50 Hz (ω=100π), the equation simplifies to tan δ = 100,000 * C4. This means C4 can be calibrated directly to read:",
        "options": [
          "Capacitance",
          "Dissipation factor",
          "Voltage",
          "Frequency"
        ],
        "answer": 1
      },
      {
        "q": "If C4 is 1µF, what is the dissipation factor in the above setup?",
        "options": [
          "0.01",
          "0.1",
          "1.0",
          "10"
        ],
        "answer": 1
      },
      {
        "q": "Why is a Wagner Earth connection absolutely critical in precision Schering bridge measurements?",
        "options": [
          "To prevent electrocution",
          "To eliminate the effect of stray capacitances from the detector nodes to ground, which would otherwise ruin the phase balance",
          "To cool the compressed gas capacitor",
          "To increase the supply voltage"
        ],
        "answer": 1
      },
      {
        "q": "As an insulator ages, its dissipation factor (tan δ) typically:",
        "options": [
          "Decreases",
          "Increases due to moisture ingress and partial discharges",
          "Remains perfectly constant",
          "Becomes negative"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
        "id": "sb_q6",
        "question": "The Schering bridge is primarily used for measuring:",
        "options": [
          "Unknown inductance",
          "Unknown capacitance and dielectric loss",
          "Unknown resistance",
          "Unknown frequency"
        ],
        "correctIndex": 1
      },
      {
        "id": "sb_q7",
        "question": "At high voltages, the standard capacitor used in a Schering bridge is typically a:",
        "options": [
          "Electrolytic capacitor",
          "Ceramic capacitor",
          "Gas-filled standard capacitor",
          "Tantalum capacitor"
        ],
        "correctIndex": 2
      },
      {
        "id": "sb_q8",
        "question": "The dissipation factor (D) measured by a Schering bridge is equivalent to:",
        "options": [
          "tan(delta)",
          "cos(theta)",
          "sin(delta)",
          "Q factor"
        ],
        "correctIndex": 0
      },
      {
        "id": "sb_q9",
        "question": "In a high-voltage Schering bridge, the null detector is connected between:",
        "options": [
          "The high voltage arms",
          "The low voltage arms",
          "The source terminals",
          "The standard capacitor and ground"
        ],
        "correctIndex": 1
      },
      {
        "id": "sb_q10",
        "question": "The Schering bridge balance is achieved by varying:",
        "options": [
          "The high voltage standard capacitor",
          "The unknown capacitor",
          "A low voltage resistor and capacitor",
          "The supply frequency"
        ],
        "correctIndex": 2
      },
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
        "q": "Info: Wien's Bridge is an AC bridge used primarily for measuring frequency or acting as a frequency-selective filter. Prerequisite: RC phase shift networks. At the balance frequency, what is the phase shift across the RC arms?",
        "options": [
          "90 degrees",
          "180 degrees",
          "Zero degrees",
          "45 degrees"
        ],
        "answer": 2
      },
      {
        "q": "If the series RC arm has components R1, C1 and the parallel RC arm has R2, C2, the balance frequency f is given by:",
        "options": [
          "1 / (2π * R1 * C1)",
          "1 / (2π * √(R1*R2*C1*C2))",
          "R1 / (2π * C1)",
          "√(R1*C1)"
        ],
        "answer": 1
      },
      {
        "q": "Wien's bridge is fundamentally a:",
        "options": [
          "Notch filter (band-reject) at the balance frequency",
          "Low-pass filter",
          "High-pass filter",
          "All-pass filter"
        ],
        "answer": 0
      },
      {
        "q": "To use Wien's bridge as an audio frequency oscillator, it must be placed in the feedback loop of an amplifier with:",
        "options": [
          "Negative feedback only",
          "Positive feedback to sustain oscillations",
          "No feedback",
          "Infinite gain"
        ],
        "answer": 1
      },
      {
        "q": "If the series RC arm is R1, C1 and the parallel RC arm is R2, C2, the phase shift at the balance frequency is exactly:",
        "options": [
          "180°",
          "90°",
          "0°",
          "-90°"
        ],
        "answer": 2
      },
      {
        "q": "Wien's bridge is unique among AC bridges because its primary application is:",
        "options": [
          "Measuring unknown capacitance",
          "Measuring unknown inductance",
          "Measuring frequency or acting as a frequency-determining feedback network in oscillators",
          "Measuring high voltages"
        ],
        "answer": 2
      },
      {
        "q": "At the balance frequency, the phase shift introduced by the series-parallel RC arms of a Wien bridge is:",
        "options": [
          "-90°",
          "0°",
          "90°",
          "180°"
        ],
        "answer": 1
      },
      {
        "q": "A Wien Bridge Oscillator requires an amplifier. The bridge is placed in the feedback loop. What type of feedback is used?",
        "options": [
          "Positive feedback only",
          "Negative feedback only",
          "Both: Positive feedback through the RC arms for oscillation, and Negative feedback through the resistive arms for amplitude stabilization",
          "No feedback"
        ],
        "answer": 2
      },
      {
        "q": "In a Wien Bridge with identical RC components (R1=R2=R, C1=C2=C), the ratio of the purely resistive arms R3/R4 required for balance is:",
        "options": [
          "0.5",
          "1.0",
          "2.0",
          "3.0"
        ],
        "answer": 2
      },
      {
        "q": "What component is traditionally used in the negative feedback loop of a Wien bridge oscillator to automatically stabilize the amplitude?",
        "options": [
          "A zener diode",
          "An inductor",
          "A small incandescent lamp (PTC thermistor)",
          "A capacitor"
        ],
        "answer": 2
      }
    ],
    "posttest": [
      {
        "q": "A Wien bridge oscillator uses identical RC components (R1=R2=R, C1=C2=C). If R=15.9 kΩ and C=0.01 µF, what is the balance frequency?",
        "options": [
          "100 Hz",
          "1 kHz",
          "10 kHz",
          "50 Hz"
        ],
        "answer": 1
      },
      {
        "q": "For a Wien bridge with identical RC components, what must be the ratio of the purely resistive arms (R3/R4) to maintain oscillation?",
        "options": [
          "1",
          "2",
          "3",
          "0.5"
        ],
        "answer": 1
      },
      {
        "q": "In a Wien Bridge Oscillator, an incandescent lamp or thermistor is often used in the purely resistive arm. Why?",
        "options": [
          "To provide light for the operator",
          "To provide automatic amplitude stabilization via non-linear resistance",
          "To increase the frequency",
          "To filter out harmonics"
        ],
        "answer": 1
      },
      {
        "q": "If R1=10kΩ, C1=10nF, R2=20kΩ, C2=5nF. Calculate the balance frequency f = 1 / (2π√(R1*R2*C1*C2)).",
        "options": [
          "~1.59 kHz",
          "~3.18 kHz",
          "~7.95 kHz",
          "~15.9 kHz"
        ],
        "answer": 0
      },
      {
        "q": "At the balance frequency of a Wien bridge with identical RC components (R1=R2, C1=C2), the voltage at the junction of the RC arms is what fraction of the input voltage?",
        "options": [
          "1/2",
          "1/3",
          "1/4",
          "1/√2"
        ],
        "answer": 1
      },
      {
        "q": "The balance frequency of a Wien bridge is f = 1 / (2π√(R1*R2*C1*C2)). If identical components R=15.9 kΩ and C=0.01 µF are used, the frequency is:",
        "options": [
          "100 Hz",
          "500 Hz",
          "1 kHz",
          "10 kHz"
        ],
        "answer": 2
      },
      {
        "q": "If the capacitors C1 and C2 are both doubled, the balance frequency will:",
        "options": [
          "Double",
          "Halve",
          "Quadruple",
          "Remain unchanged"
        ],
        "answer": 1
      },
      {
        "q": "At the exact balance frequency, the attenuation of the RC network (Vout/Vin) is:",
        "options": [
          "1/2",
          "1/3",
          "1/4",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "If the amplifier gain drops slightly below 3 (i.e., R3/R4 < 2), what happens to the oscillations?",
        "options": [
          "They grow exponentially and clip",
          "They are sustained perfectly",
          "They decay and die out completely",
          "The frequency shifts"
        ],
        "answer": 2
      },
      {
        "q": "Wien's bridge can also be used as a notch filter (band-reject filter) to remove a specific frequency. What is a common application of this?",
        "options": [
          "Creating radio waves",
          "Filtering out 50/60 Hz AC mains hum from audio signals",
          "Amplifying DC signals",
          "Measuring temperature"
        ],
        "answer": 1
      }
    ],
    "viva": [
      {
        "id": "wb2_q6",
        "question": "Wien's bridge is most commonly used for measuring:",
        "options": [
          "Inductance",
          "Frequency",
          "High resistance",
          "Mutual inductance"
        ],
        "correctIndex": 1
      },
      {
        "id": "wb2_q7",
        "question": "At balance, the frequency formula for a Wien bridge (when R1=R2=R and C1=C2=C) is:",
        "options": [
          "f = 1 / (2*pi*R*C)",
          "f = 2*pi*R*C",
          "f = 1 / (R*C)",
          "f = R*C / (2*pi)"
        ],
        "correctIndex": 0
      },
      {
        "id": "wb2_q8",
        "question": "For the Wien bridge to be balanced with identical RC components in the reactive arms, the ratio of the resistive arms must be:",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correctIndex": 1
      },
      {
        "id": "wb2_q9",
        "question": "Wien bridge can also be used as the feedback network in an oscillator. It requires an amplifier with a gain of:",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correctIndex": 2
      },
      {
        "id": "wb2_q10",
        "question": "Harmonic distortion in a source can cause problems in a Wien bridge because:",
        "options": [
          "It breaks the resistors",
          "The bridge balances at only one fundamental frequency",
          "It creates DC offset",
          "It burns out the detector"
        ],
        "correctIndex": 1
      },
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
        "q": "Info: The Transformer Ratio Bridge uses a tapped precision transformer to provide exact voltage ratios, replacing resistive arms. Prerequisite: Magnetic coupling and transformer turns ratio. What is the primary advantage of a transformer ratio bridge?",
        "options": [
          "It uses DC only",
          "It is immune to stray capacitances and requires no Wagner earth connection",
          "It is extremely cheap to build",
          "It measures only inductors"
        ],
        "answer": 1
      },
      {
        "q": "If the tapped transformer provides a voltage ratio of N1/N2, the balance condition for unknown impedance Zx and standard Zs is:",
        "options": [
          "Zx = Zs * (N1/N2)",
          "Zx = Zs * (N2/N1)",
          "Zx = Zs",
          "Zx = Zs * √(N1/N2)"
        ],
        "answer": 0
      },
      {
        "q": "A Transformer Ratio Arm Bridge utilizes tightly coupled transformer windings. This provides:",
        "options": [
          "A highly accurate and stable voltage ratio unaffected by age or temperature",
          "A variable frequency output",
          "A DC measurement capability",
          "A high resistance ratio"
        ],
        "answer": 0
      },
      {
        "q": "In a three-terminal measurement setup using a transformer ratio bridge, stray capacitance from the unknown component's terminals to the grounded shield:",
        "options": [
          "Causes massive errors",
          "Is completely eliminated from the balance condition",
          "Requires a Wagner earth",
          "Burns the transformer"
        ],
        "answer": 1
      },
      {
        "q": "The accuracy of a transformer ratio bridge is primarily determined by:",
        "options": [
          "The quality of the resistors used",
          "The turns ratio of the transformer core",
          "The battery voltage",
          "The ambient temperature"
        ],
        "answer": 1
      },
      {
        "q": "The core principle of a Transformer Ratio Bridge is to replace the traditional resistive ratio arms with:",
        "options": [
          "Capacitors",
          "Inductors",
          "A tightly coupled, precisely tapped audio-frequency transformer",
          "A battery"
        ],
        "answer": 2
      },
      {
        "q": "What is the biggest advantage of a Transformer Ratio Bridge over a traditional Wheatstone-style AC bridge?",
        "options": [
          "It uses DC",
          "It is virtually immune to stray capacitances to ground, eliminating the need for a Wagner Earth",
          "It requires no detector",
          "It can measure temperature"
        ],
        "answer": 1
      },
      {
        "q": "In an ideal transformer, the voltage ratio between two taps is determined EXACTLY by:",
        "options": [
          "The wire thickness",
          "The core material",
          "The ratio of the number of turns (N1/N2)",
          "The frequency"
        ],
        "answer": 2
      },
      {
        "q": "Because of the tight magnetic coupling on a high-permeability core, drawing current from one tap of the transformer:",
        "options": [
          "Causes a massive voltage drop",
          "Has almost no effect on the voltage ratio between taps",
          "Burns out the core",
          "Changes the frequency"
        ],
        "answer": 1
      },
      {
        "q": "Transformer ratio bridges are extremely useful for measuring 'in-circuit' components because:",
        "options": [
          "They use very high voltages",
          "The stray impedances to ground are shunted across the low-impedance transformer windings or the zero-potential detector, causing negligible error",
          "They burn out the surrounding components",
          "They operate at 0 Hz"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "In a transformer ratio capacitance bridge, a standard capacitor Cs=100pF is connected to a tap with 10 turns. The unknown Cx is connected to a tap with 100 turns. What is Cx at balance?",
        "options": [
          "10 pF",
          "100 pF",
          "1000 pF",
          "1 pF"
        ],
        "answer": 0
      },
      {
        "q": "Why do stray capacitances to ground at the detector nodes not affect the balance point of a transformer ratio bridge?",
        "options": [
          "Because the transformer operates at high frequency",
          "Because at balance, the detector nodes are at zero potential difference",
          "Because the stray capacitance is absorbed into the transformer leakage inductance",
          "Because DC current blocks capacitance"
        ],
        "answer": 1
      },
      {
        "q": "If the transformer core is made of a high-permeability material like Supermalloy, the leakage flux is very small. What happens to the balance ratio if a heavy load draws current from one tap?",
        "options": [
          "The ratio changes drastically",
          "The ratio remains virtually unchanged due to the tight magnetic coupling",
          "The core saturates immediately",
          "The frequency shifts"
        ],
        "answer": 1
      },
      {
        "q": "A standard capacitor Cs is fixed at 1nF. The transformer has 1000 equal turns. The unknown Cx balances when connected to turn 745, while Cs is on turn 1000. What is Cx?",
        "options": [
          "745 nF",
          "1.34 nF",
          "0.745 nF",
          "7.45 nF"
        ],
        "answer": 2
      },
      {
        "q": "Which of the following is a direct consequence of using an ideal transformer in a bridge?",
        "options": [
          "The bridge arms have zero output impedance",
          "The bridge requires infinite power",
          "The bridge cannot measure capacitance",
          "The bridge only works at 1 MHz"
        ],
        "answer": 0
      },
      {
        "q": "A standard capacitor Cs = 1000 pF is connected to a 10-turn tap. The unknown Cx is connected to a 100-turn tap. At balance, what is Cx?",
        "options": [
          "10 pF",
          "100 pF",
          "1000 pF",
          "10000 pF"
        ],
        "answer": 1
      },
      {
        "q": "If a stray capacitance of 100 pF exists from the unknown capacitor's terminal to ground (which is connected to the transformer center tap), what error does it introduce?",
        "options": [
          "100% error",
          "10% error",
          "Negligible error (ppm level) because it only heavily loads a very low-impedance transformer winding",
          "Bridge cannot balance"
        ],
        "answer": 2
      },
      {
        "q": "To measure an inductor with a Transformer Ratio Bridge using a standard capacitor, one must:",
        "options": [
          "It is impossible",
          "Connect the standard capacitor to a winding with the OPPOSITE phase (negative turns) to cancel the inductive reactance",
          "Use a DC battery",
          "Heat the capacitor"
        ],
        "answer": 1
      },
      {
        "q": "If the core is made of Supermalloy (relative permeability ~100,000), the leakage flux is:",
        "options": [
          "Extremely high",
          "Zero",
          "Extremely low, ensuring the voltage ratio perfectly matches the turns ratio",
          "Dependent on temperature"
        ],
        "answer": 2
      },
      {
        "q": "A 6-dial transformer ratio bridge can provide a resolution of:",
        "options": [
          "1 part in 10",
          "1 part in 100",
          "1 part in 1,000,000 (1 ppm)",
          "Infinite resolution"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "trb_q6",
        "question": "What replaces the resistive ratio arms in a Transformer Ratio Arm Bridge?",
        "options": [
          "Capacitors",
          "Inductors",
          "A tapped transformer winding",
          "Active op-amps"
        ],
        "correctIndex": 2
      },
      {
        "id": "trb_q7",
        "question": "A major advantage of the transformer ratio arm bridge is its:",
        "options": [
          "Ability to operate on DC",
          "Extreme accuracy and immunity to stray capacitance",
          "Very low cost",
          "Simplicity for low frequency"
        ],
        "correctIndex": 1
      },
      {
        "id": "trb_q8",
        "question": "The voltage ratio in a transformer ratio arm bridge depends primarily on:",
        "options": [
          "The temperature of the wire",
          "The turns ratio of the transformer",
          "The supply voltage magnitude",
          "The stray capacitance to ground"
        ],
        "correctIndex": 1
      },
      {
        "id": "trb_q9",
        "question": "Why are stray capacitances to ground less problematic in this bridge?",
        "options": [
          "Because they are eliminated by shielding",
          "Because they shunt the low impedance transformer windings",
          "Because they are resonated out",
          "Because DC is used"
        ],
        "correctIndex": 1
      },
      {
        "id": "trb_q10",
        "question": "Transformer ratio arm bridges are often used for precision measurement of:",
        "options": [
          "Large inductors",
          "Small capacitances",
          "High voltages",
          "DC resistances"
        ],
        "correctIndex": 1
      },
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
  },
  {
    "id": "thermocouple",
    "tag": "T-01",
    "title": "Thermocouple Characteristics",
    "aim": "To study the characteristics of a thermocouple and determine the Seebeck EMF as a function of temperature difference.",
    "objectives": [
      "Understand the Seebeck effect and thermoelectric EMF generation.",
      "Measure the EMF output of J, K, T, and E type thermocouples.",
      "Understand cold junction compensation (CJC) and its importance.",
      "Plot EMF vs. temperature characteristics."
    ],
    "theory": [
      "A thermocouple is a temperature sensor consisting of two dissimilar metal wires joined at one end (hot junction). When the hot junction is at a different temperature from the reference end (cold junction), a voltage (EMF) is generated.",
      "This phenomenon is called the Seebeck effect, discovered by Thomas Johann Seebeck in 1821.",
      "The EMF generated is given by: V = S × (T_hot - T_cold), where S is the Seebeck coefficient (μV/°C) and T is temperature in °C.",
      "Different thermocouple types use different metal pairs: Type J (Iron-Constantan, S≈50.38 μV/°C), Type K (Chromel-Alumel, S≈40.44 μV/°C), Type T (Copper-Constantan, S≈40.68 μV/°C), Type E (Chromel-Constantan, S≈63.0 μV/°C).",
      "Cold Junction Compensation (CJC) is essential because the cold junction is usually at ambient temperature, not 0°C. The instrument adds the equivalent EMF for the ambient temperature to give the correct reading.",
      "Any error in CJC measurement adds directly to the temperature reading error: ΔV_error = S × ε_CJC."
    ],
    "procedure": [
      "Open the Thermocouple Simulator in the Simulation tab.",
      "Select thermocouple type (K is most common for general-purpose use).",
      "Set the cold junction temperature to 25°C (room temperature).",
      "Slowly increase the hot junction temperature from 0°C to maximum range using the slider.",
      "Record the EMF output at every 100°C interval in the observation table.",
      "Introduce a CJC error of +3°C and observe the shift in compensated EMF.",
      "Plot the EMF vs. Temperature graph and verify linearity."
    ],
    "references": [
      "A.K. Sawhney - A Course in Electrical and Electronic Measurements and Instrumentation",
      "IEC 60584 - Thermocouples Standard"
    ],
    "pretest": [
      {
        "q": "Info: A Thermocouple is a temperature sensor consisting of two dissimilar metals joined at one end, generating a voltage proportional to temperature difference (Seebeck Effect). Prerequisite: Seebeck effect and thermodynamics. What is the fundamental principle of a thermocouple?",
        "options": [
          "Peltier Effect",
          "Seebeck Effect",
          "Hall Effect",
          "Thomson Effect"
        ],
        "answer": 1
      },
      {
        "q": "To measure absolute temperature using a thermocouple, the reference (cold) junction must be:",
        "options": [
          "At the same temperature as the hot junction",
          "Kept at a known, stable temperature (usually 0°C)",
          "Heated to boiling point",
          "Left floating in open air"
        ],
        "answer": 1
      },
      {
        "q": "The Seebeck EMF generated by a thermocouple is a non-linear function of temperature. It is typically modeled using:",
        "options": [
          "A linear equation (y = mx + c)",
          "A polynomial equation (E = aT + bT² + ...)",
          "An exponential decay",
          "A logarithmic function"
        ],
        "answer": 1
      },
      {
        "q": "Cold Junction Compensation (CJC) in modern digital thermometers is usually achieved by:",
        "options": [
          "An ice bath",
          "Measuring the terminal block temperature with a thermistor or RTD and calculating the offset",
          "Ignoring the cold junction",
          "Short-circuiting the cold junction"
        ],
        "answer": 1
      },
      {
        "q": "Which thermocouple type is made of Platinum/Rhodium and used for extremely high temperatures?",
        "options": [
          "Type K",
          "Type J",
          "Type T",
          "Type B, R, or S"
        ],
        "answer": 3
      },
      {
        "q": "A thermocouple operates on the Seebeck effect, which is:",
        "options": [
          "The generation of light from electricity",
          "The generation of a voltage proportional to a temperature gradient across two dissimilar metals",
          "The change in resistance with temperature",
          "The cooling of a junction when current flows"
        ],
        "answer": 1
      },
      {
        "q": "The Law of Intermediate Metals states that inserting a third metal into a thermocouple circuit will not affect the EMF, PROVIDED:",
        "options": [
          "The third metal is copper",
          "Both ends of the third metal are at the exact same temperature",
          "The third metal is an insulator",
          "The voltage is AC"
        ],
        "answer": 1
      },
      {
        "q": "To make an absolute temperature measurement, a thermocouple requires:",
        "options": [
          "A high voltage power supply",
          "A known, stable reference (cold) junction temperature",
          "A vacuum chamber",
          "A laser"
        ],
        "answer": 1
      },
      {
        "q": "Type K thermocouples are made of:",
        "options": [
          "Platinum and Rhodium",
          "Iron and Constantan",
          "Chromel and Alumel",
          "Copper and Constantan"
        ],
        "answer": 2
      },
      {
        "q": "Why are thermocouples often encased in a stainless steel or ceramic sheath?",
        "options": [
          "To make them heavier",
          "To protect the delicate metal wires from corrosive industrial environments and mechanical damage",
          "To generate more voltage",
          "To act as a third metal"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "A K-type thermocouple has a sensitivity of approximately 41 µV/°C. If the reference junction is at 0°C and the voltmeter reads 4.1 mV, what is the temperature of the hot junction?",
        "options": [
          "10°C",
          "50°C",
          "100°C",
          "410°C"
        ],
        "answer": 2
      },
      {
        "q": "Which law states that a third metal inserted into a thermocouple circuit will not affect the net EMF, provided both ends of the new metal are at the same temperature?",
        "options": [
          "Law of Homogeneous Circuits",
          "Law of Intermediate Metals",
          "Law of Intermediate Temperatures",
          "Ohm's Law"
        ],
        "answer": 1
      },
      {
        "q": "A Type K thermocouple outputs 4.096 mV at 100°C (with 0°C reference). If the reference junction is actually at 25°C (which outputs 1.000 mV vs 0°C), what voltage will the voltmeter actually read when the hot junction is at 100°C?",
        "options": [
          "5.096 mV",
          "4.096 mV",
          "3.096 mV",
          "0.000 mV"
        ],
        "answer": 2
      },
      {
        "q": "Using extension wires made of standard copper instead of thermocouple alloy wires will cause:",
        "options": [
          "No error",
          "An error if there is a temperature gradient along the copper wires",
          "The thermocouple to melt",
          "A short circuit"
        ],
        "answer": 1
      },
      {
        "q": "The Peltier effect is the reverse of the Seebeck effect. In a thermocouple measurement circuit, the Peltier effect:",
        "options": [
          "Causes massive measurement errors",
          "Is negligible because the measuring voltmeter draws almost zero current",
          "Provides the primary measurement EMF",
          "Heats the cold junction to 100°C"
        ],
        "answer": 1
      },
      {
        "q": "A Type K thermocouple has a sensitivity of ~41 µV/°C. If the reference junction is at 20°C and the voltmeter reads 4.1 mV, what is the hot junction temperature?",
        "options": [
          "100 °C",
          "120 °C",
          "80 °C",
          "410 °C"
        ],
        "answer": 1
      },
      {
        "q": "If you connect a Type K thermocouple to a copper-wire voltmeter, you create two new junctions. If these two new junctions are at different temperatures, what happens?",
        "options": [
          "The measurement is perfectly accurate",
          "A parasitic Seebeck EMF is generated, causing a significant measurement error",
          "The thermocouple melts",
          "The voltmeter reads zero"
        ],
        "answer": 1
      },
      {
        "q": "Modern digital thermometers perform 'Cold Junction Compensation' (CJC) by:",
        "options": [
          "Carrying an ice bath inside the device",
          "Measuring the temperature of the terminal block with an RTD or thermistor and digitally adding the equivalent offset voltage",
          "Ignoring the cold junction",
          "Shorting the terminals"
        ],
        "answer": 1
      },
      {
        "q": "The Seebeck voltage is not perfectly linear with temperature. To get highly accurate readings across a wide range, microcontrollers use:",
        "options": [
          "A simple multiplier",
          "High-order polynomial equations (e.g., NIST standard polynomials) or look-up tables",
          "Ohm's law",
          "A fixed offset"
        ],
        "answer": 1
      },
      {
        "q": "Which thermocouple type is best suited for measuring the temperature of molten steel (~1500°C)?",
        "options": [
          "Type T (Copper/Constantan)",
          "Type J (Iron/Constantan)",
          "Type K (Chromel/Alumel)",
          "Type S or R (Platinum/Rhodium)"
        ],
        "answer": 3
      }
    ],
    "viva": [
      {
        "id": "tc_q4",
        "question": "The Seebeck coefficient is defined as:",
        "options": [
          "Change in voltage per unit change in temperature",
          "Change in resistance per unit temperature",
          "Change in current per unit voltage",
          "Heat absorbed per unit current"
        ],
        "correctIndex": 0
      },
      {
        "id": "tc_q5",
        "question": "What is Cold Junction Compensation (CJC) in a thermocouple?",
        "options": [
          "Cooling the thermocouple to 0°C",
          "Adding a voltage to compensate for the reference junction not being at 0°C",
          "Using ice water for the hot junction",
          "Removing the cold junction entirely"
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q6",
        "question": "Which thermocouple type is made of Chromel and Alumel?",
        "options": [
          "Type J",
          "Type K",
          "Type T",
          "Type E"
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q7",
        "question": "The Peltier effect is the reverse of which effect?",
        "options": [
          "Thomson effect",
          "Seebeck effect",
          "Hall effect",
          "Faraday effect"
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q8",
        "question": "Which law states that the EMF of a thermocouple is independent of the temperature distribution along the wires?",
        "options": [
          "Law of intermediate metals",
          "Law of homogeneous materials",
          "Law of intermediate temperatures",
          "Ohm's Law"
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q9",
        "question": "Thermocouples measure:",
        "options": [
          "Absolute temperature",
          "Temperature difference between two junctions",
          "Heat capacity",
          "Thermal conductivity"
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q10",
        "question": "Type T thermocouple consists of which metals?",
        "options": [
          "Iron and Constantan",
          "Copper and Constantan",
          "Chromel and Alumel",
          "Platinum and Rhodium"
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q1",
        "question": "What is the Seebeck effect?",
        "options": [
          "The cooling of a junction when current flows through it.",
          "The generation of an EMF at the junction of two dissimilar metals when a temperature difference exists.",
          "The change in resistance of a metal with temperature.",
          "The absorption of heat when current flows through a resistor."
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q2",
        "question": "Why is Cold Junction Compensation (CJC) necessary in a thermocouple measurement system?",
        "options": [
          "To prevent the cold junction from melting.",
          "Because the thermocouple EMF tables are referenced to 0°C, but the cold junction is usually at ambient temperature.",
          "To amplify the weak thermocouple signal.",
          "To filter out electrical noise."
        ],
        "correctIndex": 1
      },
      {
        "id": "tc_q3",
        "question": "Type K thermocouple uses which metal pair?",
        "options": [
          "Iron and Constantan",
          "Copper and Constantan",
          "Chromel and Alumel",
          "Platinum and Rhodium"
        ],
        "correctIndex": 2
      }
    ]
  },
  {
    "id": "rtd",
    "tag": "T-02",
    "title": "RTD (PT100) Characteristics",
    "aim": "To study the resistance-temperature characteristics of a PT100 RTD and understand the effect of wiring configurations on measurement accuracy.",
    "objectives": [
      "Understand the principle of resistance temperature detectors (RTDs).",
      "Apply the Callendar-Van Dusen equation to calculate resistance.",
      "Compare 2-wire, 3-wire, and 4-wire measurement configurations.",
      "Understand lead resistance errors and how to eliminate them."
    ],
    "theory": [
      "An RTD (Resistance Temperature Detector) is a temperature sensor that exploits the fact that the electrical resistance of metals changes with temperature.",
      "PT100 is the most common RTD, made of platinum with a resistance of 100 Ω at 0°C.",
      "For temperatures above 0°C, the Callendar-Van Dusen equation applies: R(T) = R0 × (1 + A×T + B×T²), where R0=100 Ω, A=3.9083×10⁻³, B=-5.775×10⁻⁷.",
      "For temperatures below 0°C, an additional C term applies: R(T) = R0 × (1 + A×T + B×T² + C×(T-100)×T³), where C=-4.183×10⁻¹².",
      "2-wire configuration: Lead resistance adds directly to measured resistance, causing errors.",
      "3-wire configuration: Cancels one lead resistance, reducing error significantly.",
      "4-wire (Kelvin) configuration: Completely eliminates lead resistance error. Gold standard for precision."
    ],
    "procedure": [
      "Open the RTD Simulator in the Simulation tab.",
      "Set the temperature slider to 0°C and note the resistance (should be 100 Ω).",
      "Increase temperature in steps of 100°C up to 600°C and record R(T).",
      "Set lead resistance to 2 Ω and compare 2-wire vs 3-wire vs 4-wire readings.",
      "Observe and record the temperature error due to lead resistance in 2-wire mode.",
      "Plot R vs T graph and verify the non-linear (quadratic) relationship."
    ],
    "references": [
      "IEC 60751 - Industrial Platinum Resistance Thermometers",
      "Helfrick & Cooper - Modern Electronic Instrumentation"
    ],
    "pretest": [
      {
        "q": "Info: A Resistance Temperature Detector (RTD) measures temperature by correlating the resistance of the RTD element with temperature. Prerequisite: Temperature coefficient of resistance (alpha). Which material is the industry standard for precision RTDs (e.g., PT100)?",
        "options": [
          "Copper",
          "Nickel",
          "Platinum",
          "Tungsten"
        ],
        "answer": 2
      },
      {
        "q": "What does 'PT100' mean?",
        "options": [
          "Platinum sensor with 100 ohms resistance at 100°C",
          "Platinum sensor with 100 ohms resistance at 0°C",
          "Polymer sensor with 100 ohms resistance",
          "Platinum sensor handling 100 Amps"
        ],
        "answer": 1
      },
      {
        "q": "The resistance of a metal increases with temperature due to:",
        "options": [
          "Increased electron density",
          "Decreased electron density",
          "Increased scattering of electrons by lattice vibrations (phonons)",
          "Creation of electron-hole pairs"
        ],
        "answer": 2
      },
      {
        "q": "Which of the following defines the 'Alpha' (α) of a PT100 RTD?",
        "options": [
          "The resistance at 0°C",
          "The average fractional change in resistance per °C between 0°C and 100°C",
          "The maximum operating temperature",
          "The minimum current required"
        ],
        "answer": 1
      },
      {
        "q": "A 4-wire RTD configuration uses two wires to supply current and two wires to measure voltage. This is an application of:",
        "options": [
          "A Wheatstone bridge",
          "A Kelvin sensing (4-terminal sensing) method",
          "A Maxwell bridge",
          "A current transformer"
        ],
        "answer": 1
      },
      {
        "q": "An RTD (Resistance Temperature Detector) measures temperature based on:",
        "options": [
          "The Seebeck effect",
          "The positive temperature coefficient of electrical resistance in pure metals",
          "The emission of infrared radiation",
          "The piezoelectric effect"
        ],
        "answer": 1
      },
      {
        "q": "The most common and stable material used for precision industrial RTDs is:",
        "options": [
          "Copper",
          "Nickel",
          "Tungsten",
          "Platinum"
        ],
        "answer": 3
      },
      {
        "q": "A 'PT100' sensor has a resistance of:",
        "options": [
          "100 ohms at 100°C",
          "100 ohms at 0°C",
          "100 ohms at absolute zero",
          "100 kilo-ohms at 0°C"
        ],
        "answer": 1
      },
      {
        "q": "Why is a 4-wire RTD measurement superior to a 2-wire measurement?",
        "options": [
          "It provides 4 times the current",
          "It completely eliminates errors caused by the resistance of the long lead wires connecting the sensor to the instrument",
          "It makes the sensor physically stronger",
          "It reduces the cost"
        ],
        "answer": 1
      },
      {
        "q": "The 'Alpha' (α) value of a standard European PT100 RTD is:",
        "options": [
          "0.00385 Ω/Ω/°C",
          "0.00392 Ω/Ω/°C",
          "0.1 Ω/Ω/°C",
          "1.0 Ω/Ω/°C"
        ],
        "answer": 0
      }
    ],
    "posttest": [
      {
        "q": "A PT100 RTD has an alpha (α) of 0.00385 Ω/Ω/°C. At 100°C, what is its approximate resistance? (R = R0(1 + αΔT))",
        "options": [
          "100.0 Ω",
          "138.5 Ω",
          "200.0 Ω",
          "103.8 Ω"
        ],
        "answer": 1
      },
      {
        "q": "Why is a 3-wire or 4-wire measurement configuration preferred over a 2-wire configuration for RTDs?",
        "options": [
          "To increase the current flow",
          "To eliminate the error caused by lead wire resistance",
          "To double the sensitivity",
          "To prevent the RTD from overheating"
        ],
        "answer": 1
      },
      {
        "q": "An RTD has R0 = 100Ω and α = 0.00385. If it is placed in a Wheatstone bridge with equal 100Ω arms, and the temperature rises to 10°C, the RTD resistance becomes 103.85Ω. If the bridge is powered by 5V, the approximate unbalanced voltage is:",
        "options": [
          "~47 mV",
          "~4.7 V",
          "~0.47 mV",
          "~470 mV"
        ],
        "answer": 0
      },
      {
        "q": "If a 1mA excitation current is passed through a PT100 RTD at 0°C (100Ω), the power dissipated is 0.1mW. If the RTD has a self-heating factor of 0.2°C/mW in still air, the temperature error introduced by the measurement current is:",
        "options": [
          "0.02 °C",
          "0.2 °C",
          "2.0 °C",
          "20 °C"
        ],
        "answer": 0
      },
      {
        "q": "To achieve a highly linear voltage output from an RTD over a wide temperature range without a bridge, one should drive the RTD with:",
        "options": [
          "A constant voltage source",
          "A constant current source",
          "An AC voltage source",
          "A noisy power supply"
        ],
        "answer": 1
      },
      {
        "q": "Using the linear approximation R = R0(1 + αT), calculate the resistance of a PT100 at 50°C (Assume α = 0.00385).",
        "options": [
          "100.00 Ω",
          "119.25 Ω",
          "150.00 Ω",
          "103.85 Ω"
        ],
        "answer": 1
      },
      {
        "q": "If a measurement current of 5mA is used for a PT100 at 0°C, what is the power dissipated in the sensor? (P = I²R)",
        "options": [
          "2.5 mW",
          "5 mW",
          "25 mW",
          "500 mW"
        ],
        "answer": 0
      },
      {
        "q": "If the sensor from the previous question has a self-heating factor of 0.2 °C/mW, what is the temperature error introduced by the 5mA measurement current?",
        "options": [
          "0.5 °C",
          "1.0 °C",
          "2.5 °C",
          "5.0 °C"
        ],
        "answer": 0
      },
      {
        "q": "The exact resistance-temperature relationship for Platinum from 0°C to 850°C is described by a non-linear quadratic equation known as:",
        "options": [
          "The Steinhart-Hart equation",
          "The Callendar-Van Dusen equation",
          "Maxwell's equations",
          "The Seebeck equation"
        ],
        "answer": 1
      },
      {
        "q": "Compared to a thermocouple, an RTD generally has:",
        "options": [
          "A higher maximum temperature limit",
          "A much faster response time",
          "Higher accuracy, better stability, but a lower maximum temperature limit",
          "Lower cost"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "rtd_q4",
        "question": "What does PT100 mean?",
        "options": [
          "Platinum sensor with 100 ohms at 100°C",
          "Platinum sensor with 100 ohms at 0°C",
          "Potentiometer with 100 turns",
          "Polymer thermistor with 100 ohms"
        ],
        "correctIndex": 1
      },
      {
        "id": "rtd_q5",
        "question": "Why is a 3-wire or 4-wire configuration used for RTDs?",
        "options": [
          "To increase the resistance",
          "To compensate for lead wire resistance",
          "To make it physically stronger",
          "To allow higher currents"
        ],
        "correctIndex": 1
      },
      {
        "id": "rtd_q6",
        "question": "RTDs typically have a:",
        "options": [
          "Positive temperature coefficient (PTC)",
          "Negative temperature coefficient (NTC)",
          "Zero temperature coefficient",
          "Exponential temperature coefficient"
        ],
        "correctIndex": 0
      },
      {
        "id": "rtd_q7",
        "question": "Which material provides the most stable and accurate RTD?",
        "options": [
          "Copper",
          "Nickel",
          "Platinum",
          "Tungsten"
        ],
        "correctIndex": 2
      },
      {
        "id": "rtd_q8",
        "question": "The Callendar-Van Dusen equation is used for:",
        "options": [
          "Calculating thermocouple EMF",
          "Describing the resistance-temperature relationship of Platinum RTDs",
          "Finding the null point in a bridge",
          "Calculating optical intensity"
        ],
        "correctIndex": 1
      },
      {
        "id": "rtd_q9",
        "question": "Self-heating in an RTD is caused by:",
        "options": [
          "Ambient temperature",
          "Excitation current passing through it",
          "Lead wire resistance",
          "Electromagnetic interference"
        ],
        "correctIndex": 1
      },
      {
        "id": "rtd_q10",
        "question": "Compared to thermocouples, RTDs generally offer:",
        "options": [
          "Higher temperature range",
          "Faster response time",
          "Higher accuracy and stability",
          "Lower cost"
        ],
        "correctIndex": 2
      },
      {
        "id": "rtd_q1",
        "question": "Why is platinum preferred for RTDs over copper or nickel?",
        "options": [
          "It is the cheapest metal available.",
          "It has a highly linear, stable, and repeatable resistance-temperature relationship over a wide range.",
          "It has the highest Seebeck coefficient.",
          "It changes resistance only above 500°C."
        ],
        "correctIndex": 1
      },
      {
        "id": "rtd_q2",
        "question": "What is the key advantage of a 4-wire RTD connection over a 2-wire connection?",
        "options": [
          "It can measure temperatures up to 2000°C.",
          "It completely eliminates lead wire resistance errors from the measurement.",
          "It requires less expensive cables.",
          "It responds faster to temperature changes."
        ],
        "correctIndex": 1
      },
      {
        "id": "rtd_q3",
        "question": "The Callendar-Van Dusen equation is used for PT100 because the resistance-temperature relationship is:",
        "options": [
          "Perfectly linear over the full range.",
          "Slightly non-linear and the equation accounts for this non-linearity accurately.",
          "Completely random below 0°C.",
          "Only valid above 850°C."
        ],
        "correctIndex": 1
      }
    ]
  },
  {
    "id": "photodiode-ldr",
    "tag": "OE-01",
    "title": "Photodiode & LDR Characteristics",
    "aim": "To study the characteristics of a photodiode (in photoconductive mode) and an LDR (light dependent resistor) as a function of light intensity.",
    "objectives": [
      "Understand the principle of photoelectric effect in semiconductor devices.",
      "Measure photocurrent vs illuminance for a photodiode.",
      "Measure resistance vs illuminance for an LDR.",
      "Design a voltage divider circuit using an LDR."
    ],
    "theory": [
      "A Photodiode is a semiconductor p-n junction device that generates a photocurrent proportional to incident light intensity when reverse-biased.",
      "In photoconductive mode (reverse bias), the photocurrent Iph = Kph × E, where Kph is the responsivity (mA/lux) and E is the illuminance in lux.",
      "An LDR (Light Dependent Resistor) or photoresistor uses the photoconductive effect in materials like CdS. Its resistance decreases as light intensity increases.",
      "LDR resistance follows an empirical power law: R = K / E^γ, where K≈500,000, γ≈0.7. At 1 lux, R≈500 kΩ (dark); at 1000 lux, R≈1 kΩ (bright).",
      "LDRs are widely used in light-activated switches. A voltage divider with an LDR produces an output voltage Vout = Vcc × Rload / (RLDR + Rload).",
      "Response time of LDR is slow (10-100ms) compared to photodiodes (nanoseconds), making LDRs unsuitable for high-speed applications."
    ],
    "procedure": [
      "Open the Photodiode/LDR Simulator in the Simulation tab.",
      "PHOTODIODE MODE: Set light intensity from 0 to 1000 lux and record photocurrent (mA) at each step.",
      "Observe the linear relationship between photocurrent and illuminance.",
      "LDR MODE: Set light intensity from 1 to 1000 lux and record LDR resistance (kΩ).",
      "Set Rload to 10 kΩ and observe Vout change with light intensity.",
      "Compare the response characteristics of both devices."
    ],
    "references": [
      "Sedra & Smith - Microelectronic Circuits",
      "Razavi - Fundamentals of Microelectronics"
    ],
    "pretest": [
      {
        "q": "Info: LDRs (photoresistors) decrease resistance with light, while Photodiodes generate current/voltage from light. Prerequisite: Semiconductor physics, electron-hole pairs, depletion regions. In which biasing mode does a photodiode exhibit the fastest response time for optical communication?",
        "options": [
          "Forward bias",
          "Photovoltaic mode (zero bias)",
          "Reverse bias (photoconductive mode)",
          "Avalanche mode"
        ],
        "answer": 2
      },
      {
        "q": "An LDR (Light Dependent Resistor) is typically made from:",
        "options": [
          "Intrinsic Silicon",
          "Cadmium Sulfide (CdS)",
          "Gallium Arsenide",
          "Platinum"
        ],
        "answer": 1
      },
      {
        "q": "The energy bandgap of Cadmium Sulfide (CdS) used in LDRs closely matches:",
        "options": [
          "The infrared spectrum",
          "The visible light spectrum (human eye response)",
          "The ultraviolet spectrum",
          "X-rays"
        ],
        "answer": 1
      },
      {
        "q": "In a photodiode, the depletion region is intentionally made wide (as in a PIN photodiode) to:",
        "options": [
          "Increase the capacitance",
          "Increase the volume for photon absorption and electron-hole pair generation",
          "Decrease the breakdown voltage",
          "Emit more light"
        ],
        "answer": 1
      },
      {
        "q": "Why is a photodiode inherently faster than an LDR?",
        "options": [
          "Because it is smaller",
          "Because LDR relies on bulk recombination of carriers which takes milliseconds, while a photodiode sweeps carriers across a junction in nanoseconds",
          "Because LDRs have higher resistance",
          "Because photodiodes use higher voltages"
        ],
        "answer": 1
      },
      {
        "q": "An LDR (Light Dependent Resistor) is a photo-conductive sensor typically made of:",
        "options": [
          "Intrinsic Silicon",
          "Cadmium Sulfide (CdS)",
          "Platinum",
          "Gallium Arsenide"
        ],
        "answer": 1
      },
      {
        "q": "When incident light strikes the semiconductor material in an LDR, it:",
        "options": [
          "Heats up the material, causing resistance to increase",
          "Provides energy to electrons, raising them from the valence band to the conduction band, thereby decreasing resistance",
          "Causes the material to emit light",
          "Has no effect"
        ],
        "answer": 1
      },
      {
        "q": "A Photodiode operates on the principle of:",
        "options": [
          "Generating electron-hole pairs in the depletion region of a P-N junction when struck by photons",
          "Changing bulk resistance",
          "The Seebeck effect",
          "Magnetic induction"
        ],
        "answer": 0
      },
      {
        "q": "To achieve the fastest possible response time (e.g., for optical fiber communications), a photodiode should be operated in:",
        "options": [
          "Photovoltaic mode (zero bias)",
          "Photoconductive mode (reverse bias)",
          "Forward bias",
          "Avalanche breakdown"
        ],
        "answer": 1
      },
      {
        "q": "The dark current of a photodiode is:",
        "options": [
          "The current that flows when it is exposed to maximum light",
          "The small reverse leakage current that flows even when no light is present",
          "The current required to power it",
          "The AC current component"
        ],
        "answer": 1
      }
    ],
    "posttest": [
      {
        "q": "An LDR in a voltage divider is in series with a 10kΩ resistor, powered by 5V. In dark, LDR = 1MΩ. In light, LDR = 1kΩ. If the LDR is tied to ground, what is the output voltage across the LDR in the light?",
        "options": [
          "0.45 V",
          "2.5 V",
          "4.5 V",
          "5.0 V"
        ],
        "answer": 0
      },
      {
        "q": "A photodiode operates in reverse bias. When incident light intensity doubles, the reverse leakage current (photocurrent):",
        "options": [
          "Remains constant",
          "Halves",
          "Increases exponentially",
          "Doubles (highly linear relationship)"
        ],
        "answer": 3
      },
      {
        "q": "A photodiode has a responsivity of 0.5 A/W at 850 nm. If 2 mW of optical power is incident on the active area, the generated photocurrent is:",
        "options": [
          "0.25 mA",
          "0.5 mA",
          "1.0 mA",
          "2.5 mA"
        ],
        "answer": 2
      },
      {
        "q": "If the load resistor (RL) in a photodiode circuit is made very large to increase the voltage output (V = I * RL), the bandwidth (speed) of the circuit will:",
        "options": [
          "Increase",
          "Decrease due to the RC time constant of the junction capacitance and RL",
          "Remain unchanged",
          "Become infinite"
        ],
        "answer": 1
      },
      {
        "q": "An LDR shows a memory effect (light history effect). This means:",
        "options": [
          "It stores data like a flash drive",
          "Its resistance at a specific light level depends slightly on the light levels it was exposed to previously",
          "It remembers the time of day",
          "It generates power in the dark"
        ],
        "answer": 1
      },
      {
        "q": "An LDR is placed in a voltage divider in series with a 10kΩ resistor, powered by 5V. In total darkness, LDR = 1MΩ. In bright light, LDR = 1kΩ. If the LDR is connected to ground, what is the output voltage across it in bright light?",
        "options": [
          "~0.45 V",
          "~2.5 V",
          "~4.5 V",
          "~5.0 V"
        ],
        "answer": 0
      },
      {
        "q": "A photodiode has a responsivity of 0.6 A/W at 900 nm. If 1 mW of optical power hits the active area, what is the photocurrent?",
        "options": [
          "0.6 µA",
          "6.0 µA",
          "60 µA",
          "600 µA"
        ],
        "answer": 3
      },
      {
        "q": "The relationship between illuminance (lux) and LDR resistance is typically:",
        "options": [
          "Perfectly linear",
          "Logarithmic (a straight line on a log-log plot)",
          "Exponential growth",
          "Sinusoidal"
        ],
        "answer": 1
      },
      {
        "q": "If a photodiode is operated in photovoltaic mode (zero bias) and connected to a high-impedance voltmeter, the output voltage relationship to light intensity is:",
        "options": [
          "Highly linear",
          "Logarithmic (like a diode's V-I curve)",
          "Zero",
          "Inverse"
        ],
        "answer": 1
      },
      {
        "q": "Which sensor exhibits the 'memory effect' (its response depends slightly on its recent light exposure history)?",
        "options": [
          "Photodiode",
          "Phototransistor",
          "LDR (Photoresistor)",
          "Solar Cell"
        ],
        "answer": 2
      }
    ],
    "viva": [
      {
        "id": "pdl_q4",
        "question": "What is the primary semiconductor material used in common LDRs?",
        "options": [
          "Silicon",
          "Cadmium Sulfide (CdS)",
          "Germanium",
          "Gallium Arsenide"
        ],
        "correctIndex": 1
      },
      {
        "id": "pdl_q5",
        "question": "In which biasing mode is a photodiode typically operated for light detection?",
        "options": [
          "Forward bias",
          "Reverse bias",
          "Zero bias",
          "Alternating bias"
        ],
        "correctIndex": 1
      },
      {
        "id": "pdl_q6",
        "question": "What is dark current in a photodiode?",
        "options": [
          "Current generated by maximum light",
          "Leakage current that flows when there is no incident light",
          "Current used to power the LED",
          "Current from the power supply"
        ],
        "correctIndex": 1
      },
      {
        "id": "pdl_q7",
        "question": "The resistance of an LDR ________ when light intensity increases.",
        "options": [
          "Increases",
          "Decreases",
          "Remains constant",
          "Becomes zero"
        ],
        "correctIndex": 1
      },
      {
        "id": "pdl_q8",
        "question": "Which sensor has a faster response time?",
        "options": [
          "LDR (Photoresistor)",
          "Photodiode",
          "Thermistor",
          "RTD"
        ],
        "correctIndex": 1
      },
      {
        "id": "pdl_q9",
        "question": "Photovoltaic mode in a photodiode means:",
        "options": [
          "It operates with zero external bias",
          "It operates with reverse bias",
          "It emits light",
          "It acts as a resistor"
        ],
        "correctIndex": 0
      },
      {
        "id": "pdl_q10",
        "question": "LDRs are often used in:",
        "options": [
          "High-speed optical communication",
          "Precision temperature sensing",
          "Automatic street lighting circuits",
          "Measuring magnetic fields"
        ],
        "correctIndex": 2
      },
      {
        "id": "ldr_q1",
        "question": "What is the main difference between a photodiode and an LDR in terms of response speed?",
        "options": [
          "LDRs respond in nanoseconds while photodiodes take milliseconds.",
          "Photodiodes respond in nanoseconds while LDRs respond in 10-100 milliseconds.",
          "Both respond at the same speed.",
          "Response speed depends only on the circuit resistance, not the device type."
        ],
        "correctIndex": 1
      },
      {
        "id": "ldr_q2",
        "question": "In photoconductive mode, why is a reverse bias voltage applied to the photodiode?",
        "options": [
          "To increase the junction capacitance for better sensitivity.",
          "To widen the depletion region, reducing junction capacitance and improving response speed and linearity.",
          "To forward-bias the diode and increase current flow.",
          "To protect the diode from high light intensity."
        ],
        "correctIndex": 1
      },
      {
        "id": "ldr_q3",
        "question": "An LDR has a resistance of approximately 500 kΩ in darkness and 1 kΩ in bright light. This property makes it ideal for:",
        "options": [
          "High-frequency optical communication.",
          "Light-activated switches, automatic street lights, and alarm systems.",
          "Measuring very high temperatures.",
          "Replacing thermocouples in temperature measurement."
        ],
        "correctIndex": 1
      }
    ]
  }
];
