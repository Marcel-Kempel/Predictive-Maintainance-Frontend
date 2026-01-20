import { useEffect, useState } from 'react';
import { api, GetDataResponse, PredictResponse, COLUMN_NAMES } from '../api/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';

type TrendPoint = {
  time: string;
  torque: number;
  speed: number;
  temp: number;
};

type DashboardKpis = {
  failureProbability: number;
  activeWarnings: number;
  avgToolWear: number;
  avgTorque: number;
};

export function DashboardPage() {
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const warnings = [
    { time: '08:34', mode: 'OSF', severity: 'Hoch', recommendation: 'Werkzeugverschleiß hoch → Wechsel empfohlen' },
    { time: '10:12', mode: 'HDF', severity: 'Mittel', recommendation: 'Temperatur prüfen' }
  ];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Messdaten + Modell-Output parallel laden
        const [dataRes, predictRes]: [GetDataResponse, PredictResponse] = await Promise.all([
          api.getData(200, [
            COLUMN_NAMES.torque,
            COLUMN_NAMES.rpm,
            COLUMN_NAMES.procTemp,
            COLUMN_NAMES.toolWear,
          ]),
          api.getFailurePredictions(),
        ]);


        const rows = dataRes.data as any[];

        // Trenddaten für das Chart vorbereiten
        const trend: TrendPoint[] = rows.map((row, index) => ({
          time: index.toString(), // künstliche Zeitachse, da Dataset keinen echten Timestamp hat
          torque: Number(row['Torque [Nm]'] ?? 0),
          speed: Number(row['Rotational speed [rpm]'] ?? 0),
          temp: Number(row['Process temperature [K]'] ?? 0)
        }));

        // KPIs aus den Daten berechnen
        const avgTorque =
          rows.length > 0
            ? rows.reduce((sum, row) => sum + Number(row['Torque [Nm]'] ?? 0), 0) / rows.length
            : 0;

        const avgToolWear =
          rows.length > 0
            ? rows.reduce((sum, row) => sum + Number(row['Tool wear [min]'] ?? 0), 0) / rows.length
            : 0;

        const failureProbability =
          predictRes.total_samples > 0
            ? (predictRes.failure_predictions_count / predictRes.total_samples) * 100
            : 0;

        const activeWarnings = predictRes.failure_predictions_count;

        setTrendData(trend);
        setKpis({
          failureProbability,
          activeWarnings,
          avgTorque,
          avgToolWear
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Fehler beim Laden der Dashboard-Daten');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm" style={{ color: '#9ca3af' }}>
        Lade Dashboard-Daten…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm" style={{ color: '#ef4444' }}>
        Fehler beim Laden der Dashboard-Daten: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div
        className="p-6 rounded-[14px] shadow-lg"
        style={{
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1 className="mb-2" style={{ color: '#e5e7eb', fontSize: '1.5rem' }}>
          Systemübersicht: Maschinenzustand & Vorhersagen
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Erkennen Sie potenzielle Ausfälle frühzeitig und optimieren Sie Ihre Wartungsplanung.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div
          className="p-5 rounded-[14px] shadow-lg"
          style={{
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Failure Probability
            </p>
            <TrendingUp className="w-5 h-5" style={{ color: '#a78bfa' }} />
          </div>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
            {kpis ? `${kpis.failureProbability.toFixed(1)}%` : '–'}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Ausfallwahrscheinlichkeit (aktuelle Auswahl)
          </p>
        </div>

        <div
          className="p-5 rounded-[14px] shadow-lg"
          style={{
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Aktive Warnungen
            </p>
            <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />
          </div>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
            {kpis ? kpis.activeWarnings : '–'}
          </p>
          <p style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Erfordert Aufmerksamkeit
          </p>
        </div>

        <div
          className="p-5 rounded-[14px] shadow-lg"
          style={{
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Ø Tool Wear
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
            {kpis ? `${kpis.avgToolWear.toFixed(0)} min` : '–'}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Durchschnittlicher Verschleiß
          </p>
        </div>

        <div
          className="p-5 rounded-[14px] shadow-lg"
          style={{
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Ø Torque
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
            {kpis ? `${kpis.avgTorque.toFixed(1)} Nm` : '–'}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Durchschnittliches Drehmoment
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      <div
        className="p-6 rounded-[14px] shadow-lg"
        style={{
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Prozessparameter-Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
            <Tooltip
              contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line type="monotone" dataKey="torque" stroke="#22d3ee" strokeWidth={2} name="Torque [Nm]" />
            <Line type="monotone" dataKey="speed" stroke="#a78bfa" strokeWidth={2} name="Speed [rpm]" />
            <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name="Process Temp [K]" />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 flex gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#22d3ee' }}></div>
            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Torque</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#a78bfa' }}></div>
            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Rotational Speed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }}></div>
            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Process Temperature</span>
          </div>
        </div>
      </div>

      {/* Warnings Panel */}
      <div
        className="p-6 rounded-[14px] shadow-lg"
        style={{
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Aktuelle Warnungen
        </h2>

        <div
          className="rounded-lg overflow-hidden"
          style={{ background: '#6b675c' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Zeit</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Failure Mode</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Severity</th>
                <th className="px-4 py-3 text-left" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Empfehlung</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((warning, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: index < warnings.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}
                >
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{warning.time}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        background: warning.severity === 'Hoch' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: warning.severity === 'Hoch' ? '#ef4444' : '#f59e0b',
                        fontSize: '0.75rem'
                      }}
                    >
                      {warning.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{warning.severity}</td>
                  <td className="px-4 py-3" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{warning.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
        © 2025 – Predictive Maintenance Dashboard (Live-Daten aus Backend)
      </footer>
    </div>
  );
}
