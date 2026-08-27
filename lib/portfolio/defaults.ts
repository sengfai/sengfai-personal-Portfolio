export type ServiceItem = { title: string; text: string };
export type ProcessItem = { title: string; text: string };
export type ProjectItem = { title: string; type: string; url: string; imageUrl: string };

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
    intro: "I’m a web designer and developer focused on creating modern, accessible, and user-friendly digital experiences.",
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
  tools: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Webflow"],
  links: {
    linkedin: "https://www.linkedin.com/in/fai-merseng-3b7858153/",
    github: "https://github.com/sengfai/main",
    email: "",
  },
  footerTagline: "DESIGNING EXPERIENCES. BUILDING CONNECTIONS.",
};

export function normalizeContent(value: unknown): PortfolioContent {
  if (!value || typeof value !== "object") return DEFAULT_CONTENT;
  const input = value as Partial<PortfolioContent>;
  return {
    ...DEFAULT_CONTENT,
    ...input,
    general: { ...DEFAULT_CONTENT.general, ...(input.general ?? {}) },
    about: { ...DEFAULT_CONTENT.about, ...(input.about ?? {}) },
    links: { ...DEFAULT_CONTENT.links, ...(input.links ?? {}) },
    services: Array.isArray(input.services) ? input.services.slice(0, 12) : DEFAULT_CONTENT.services,
    process: Array.isArray(input.process) ? input.process.slice(0, 12) : DEFAULT_CONTENT.process,
    projects: Array.isArray(input.projects) ? input.projects.slice(0, 20) : DEFAULT_CONTENT.projects,
    tools: Array.isArray(input.tools) ? input.tools.slice(0, 40).map(String) : DEFAULT_CONTENT.tools,
  };
}
