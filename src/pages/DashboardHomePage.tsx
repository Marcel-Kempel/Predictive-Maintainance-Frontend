import { useNavigate } from 'react-router-dom';
import { BarChart3, Activity, Database, Settings } from 'lucide-react';

export function DashboardHomePage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Übersicht',
      description: 'Dashboard mit KPIs, Charts und aktuellen Alarmen',
      icon: BarChart3,
      path: '/uebersicht',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Analyse',
      description: 'Cluster, Failure Modes und PCA-Visualisierung',
      icon: Activity,
      path: '/analyse',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Daten & Training',
      description: 'Upload, Vorschau und Modell-Training',
      icon: Database,
      path: '/daten',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Einstellungen',
      description: 'System-Konfiguration und Präferenzen',
      icon: Settings,
      path: '/einstellungen',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#f6f4ec' }}
    >
      {/* Radial glow effects in background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>

      <div className="relative px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
              }}
            ></div>
            <div className="flex items-center gap-1">
              <span style={{ color: '#232421', fontSize: '1.5rem' }}>Machine</span>
              <span style={{ color: '#22d3ee', fontSize: '1.5rem' }}>Analysis</span>
            </div>
          </div>
          
          <h1 style={{ color: '#232421', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Predictive Maintenance System
          </h1>
          <p style={{ color: '#6b675c', fontSize: '1.125rem' }}>
            Wählen Sie ein Modul, um zu beginnen
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-5xl">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.path}
                onClick={() => navigate(module.path)}
                className="group p-8 rounded-[20px] shadow-lg transition-all hover:scale-105 hover:shadow-xl text-left"
                style={{ 
                  background: '#232421',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                  height: '180px'
                }}
              >
                <div 
                  className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${module.color}`}
                  style={{ boxShadow: '0 4px 12px rgba(34, 211, 238, 0.2)' }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h2 className="mb-2" style={{ color: '#e5e7eb', fontSize: '1.5rem' }}>
                  {module.title}
                </h2>
                <p style={{ color: '#9ca3af' }}>
                  {module.description}
                </p>

                <div className="mt-4 flex items-center gap-2" style={{ color: '#22d3ee' }}>
                  <span className="text-sm">Modul öffnen</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Info */}
        <div className="mt-12 max-w-5xl">
          <div 
            className="p-6 rounded-[14px] shadow-lg"
            style={{ 
              background: '#232421',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1" style={{ color: '#e5e7eb' }}>
                  System Status
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Alle Systeme betriebsbereit • Modellversion MVP v0.1
                </p>
              </div>
              <div 
                className="px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(34, 211, 238, 0.1)',
                  color: '#22d3ee',
                  fontSize: '0.875rem'
                }}
              >
                ● Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
