"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JournalItem, PortfolioContent } from "@/lib/portfolio/defaults";

const ADMIN_TABS = new Set(["general", "about", "services", "process", "projects", "journal", "tools"]);

type JournalView =
  | { mode: "list" }
  | { mode: "create" | "edit"; index: number };

function AdminIcon({ children, spin = false }: { children: string; spin?: boolean }) {
  return <span className={spin ? "admin-icon spin" : "admin-icon"} aria-hidden="true">{children}</span>;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <Textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function UploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    setLoading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const result = (await response.json()) as { url?: string; error?: string };
    setLoading(false);
    if (!response.ok || !result.url) return alert(result.error ?? "Upload failed");
    onUploaded(result.url);
  }

  return (
    <label className="upload-button">
      {loading ? <AdminIcon spin>o</AdminIcon> : <AdminIcon>^</AdminIcon>}
      <span>{loading ? "Uploading..." : "Upload image"}</span>
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => upload(event.target.files?.[0])} />
    </label>
  );
}

function todayInputValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createJournalPost(): JournalItem {
  return {
    title: "New journal post",
    date: todayInputValue(),
    category: "Update",
    excerpt: "Short summary for the journal page.",
    body: "Write the full journal entry here.",
  };
}

function journalTime(value: string) {
  const parsed = Date.parse(`${value}T00:00:00`);
  return Number.isNaN(parsed) ? -Infinity : parsed;
}

function readAdminLocation(journalLength: number): { tab: string; journalView: JournalView } {
  if (typeof window === "undefined") return { tab: "general", journalView: { mode: "list" } };

  const params = new URLSearchParams(window.location.search);
  const requestedTab = params.get("tab");
  const tab = requestedTab && ADMIN_TABS.has(requestedTab) ? requestedTab : "general";
  const requestedJournalMode = params.get("journal");
  const requestedPost = Number(params.get("post"));
  const hasPostIndex = Number.isInteger(requestedPost) && requestedPost >= 0 && requestedPost < journalLength;

  if (tab === "journal" && requestedJournalMode === "create" && hasPostIndex) {
    return { tab, journalView: { mode: "create", index: requestedPost } };
  }

  if (tab === "journal" && requestedJournalMode === "edit" && hasPostIndex) {
    return { tab, journalView: { mode: "edit", index: requestedPost } };
  }

  return { tab, journalView: { mode: "list" } };
}

function writeAdminLocation(tab: string, journalView: JournalView, replace = false) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);

  if (tab === "journal" && journalView.mode !== "list") {
    url.searchParams.set("journal", journalView.mode);
    url.searchParams.set("post", String(journalView.index));
  } else {
    url.searchParams.delete("journal");
    url.searchParams.delete("post");
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (replace) window.history.replaceState(null, "", nextUrl);
  else window.history.pushState(null, "", nextUrl);
}

function formatJournalDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value || "No date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function AdminClient({
  authenticated,
  initialContent,
}: {
  authenticated: boolean;
  initialContent: PortfolioContent | null;
}) {
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [journalView, setJournalView] = useState<JournalView>({ mode: "list" });
  const journalCount = content?.journal.length ?? 0;

  const sortedJournalRows = useMemo(() => {
    if (!content) return [];
    return content.journal
      .map((post, index) => ({ post, index }))
      .sort((a, b) => {
        const dateDifference = journalTime(b.post.date) - journalTime(a.post.date);
        if (dateDifference !== 0) return dateDifference;
        return a.index - b.index;
      });
  }, [content]);

  useEffect(() => {
    if (!loggedIn) return;

    const applyLocationState = () => {
      const next = readAdminLocation(journalCount);
      setActiveTab(next.tab);
      setJournalView(next.journalView);
    };

    applyLocationState();
    window.addEventListener("popstate", applyLocationState);
    return () => window.removeEventListener("popstate", applyLocationState);
  }, [loggedIn, journalCount]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) return setMessage(result.error ?? "Unable to sign in");
    const data = (await fetch("/api/admin/content").then((item) => item.json())) as { content: PortfolioContent };
    setContent(data.content);
    setLoggedIn(true);
    setPassword("");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setContent(null);
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const result = (await response.json()) as { content?: PortfolioContent; error?: string };
    setSaving(false);
    if (!response.ok) return setMessage(result.error ?? "Unable to save changes");
    if (result.content) setContent(result.content);
    setMessage("Changes saved. Refresh the portfolio to see the update.");
  }

  function handleTabChange(value: string) {
    setActiveTab(value);
    const nextJournalView = { mode: "list" } as const;
    setJournalView(nextJournalView);
    writeAdminLocation(value, nextJournalView);
  }

  function updateJournal(index: number, value: JournalItem) {
    if (!content) return;
    const journal = [...content.journal];
    journal[index] = value;
    setContent({ ...content, journal });
  }

  function removeJournalPost(index: number) {
    if (!content) return;
    setContent({ ...content, journal: content.journal.filter((_, itemIndex) => itemIndex !== index) });
    setJournalView({ mode: "list" });
    writeAdminLocation("journal", { mode: "list" });
  }

  function openJournalEditor(mode: "create" | "edit", index: number) {
    const nextJournalView = { mode, index };
    setActiveTab("journal");
    setJournalView(nextJournalView);
    writeAdminLocation("journal", nextJournalView);
  }

  function addJournalPost() {
    if (!content) return;
    const nextContent = { ...content, journal: [createJournalPost(), ...content.journal] };
    setContent(nextContent);
    openJournalEditor("create", 0);
  }

  function showJournalTable() {
    const nextJournalView = { mode: "list" } as const;
    setJournalView(nextJournalView);
    writeAdminLocation("journal", nextJournalView);
  }

  if (!loggedIn || !content) {
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <div className="admin-mark">MF<span>.</span></div>
          <p>PORTFOLIO BACKOFFICE</p>
          <h1>Welcome back.</h1>
          <span>Enter your admin password to manage your website content.</span>
          <Input
            type="password"
            value={password}
            autoFocus
            placeholder="Admin password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit">Sign in</Button>
          {message && <small>{message}</small>}
          <Link href="/"><AdminIcon>&lt;</AdminIcon> Return to portfolio</Link>
        </form>
      </main>
    );
  }

  const updateGeneral = (key: keyof PortfolioContent["general"], value: string) => {
    setContent({ ...content, general: { ...content.general, [key]: value } });
  };
  const updateAbout = (key: "intro" | "description", value: string) => {
    setContent({ ...content, about: { ...content.about, [key]: value } });
  };
  const activeJournalPost = journalView.mode === "list" ? null : content.journal[journalView.index];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p>MF CONTENT MANAGER</p>
          <h1>Portfolio backoffice</h1>
        </div>
        <div>
          <a href="/" target="_blank">View website</a>
          <Button variant="outline" onClick={logout}><AdminIcon>&gt;</AdminIcon> Sign out</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <AdminIcon spin>o</AdminIcon> : <AdminIcon>#</AdminIcon>}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </header>

      {message && <div className="admin-message">{message}</div>}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="admin-tabs">
        <TabsList variant="line">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="tools">Tools & links</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <section className="admin-card">
            <h2>Hero and identity</h2>
            <div className="admin-grid">
              <Field label="Large heading" value={content.general.heroTitle} onChange={(v) => updateGeneral("heroTitle", v)} />
              <Field label="Discipline" value={content.general.discipline} onChange={(v) => updateGeneral("discipline", v)} />
              <Field label="Display name" value={content.general.name} onChange={(v) => updateGeneral("name", v)} />
              <Field label="Professional title" value={content.general.role} onChange={(v) => updateGeneral("role", v)} />
              <Field label="Location" value={content.general.location} onChange={(v) => updateGeneral("location", v)} />
              <Field label="Education" value={content.general.education} onChange={(v) => updateGeneral("education", v)} />
              <Field label="Availability text" value={content.general.availability} onChange={(v) => updateGeneral("availability", v)} />
              <Field label="Short biography" value={content.general.bio} multiline onChange={(v) => updateGeneral("bio", v)} />
              <Field label="Hero quote" value={content.general.quote} multiline onChange={(v) => updateGeneral("quote", v)} />
            </div>
            <div className="image-setting">
              <div>{content.general.portraitUrl && <img src={content.general.portraitUrl} alt="Current portrait" />}</div>
              <div>
                <strong>Hero portrait</strong>
                <p>JPG, PNG, or WebP up to 8 MB.</p>
                <UploadButton onUploaded={(url) => updateGeneral("portraitUrl", url)} />
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="about">
          <section className="admin-card">
            <h2>About me</h2>
            <Field label="Introduction" value={content.about.intro} multiline onChange={(v) => updateAbout("intro", v)} />
            <Field label="Professional background" value={content.about.description} multiline onChange={(v) => updateAbout("description", v)} />
            <h3>Traits</h3>
            <div className="repeat-list">
              {content.about.traits.map((trait, index) => (
                <div key={index}>
                  <Input
                    value={trait}
                    onChange={(e) => {
                      const traits = [...content.about.traits];
                      traits[index] = e.target.value;
                      setContent({ ...content, about: { ...content.about, traits } });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove trait"
                    onClick={() => setContent({ ...content, about: { ...content.about, traits: content.about.traits.filter((_, i) => i !== index) } })}
                  >
                    <AdminIcon>x</AdminIcon>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => setContent({ ...content, about: { ...content.about, traits: [...content.about.traits, "New trait"] } })}>
              <AdminIcon>+</AdminIcon> Add trait
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="services">
          <section className="admin-card">
            <div className="card-heading">
              <h2>Services</h2>
              <Button variant="outline" onClick={() => setContent({ ...content, services: [...content.services, { title: "New service", text: "Service description" }] })}>
                <AdminIcon>+</AdminIcon> Add service
              </Button>
            </div>
            <div className="editor-cards">
              {content.services.map((item, index) => (
                <article key={index}>
                  <div className="item-number">{String(index + 1).padStart(2, "0")}</div>
                  <Field
                    label="Title"
                    value={item.title}
                    onChange={(v) => {
                      const services = [...content.services];
                      services[index] = { ...item, title: v };
                      setContent({ ...content, services });
                    }}
                  />
                  <Field
                    label="Description"
                    value={item.text}
                    multiline
                    onChange={(v) => {
                      const services = [...content.services];
                      services[index] = { ...item, text: v };
                      setContent({ ...content, services });
                    }}
                  />
                  <Button variant="ghost" onClick={() => setContent({ ...content, services: content.services.filter((_, i) => i !== index) })}>
                    <AdminIcon>x</AdminIcon> Remove
                  </Button>
                </article>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="process">
          <section className="admin-card">
            <div className="card-heading">
              <h2>Working process</h2>
              <Button variant="outline" onClick={() => setContent({ ...content, process: [...content.process, { title: "New step", text: "Step description" }] })}>
                <AdminIcon>+</AdminIcon> Add step
              </Button>
            </div>
            <div className="editor-cards">
              {content.process.map((item, index) => (
                <article key={index}>
                  <div className="item-number">{String(index + 1).padStart(2, "0")}</div>
                  <Field
                    label="Step name"
                    value={item.title}
                    onChange={(v) => {
                      const process = [...content.process];
                      process[index] = { ...item, title: v };
                      setContent({ ...content, process });
                    }}
                  />
                  <Field
                    label="Description"
                    value={item.text}
                    multiline
                    onChange={(v) => {
                      const process = [...content.process];
                      process[index] = { ...item, text: v };
                      setContent({ ...content, process });
                    }}
                  />
                  <Button variant="ghost" onClick={() => setContent({ ...content, process: content.process.filter((_, i) => i !== index) })}>
                    <AdminIcon>x</AdminIcon> Remove
                  </Button>
                </article>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="projects">
          <section className="admin-card">
            <div className="card-heading">
              <h2>Featured projects</h2>
              <Button variant="outline" onClick={() => setContent({ ...content, projects: [...content.projects, { title: "New project", type: "Web design", url: "", imageUrl: "" }] })}>
                <AdminIcon>+</AdminIcon> Add project
              </Button>
            </div>
            <div className="editor-cards project-editors">
              {content.projects.map((item, index) => (
                <article key={index}>
                  <div className="item-number">{String(index + 1).padStart(2, "0")}</div>
                  {item.imageUrl && <img src={item.imageUrl} alt="Project" />}
                  <UploadButton
                    onUploaded={(url) => {
                      const projects = [...content.projects];
                      projects[index] = { ...item, imageUrl: url };
                      setContent({ ...content, projects });
                    }}
                  />
                  <Field
                    label="Project name"
                    value={item.title}
                    onChange={(v) => {
                      const projects = [...content.projects];
                      projects[index] = { ...item, title: v };
                      setContent({ ...content, projects });
                    }}
                  />
                  <Field
                    label="Category / role"
                    value={item.type}
                    onChange={(v) => {
                      const projects = [...content.projects];
                      projects[index] = { ...item, type: v };
                      setContent({ ...content, projects });
                    }}
                  />
                  <Field
                    label="Project URL"
                    value={item.url}
                    placeholder="https://"
                    onChange={(v) => {
                      const projects = [...content.projects];
                      projects[index] = { ...item, url: v };
                      setContent({ ...content, projects });
                    }}
                  />
                  <Button variant="ghost" onClick={() => setContent({ ...content, projects: content.projects.filter((_, i) => i !== index) })}>
                    <AdminIcon>x</AdminIcon> Remove
                  </Button>
                </article>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="journal">
          <section className="admin-card">
            {journalView.mode === "list" ? (
              <>
                <div className="card-heading">
                  <div>
                    <h2>Journal posts</h2>
                    <p className="admin-subtle">Newest posts stay on top by date.</p>
                  </div>
                  <Button variant="outline" onClick={addJournalPost}><AdminIcon>+</AdminIcon> Add post</Button>
                </div>

                <div className="journal-table-wrap">
                  <Table className="journal-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="journal-table-number">No.</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Excerpt</TableHead>
                        <TableHead className="journal-table-actions">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedJournalRows.length > 0 ? (
                        sortedJournalRows.map(({ post, index }, rowIndex) => (
                          <TableRow key={`${post.title}-${post.date}-${index}`}>
                            <TableCell className="journal-table-number">{String(rowIndex + 1).padStart(2, "0")}</TableCell>
                            <TableCell>{formatJournalDate(post.date)}</TableCell>
                            <TableCell><strong>{post.title || "Untitled post"}</strong></TableCell>
                            <TableCell><span className="journal-category-pill">{post.category || "Update"}</span></TableCell>
                            <TableCell className="journal-excerpt-cell">{post.excerpt || "No excerpt yet."}</TableCell>
                            <TableCell>
                              <div className="journal-row-actions">
                                <Button variant="outline" onClick={() => openJournalEditor("edit", index)}><AdminIcon>&gt;</AdminIcon> Edit</Button>
                                <Button variant="ghost" onClick={() => removeJournalPost(index)}><AdminIcon>x</AdminIcon> Remove</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="journal-empty-cell">No journal posts yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : activeJournalPost ? (
              <>
                <div className="card-heading journal-editor-heading">
                  <div>
                    <button type="button" className="back-link-button" onClick={showJournalTable}>
                      <AdminIcon>&lt;</AdminIcon> Journal table
                    </button>
                    <h2>{journalView.mode === "create" ? "Create journal post" : "Edit journal post"}</h2>
                  </div>
                  <Button variant="ghost" onClick={() => removeJournalPost(journalView.index)}><AdminIcon>x</AdminIcon> Remove</Button>
                </div>

                <div className="journal-form-panel">
                  <Field
                    label="Post title"
                    value={activeJournalPost.title}
                    onChange={(v) => updateJournal(journalView.index, { ...activeJournalPost, title: v })}
                  />
                  <div className="admin-grid">
                    <Field
                      label="Date"
                      value={activeJournalPost.date}
                      placeholder="YYYY-MM-DD"
                      onChange={(v) => updateJournal(journalView.index, { ...activeJournalPost, date: v })}
                    />
                    <Field
                      label="Category"
                      value={activeJournalPost.category}
                      onChange={(v) => updateJournal(journalView.index, { ...activeJournalPost, category: v })}
                    />
                  </div>
                  <Field
                    label="Excerpt"
                    value={activeJournalPost.excerpt}
                    multiline
                    onChange={(v) => updateJournal(journalView.index, { ...activeJournalPost, excerpt: v })}
                  />
                  <Field
                    label="Body"
                    value={activeJournalPost.body}
                    multiline
                    onChange={(v) => updateJournal(journalView.index, { ...activeJournalPost, body: v })}
                  />
                </div>
              </>
            ) : (
              <div className="journal-empty-state">
                <h2>Post not found</h2>
                <Button variant="outline" onClick={showJournalTable}><AdminIcon>&lt;</AdminIcon> Back to journal table</Button>
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="tools">
          <section className="admin-card">
            <h2>Tools and contact links</h2>
            <div className="admin-grid">
              <Field label="LinkedIn URL" value={content.links.linkedin} onChange={(v) => setContent({ ...content, links: { ...content.links, linkedin: v } })} />
              <Field label="GitHub URL" value={content.links.github} onChange={(v) => setContent({ ...content, links: { ...content.links, github: v } })} />
              <Field label="Public email" value={content.links.email} onChange={(v) => setContent({ ...content, links: { ...content.links, email: v } })} />
              <Field label="Footer tagline" value={content.footerTagline} onChange={(v) => setContent({ ...content, footerTagline: v })} />
            </div>
            <h3>Tools and technologies</h3>
            <div className="repeat-list">
              {content.tools.map((tool, index) => (
                <div key={index}>
                  <Input
                    value={tool}
                    onChange={(e) => {
                      const tools = [...content.tools];
                      tools[index] = e.target.value;
                      setContent({ ...content, tools });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove tool"
                    onClick={() => setContent({ ...content, tools: content.tools.filter((_, i) => i !== index) })}
                  >
                    <AdminIcon>x</AdminIcon>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => setContent({ ...content, tools: [...content.tools, "New tool"] })}>
              <AdminIcon>+</AdminIcon> Add tool
            </Button>
          </section>
        </TabsContent>
      </Tabs>

      <div className="mobile-save">
        <Button onClick={save} disabled={saving}>
          {saving ? <AdminIcon spin>o</AdminIcon> : <AdminIcon>#</AdminIcon>} Save changes
        </Button>
      </div>
    </main>
  );
}
