export function EinstellungenPage() {
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
          Einstellungen
        </h1>
        
        <p style={{ color: '#9ca3af' }}>
          Konfigurieren Sie Ihr Dashboard und passen Sie die Systemeinstellungen 
          an Ihre Bedürfnisse an. Verwalten Sie Benutzer, Benachrichtigungen und 
          Schwellenwerte für Alarme.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
            Allgemein
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Dashboard-Name
              </label>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: 'rgba(107, 103, 92, 0.3)',
                  border: '1px solid rgba(156, 163, 175, 0.2)'
                }}
              >
                <span style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>
                  MachineAnalysis
                </span>
              </div>
            </div>
            
            <div>
              <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Zeitzone
              </label>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: 'rgba(107, 103, 92, 0.3)',
                  border: '1px solid rgba(156, 163, 175, 0.2)'
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  [ UTC+1 - Berlin ]
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb' }}>
            Benachrichtigungen
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                E-Mail Alarme
              </label>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: 'rgba(107, 103, 92, 0.3)',
                  border: '1px solid rgba(156, 163, 175, 0.2)'
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  [ Aktiviert ]
                </span>
              </div>
            </div>
            
            <div>
              <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Alarm-Schwellenwert
              </label>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: 'rgba(107, 103, 92, 0.3)',
                  border: '1px solid rgba(156, 163, 175, 0.2)'
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  [ Hoch ]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}
