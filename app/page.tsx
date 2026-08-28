import {
  ArrowRight, ArrowUpRight, Boxes, Check, CloudUpload, Code2, Database, ExternalLink,
  LayoutGrid, Mail, MonitorSmartphone, MousePointer2, Network, Palette, PenTool,
  Search, SearchCheck, Sparkles, type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio/data";
import { getPortfolioQuote } from "@/lib/portfolio/quotes";

export const dynamic = "force-dynamic";

const serviceIcons = [Palette, MonitorSmartphone, MousePointer2, Boxes, LayoutGrid];
const processIcons = [Search, LayoutGrid, PenTool, Code2, CloudUpload];
const projectClasses = ["project-a", "project-b", "project-c", "project-d"];
const aboutImageUrl = "/about-nameless-king.png";
const simpleIconUrl = (slug: string, color = "auto") => `https://cdn.simpleicons.org/${slug}/${color}`;
const toolLogos: Record<string, { src?: string; mark: string; color: string; Icon?: LucideIcon }> = {
  javascript: { src: simpleIconUrl("javascript"), mark: "JS", color: "#f7df1e" },
  typescript: { src: simpleIconUrl("typescript"), mark: "TS", color: "#3178c6" },
  php: { src: simpleIconUrl("php"), mark: "PHP", color: "#777bb4" },
  sql: { mark: "SQL", color: "#58d5cf", Icon: Database },
  react: { src: simpleIconUrl("react"), mark: "Re", color: "#61dafb" },
  "next.js": { src: simpleIconUrl("nextdotjs", "ffffff"), mark: "Nx", color: "#ffffff" },
  "vue.js 3": { src: simpleIconUrl("vuedotjs"), mark: "Vue", color: "#4fc08d" },
  nuxt3: { src: simpleIconUrl("nuxt"), mark: "Nu", color: "#00dc82" },
  "tailwind css": { src: simpleIconUrl("tailwindcss"), mark: "Tw", color: "#06b6d4" },
  bootstrap: { src: simpleIconUrl("bootstrap"), mark: "Bs", color: "#7952b3" },
  reactstrap: { src: simpleIconUrl("bootstrap"), mark: "Rs", color: "#61dafb" },
  pinia: { src: simpleIconUrl("pinia"), mark: "Pi", color: "#ffd859" },
  vite: { src: simpleIconUrl("vite"), mark: "Vi", color: "#646cff" },
  laravel: { src: simpleIconUrl("laravel"), mark: "Lv", color: "#ff2d20" },
  "payload cms": { src: simpleIconUrl("payloadcms", "ffffff"), mark: "Pc", color: "#ffffff" },
  supabase: { src: simpleIconUrl("supabase"), mark: "Sb", color: "#3fcf8e" },
  "supabase rest apis": { src: simpleIconUrl("supabase"), mark: "API", color: "#3fcf8e" },
  "rest apis": { mark: "API", color: "#b8894b", Icon: Network },
  postgresql: { src: simpleIconUrl("postgresql"), mark: "Pg", color: "#4169e1" },
  mysql: { src: simpleIconUrl("mysql"), mark: "My", color: "#4479a1" },
  "supabase postgresql": { src: simpleIconUrl("postgresql"), mark: "SP", color: "#3fcf8e" },
  "node.js": { src: simpleIconUrl("nodedotjs"), mark: "Nd", color: "#5fa04e" },
  docker: { src: simpleIconUrl("docker"), mark: "Do", color: "#2496ed" },
  pgadmin: { src: simpleIconUrl("postgresql"), mark: "pA", color: "#4169e1" },
  "google seo": { src: simpleIconUrl("google"), mark: "G", color: "#4285f4", Icon: SearchCheck },
  git: { src: simpleIconUrl("git"), mark: "Gt", color: "#f05032" },
};

function getToolLogo(tool: string) {
  const logo = toolLogos[tool.trim().toLowerCase()];
  if (logo) return logo;
  const mark = tool
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return { mark: mark || "TL", color: "#cf343f", Icon: Code2 };
}

export default async function Home() {
  const content = await getPortfolioContent();
  const { general, about, links } = content;
  const quote = await getPortfolioQuote();
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
        <header className="topbar mb-5">
          <nav className="top-nav" aria-label="Main navigation">
            <Link href="/projects">Projects</Link>
            <Link href="/journal">Journal</Link>
            <a href="#contact">Contact</a>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation menu">
              <span className="hamburger-lines"><i /><i /><i /></span>
              <span>Menu</span>
            </summary>
            <nav aria-label="Mobile navigation">
              <Link href="/projects">Projects</Link>
              <Link href="/journal">Journal</Link>
              <a href="#contact">Contact</a>
            </nav>
          </details>
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
              <blockquote>
                <span>&quot;</span>
                {quote.text}
                <em className="signature-mark">{quote.author}</em>
              </blockquote>
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
              <Link href="/projects">View more projects <ArrowRight /></Link>
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
            <div className="tool-list">
              {content.tools.map((tool, index) => {
                const logo = getToolLogo(tool);
                const Icon = logo.Icon;
                return (
                  <div
                    className="tool-card"
                    key={`${tool}-${index}`}
                    style={{ "--tool-accent": logo.color } as CSSProperties}
                  >
                    <span className="tool-logo">
                      {logo.src ? <img src={logo.src} alt="" loading="lazy" /> : Icon ? <Icon aria-hidden="true" /> : logo.mark}
                    </span>
                    <strong>{tool}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="contact-footer" id="contact">
          <div>
            <div className="section-title"><h2>LET&apos;S COLLABORATE</h2><span /></div>
            <p>Have a project in mind or just want to say hello? I&apos;d love to hear from you.</p>
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer"><ArrowUpRight /> LinkedIn</a>}
            {links.github && <a href={links.github} target="_blank" rel="noreferrer"><Code2 /> GitHub repository</a>}
            {links.email && <a href={`mailto:${links.email}`}><Mail /> {links.email}</a>}
          </div>
          <div className="scan-panel">
            <h2>SCAN TO CONNECT</h2>
            <div>
              {links.linkedin && <a className="qr-card" href={links.linkedin} target="_blank" rel="noreferrer"><span className="qr-image-frame"><img src="/linkedin-qr.png" alt="LinkedIn QR code" loading="lazy" /></span><strong>LINKEDIN</strong></a>}
              {links.github && <a className="qr-card" href={links.github} target="_blank" rel="noreferrer"><span>gh</span><strong>GITHUB</strong></a>}
            </div>
          </div>
          <div className="contact-center"><Sparkles /><p>{content.footerTagline}</p><span className="signature-mark contact-signature">Mersengfai</span></div>
          <div className="contact-cta"><Mail /><p>{general.role}</p>{links.github && <a href={links.github} target="_blank" rel="noreferrer">Explore my code <ExternalLink /></a>}</div>
        </footer>
      </div>
    </main>
  );
}
