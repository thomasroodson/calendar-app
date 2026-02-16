const BASE_URL = "https://localhost:7023";

export type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const tryParseErrorMessage = async (res: Response): Promise<string | null> => {
  // sua API: { errors: string[] }
  try {
    const data = (await res.json()) as { errors?: string[] };
    if (data?.errors?.length) return data.errors.join("\n");
  } catch {
    // ignore
  }

  try {
    const text = await res.text();
    if (text?.trim()) return text;
  } catch {
    // ignore
  }

  return null;
};

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    const message = (await tryParseErrorMessage(res)) ?? res.statusText;
    throw new ApiError(res.status, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options: Omit<ApiOptions, "body" | "method"> = {}) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options: Omit<ApiOptions, "body" | "method"> = {}) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options: Omit<ApiOptions, "body" | "method"> = {}) =>
    request<T>(path, { ...options, method: "PUT", body }),

  del: <T>(path: string, options: Omit<ApiOptions, "body" | "method"> = {}) =>
    request<T>(path, { ...options, method: "DELETE" })
};
