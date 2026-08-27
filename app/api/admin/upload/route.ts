import { isValidSession, tokenFromRequest } from "@/lib/portfolio/auth";

const MAX_BYTES = 8 * 1024 * 1024;

async function getBucket() {
  const { env } = await import("cloudflare:workers");
  return (env as unknown as { BUCKET?: R2Bucket }).BUCKET;
}

export async function POST(request: Request) {
  if (!(await isValidSession(tokenFromRequest(request)))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose an image" }, { status: 400 });
  if (!file.type.startsWith("image/") || file.size > MAX_BYTES) return Response.json({ error: "Use a JPG, PNG, or WebP image under 8 MB" }, { status: 400 });

  const bucket = await getBucket();
  if (!bucket) return Response.json({ error: "Image storage is unavailable" }, { status: 503 });
  const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
  const key = `portfolio-${crypto.randomUUID()}.${extension}`;
  await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return Response.json({ url: `/api/assets/${key}` });
}
