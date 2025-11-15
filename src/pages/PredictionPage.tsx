import { Play, Download, Database } from 'lucide-react';
import { useState } from 'react';

export function PredictionPage() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Decision Tree');

  const sampleData = [
    { id: 'M14860', airTemp: 298.1, processTemp: 308.6, speed: 1551, torque: 42.8, wear: 0 },
    { id: 'L47181', airTemp: 298.2, processTemp: 308.7, speed: 1408, torque: 46.3, wear: 3 },
    { id: 'L47182', airTemp: 298.1, processTemp: 308.5, speed: 1498, torque: 49.4, wear: 5 },
    { id: 'L47183', airTemp: 298.2, processTemp: 308.6, speed: 1433, torque: 39.5, wear: 7 },
    { id: 'L47184', airTemp: 298.2, processTemp: 308.7, speed: 1408, torque: 11.2, wear: 235 },
  ];

  const predictionResults = [
    { product: 'M14860', mode: 'Kein Ausfall', probability: '5%', explanation: 'Alle Parameter im Normalbereich', recommendation: 'Keine Aktion erforderlich' },
    { product: 'L47181', mode: 'Kein Ausfall', probability: '8%', explanation: 'Normale Betriebsbedingungen', recommendation: 'Keine Aktion erforderlich' },
    { product: 'L47182', mode: 'Kein Ausfall', probability: '6%', explanation: 'Stabile Prozessparameter', recommendation: 'Keine Aktion erforderlich' },
    { product: 'L47183', mode: 'Kein Ausfall', probability: '9%', explanation: 'Leicht erhöhter Verschleiß', recommendation: 'Monitoring fortsetzen' },
    { product: 'L47184', mode: 'OSF / TWF', probability: '87%', explanation: 'Niedriger Torque + hoher Tool Wear → OSF wahrscheinlich', recommendation: 'Werkzeugwechsel empfohlen' },
  ];

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setShowResults(true);
    }, 2000);
  };

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
          Vorhersage
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Nutzen Sie Ihre aktuellen Maschinendaten für präzise Ausfallvorhersagen.
        </p>
      </div>

      {/* Model Selection */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Modell wählen
        </h2>
        
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 rounded-lg outline-none"
          style={{ 
            background: 'rgba(107, 103, 92, 0.3)',
            border: '1px solid rgba(156, 163, 175, 0.2)',
            color: '#e5e7eb',
            fontSize: '0.875rem'
          }}
        >
          <option value="Decision Tree">Decision Tree</option>
          <option value="Random Forest">Random Forest</option>
          <option value="Bagged Trees Ensemble">Bagged Trees Ensemble</option>
          <option value="Neural Network">Neural Network</option>
        </select>
      </div>

      {/* Data Source */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Batch-Daten laden
        </h2>
        
        <button
          className="w-full p-4 rounded-lg flex items-center justify-center gap-3 transition-all hover:opacity-90"
          style={{ 
            background: 'rgba(34, 211, 238, 0.1)',
            border: '2px solid rgba(34, 211, 238, 0.3)',
            color: '#22d3ee'
          }}
        >
          <Database className="w-5 h-5" />
          <span style={{ fontSize: '0.875rem' }}>Aktuelle Messdaten abrufen</span>
        </button>

        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
          Die Daten werden automatisch aus der Datenbank geladen.
        </p>

        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(34, 211, 238, 0.1)' }}>
          <p style={{ color: '#22d3ee', fontSize: '0.875rem' }}>
            ✓ Daten geladen (248 Einträge) • 6 Features erkannt
          </p>
        </div>
      </div>

      {/* Batch Preview */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Batch-Vorschau
        </h2>

        <div 
          className="rounded-lg overflow-auto"
          style={{ background: '#6b675c' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Product ID</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Air Temp [K]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Process Temp [K]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Speed [rpm]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Torque [Nm]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Tool Wear [min]</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr 
                  key={index}
                  style={{ borderBottom: index < sampleData.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}
                >
                  <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.id}</td>
                  <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.airTemp}</td>
                  <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.processTemp}</td>
                  <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.speed}</td>
                  <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.torque}</td>
                  <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.wear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        disabled={isPredicting}
        className="w-full py-4 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-3"
        style={{
          background: isPredicting ? 'rgba(107, 103, 92, 0.5)' : 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
          color: '#ffffff',
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
          cursor: isPredicting ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem'
        }}
      >
        {isPredicting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Vorhersagen werden berechnet...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>Vorhersagen berechnen</span>
          </>
        )}
      </button>

      {/* Results */}
      {showResults && (
        <>
          <div 
            className="p-6 rounded-[14px] shadow-lg"
            style={{ 
              background: '#232421',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
                Vorhersage-Ergebnisse
              </h2>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', fontSize: '0.875rem' }}
              >
                <Download className="w-4 h-4" />
                <span>Als CSV exportieren</span>
              </button>
            </div>

            <div 
              className="rounded-lg overflow-auto"
              style={{ background: '#6b675c' }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Product</th>
                    <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Failure Mode</th>
                    <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Probability</th>
                    <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Explanation</th>
                    <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionResults.map((result, index) => (
                    <tr 
                      key={index}
                      style={{ borderBottom: index < predictionResults.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}
                    >
                      <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{result.product}</td>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.875rem' }}>
                        <span 
                          className="px-2 py-1 rounded"
                          style={{ 
                            background: result.probability === '87%' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 211, 238, 0.2)',
                            color: result.probability === '87%' ? '#ef4444' : '#22d3ee',
                            fontSize: '0.75rem'
                          }}
                        >
                          {result.mode}
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{result.probability}</td>
                      <td className="px-4 py-2.5" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{result.explanation}</td>
                      <td className="px-4 py-2.5" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{result.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}
