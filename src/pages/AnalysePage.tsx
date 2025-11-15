import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { useState } from 'react';

export function AnalysePage() {
  const [activeTab, setActiveTab] = useState('scatter');

  const scatterData = [
    { speed: 1551, torque: 42.8, failure: 0 },
    { speed: 1408, torque: 46.3, failure: 0 },
    { speed: 1498, torque: 49.4, failure: 0 },
    { speed: 1200, torque: 12.5, failure: 1 },
    { speed: 1380, torque: 11.8, failure: 1 },
    { speed: 1450, torque: 45.2, failure: 0 },
    { speed: 1250, torque: 13.1, failure: 1 },
    { speed: 1520, torque: 48.6, failure: 0 },
  ];

  const failureModes = [
    { mode: 'TWF', count: 45, color: '#ef4444' },
    { mode: 'HDF', count: 115, color: '#f59e0b' },
    { mode: 'PWF', count: 95, color: '#a78bfa' },
    { mode: 'OSF', count: 78, color: '#22d3ee' },
    { mode: 'RNF', count: 6, color: '#9ca3af' }
  ];

  const tabs = [
    { id: 'scatter', label: 'Feature Analysis' },
    { id: 'modes', label: 'Failure Modes' },
    { id: 'trends', label: 'Trends' }
  ];

  return (
    <div className="space-y-6">
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1 className="mb-3" style={{ color: '#e5e7eb' }}>
          Analyse
        </h1>
        <p style={{ color: '#9ca3af' }}>
          Detaillierte Analysen von Clustern, Failure Modes und Feature-Korrelationen
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-6 py-3 rounded-lg transition-all"
            style={{
              background: activeTab === tab.id ? '#232421' : 'transparent',
              color: activeTab === tab.id ? '#e5e7eb' : '#9ca3af',
              border: activeTab === tab.id ? 'none' : '1px solid rgba(156, 163, 175, 0.3)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'scatter' && (
        <div className="grid grid-cols-[1fr_300px] gap-4">
          <div 
            className="p-6 rounded-[14px] shadow-lg"
            style={{ 
              background: '#232421',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
              Rotational Speed × Torque
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  dataKey="speed" 
                  name="Speed" 
                  unit=" rpm" 
                  stroke="#9ca3af"
                  label={{ value: 'Rotational Speed [rpm]', position: 'bottom', fill: '#9ca3af' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="torque" 
                  name="Torque" 
                  unit=" Nm" 
                  stroke="#9ca3af"
                  label={{ value: 'Torque [Nm]', angle: -90, position: 'left', fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Scatter data={scatterData} fill="#22d3ee">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.failure ? '#ef4444' : '#22d3ee'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            <div className="mt-4 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#22d3ee' }}></div>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Normal Operation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }}></div>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Failure</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div 
            className="p-6 rounded-[14px] shadow-lg"
            style={{ 
              background: '#232421',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 className="mb-4" style={{ color: '#e5e7eb' }}>
              Filter
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Product Type
                </label>
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(107, 103, 92, 0.3)',
                    border: '1px solid rgba(156, 163, 175, 0.2)'
                  }}
                >
                  <span style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>
                    Alle
                  </span>
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Torque Range [Nm]
                </label>
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    className="w-full"
                    style={{ accentColor: '#22d3ee' }}
                  />
                  <div className="flex justify-between" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Tool Wear Range [min]
                </label>
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="300" 
                    className="w-full"
                    style={{ accentColor: '#22d3ee' }}
                  />
                  <div className="flex justify-between" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span>0</span>
                    <span>300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'modes' && (
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
            Failure Modes Distribution
          </h2>
          
          <div className="space-y-3">
            {failureModes.map((mode) => (
              <div key={mode.mode}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#e5e7eb' }}>{mode.mode}</span>
                  <span style={{ color: '#9ca3af' }}>{mode.count} Fälle</span>
                </div>
                <div className="h-8 rounded-lg overflow-hidden" style={{ background: 'rgba(107, 103, 92, 0.3)' }}>
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      background: mode.color,
                      width: `${(mode.count / 115) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-5 gap-3" style={{ fontSize: '0.75rem' }}>
            <div>
              <p style={{ color: '#9ca3af' }}>TWF</p>
              <p style={{ color: '#e5e7eb' }}>Tool Wear Failure</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af' }}>HDF</p>
              <p style={{ color: '#e5e7eb' }}>Heat Dissipation F.</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af' }}>PWF</p>
              <p style={{ color: '#e5e7eb' }}>Power Failure</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af' }}>OSF</p>
              <p style={{ color: '#e5e7eb' }}>Overstrain Failure</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af' }}>RNF</p>
              <p style={{ color: '#e5e7eb' }}>Random Failure</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
            Zeitliche Trends
          </h2>
          <div 
            className="h-64 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(107, 103, 92, 0.2)' }}
          >
            <span style={{ color: '#9ca3af' }}>
              Trend-Visualisierung (Platzhalter)
            </span>
          </div>
        </div>
      )}

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}
