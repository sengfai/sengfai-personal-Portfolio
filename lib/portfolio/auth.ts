export const SESSION_COOKIE = "mersengfai_admin";
const MAX_AGE = 60 * 60 * 12;

async function runtimeValue(key: string) {
  try {
    const { env } = await import("cloudflare:workers");
    return String((env as unknown as Record<string, unknown>)[key] ?? process.env[key] ?? "");
  } catch {
    return String(process.env[key] ?? "");
  }
}

function encode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

export async function passwordMatches(candidate: string) {
  const expected = await runtimeValue("ADMIN_PASSWORD");
  if (!expected || !candidate) return false;
  return equalBytes(await digest(candidate), await digest(expected));
}

async function signature(payload: string) {
  const secret = await runtimeValue("ADMIN_SESSION_SECRET");
  if (!secret) return "";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return encode(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))));
}

export async function createSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = String(expires);
  return `${payload}.${await signature(payload)}`;
}

export async function isValidSession(token?: string | null) {
  if (!token) return false;
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied || Number(payload) < Math.floor(Date.now() / 1000)) return false;
  const expected = await signature(payload);
  return Boolean(expected) && supplied === expected;
}

export function tokenFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const item = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return item ? decodeURIComponent(item.slice(SESSION_COOKIE.length + 1)) : null;
}

export function sessionCookie(token: string) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}
