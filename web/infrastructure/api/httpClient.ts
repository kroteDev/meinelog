import type { ApiErrorResponse } from "../../domain/api/ApiEnvelope";

export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join("; ") || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

export interface ApiRequestOptions {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  token?: string;
  body?: unknown;
}

export type ApiRequestFn = <T>(options: ApiRequestOptions) => Promise<T>;

/**
 * Builds a request function bound to one base URL. The base URL is
 * injected (never hardcoded) because it differs per context:
 * browsers need the public address, server code needs the
 * in-cluster address (http://api:3000).
 */
export function createApiClient({ baseUrl }: { baseUrl: string }): ApiRequestFn {
  return async function apiRequest<T>({ method, path, token, body }: ApiRequestOptions) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    const json = text ? (JSON.parse(text) as unknown) : null;

    if (!res.ok) {
      const messages =
        (json as ApiErrorResponse | null)?.errors ?? [`Request failed with status ${res.status}`];
      throw new ApiError(res.status, messages);
    }

    return (json as { data: T }).data;
  };
}

/**
 * Browser default: public API address from compose
 * (NEXT_PUBLIC_API_URL), falling back to same-machine dev.
 */
export function createBrowserApiClient(): ApiRequestFn {
  return createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  });
}

/**
 * Server default: in-cluster address. Only used by server-side
 * code, where localhost would resolve to the web container itself.
 */
export function createServerApiClient(): ApiRequestFn {
  return createApiClient({
    baseUrl: process.env.API_INTERNAL_BASE_URL ?? "http://api:3000",
  });
}
