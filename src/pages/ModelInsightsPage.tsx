import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { useEffect, useState } from "react";



export function ModelInsightsPage() {

  // --------------------------------------------
  // Mock / Platzhalter: Feature Importances
  // (kann später durch Backend ersetzt werden)
  // --------------------------------------------
  const featureImportances = [
    { feature: 'Torque', value: 0.52 },
    { feature: 'Rotational Speed', value: 0.21 },
    { feature: 'Tool Wear', value: 0.13 },
    { feature: 'Air Temperature', value: 0.08 },
    { feature: 'Process Temperature', value: 0.04 },
    { feature: 'Product Type', value: 0.02 }
  ];

  // --------------------------------------------
  // State: ROC-Daten + AUC Wert
  // - rocData: Array von Punkten {fpr, tpr}
  // - auc: Area Under Curve
  // - rocLoading: UI Loading-Status
  // --------------------------------------------
  
const [rocData, setRocData] = useState<{ fpr: number; tpr: number }[]>([]);
const [auc, setAuc] = useState<number | null>(null);
const [rocLoading, setRocLoading] = useState(true);



// --------------------------------------------
  // State: Modell-Metriken (Accuracy, F1, Precision, Recall)
  // - wird aus Backend geladen (model/metrics)
  // - null bedeutet: nicht verfügbar oder noch nicht geladen
  // --------------------------------------------
const [metrics, setMetrics] = useState<{
  accuracy: number | null;
  f1: number | null;
  precision: number | null;
  recall: number | null;
}>({ accuracy: null, f1: null, precision: null, recall: null });

const [metricsLoading, setMetricsLoading] = useState(true);


// ============================================================
  // 1) ROC + AUC vom Backend laden
  // Endpoint: GET /model/roc?model_name=Random_Forest
  //
  // Erwartetes JSON (Beispiel):
  // {
  //   "auc": 0.92,
  //   "points": [{"fpr":0.0,"tpr":0.0}, ...]
  // }
  //
  // Wichtig:
  // - Konvertiert Werte zu Number
  // - Filtert NaN raus
  // - Sortiert nach fpr (für saubere Kurve)
  // ============================================================

useEffect(() => {
  let alive = true;

  const load = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/model/roc?model_name=Random_Forest");
      
      // Wenn Endpoint nicht existiert/fehlschlägt -> keine ROC anzeigen
    
      if (!res.ok) {
        console.error("ROC endpoint returned not OK:", res.status);
        // Use fallback mock data if endpoint not available
        // setRocData([
        //   { fpr: 0, tpr: 0 },
        //   { fpr: 0.1, tpr: 0.75 },
        //   { fpr: 0.2, tpr: 0.85 },
        //   { fpr: 0.3, tpr: 0.90 },
        //   { fpr: 0.5, tpr: 0.95 },
        //   { fpr: 1, tpr: 1 }
        // ]);
        // setAuc(0.92);
        setRocLoading(false);
        return;
      }
      const json = await res.json();
      console.debug("ROC response:", json);

      if (!alive) return;

      const raw = json.points ?? [];
       // Sicherstellen: numeric + sortiert nach fpr
      const points = raw
        .map((p: any) => ({ fpr: Number(p.fpr), tpr: Number(p.tpr) }))
        .filter((p: any) => Number.isFinite(p.fpr) && Number.isFinite(p.tpr))
        .sort((a: any, b: any) => a.fpr - b.fpr);

      setRocData(points);
      setAuc(typeof json.auc === "number" ? json.auc : null);
    } catch (e) {
      console.error("ROC fetch failed:", e);
      // Use fallback mock data on error
      // setRocData([
      //   { fpr: 0, tpr: 0 },
      //   { fpr: 0.1, tpr: 0.75 },
      //   { fpr: 0.2, tpr: 0.85 },
      //   { fpr: 0.3, tpr: 0.90 },
      //   { fpr: 0.5, tpr: 0.95 },
      //   { fpr: 1, tpr: 1 }
      // ]);
      // setAuc(0.92);
    } finally {
      if (alive) setRocLoading(false);
    }
  };

  load();
  return () => {

     // verhindert setState auf unmounted component

    alive = false;
  };
}, []);



// ============================================================
  // Modell-Metriken vom Backend laden (live/periodisch)
  // Endpoint: GET /model/metrics?model_name=Random_Forest
  //
  // Unterstützt mehrere mögliche JSON-Strukturen (defensives Parsing),
  // z.B.:
  // { accuracy: 0.97, f1: 0.83, precision: 0.84, recall: 0.81 }
  // oder:
  // { metrics: { accuracy: ..., f1_score: ... } }
  //
  // Refresh alle 10 Sekunden (optional)
  // ============================================================

useEffect(() => {
  let alive = true;

  const loadMetrics = async () => {
    try {
      setMetricsLoading(true);

      const res = await fetch("http://127.0.0.1:8000/model/metrics?model_name=Random_Forest");
      if (!res.ok) {
        console.error("metrics endpoint returned not OK:", res.status);
        return;
      }

      const json: any = await res.json();
      console.debug("model/metrics json:", json);

      // defensives Auslesen: akzeptiert verschiedene Key-Namen

      const acc = json?.accuracy ?? json?.metrics?.accuracy ?? null;
      const f1 = json?.f1 ?? json?.f1_score ?? json?.metrics?.f1 ?? json?.metrics?.f1_score ?? null;
      const prec = json?.precision ?? json?.metrics?.precision ?? null;
      const rec = json?.recall ?? json?.metrics?.recall ?? null;

      if (!alive) return;

      // nur number übernehmen, sonst null (damit UI nicht crasht)
      setMetrics({
        accuracy: typeof acc === "number" ? acc : null,
        f1: typeof f1 === "number" ? f1 : null,
        precision: typeof prec === "number" ? prec : null,
        recall: typeof rec === "number" ? rec : null,
      });
    } catch (e) {
      console.error("metrics fetch failed:", e);
    } finally {
      if (alive) setMetricsLoading(false);
    }
  };

  loadMetrics();
  const id = setInterval(loadMetrics, 10000); // optional live refresh

  return () => {
    alive = false;
    clearInterval(id);
  };
}, []);




 // --------------------------------------------
  // Mock/XAI: Beispielwerte für „Normalized Feature Deviations“
  // (zur Erklärung / Visualisierung einzelner Predictions)
  // --------------------------------------------
  const deviations = [
    { feature: 'Tool Wear', deviation: 1.78, color: '#ef4444' },
    { feature: 'Rotational Speed', deviation: -0.78, color: '#f59e0b' },
    { feature: 'Torque', deviation: 0.42, color: '#9ca3af' },
    { feature: 'Air Temperature', deviation: 0.15, color: '#9ca3af' },
    { feature: 'Process Temperature', deviation: -0.08, color: '#9ca3af' }
  ];

  return (
    <div className="space-y-6">
      {/* --------------------------------------------
          UI: Page Header
         -------------------------------------------- */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1 className="mb-2" style={{ color: '#e5e7eb', fontSize: '1.5rem' }}>
          Modell-Insights 
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Modellperformance, Feature Importances und Visualisierungen
        </p>
      </div>

      {/* --------------------------------------------
          UI: Modell-Basisinformationen (statisch)
         -------------------------------------------- */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Modell-Basisinformationen
        </h2>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Modelltyp</p>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>Decision Tree Classifier</p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Trainiert</p>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>Backend v1.0</p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Datensatz</p>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>AI4I 2020</p>
          </div>
          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Klassenverteilung</p>
            <p style={{ color: '#f59e0b', fontSize: '0.875rem' }}>3.39% Failure</p>
          </div>
        </div>
      </div>

     {/* --------------------------------------------
          UI: KPI Row (live aus /model/metrics)
          - Zeigt Loading... bis Werte geladen sind
          - Wandelt 0..1 Werte in Prozent um
         -------------------------------------------- */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="p-5 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Accuracy
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
  {metricsLoading ? "Loading..." : (metrics.accuracy !== null ? `${Math.round(metrics.accuracy * 100)}%` : "—")}
</p>

          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Testdaten
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
            F1-Score
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
  {metricsLoading ? "Loading..." : (metrics.f1 !== null ? `${Math.round(metrics.f1 * 100)}%` : "—")}
</p>

          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Balanced
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
            Precision
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
  {metricsLoading ? "Loading..." : (metrics.precision !== null ? `${Math.round(metrics.precision * 100)}%` : "—")}
</p>

          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Class: Failure
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
            Recall
          </p>
          <p style={{ color: '#e5e7eb', fontSize: '1.625rem', fontWeight: '600' }}>
  {metricsLoading ? "Loading..." : (metrics.recall !== null ? `${Math.round(metrics.recall * 100)}%` : "—")}
</p>

          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Class: Failure
          </p>
        </div>
      </div>


 {/* --------------------------------------------
          UI: ROC + Feature Importances
          - ROC nutzt rocData und auc
          - Feature Importances sind aktuell Mock
         -------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4">
        {/* ROC Curve + AUC */}
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
              ROC Curve
            </h2>
            <div className="text-right">
              <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>AUC Score</p>
              <p style={{ color: '#22d3ee', fontSize: '1.5rem', fontWeight: '600' }}>{auc !== null ? auc.toFixed(2) : "_"}</p>
            </div>
          </div>

         <ResponsiveContainer width="100%" height={250}>
  <LineChart data={rocData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
    <XAxis 
      dataKey="fpr" 
      stroke="#9ca3af" 
      type="number"
      domain={[0, 1]}
      tick={{ fontSize: 12 }}
      label={{ value: 'False Positive Rate', position: 'bottom', fill: '#9ca3af', fontSize: 12 }}
    />
    <YAxis 
      dataKey="tpr" 
      stroke="#9ca3af" 
      type="number"
      domain={[0, 1]}
      tick={{ fontSize: 12 }}
      label={{ value: 'True Positive Rate', angle: -90, position: 'left', fill: '#9ca3af', fontSize: 12 }}
    />
    <Tooltip 
      contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }}
      labelStyle={{ color: '#e5e7eb' }}
      formatter={(value: any, name: any) => [Number(value).toFixed(3), name]}
    />
    {/* ROC Linie */}
    <Line
      type="monotone"
      dataKey="tpr"
      stroke="#22d3ee"
      strokeWidth={3}
      dot={false}
      isAnimationActive={false}
      name="ROC"
    />
    {/* Zufallslinie als Referenz */}
    <Line
      type="linear"
      data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]}
      dataKey="tpr"
      stroke="#9ca3af"
      strokeWidth={1}
      strokeDasharray="5 5"
      dot={false}
      isAnimationActive={false}
      name="Random"
    />
  </LineChart>
</ResponsiveContainer> 
        
        
        </div>

        {/* Feature Importances */}
        <div 
          className="p-6 rounded-[14px] shadow-lg"
          style={{ 
            background: '#232421',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="mb-4" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
            Feature Importances
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportances} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '0.75rem' }} />
              <YAxis dataKey="feature" type="category" stroke="#9ca3af" width={120} style={{ fontSize: '0.75rem' }} />
              <Tooltip 
                contentStyle={{ background: '#232421', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {featureImportances.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : '#a78bfa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Normalized Feature Deviations */}
      <div 
        className="p-6 rounded-[14px] shadow-lg"
        style={{ 
          background: '#232421',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 className="mb-3" style={{ color: '#e5e7eb', fontSize: '1.125rem' }}>
          Normalized Feature Deviations (XAI)
        </h2>
        <p className="mb-6" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Einflussstärkste Abweichungen für einzelne Vorhersagen (in Standardabweichungen)
        </p>

        <div className="space-y-3">
          {deviations.map((item) => (
            <div key={item.feature}>
              <div className="flex justify-between mb-2">
                <span style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{item.feature}</span>
                <span style={{ color: item.color, fontSize: '0.875rem' }}>{item.deviation}σ</span>
              </div>
              <div className="relative h-6 rounded-lg" style={{ background: 'rgba(107, 103, 92, 0.3)' }}>
                <div className="absolute left-1/2 w-px h-full" style={{ background: '#9ca3af' }}></div>
                <div 
                  className="absolute h-full rounded-lg transition-all"
                  style={{ 
                    background: item.color,
                    left: item.deviation >= 0 ? '50%' : `${50 + (item.deviation / 3) * 50}%`,
                    width: `${Math.abs(item.deviation / 3) * 50}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1" style={{ fontSize: '0.75rem', color: '#6b675c' }}>
                <span>-3σ</span>
                <span>0</span>
                <span>+3σ</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="pt-8 pb-6 text-center" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
        © 2025 – Projekt 2 • Predictive Analysis for Maintenance
      </footer>
    </div>
  );
}
