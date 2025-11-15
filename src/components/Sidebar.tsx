import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Brain, Upload, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Modell-Insights', path: '/model-insights', icon: Brain },
    { label: 'Vorhersage', path: '/prediction', icon: Upload },
    { label: 'Einstellungen', path: '/einstellungen', icon: Settings }
  ];
  
  return (
    <aside 
      className="w-60 min-h-screen px-4 py-6"
      style={{
        background: 'linear-gradient(180deg, #f6f4ec 0%, #f0f2f4 100%)'
      }}
    >
      {/* Menu Section */}
      <div className="mb-8">
        <h3 className="px-3 mb-3 uppercase tracking-wider" style={{ 
          color: '#9ca3af',
          fontSize: '0.75rem'
        }}>
          Menü
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-black/5"
                style={{
                  background: isActive ? 'rgba(35, 36, 33, 0.1)' : 'transparent',
                  color: isActive ? '#232421' : '#9ca3af'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Status Section */}
      <div>
        <h3 className="px-3 mb-3 uppercase tracking-wider" style={{ 
          color: '#9ca3af',
          fontSize: '0.75rem'
        }}>
          Status
        </h3>
        <div 
          className="px-3 py-2 rounded-full inline-block"
          style={{
            background: 'rgba(156, 163, 175, 0.15)',
            color: '#6b675c',
            fontSize: '0.875rem'
          }}
        >
          Mockup 
        </div>
      </div>
    </aside>
  );
}
