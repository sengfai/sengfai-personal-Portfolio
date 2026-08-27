async function getBucket() {
  const { env } = await import("cloudflare:workers");
  return (env as unknown as { BUCKET?: R2Bucket }).BUCKET;
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^portfolio-[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/.test(key)) return new Response("Not found", { status: 404 });
  const bucket = await getBucket();
  const object = await bucket?.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
}
