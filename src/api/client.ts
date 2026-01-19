const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ----- Typen entsprechend dem Backend -----

export type ColumnName =
  | "Torque [Nm]"
  | "Rotational speed [rpm]"
  | "Air temperature [K]"
  | "Process temperature [K]"
  | "Tool wear [min]"
  | "Machine failure";

export const COLUMN_NAMES = {
  torque: "Torque [Nm]" as ColumnName,
  rpm: "Rotational speed [rpm]" as ColumnName,
  airTemp: "Air temperature [K]" as ColumnName,
  procTemp: "Process temperature [K]" as ColumnName,
  toolWear: "Tool wear [min]" as ColumnName,
  machineFailure: "Machine failure" as ColumnName,
};


export interface GetDataResponse {
  row_count: number;
  data: Record<string, unknown>[];
}

export interface FailurePrediction {
  index: number;
  true_label: number;
  predicted_label: number;
  probability_failure: number | null;
}

export interface PredictResponse {
  model_name: string;
  total_samples: number;
  failure_predictions_count: number;
  failure_predictions: FailurePrediction[];
}

export interface PredictLatestResponse {
  running: boolean;
  model_name: string;
  interval: number;
  batch_size: number;
  latest: any;
  summary: any;
}

export interface PredictStatusResponse {
  running: boolean;
  model_name?: string;
  interval?: number;
  batch_size?: number;
  last_result?: any;
}

// ----- API-Funktionen -----

export const api = {
  getData(limit: number, columns?: ColumnName[]) {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (columns) {
      for (const col of columns) {
        params.append("columns", col);
      }
    }
    return request<GetDataResponse>(`/getdata?${params.toString()}`);
  },

  // Test-set predictions (offline)
  getFailurePredictions(modelName = "Random_Forest") {
    const params = new URLSearchParams({ model_name: modelName });
    return request<PredictResponse>(`/predict_testset_failures?${params.toString()}`);
  },

  // Prediction service control
  async startPrediction(interval = 1.0, modelName = "Random_Forest", batchSize = 50) {
    return request<any>(`/predict/start?interval=${interval}&model_name=${modelName}&batch_size=${batchSize}`, {
      method: "POST",
    });
  },

  async stopPrediction() {
    return request<any>(`/predict/stop`, { method: "POST" });
  },

  getPredictionStatus() {
    return request<PredictStatusResponse>(`/predict/status`);
  },

  getPredictionLatest() {
    return request<PredictLatestResponse>(`/predict/latest`);
  },

  // One-off prediction
  async predictOnce(modelName = "Random_Forest", batchSize = 50) {
    return request<any>(`/predict/once?model_name=${modelName}&batch_size=${batchSize}`, {
      method: "POST",
    });
  },

  // Simulation control
  async startSimulation(interval = 1.0) {
    return request<any>(`/simulation/start?interval=${interval}`, { method: "POST" });
  },

  async stopSimulation() {
    return request<any>(`/simulation/stop`, { method: "POST" });
  },

  getSimulationStatus() {
    return request<any>(`/simulation/status`);
  },

  async resetSimulation() {
    return request<any>(`/simulation/reset`, { method: "POST" });
  },
};
