import { ArrowLeft, CalendarDays, NotebookPen } from "lucide-react";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio/data";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function JournalPage() {
  const content = await getPortfolioContent();
  const posts = [...content.journal].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="site-shell">
      <div className="portfolio-board page-board">
        <header className="topbar page-topbar">
          <Link className="mini-brand" href="/">Creative portfolio</Link>
          <nav className="top-nav" aria-label="Main navigation">
            <Link href="/projects">Projects</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation menu">
              <span className="hamburger-lines"><i /><i /><i /></span>
              <span>Menu</span>
            </summary>
            <nav aria-label="Mobile navigation">
              <Link href="/projects">Projects</Link>
              <Link href="/journal">Journal</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
          </details>
          <div className="top-line" />
          <Link className="availability" href="/#contact">{content.general.availability} <i /></Link>
        </header>

        <section className="archive-hero journal-hero">
          <Link className="archive-back" href="/"><ArrowLeft /> Back home</Link>
          <p>Notes and updates</p>
          <h1>Journal</h1>
          <span>Thoughts about design, development, process, and the work I am building.</span>
        </section>

        <section className="archive-section journal-list">
          {posts.map((post, index) => (
            <article className="journal-card" key={`${post.title}-${index}`}>
              <div className="journal-meta">
                <span><CalendarDays /> {formatDate(post.date)}</span>
                <span><NotebookPen /> {post.category}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="journal-body">
                {post.body.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
