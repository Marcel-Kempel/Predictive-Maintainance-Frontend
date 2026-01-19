import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedLayout } from './components/ProtectedLayout';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { PredictionPage } from './pages/PredictionPage';
import { EinstellungenPage } from './pages/EinstellungenPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="model-insights" element={<ModelInsightsPage />} />
            <Route path="prediction" element={<PredictionPage />} />
            <Route path="einstellungen" element={<EinstellungenPage />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
