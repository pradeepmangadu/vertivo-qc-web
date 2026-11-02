const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message); }
}

let csrfToken: string | null = null;
let refreshing: Promise<boolean> | null = null;

async function getCsrf(force = false): Promise<string> {
  if (!csrfToken || force) {
    const r = await fetch(`${BASE}/auth/csrf`, { credentials: 'include' });
    if (!r.ok) throw new ApiError(r.status, 'Could not start a secure session');
    csrfToken = ((await r.json()) as { token: string }).token;
  }
  return csrfToken;
}

async function send(method: string, path: string, body?: unknown, isRetry = false): Promise<Response> {
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  if (method !== 'GET') headers['X-CSRF-Token'] = await getCsrf();

  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload, credentials: 'include' });

  if (res.status === 403 && !isRetry && method !== 'GET') {
    const j = await res.clone().json().catch(() => null);
    if (j?.error?.code === 'CSRF') { await getCsrf(true); return send(method, path, body, true); }
  }
  if (res.status === 401 && !isRetry && !path.startsWith('/auth/')) {
    if (await refreshSession()) return send(method, path, body, true);
    window.dispatchEvent(new Event('auth:expired'));
  }
  return res;
}

/** Single-flight token refresh (refresh token is an HttpOnly cookie; JS never sees it). */
export function refreshSession(): Promise<boolean> {
  refreshing ??= send('POST', '/auth/refresh').then((r) => r.ok).catch(() => false).finally(() => { refreshing = null; });
  return refreshing;
}

async function fail(res: Response): Promise<never> {
  const j = await res.json().catch(() => null);
  throw new ApiError(res.status, j?.error?.message ?? 'Request failed', j?.error?.code);
}

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await send(method, path, body);
  if (!res.ok) return fail(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function downloadFile(path: string, filename: string): Promise<void> {
  const res = await send('GET', path);
  if (!res.ok) return fail(res);
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
