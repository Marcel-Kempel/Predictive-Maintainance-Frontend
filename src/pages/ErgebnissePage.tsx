import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ErgebnissePage() {
  const featureImportances = [
    { feature: 'Torque', value: 0.52 },
    { feature: 'Rotational Speed', value: 0.21 },
    { feature: 'Tool Wear', value: 0.13 },
    { feature: 'Air Temperature', value: 0.08 },
    { feature: 'Process Temperature', value: 0.04 },
    { feature: 'Product Type', value: 0.02 }
  ];

  const confusionMatrix = [
    ['TN: 1993', 'FP: 12'],
    ['FN: 15', 'TP: 65']
  ];

  const deviations = [
    { feature: 'Torque', deviation: 2.8, color: '#ef4444' },
    { feature: 'Rotational Speed', deviation: 2.1, color: '#f59e0b' },
    { feature: 'Tool Wear', deviation: 0.8, color: '#9ca3af' },
    { feature: 'Air Temperature', deviation: 0.3, color: '#9ca3af' },
    { feature: 'Process Temperature', deviation: -0.5, color: '#9ca3af' }
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
          Ergebnisse & XAI
        </h1>
        <p style={{ color: '#9ca3af' }}>
          Modellperformance, Feature Importances und Explainable AI Visualisierungen
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="p-5 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Accuracy
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            97%
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Testdaten
          </p>
        </div>

        <div 
          className="p-5 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            F1-Score
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            83%
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Balanced
          </p>
        </div>

        <div 
          className="p-5 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Precision
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            84%
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Class: Failure
          </p>
        </div>

        <div 
          className="p-5 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Recall
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            81%
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Class: Failure
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Confusion Matrix */}
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
            Confusion Matrix
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {confusionMatrix.map((row, i) => 
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square flex items-center justify-center rounded-lg"
                  style={{
                    background: i === 1 && j === 0 ? 'rgba(239, 68, 68, 0.2)' : 
                               i === 0 && j === 0 || i === 1 && j === 1 ? 'rgba(34, 211, 238, 0.2)' :
                               'rgba(156, 163, 175, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="text-center">
                    <p style={{ color: '#e5e7eb', fontSize: '1.5rem', fontWeight: '600' }}>
                      {cell.split(': ')[1]}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      {cell.split(': ')[0]}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            <div>Predicted: No Failure</div>
            <div>Predicted: Failure</div>
          </div>
        </div>

        {/* Feature Importances */}
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
            Feature Importances
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportances} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="feature" type="category" stroke="#9ca3af" width={120} />
              <Tooltip 
                contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {featureImportances.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : '#a78bfa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decision Tree Path */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
          Decision Tree Pfad (Explainable Model)
        </h2>

        <div 
          className="p-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(107, 103, 92, 0.2)' }}
        >
          <div className="text-center space-y-4">
            <div 
              className="inline-block px-6 py-3 rounded-lg"
              style={{ background: '#22d3ee', color: '#fff' }}
            >
              Torque ≤ 13.2 Nm?
            </div>
            
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Ja ↓</div>
                <div 
                  className="px-4 py-2 rounded-lg"
                  style={{ background: '#ef4444', color: '#fff' }}
                >
                  Failure
                </div>
              </div>
              
              <div className="text-center">
                <div style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Nein ↓</div>
                <div 
                  className="px-4 py-2 rounded-lg"
                  style={{ background: '#22d3ee', color: '#fff' }}
                >
                  Speed ≤ 1380 rpm?
                </div>
              </div>
            </div>

            <p style={{ color: '#9ca3af', marginTop: '1rem' }}>
              Wenn <span style={{ color: '#22d3ee' }}>torque &lt; 13.2 Nm</span> → Failure wahrscheinlich
            </p>
          </div>
        </div>
      </div>

      {/* Normalized Feature Deviations */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
          Normalized Feature Deviations (XAI)
        </h2>
        <p className="mb-6" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Einflussstärkste Abweichungen für diese Vorhersage (in Standardabweichungen)
        </p>

        <div className="space-y-4">
          {deviations.map((item) => (
            <div key={item.feature}>
              <div className="flex justify-between mb-2">
                <span style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{item.feature}</span>
                <span style={{ color: item.color, fontSize: '0.875rem' }}>{item.deviation}σ</span>
              </div>
              <div className="relative h-8 rounded-lg" style={{ background: 'rgba(107, 103, 92, 0.3)' }}>
                <div className="absolute left-1/2 w-px h-full" style={{ background: '#9ca3af' }}></div>
                <div 
                  className="absolute h-full rounded-lg transition-all"
                  style={{ 
                    background: item.color,
                    left: item.deviation >= 0 ? '50%' : `${50 + (item.deviation / 3) * 50}%`,
                    width: `${Math.abs(item.deviation / 3) * 50}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1" style={{ fontSize: '0.75rem', color: '#6b675c' }}>
                <span>-3σ</span>
                <span>0</span>
                <span>+3σ</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}