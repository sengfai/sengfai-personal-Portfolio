import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { DEFAULT_CONTENT, normalizeContent, type PortfolioContent } from "./defaults";

const CONTENT_KEY = "portfolio";
type PortfolioDb = Awaited<ReturnType<typeof getDb>>;

async function ensureContentTable(db: PortfolioDb) {
  await db.run(sql`
    create table if not exists site_content (
      "key" text primary key,
      "value" text not null,
      "updated_at" text not null default CURRENT_TIMESTAMP
    )
  `);
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const db = await getDb();
    await ensureContentTable(db);
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, CONTENT_KEY)).limit(1);
    return row ? normalizeContent(JSON.parse(row.value)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function savePortfolioContent(value: unknown): Promise<PortfolioContent> {
  const content = normalizeContent(value);
  const db = await getDb();
  await ensureContentTable(db);
  const payload = JSON.stringify(content);
  const [row] = await db.select({ key: siteContent.key }).from(siteContent).where(eq(siteContent.key, CONTENT_KEY)).limit(1);
  if (row) {
    await db.update(siteContent).set({ value: payload, updatedAt: sql`CURRENT_TIMESTAMP` }).where(eq(siteContent.key, CONTENT_KEY));
  } else {
    await db.insert(siteContent).values({ key: CONTENT_KEY, value: payload });
  }
  return content;
}
