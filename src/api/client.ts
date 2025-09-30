const BASE = import.meta.env.VITE_API_BASE_URL!;
const API_KEY = import.meta.env.VITE_API_KEY!;

type Opts = RequestInit & { headers?: Record<string, string> };

function extractMessage(data: any, fallback: string) {
  try {
    if (!data) return fallback;
    if (typeof data === 'string') return data;

    if (Array.isArray(data.message)) return data.message.join(', ');
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;

    return fallback;
  } catch {
    return fallback;
  }
}

export async function apiFetch<T>(
  path: string,
  opts: Opts = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    let body: any = null;

    const text = await res.text();
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text || null;
    }
    msg = extractMessage(body, msg);
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as unknown as T;

  return (await res.json()) as T;
}
