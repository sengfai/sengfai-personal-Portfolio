import {
  ArrowUpRight, Boxes, Check, CloudUpload, Code2, ExternalLink,
  LayoutGrid, Mail, MonitorSmartphone, MousePointer2, Palette, PenTool,
  Search, Sparkles,
} from "lucide-react";
import { getPortfolioContent } from "@/lib/portfolio/data";

export const dynamic = "force-dynamic";

const serviceIcons = [Palette, MonitorSmartphone, MousePointer2, Boxes, LayoutGrid];
const processIcons = [Search, LayoutGrid, PenTool, Code2, CloudUpload];
const projectClasses = ["project-a", "project-b", "project-c", "project-d"];
const toolMarks = ["Fg", "Xd", "Ps", "Ai", "Wf", "Ts", "Tw", "Lv", "Pg", "Sb"];
const aboutImageUrl = "/about-nameless-king.png";

export default async function Home() {
  const content = await getPortfolioContent();
  const { general, about, links } = content;
  const heroTitle =
    general.heroTitle.trim().toUpperCase() === general.name.trim().toUpperCase()
      ? "PORTFOLIO"
      : general.heroTitle;
  const availability =
    general.availability.trim().toLowerCase() === "available for selected work"
      ? "Available for freelance"
      : general.availability;

  return (
    <main className="site-shell" id="top">
      <div className="portfolio-board">
        <header className="topbar">
          <a className="mini-brand" href="#top">Creative portfolio</a>
          <div className="top-line" />
          <a className="availability" href="#contact">{availability} <i /></a>
        </header>

        <section className="hero-poster" aria-labelledby="portfolio-title">
          <div className="hero-lightfield" aria-hidden="true"><span /><span /><span /></div>
          <h1 id="portfolio-title" aria-label={heroTitle}>
            {Array.from(heroTitle).map((letter, index) => (
              <span aria-hidden="true" key={`${letter}-${index}`}>
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </h1>
          <div className="hero-grid">
            <div className="hero-left">
              <div>
                <p className="hero-discipline">{general.discipline}</p>
                <p className="micro-copy">USER EXPERIENCE<br />USER INTERFACE<br />WEB DEVELOPMENT</p>
                <span className="red-rule" />
              </div>
              <blockquote><span>“</span>{general.quote}<em>MF</em></blockquote>
            </div>

            <div className="hero-portrait">
              <div className="portrait-disc" />
              <img src={general.portraitUrl} alt={general.name} className="portrait-photo" />
            </div>

            <div className="hero-right">
              <div className="name-block"><p>{general.name}</p><span>{general.role}</span></div>
              <p className="hero-bio">{general.bio}</p>
              <div className="hero-meta">
                <div><Search /><strong>4+</strong><span>YEARS EXPERIENCE</span></div>
                <div><Mail /><strong>{content.projects.length * 7}+</strong><span>PROJECTS COMPLETED</span></div>
                <div><Code2 /><strong>12+</strong><span>HAPPY CLIENTS</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="board-section services" id="services">
          <div className="section-title"><h2>WHAT I DO</h2><span /></div>
          <div className="service-grid">
            {content.services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return <article key={`${service.title}-${index}`}><Icon /><h3>{service.title}</h3><p>{service.text}</p></article>;
            })}
          </div>
        </section>

        <section className="work-process-grid">
          <div className="board-section process-panel" id="process">
            <div className="section-title"><h2>MY PROCESS</h2><span /></div>
            <div className="process-list">
              {content.process.map((step, index) => {
                const Icon = processIcons[index % processIcons.length];
                return <article key={`${step.title}-${index}`}><strong>{String(index + 1).padStart(2, "0")}</strong><div className="process-icon"><Icon /></div><div><h3>{step.title}</h3><p>{step.text}</p></div></article>;
              })}
            </div>
          </div>

          <div className="board-section projects-panel" id="work">
            <div className="section-title section-title-row">
              <div><h2>FEATURED WORK</h2><span /></div>
              {links.github && <a href={links.github} target="_blank" rel="noreferrer">View GitHub <ArrowUpRight /></a>}
            </div>
            <div className="project-grid">
              {content.projects.map((project, index) => {
                const card = <><div className={`project-visual ${projectClasses[index % projectClasses.length]}`}>{project.imageUrl ? <img src={project.imageUrl} alt="" className="project-image" /> : <><span>{`PROJECT / ${String(index + 1).padStart(2, "0")}`}</span><strong>{project.title}</strong><i /><i /><i /></>}</div><h3>{project.title}</h3><p>{project.type}</p></>;
                return project.url ? <a className="project-card" href={project.url} target="_blank" rel="noreferrer" key={`${project.title}-${index}`}>{card}</a> : <article className="project-card" key={`${project.title}-${index}`}>{card}</article>;
              })}
            </div>
          </div>
        </section>

        <section className="about-tools-grid">
          <div className="board-section about-panel" id="about">
            <div className="section-title"><h2>ABOUT ME</h2><span /></div>
            <div className="about-content">
              <div className="about-image"><img src={aboutImageUrl} alt="Nameless king archive poster" /></div>
              <div><p>{about.intro}</p><p>{about.description}</p><ul>{about.traits.map((trait, index) => <li key={`${trait}-${index}`}><Check /> {trait}</li>)}</ul></div>
            </div>
          </div>

          <div className="board-section tools-panel" id="tools">
            <div className="section-title"><h2>TOOLS I USE</h2><span /></div>
            <div className="tool-list">{content.tools.slice(0, 5).map((tool, index) => <div key={`${tool}-${index}`}><span>{toolMarks[index] ?? String(index + 1)}</span><strong>{tool}</strong></div>)}</div>
            <blockquote><Sparkles /> “{general.quote}”</blockquote>
          </div>
        </section>

        <footer className="contact-footer" id="contact">
          <div>
            <div className="section-title"><h2>LET’S COLLABORATE</h2><span /></div>
            <p>Have a project in mind or just want to say hello? I’d love to hear from you.</p>
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer"><ArrowUpRight /> LinkedIn</a>}
            {links.github && <a href={links.github} target="_blank" rel="noreferrer"><Code2 /> GitHub repository</a>}
            {links.email && <a href={`mailto:${links.email}`}><Mail /> {links.email}</a>}
          </div>
          <div className="scan-panel">
            <h2>SCAN TO CONNECT</h2>
            <div>
              {links.linkedin && <a className="qr-card" href={links.linkedin} target="_blank" rel="noreferrer"><span>in</span><strong>LINKEDIN</strong></a>}
              {links.github && <a className="qr-card" href={links.github} target="_blank" rel="noreferrer"><span>gh</span><strong>GITHUB</strong></a>}
            </div>
          </div>
          <div className="contact-center"><Sparkles /><p>{content.footerTagline}</p><span>MF</span></div>
          <div className="contact-cta"><Mail /><p>{general.role}</p>{links.github && <a href={links.github} target="_blank" rel="noreferrer">Explore my code <ExternalLink /></a>}</div>
        </footer>
      </div>
    </main>
  );
}
