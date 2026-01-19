import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DashboardPage() {
 
  // -----------------------------
  // Typen: Shape der Daten für den Trend-Chart
  // -----------------------------
  type TrendPoint = { time: string; torque: number; speed: number; temp: number };

  // -----------------------------
  // State: Trend + KPI Werte
  // -----------------------------

const [trendData, setTrendData] = useState<TrendPoint[]>([]);
const [avgTorque, setAvgTorque] = useState<number | null>(null);
const [avgToolWear, setAvgToolWear] = useState<number | null>(null);

// Live KPI aus Prediction-Backend
const [activeWarnings, setActiveWarnings] = useState<number>(0);
const [failureProb, setFailureProb] = useState<number | null>(null);
const [predLoading, setPredLoading] = useState<boolean>(true);
const [trafficLight, setTrafficLight] = useState<"green" | "yellow" | "red" | null>(null)

// -----------------------------
  // State: Live Warn-Tabelle (Liste) + Loading-Status
  // -----------------------------
const [liveWarnings, setLiveWarnings] = useState<
  { id: string; time: string; mode: string; severity: "Hoch" | "Mittel"; recommendation: string }[]
>([]);
const [warningsLoading, setWarningsLoading] = useState(true);


// ============================================================
  // 1) Trend-Daten (Sensorwerte) holen + daraus Ø Torque / Ø Tool Wear berechnen
  //    - Polling alle 2 Sekunden
  // ============================================================


useEffect(() => {
  let alive = true;

  const load = async () => {
    // Holt die letzten N Datensätze für den Trend-Chart
    const res = await fetch("http://127.0.0.1:8000/getdata?limit=200");
    if (!res.ok) return;

    const json = await res.json();
    // Backend-Felder sind "schön" benannt (z.B. "Torque [Nm]"),
      // hier mappen wir sie auf kurze Keys für recharts
    console.log("getdata json:", json);
    console.log("first row:", json?.data?.[0]);

    const points = (json.data ?? []).map((row: any) => {
      const torqueVal = row["Torque [Nm]"] ?? row.torque;
      const rpmVal = row["Rotational speed [rpm]"] ?? row.rpm;
      const tempVal = row["Process temperature [K]"] ?? row.proc_temp;

      const ts = row["TS"] ?? row.ts ?? row.timestamp ?? row.time;

      return {
        time: ts ? new Date(ts).toLocaleTimeString() : "",
        torque: Number(torqueVal),
        speed: Number(rpmVal),
        temp: Number(tempVal),
      };
    })
    
    // Ungültige Werte rausfiltern, damit recharts nicht „0“ oder NaN zeichnet
    .filter((p: any) =>
      Number.isFinite(p.torque) && Number.isFinite(p.speed) && Number.isFinite(p.temp)
    );

    if (alive) setTrendData(points);

    
      // KPI-Berechnung aus Trend-Daten: Ø Torque und Ø Tool Wear
if (points.length > 0) {
  // Ø Torque
  const torqueAvg =
    points.reduce((s: any, p: { torque: any; }) => s + p.torque, 0) / points.length;
  setAvgTorque(torqueAvg);

  // Ø Tool Wear (falls vorhanden)
  const toolWearValues = (json.data ?? [])
    .map((r: any) => r["Tool wear [min]"] ?? r.tool_wear)
    .filter((v: any) => Number.isFinite(v));

  if (toolWearValues.length > 0) {
    const wearAvg =
      toolWearValues.reduce((s: number, v: number) => s + v, 0) /
      toolWearValues.length;
    setAvgToolWear(wearAvg);
  }

  // // Einfache Warnlogik (Beispiel)
  // let warnings = 0;
  // if (torqueAvg > 50) warnings += 1;
  // if (avgToolWear !== null && avgToolWear > 180) warnings += 1;

  // setActiveWarnings(warnings);
}


  };

  load();
  const id = setInterval(load, 2000);// live refresh


  return () => {
    alive = false;
    clearInterval(id);
  };
}, []);
  

// Second UseEffect: Prediction API aufrufen
 // ============================================================
  // Prediction (predict/latest) holen:
  //    - Failure Probability (p)
  //    - Traffic Light (green/yellow/red)
  //    - Aktive Warnungen aus summary.yellow + summary.red
  //    - (TODO: Live Warnliste permanent darstellen): Live-Warnliste (eine Warnung hinzufügen, wenn yellow/red)
  // ============================================================


useEffect(() => {
  let alive = true;
  const controller = new AbortController();

  // Hilfsfunktion: akzeptiert "12%", 0.12 oder 12 und normalisiert auf 0..1
  const parseProbability = (raw: unknown): number | null => {
    if (raw == null) return null;
    // wenn String, entferne % und parseFloat
    if (typeof raw === 'string') {
      const cleaned = raw.trim().replace('%', '');
      const n = parseFloat(cleaned);
      if (!Number.isFinite(n)) return null;
      // wenn Wert wie "12" interpretieren wir als Prozent -> 0.12
      const normalized = n > 1 ? n / 100 : n;
      return Math.max(0, Math.min(1, normalized));
    }
    // wenn Zahl
    if (typeof raw === 'number') {
      if (!Number.isFinite(raw)) return null;
      const normalized = raw > 1 ? raw / 100 : raw;
      return Math.max(0, Math.min(1, normalized));
    }
    return null;
  };

  const loadLatest = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/predict/latest", { signal: controller.signal });
    if (!res.ok) {
      const txt = await res.text().catch(() => "<no body>");
      console.error("predict/latest failed:", res.status, txt);
      return;
    }

   const json = await res.json();
console.debug("predict/latest json:", json);

const latest = json?.latest ?? null;

const raw = latest?.probability ?? null;

// KPI: Failure Probability + Aktive Warnungen + Traffic Light
const p = parseProbability(raw);

const yellow = Number(json?.summary?.yellow ?? 0);
const red = Number(json?.summary?.red ?? 0);
const tl = (latest?.traffic_light ?? null) as "green" | "yellow" | "red" | null;

if (alive) {
  setFailureProb(p);
  setActiveWarnings(yellow + red);
  setTrafficLight(tl);
}

// Wenn TrafficLight gelb/rot, wird einen Eintrag in die Tabelle hinzugefügt
// (aktuell wird die Liste mit genau 1 Element ersetzt: Habe keine Ahnung wie ich es
// beheben kann -> "flackert"/verschwindet)


const light = String(latest?.traffic_light ?? "green"); // "green" | "yellow" | "red"

if (alive) {
  // Traffic Light state (falls du es anzeigen willst)
  if (light === "green" || light === "yellow" || light === "red") {
    setTrafficLight(light as any);
  } else {
    setTrafficLight(null);
  }

  // Live Warn-Tabelle: nur wenn yellow/red
  if (latest && (light === "yellow" || light === "red")) {
    const ts = latest?.TS ?? latest?.ts ?? latest?.timestamp ?? null;
    const time = ts ? new Date(ts).toLocaleTimeString() : "—";

    setLiveWarnings([
      {
        id: `warning-${Date.now()}`,// schnelle ID, aber nicht stabil über Reloads
        time,
        mode: latest?.predicted_label === 1 ? "Failure" : "Warning",
        severity: light === "red" ? "Hoch" : "Mittel",
        recommendation: light === "red"
          ? "Sofort prüfen / Wartung einleiten"
          : "Beobachten und zeitnah prüfen",
      },
    ]);
  } else {
    setLiveWarnings([]); // keine Warnungen
  }
}


  } catch (e: any) {
    if (e?.name === "AbortError") return;
    console.error("predict/latest error:", e);
  } finally {
    if (alive) setPredLoading(false);
  }
};

  loadLatest();
  const id = setInterval(loadLatest, 2000);


  return () => {
    alive = false;
    controller.abort();
    clearInterval(id);
  };
}, []);


  type LiveWarning = {
  time: string;
  mode: string;
  severity: "Hoch" | "Mittel" | "Niedrig";
  recommendation: string;
};

// ============================================================
  //  Predict Status (predict/status) holen:
  //    - Baut Warnliste aus Backend (failures[] etc.)
  //    - Polling alle 3 Sekunden
  //
  // ⚠️ WICHTIG: Das ist eine zweite Quelle für die Warn-Tabelle.
  //    An sich bekomme ich auch Live Warnings aus predict/latest und hiermit wird
  // es nur noch überschrieben, könnte einen Grund sein, wieso die Liste „flackert“.
  //   Aber leider kann ich es nicht anders lösen, da ich aus predict/latest
  //   nicht alle Warnungen bekomme, sondern nur die aktuellste.
  // ============================================================
;

useEffect(() => {
  let alive = true;
  const controller = new AbortController();

  const mapSeverity = (traffic: string): "Hoch" | "Mittel" | "Niedrig" => {
    if (traffic === "red") return "Hoch";
    if (traffic === "yellow") return "Mittel";
    return "Niedrig";
  };

  const mapRecommendation = (traffic: string) => {
    if (traffic === "red") return "Sofort prüfen / Wartung einleiten";
    if (traffic === "yellow") return "Beobachten und zeitnah prüfen";
    return "Keine Aktion erforderlich";
  };

  const loadWarnings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/predict/status", {
        signal: controller.signal,
      });
      if (!res.ok) return;

      const json = await res.json();

    // Erwartete Struktur:
        // { failures: [ { ts, failure_mode, traffic_light } ] }
      const rows = (json.failures ?? []).map((f: any) => ({
        time: f.ts
          ? new Date(f.ts).toLocaleTimeString()
          : "--",
        mode: f.failure_mode ?? "Unknown",
        severity: mapSeverity(f.traffic_light),
        recommendation: mapRecommendation(f.traffic_light),
      }));

      if (alive) setLiveWarnings(rows);
    } catch (e) {
      if ((e as any)?.name !== "AbortError") {
        console.error("predict/status failed:", e);
      }
    } finally {
      if (alive) setWarningsLoading(false);
    }
  };

  loadWarnings();
  const id = setInterval(loadWarnings, 3000); // live

  return () => {
    alive = false;
    controller.abort();
    clearInterval(id);
  };
}, []);


 // -----------------------------
  // UI Helfer: Prozent + Farbe nach Traffic Light
  // -----------------------------

  const failureProbPct = failureProb !== null ? failureProb * 100 : null;

const probColor =
  trafficLight === "red" ? "#ef4444" :
  trafficLight === "yellow" ? "#f59e0b" :
  trafficLight === "green" ? "#22c55e" :
  "#e5e7eb";

// -----------------------------
  // Render: UI (KPI Cards, Trend Charts, Warn-Tabelle)
  // -----------------------------

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
            <TrendingUp className="w-5 h-5" style={{ color: probColor }} />
          </div>
         <p style={{ color: probColor, fontSize: '1.625rem', fontWeight: '600' }}>
  {predLoading ? "Loading..." : (failureProbPct !== null ? `${failureProbPct.toFixed(1)}%` : "—")}
</p>


          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Ausfallwahrscheinlichkeit (aktuelle Charge)
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
  {activeWarnings}
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
  {avgToolWear !== null ? Math.round(avgToolWear) : "—"} min
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
  {avgTorque !== null ? avgTorque.toFixed(1) : "—"} Nm
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

<div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 8 }}>
  trendData: {trendData.length}
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  {/* Torque */}
  <div className="p-4 rounded-[12px]" style={{ background: "#1f201d" }}>
    <h3 style={{ color: "#e5e7eb", fontSize: "0.95rem", marginBottom: 8 }}>
      Torque [Nm]
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
        <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="torque" stroke="#22d3ee" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Rotational Speed */}
  <div className="p-4 rounded-[12px]" style={{ background: "#1f201d" }}>
    <h3 style={{ color: "#e5e7eb", fontSize: "0.95rem", marginBottom: 8 }}>
      Rotational Speed [rpm]
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
        <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="speed" stroke="#a78bfa" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Process Temperature */}
  <div className="p-4 rounded-[12px]" style={{ background: "#1f201d" }}>
    <h3 style={{ color: "#e5e7eb", fontSize: "0.95rem", marginBottom: 8 }}>
      Process Temperature [K]
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />

        {/* Dynamische Y-Achse, um kleine Temperatur-Schwankungen sichtbar zu machen*/}

        <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} domain={[
    (dataMin: number) => Math.floor(dataMin - 1),
    (dataMax: number) => Math.ceil(dataMax + 1),]}
 // stroke="#9ca3af" tick={{ fontSize: 10 }} 
  /> 
        <Tooltip />
        <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

       

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
              {warningsLoading && (
  <tr>
    <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-400">
      Lade Warnungen…
    </td>
  </tr>
)}

{!warningsLoading && liveWarnings.length === 0 && (
  <tr>
    <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-400">
      Keine aktiven Warnungen
    </td>
  </tr>
)}

{liveWarnings.map((warning, index) => (

                <tr 
                  key={index}
                  style={{ borderBottom: index < liveWarnings.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}
                >
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>{warning.time}</td>
                  <td className="px-4 py-3" style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>
                    <span 
                      className="px-2 py-1 rounded"
                      style={{ background: warning.severity === 'Hoch' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: warning.severity === 'Hoch' ? '#ef4444' : '#f59e0b', fontSize: '0.75rem' }}
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
        © 2025 – Projekt 2 • Predictive Analysis for Maintenance
      </footer>
    </div>
  );
}