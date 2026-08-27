import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "@/lib/portfolio/auth";
import { getPortfolioContent } from "@/lib/portfolio/data";
import { AdminClient } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await cookies();
  const authenticated = await isValidSession(store.get(SESSION_COOKIE)?.value);
  const content = authenticated ? await getPortfolioContent() : null;
  return <AdminClient authenticated={authenticated} initialContent={content} />;
}
