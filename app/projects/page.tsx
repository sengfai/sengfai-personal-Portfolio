import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio/data";

export const dynamic = "force-dynamic";

const projectClasses = ["project-a", "project-b", "project-c", "project-d"];

export default async function ProjectsPage() {
  const content = await getPortfolioContent();

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

        <section className="archive-hero">
          <Link className="archive-back" href="/"><ArrowLeft /> Back home</Link>
          <p>Selected builds</p>
          <h1>Projects</h1>
          <span>Interfaces, websites, dashboards, and frontend systems I have designed or built.</span>
        </section>

        <section className="archive-section">
          <div className="archive-project-grid">
            {content.projects.map((project, index) => {
              const visual = (
                <div className={`project-visual ${projectClasses[index % projectClasses.length]}`}>
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt="" className="project-image" />
                  ) : (
                    <>
                      <span>{`PROJECT / ${String(index + 1).padStart(2, "0")}`}</span>
                      <strong>{project.title}</strong>
                      <i /><i /><i />
                    </>
                  )}
                </div>
              );
              const card = (
                <>
                  {visual}
                  <div className="archive-card-copy">
                    <div>
                      <p>{project.type}</p>
                      <h2>{project.title}</h2>
                    </div>
                    {project.url ? <ArrowUpRight /> : <Code2 />}
                  </div>
                </>
              );

              return project.url ? (
                <a className="project-card archive-project-card" href={project.url} target="_blank" rel="noreferrer" key={`${project.title}-${index}`}>
                  {card}
                </a>
              ) : (
                <article className="project-card archive-project-card" key={`${project.title}-${index}`}>
                  {card}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
