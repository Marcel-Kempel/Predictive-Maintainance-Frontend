import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

export function ModelInsightsPage() {
  const featureImportances = [
    { feature: 'Torque', value: 0.52 },
    { feature: 'Rotational Speed', value: 0.21 },
    { feature: 'Tool Wear', value: 0.13 },
    { feature: 'Air Temperature', value: 0.08 },
    { feature: 'Process Temperature', value: 0.04 },
    { feature: 'Product Type', value: 0.02 }
  ];

  const rocData = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.1, tpr: 0.75 },
    { fpr: 0.2, tpr: 0.88 },
    { fpr: 0.3, tpr: 0.94 },
    { fpr: 0.4, tpr: 0.97 },
    { fpr: 0.5, tpr: 0.98 },
    { fpr: 1, tpr: 1 }
  ];

  const deviations = [
    { feature: 'Tool Wear', deviation: 1.78, color: '#ef4444' },
    { feature: 'Rotational Speed', deviation: -0.78, color: '#f59e0b' },
    { feature: 'Torque', deviation: 0.42, color: '#9ca3af' },
    { feature: 'Air Temperature', deviation: 0.15, color: '#9ca3af' },
    { feature: 'Process Temperature', deviation: -0.08, color: '#9ca3af' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1 className="mb-2" style={{ color: '#e5e7eb', fontSize: '1.5rem' }}>
          Modell-Insights & Explainable AI
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Modellperformance, Feature Importances und Explainable AI Visualisierungen
        </p>
      </div>

      {/* Model Info */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Modell-Basisinformationen
        </h2>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Modelltyp</p>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>Decision Tree Classifier</p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Trainiert</p>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>Backend v1.0</p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Datensatz</p>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>AI4I 2020</p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Klassenverteilung</p>
            <p style={{ color: '#f59e0b', fontSize: '0.875rem' }}>3.39% Failure</p>
          </div>
        </div>
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
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
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
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
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
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
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
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
            81%
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Class: Failure
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* ROC Curve + AUC */}
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
              ROC Curve
            </h2>
            <div className="text-right">
              <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>AUC Score</p>
              <p style={{ color: '#22d3ee', fontSize: '1.5rem', fontWeight: '600' }}>0.91</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={rocData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="fpr" 
                stroke="#9ca3af" 
                label={{ value: 'False Positive Rate', position: 'bottom', fill: '#9ca3af', fontSize: 12 }}
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis 
                dataKey="tpr" 
                stroke="#9ca3af" 
                label={{ value: 'True Positive Rate', angle: -90, position: 'left', fill: '#9ca3af', fontSize: 12 }}
                style={{ fontSize: '0.75rem' }}
              />
              <Tooltip 
                contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Line type="monotone" dataKey="tpr" stroke="#22d3ee" strokeWidth={3} dot={false} />
              <Line 
                type="monotone" 
                data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} 
                dataKey="tpr" 
                stroke="#9ca3af" 
                strokeWidth={1} 
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Importances */}
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
            Feature Importances
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportances} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
              <YAxis dataKey="feature" type="category" stroke="#9ca3af" width={120} style={{ fontSize: '0.75rem' }} />
              <Tooltip 
                contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }}
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

      {/* Normalized Feature Deviations */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-3" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Normalized Feature Deviations (XAI)
        </h2>
        <p className="mb-6" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Einflussstärkste Abweichungen für einzelne Vorhersagen (in Standardabweichungen)
        </p>

        <div className="space-y-3">
          {deviations.map((item) => (
            <div key={item.feature}>
              <div className="flex justify-between mb-2">
                <span style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{item.feature}</span>
                <span style={{ color: item.color, fontSize: '0.875rem' }}>{item.deviation}σ</span>
              </div>
              <div className="relative h-6 rounded-lg" style={{ background: 'rgba(107, 103, 92, 0.3)' }}>
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

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}
