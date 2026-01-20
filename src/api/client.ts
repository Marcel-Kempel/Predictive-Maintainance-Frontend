const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  bodyText: string;

  constructor(status: number, bodyText: string) {
    super(`API error ${status}: ${bodyText}`);
    this.status = status;
    this.bodyText = bodyText;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // <- wichtig für Sessions/Cookies (auch wenn Backend später erst kommt)
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

    if (!res.ok) {
  const text = await res.text();

  // Globales Event, damit App bei 401 automatisch reagieren kann
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }

  throw new ApiError(res.status, text || res.statusText);
}


  // falls mal 204 kommt
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;

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

export interface SimPreviewResponse {
  model_name: string;
  sample_count: number;
  results: any[];
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

  getFailurePredictions(modelName = "Random_Forest") {
    const params = new URLSearchParams({ model_name: modelName });
    return request<PredictResponse>(`/predict?${params.toString()}`);
  },

  getSimPreview(limit = 10, modelName = "Random_Forest") {
    const params = new URLSearchParams({
      limit: String(limit),
      model_name: modelName,
    });
    return request<SimPreviewResponse>(`/sim_preview?${params.toString()}`);
  },

  evaluateModel(modelName = "Random_Forest") {
    const params = new URLSearchParams({ model_name: modelName });
    return request<any>(`/evaluate_model?${params.toString()}`);
  },
    auth: {
    login(username: string, password: string) {
      return request<{ ok: boolean; username?: string; role?: string }>(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
    },

    logout() {
      return request<{ ok: boolean }>(`/auth/logout`, {
        method: "POST",
      });
    },

    me() {
      return request<{ ok: boolean; username: string; role?: string }>(`/auth/me`);
    },
  },

};
