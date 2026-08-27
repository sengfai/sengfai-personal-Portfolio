import { SESSION_COOKIE } from "@/lib/portfolio/auth";

export async function POST() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` } });
}
