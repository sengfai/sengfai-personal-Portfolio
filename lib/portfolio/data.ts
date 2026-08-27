import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { DEFAULT_CONTENT, normalizeContent, type PortfolioContent } from "./defaults";

const CONTENT_KEY = "portfolio";

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const db = getDb();
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, CONTENT_KEY)).limit(1);
    return row ? normalizeContent(JSON.parse(row.value)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function savePortfolioContent(value: unknown): Promise<PortfolioContent> {
  const content = normalizeContent(value);
  const db = getDb();
  await db.insert(siteContent).values({ key: CONTENT_KEY, value: JSON.stringify(content) }).onConflictDoUpdate({
    target: siteContent.key,
    set: { value: JSON.stringify(content), updatedAt: new Date().toISOString() },
  });
  return content;
}
