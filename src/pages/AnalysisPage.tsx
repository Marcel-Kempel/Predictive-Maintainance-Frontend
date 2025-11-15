export function AnalysisPage() {
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
          Analysis
        </h1>
        
        <p style={{ color: '#9ca3af' }}>
          Hier können Sie detaillierte Analysen Ihrer Maschinendaten durchführen. 
          Wählen Sie verschiedene Analysemethoden und Zeiträume aus, um tiefere Einblicke 
          in das Verhalten und die Performance Ihrer Anlagen zu erhalten.
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
            Analysemethoden
          </h2>
          <div 
            className="h-48 rounded-lg flex items-center justify-center"
            style={{ 
              background: 'rgba(107, 103, 92, 0.2)',
              border: '2px dashed rgba(156, 163, 175, 0.3)'
            }}
          >
            <span style={{ color: '#9ca3af' }}>
              Analysemethoden werden hier angezeigt
            </span>
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
            Ergebnisse
          </h2>
          <div 
            className="h-48 rounded-lg flex items-center justify-center"
            style={{ 
              background: 'rgba(107, 103, 92, 0.2)',
              border: '2px dashed rgba(156, 163, 175, 0.3)'
            }}
          >
            <span style={{ color: '#9ca3af' }}>
              Analyseergebnisse werden hier angezeigt
            </span>
          </div>
        </div>
      </div>
      
      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af' }}>
        © 2025 – Mockup • Predictive Analysis Grundgerüst
      </footer>
    </div>
  );
}
