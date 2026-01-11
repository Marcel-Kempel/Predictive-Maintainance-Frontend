import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedLayout } from './components/ProtectedLayout';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { PredictionPage } from './pages/PredictionPage';
import { EinstellungenPage } from './pages/EinstellungenPage';

import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./routes/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Layout */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <ProtectedLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="model-insights" element={<ModelInsightsPage />} />
            <Route path="prediction" element={<PredictionPage />} />
            <Route path="einstellungen" element={<EinstellungenPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
