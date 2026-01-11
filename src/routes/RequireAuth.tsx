import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      // Session abgelaufen -> logout-state setzen & zum login
      // (Logout call ist optional, state reicht; wir halten es hier simpel)
      navigate("/login", { replace: true, state: { reason: "expired" } });
    };

    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, [navigate]);

  if (auth.isLoading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
