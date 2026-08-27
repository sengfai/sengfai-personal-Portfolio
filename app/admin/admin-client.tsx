"use client";

import { useState } from "react";
import { ArrowLeft, ImageUp, Loader2, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PortfolioContent } from "@/lib/portfolio/defaults";

function Field({ label, value, onChange, multiline = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; placeholder?: string }) {
  return <label className="admin-field"><span>{label}</span>{multiline ? <Textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /> : <Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function UploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false);
  async function upload(file?: File) {
    if (!file) return;
    setLoading(true);
    const body = new FormData(); body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const result = await response.json() as { url?: string; error?: string };
    setLoading(false);
    if (!response.ok || !result.url) return alert(result.error ?? "Upload failed");
    onUploaded(result.url);
  }
  return <label className="upload-button">{loading ? <Loader2 className="spin" /> : <ImageUp />}<span>{loading ? "Uploading…" : "Upload image"}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => upload(event.target.files?.[0])} /></label>;
}

export function AdminClient({ authenticated, initialContent }: { authenticated: boolean; initialContent: PortfolioContent | null }) {
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function login(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) return setMessage(result.error ?? "Unable to sign in");
    const data = await fetch("/api/admin/content").then((item) => item.json()) as { content: PortfolioContent };
    setContent(data.content); setLoggedIn(true); setPassword("");
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setLoggedIn(false); setContent(null); }
  async function save() {
    if (!content) return;
    setSaving(true); setMessage("");
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const result = await response.json() as { content?: PortfolioContent; error?: string };
    setSaving(false);
    if (!response.ok) return setMessage(result.error ?? "Unable to save changes");
    if (result.content) setContent(result.content);
    setMessage("Changes saved. Refresh the portfolio to see the update.");
  }

  if (!loggedIn || !content) return <main className="admin-login"><form onSubmit={login}><div className="admin-mark">MF<span>.</span></div><p>PORTFOLIO BACKOFFICE</p><h1>Welcome back.</h1><span>Enter your admin password to manage your website content.</span><Input type="password" value={password} autoFocus placeholder="Admin password" onChange={(event) => setPassword(event.target.value)} /><Button type="submit">Sign in</Button>{message && <small>{message}</small>}<a href="/"><ArrowLeft /> Return to portfolio</a></form></main>;

  const updateGeneral = (key: keyof PortfolioContent["general"], value: string) => setContent({ ...content, general: { ...content.general, [key]: value } });
  const updateAbout = (key: "intro" | "description", value: string) => setContent({ ...content, about: { ...content.about, [key]: value } });

  return <main className="admin-page">
    <header className="admin-header"><div><p>MF CONTENT MANAGER</p><h1>Portfolio backoffice</h1></div><div><a href="/" target="_blank">View website</a><Button variant="outline" onClick={logout}><LogOut /> Sign out</Button><Button onClick={save} disabled={saving}>{saving ? <Loader2 className="spin" /> : <Save />}{saving ? "Saving…" : "Save changes"}</Button></div></header>
    {message && <div className="admin-message">{message}</div>}
    <Tabs defaultValue="general" className="admin-tabs">
      <TabsList variant="line"><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="about">About</TabsTrigger><TabsTrigger value="services">Services</TabsTrigger><TabsTrigger value="process">Process</TabsTrigger><TabsTrigger value="projects">Projects</TabsTrigger><TabsTrigger value="tools">Tools & links</TabsTrigger></TabsList>
      <TabsContent value="general"><section className="admin-card"><h2>Hero and identity</h2><div className="admin-grid"><Field label="Large heading" value={content.general.heroTitle} onChange={(v) => updateGeneral("heroTitle", v)} /><Field label="Discipline" value={content.general.discipline} onChange={(v) => updateGeneral("discipline", v)} /><Field label="Display name" value={content.general.name} onChange={(v) => updateGeneral("name", v)} /><Field label="Professional title" value={content.general.role} onChange={(v) => updateGeneral("role", v)} /><Field label="Location" value={content.general.location} onChange={(v) => updateGeneral("location", v)} /><Field label="Education" value={content.general.education} onChange={(v) => updateGeneral("education", v)} /><Field label="Availability text" value={content.general.availability} onChange={(v) => updateGeneral("availability", v)} /><Field label="Short biography" value={content.general.bio} multiline onChange={(v) => updateGeneral("bio", v)} /><Field label="Hero quote" value={content.general.quote} multiline onChange={(v) => updateGeneral("quote", v)} /></div><div className="image-setting"><div>{content.general.portraitUrl && <img src={content.general.portraitUrl} alt="Current portrait" />}</div><div><strong>Hero portrait</strong><p>JPG, PNG, or WebP up to 8 MB.</p><UploadButton onUploaded={(url) => updateGeneral("portraitUrl", url)} /></div></div></section></TabsContent>
      <TabsContent value="about"><section className="admin-card"><h2>About me</h2><Field label="Introduction" value={content.about.intro} multiline onChange={(v) => updateAbout("intro", v)} /><Field label="Professional background" value={content.about.description} multiline onChange={(v) => updateAbout("description", v)} /><h3>Traits</h3><div className="repeat-list">{content.about.traits.map((trait, index) => <div key={index}><Input value={trait} onChange={(e) => { const traits = [...content.about.traits]; traits[index] = e.target.value; setContent({ ...content, about: { ...content.about, traits } }); }} /><Button variant="ghost" size="icon" onClick={() => setContent({ ...content, about: { ...content.about, traits: content.about.traits.filter((_, i) => i !== index) } })}><Trash2 /></Button></div>)}</div><Button variant="outline" onClick={() => setContent({ ...content, about: { ...content.about, traits: [...content.about.traits, "New trait"] } })}><Plus /> Add trait</Button></section></TabsContent>
      <TabsContent value="services"><section className="admin-card"><div className="card-heading"><h2>Services</h2><Button variant="outline" onClick={() => setContent({ ...content, services: [...content.services, { title: "New service", text: "Service description" }] })}><Plus /> Add service</Button></div><div className="editor-cards">{content.services.map((item, index) => <article key={index}><div className="item-number">{String(index + 1).padStart(2, "0")}</div><Field label="Title" value={item.title} onChange={(v) => { const services = [...content.services]; services[index] = { ...item, title: v }; setContent({ ...content, services }); }} /><Field label="Description" value={item.text} multiline onChange={(v) => { const services = [...content.services]; services[index] = { ...item, text: v }; setContent({ ...content, services }); }} /><Button variant="ghost" onClick={() => setContent({ ...content, services: content.services.filter((_, i) => i !== index) })}><Trash2 /> Remove</Button></article>)}</div></section></TabsContent>
      <TabsContent value="process"><section className="admin-card"><div className="card-heading"><h2>Working process</h2><Button variant="outline" onClick={() => setContent({ ...content, process: [...content.process, { title: "New step", text: "Step description" }] })}><Plus /> Add step</Button></div><div className="editor-cards">{content.process.map((item, index) => <article key={index}><div className="item-number">{String(index + 1).padStart(2, "0")}</div><Field label="Step name" value={item.title} onChange={(v) => { const process = [...content.process]; process[index] = { ...item, title: v }; setContent({ ...content, process }); }} /><Field label="Description" value={item.text} multiline onChange={(v) => { const process = [...content.process]; process[index] = { ...item, text: v }; setContent({ ...content, process }); }} /><Button variant="ghost" onClick={() => setContent({ ...content, process: content.process.filter((_, i) => i !== index) })}><Trash2 /> Remove</Button></article>)}</div></section></TabsContent>
      <TabsContent value="projects"><section className="admin-card"><div className="card-heading"><h2>Featured projects</h2><Button variant="outline" onClick={() => setContent({ ...content, projects: [...content.projects, { title: "New project", type: "Web design", url: "", imageUrl: "" }] })}><Plus /> Add project</Button></div><div className="editor-cards project-editors">{content.projects.map((item, index) => <article key={index}><div className="item-number">{String(index + 1).padStart(2, "0")}</div>{item.imageUrl && <img src={item.imageUrl} alt="Project" />}<UploadButton onUploaded={(url) => { const projects = [...content.projects]; projects[index] = { ...item, imageUrl: url }; setContent({ ...content, projects }); }} /><Field label="Project name" value={item.title} onChange={(v) => { const projects = [...content.projects]; projects[index] = { ...item, title: v }; setContent({ ...content, projects }); }} /><Field label="Category / role" value={item.type} onChange={(v) => { const projects = [...content.projects]; projects[index] = { ...item, type: v }; setContent({ ...content, projects }); }} /><Field label="Project URL" value={item.url} placeholder="https://" onChange={(v) => { const projects = [...content.projects]; projects[index] = { ...item, url: v }; setContent({ ...content, projects }); }} /><Button variant="ghost" onClick={() => setContent({ ...content, projects: content.projects.filter((_, i) => i !== index) })}><Trash2 /> Remove</Button></article>)}</div></section></TabsContent>
      <TabsContent value="tools"><section className="admin-card"><h2>Tools and contact links</h2><div className="admin-grid"><Field label="LinkedIn URL" value={content.links.linkedin} onChange={(v) => setContent({ ...content, links: { ...content.links, linkedin: v } })} /><Field label="GitHub URL" value={content.links.github} onChange={(v) => setContent({ ...content, links: { ...content.links, github: v } })} /><Field label="Public email" value={content.links.email} onChange={(v) => setContent({ ...content, links: { ...content.links, email: v } })} /><Field label="Footer tagline" value={content.footerTagline} onChange={(v) => setContent({ ...content, footerTagline: v })} /></div><h3>Tools and technologies</h3><div className="repeat-list">{content.tools.map((tool, index) => <div key={index}><Input value={tool} onChange={(e) => { const tools = [...content.tools]; tools[index] = e.target.value; setContent({ ...content, tools }); }} /><Button variant="ghost" size="icon" onClick={() => setContent({ ...content, tools: content.tools.filter((_, i) => i !== index) })}><Trash2 /></Button></div>)}</div><Button variant="outline" onClick={() => setContent({ ...content, tools: [...content.tools, "New tool"] })}><Plus /> Add tool</Button></section></TabsContent>
    </Tabs>
    <div className="mobile-save"><Button onClick={save} disabled={saving}>{saving ? <Loader2 className="spin" /> : <Save />} Save changes</Button></div>
  </main>;
}
