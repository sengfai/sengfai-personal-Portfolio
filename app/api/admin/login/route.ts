import { createSession, passwordMatches, sessionCookie } from "@/lib/portfolio/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!(await passwordMatches(body.password ?? ""))) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }
  const token = await createSession();
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(token) } });
}
