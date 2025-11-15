import { Upload } from 'lucide-react';

export function DatenPage() {
  const sampleData = [
    { id: 'M14860', airTemp: 298.1, processTemp: 308.6, speed: 1551, torque: 42.8, wear: 0, failure: 0 },
    { id: 'L47181', airTemp: 298.2, processTemp: 308.7, speed: 1408, torque: 46.3, wear: 3, failure: 0 },
    { id: 'L47182', airTemp: 298.1, processTemp: 308.5, speed: 1498, torque: 49.4, wear: 5, failure: 0 },
    { id: 'L47183', airTemp: 298.2, processTemp: 308.6, speed: 1433, torque: 39.5, wear: 7, failure: 0 },
    { id: 'L47184', airTemp: 298.2, processTemp: 308.7, speed: 1408, torque: 40.0, wear: 9, failure: 0 },
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
          Daten & Vorschau
        </h1>
        <p style={{ color: '#9ca3af' }}>
          Laden Sie Ihren Datensatz hoch und überprüfen Sie die Datenqualität vor dem Training.
        </p>
      </div>

      {/* Upload Card */}
      <div 
        className="p-8 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
          Datensatz hochladen
        </h2>
        
        <div 
          className="p-12 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
          style={{ 
            borderColor: 'rgba(156, 163, 175, 0.3)',
            background: 'rgba(107, 103, 92, 0.1)'
          }}
        >
          <Upload className="w-12 h-12 mb-4" style={{ color: '#22d3ee' }} />
          <p style={{ color: '#e5e7eb', marginBottom: '0.5rem' }}>
            Datei hier ablegen oder auswählen
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            CSV, max. 20 MB
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              Letzter Upload:
            </p>
            <p style={{ color: '#e5e7eb' }}>
              ai4i2020.csv
            </p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              Status:
            </p>
            <p style={{ color: '#22d3ee' }}>
              ✓ Spalten validiert
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="p-5 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Zeilen
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            10,000
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
            Failures
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            339
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            (3.39%)
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
            Features
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.875rem', fontWeight: '600' }}>
            7
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
            Balance
          </p>
          <p style={{ color: '#f59e0b', fontSize: '1.875rem', fontWeight: '600' }}>
            ⚠
          </p>
          <p style={{ color: '#f59e0b', fontSize: '0.75rem' }}>
            Unausgeglichen
          </p>
        </div>
      </div>

      {/* Data Preview */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
          Datensatz-Vorschau (erste 5 Zeilen)
        </h2>

        <div 
          className="rounded-lg overflow-auto"
          style={{ background: '#6b675c' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Product ID</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Air Temp [K]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Process Temp [K]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Speed [rpm]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Torque [Nm]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Tool Wear [min]</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Failure</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr 
                  key={index}
                  style={{ borderBottom: index < sampleData.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}
                >
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.id}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.airTemp}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.processTemp}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.speed}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.torque}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{row.wear}</td>
                  <td className="px-4 py-3" style={{ color: row.failure ? '#ef4444' : '#22d3ee', fontSize: '0.875rem' }}>
                    {row.failure ? '✗' : '✓'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Spalten: product ID, air temperature, process temperature, rotational speed, torque, tool wear, machine failure
        </p>
      </div>

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}
