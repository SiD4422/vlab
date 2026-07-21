import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StrainGaugeSim() {
  const [load, setLoad] = useState(0); // kg
  const [gaugeFactor, setGaugeFactor] = useState(2.0);
  const [bridgeConfig, setBridgeConfig] = useState("quarter"); // quarter, half, full
  const [data, setData] = useState([]);

  const excitationVoltage = 5; // V
  const youngsModulus = 200e9; // Pa (Steel)
  const area = 0.0001; // m^2 (cross-sectional area)
  const g = 9.81; // m/s^2

  // Calculate voltage output based on current params
  const force = load * g;
  const stress = force / area;
  const strain = stress / youngsModulus;
  
  let sensitivityMultiplier = 1;
  if (bridgeConfig === "half") sensitivityMultiplier = 2;
  if (bridgeConfig === "full") sensitivityMultiplier = 4;

  const vOut = (excitationVoltage / 4) * gaugeFactor * strain * sensitivityMultiplier;
  const vOutMv = vOut * 1000; // Convert to mV

  // Generate plot data
  useEffect(() => {
    const newData = [];
    for (let l = 0; l <= 10; l += 0.5) {
      const f = l * g;
      const s = (f / area) / youngsModulus;
      const v = (excitationVoltage / 4) * gaugeFactor * s * sensitivityMultiplier;
      newData.push({
        load: l,
        voltage: Number((v * 1000).toFixed(4))
      });
    }
    setData(newData);
  }, [gaugeFactor, bridgeConfig]);

  return (
    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
      <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dfe3df' }}>
        <h3 style={{ margin: '0 0 16px', color: '#1b2430' }}>Simulation Controls</h3>
        
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* Load Slider */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
              Applied Load (kg): {load.toFixed(1)}
            </label>
            <input 
              type="range" 
              min="0" max="10" step="0.1" 
              value={load} 
              onChange={(e) => setLoad(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Gauge Factor Slider */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
              Gauge Factor (GF): {gaugeFactor.toFixed(1)}
            </label>
            <input 
              type="range" 
              min="1.8" max="5.0" step="0.1" 
              value={gaugeFactor} 
              onChange={(e) => setGaugeFactor(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Bridge Config */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
              Bridge Configuration
            </label>
            <select 
              value={bridgeConfig} 
              onChange={(e) => setBridgeConfig(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="quarter">Quarter Bridge (1 Active Arm)</option>
              <option value="half">Half Bridge (2 Active Arms)</option>
              <option value="full">Full Bridge (4 Active Arms)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Output Display */}
        <div style={{ 
          flex: '1', minWidth: '250px', background: '#fff', 
          border: '1px solid #dfe3df', borderRadius: '8px', padding: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#68707c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Output Voltage
          </div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: '#c1712f', margin: '16px 0' }}>
            {vOutMv.toFixed(4)} <span style={{ fontSize: '20px', color: '#1b2430' }}>mV</span>
          </div>
          <div style={{ fontSize: '13px', color: '#68707c' }}>
            Strain (ε): {(strain * 1e6).toFixed(2)} µε
          </div>
        </div>

        {/* Chart */}
        <div style={{ 
          flex: '2', minWidth: '400px', background: '#fff', 
          border: '1px solid #dfe3df', borderRadius: '8px', padding: '16px', height: '300px' 
        }}>
          <h4 style={{ margin: '0 0 16px', textAlign: 'center', color: '#1b2430' }}>Load vs Output Voltage</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="load" label={{ value: 'Load (kg)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Voltage (mV)', angle: -90, position: 'insideLeft', offset: 15 }} />
              <Tooltip formatter={(val) => [`${val} mV`, 'Voltage']} labelFormatter={(l) => `Load: ${l} kg`} />
              <Line type="monotone" dataKey="voltage" stroke="#1f7a72" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              
              {/* Add a reference dot for current load */}
              {data.length > 0 && (
                <Line 
                  data={[{ load: load, voltage: vOutMv }]} 
                  dataKey="voltage" 
                  stroke="none" 
                  dot={{ r: 8, fill: '#c1712f', stroke: '#fff', strokeWidth: 2 }} 
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
