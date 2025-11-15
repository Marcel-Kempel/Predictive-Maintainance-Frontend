import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Einfache Demo-Authentifizierung
    if (username && password) {
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#f6f4ec' }}
    >
      {/* Radial glow effects in background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
      
      <div 
        className="relative w-full max-w-md p-8 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div 
            className="w-10 h-10 rounded-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
            }}
          ></div>
          <div className="flex items-center gap-1">
            <span style={{ color: '#e5e7eb', fontSize: '1.5rem' }}>Machine</span>
            <span style={{ color: '#22d3ee', fontSize: '1.5rem' }}>Analysis</span>
          </div>
        </div>

        <h1 className="mb-2 text-center" style={{ color: '#e5e7eb' }}>
          Willkommen
        </h1>
        <p className="mb-8 text-center" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Melden Sie sich an, um auf Ihr Predictive Maintenance System zuzugreifen
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none transition-all"
              style={{ 
                background: 'rgba(107, 103, 92, 0.3)',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                color: '#e5e7eb'
              }}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none transition-all"
              style={{ 
                background: 'rgba(107, 103, 92, 0.3)',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                color: '#e5e7eb'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg transition-all hover:opacity-90 text-center"
            style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
            }}
          >
          Anmelden
          </button>
        </form>

        <p className="mt-6 text-center" style={{ color: '#6b675c', fontSize: '0.75rem' }}>
          Demo: Beliebige Anmeldedaten eingeben
        </p>
      </div>
    </div>
  );
}
