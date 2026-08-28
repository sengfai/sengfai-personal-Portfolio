export type ServiceItem = { title: string; text: string };
export type ProcessItem = { title: string; text: string };
export type ProjectItem = { title: string; type: string; url: string; imageUrl: string };
export type JournalItem = { title: string; date: string; category: string; excerpt: string; body: string };

export type PortfolioContent = {
  general: {
    heroTitle: string;
    discipline: string;
    name: string;
    role: string;
    bio: string;
    quote: string;
    location: string;
    education: string;
    availability: string;
    portraitUrl: string;
  };
  about: { intro: string; description: string; traits: string[] };
  services: ServiceItem[];
  process: ProcessItem[];
  projects: ProjectItem[];
  journal: JournalItem[];
  tools: string[];
  links: { linkedin: string; github: string; email: string };
  footerTagline: string;
};

export const DEFAULT_CONTENT: PortfolioContent = {
  general: {
    heroTitle: "PORTFOLIO",
    discipline: "UI / UX / WEB",
    name: "MERSENGFAI",
    role: "WEB DESIGNER & DEVELOPER",
    bio: "I create modern digital products that connect thoughtful interface design with reliable web development.",
    quote: "I DESIGN DIGITAL EXPERIENCES THAT ARE INTUITIVE, BEAUTIFUL, AND IMPACTFUL.",
    location: "PHNOM PENH, CAMBODIA",
    education: "ITC, CLASS OF 2019",
    availability: "Available for freelance",
    portraitUrl: "/mersengfai-portrait-hero.png",
  },
  about: {
    intro: "I'm a web designer and developer focused on creating modern, accessible, and user-friendly digital experiences.",
    description: "I work as a Web Design and Development Officer under the Talents for Digital Economy program at the General Secretariat of the Digital Economy and Business Committee.",
    traits: ["Detail-oriented", "Practical problem solver", "Design and code", "Always learning"],
  },
  services: [
    { title: "UI/UX Design", text: "Clear interfaces shaped around real users and practical goals." },
    { title: "Web Design", text: "Responsive visual systems that feel consistent on every screen." },
    { title: "Interaction Design", text: "Purposeful motion, feedback, and details that make products feel alive." },
    { title: "Prototyping", text: "Turning ideas into clickable flows and user journeys." },
    { title: "Design Systems", text: "Reusable patterns that keep growing products organized and coherent." },
  ],
  process: [
    { title: "Discover", text: "Understand the goal, audience, and project requirements." },
    { title: "Define", text: "Organize content, priorities, and the right product structure." },
    { title: "Design", text: "Craft a focused visual direction and responsive interface." },
    { title: "Develop", text: "Build the experience with clean and maintainable code." },
    { title: "Deliver", text: "Test, refine, optimize, and prepare a confident launch." },
  ],
  projects: [
    { title: "DEBC Website", type: "Web design / Development", url: "https://www.digitaleconomy.gov.kh/", imageUrl: "" },
    { title: "HR Management", type: "Product design / Frontend", url: "", imageUrl: "" },
    { title: "Informal Economy", type: "Web design / Development", url: "", imageUrl: "" },
    { title: "Digital Content CMS", type: "Frontend / Integration", url: "", imageUrl: "" },
  ],
  journal: [
    {
      title: "Designing Useful Interfaces",
      date: "2026-08-28",
      category: "Design Notes",
      excerpt: "A short reflection on making portfolio interfaces feel clear, visual, and practical.",
      body: "Good interface design starts with hierarchy. I try to make each section easy to scan first, then add motion and detail only where it helps the story feel alive.",
    },
    {
      title: "Building With Motion",
      date: "2026-08-20",
      category: "Development",
      excerpt: "How subtle animation can make a static portfolio feel more memorable without hurting readability.",
      body: "Motion works best when it supports the structure. Glowing rails, small hover states, and responsive spacing can make the page feel premium while keeping the content readable.",
    },
  ],
  tools: [
    "JavaScript",
    "TypeScript",
    "PHP",
    "SQL",
    "React",
    "Next.js",
    "Vue.js 3",
    "Nuxt3",
    "Tailwind CSS",
    "Bootstrap",
    "Reactstrap",
    "Pinia",
    "Vite",
    "Laravel",
    "Payload CMS",
    "Supabase",
    "REST APIs",
    "PostgreSQL",
    "MySQL",
    "Supabase PostgreSQL",
    "Node.js",
    "Docker",
    "pgAdmin",
    "Google SEO",
    "Git",
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/fai-merseng-3b7858153/",
    github: "https://github.com/sengfai/main",
    email: "",
  },
  footerTagline: "DESIGNING EXPERIENCES. BUILDING CONNECTIONS.",
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeTools(value: unknown) {
  if (!Array.isArray(value)) return DEFAULT_CONTENT.tools;
  const tools = value.slice(0, 40).map(String);
  const legacyDefaults = ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Webflow"];
  return tools.length === legacyDefaults.length && tools.every((tool, index) => tool === legacyDefaults[index])
    ? DEFAULT_CONTENT.tools
    : tools;
}

export function normalizeContent(value: unknown): PortfolioContent {
  if (!value || typeof value !== "object") return DEFAULT_CONTENT;
  const input = value as Partial<PortfolioContent>;
  return {
    ...DEFAULT_CONTENT,
    ...input,
    general: { ...DEFAULT_CONTENT.general, ...(input.general ?? {}) },
    about: { ...DEFAULT_CONTENT.about, ...(input.about ?? {}) },
    links: { ...DEFAULT_CONTENT.links, ...(input.links ?? {}) },
    services: Array.isArray(input.services)
      ? input.services.slice(0, 12).map((item) => ({
          title: text((item as Partial<ServiceItem>)?.title, "Untitled service"),
          text: text((item as Partial<ServiceItem>)?.text),
        }))
      : DEFAULT_CONTENT.services,
    process: Array.isArray(input.process)
      ? input.process.slice(0, 12).map((item) => ({
          title: text((item as Partial<ProcessItem>)?.title, "Untitled step"),
          text: text((item as Partial<ProcessItem>)?.text),
        }))
      : DEFAULT_CONTENT.process,
    projects: Array.isArray(input.projects)
      ? input.projects.slice(0, 20).map((item) => ({
          title: text((item as Partial<ProjectItem>)?.title, "Untitled project"),
          type: text((item as Partial<ProjectItem>)?.type, "Web design"),
          url: text((item as Partial<ProjectItem>)?.url),
          imageUrl: text((item as Partial<ProjectItem>)?.imageUrl),
        }))
      : DEFAULT_CONTENT.projects,
    journal: Array.isArray(input.journal)
      ? input.journal.slice(0, 60).map((item) => ({
          title: text((item as Partial<JournalItem>)?.title, "Untitled post"),
          date: text((item as Partial<JournalItem>)?.date),
          category: text((item as Partial<JournalItem>)?.category, "Update"),
          excerpt: text((item as Partial<JournalItem>)?.excerpt),
          body: text((item as Partial<JournalItem>)?.body),
        }))
      : DEFAULT_CONTENT.journal,
    tools: normalizeTools(input.tools),
  };
}
