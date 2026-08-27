import { isValidSession, tokenFromRequest } from "@/lib/portfolio/auth";
import { getPortfolioContent, savePortfolioContent } from "@/lib/portfolio/data";

export async function GET(request: Request) {
  if (!(await isValidSession(tokenFromRequest(request)))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ content: await getPortfolioContent() });
}

export async function PUT(request: Request) {
  if (!(await isValidSession(tokenFromRequest(request)))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const content = await savePortfolioContent(await request.json());
    return Response.json({ content });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save content" }, { status: 500 });
  }
}
