import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Menu, MessageCircle, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useContent } from "@/lib/content-store";

const links = [
  ["/", "Accueil"], ["/about", "À propos"], ["/languages", "Langues"], ["/professional-training", "Formations pro"], ["/germany", "Allemagne"], ["/contact", "Contact"]
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data } = useContent();
  const logoUrl = data.settings.logo || "/logo.png";
  const waNumber = (data.settings.whatsapp || data.settings.phone).replace(/[^0-9]/g, "");
  return <div className="min-h-screen">
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3"><img src={logoUrl} alt="Créateur Centre Monastir" className="h-14 w-14 object-contain"/><span className="hidden max-w-40 text-sm font-extrabold leading-tight sm:block">Créateur Centre<br/>Monastir</span></Link>
        <nav className="hidden items-center gap-6 lg:flex">{links.map(([to,label]) => <Link key={to} to={to} activeOptions={{exact:to==="/"}} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" activeProps={{className:"text-primary"}}>{label}</Link>)}</nav>
        <div className="hidden items-center gap-3 sm:flex"><Link to="/register" className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-strong">Inscription</Link></div>
        <button aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} className="grid size-11 place-items-center rounded-md border border-border lg:hidden" onClick={() => setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button>
      </div>
      {open && <nav className="container-shell grid gap-1 border-t border-border py-3 lg:hidden">{links.map(([to,label]) => <Link key={to} to={to} onClick={()=>setOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold" activeProps={{className:"bg-muted text-primary"}}>{label}</Link>)}<Link to="/register" onClick={()=>setOpen(false)} className="mt-2 rounded-md bg-primary px-3 py-3 text-center font-bold text-primary-foreground">Inscription</Link></nav>}
    </header>
    <main>{children}</main>
    <a aria-label="Contacter sur WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${waNumber}`} className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-success text-primary-foreground shadow-xl"><MessageCircle className="size-6"/></a>
    <footer className="bg-secondary py-14 text-secondary-foreground"><div className="container-shell grid gap-10 md:grid-cols-3"><div><img src={logoUrl} alt="Logo CMM" className="mb-4 h-16 w-16 object-contain"/><p className="max-w-xs text-sm leading-7 opacity-70">{data.settings.footer}</p>{(data.settings.facebook||data.settings.instagram||data.settings.tiktok)&&<div className="mt-5 flex gap-3">{data.settings.facebook&&<a href={data.settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-9 place-items-center rounded-md border border-secondary-foreground/20 hover:border-accent hover:text-accent"><Facebook className="size-4"/></a>}{data.settings.instagram&&<a href={data.settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-md border border-secondary-foreground/20 hover:border-accent hover:text-accent"><Instagram className="size-4"/></a>}{data.settings.tiktok&&<a href={data.settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid size-9 place-items-center rounded-md border border-secondary-foreground/20 text-xs font-bold hover:border-accent hover:text-accent">TT</a>}</div>}</div><div><h3 className="mb-4 font-sans text-base">Coordonnées</h3><div className="space-y-2 text-sm opacity-75"><p>{data.settings.address}</p><p>{data.settings.phone}</p><p>{data.settings.email}</p><p>{data.settings.hours}</p></div></div><div><h3 className="mb-4 font-sans text-base">Liens</h3><div className="grid gap-2 text-sm opacity-75"><Link to="/legal">Mentions légales</Link><Link to="/privacy">Confidentialité</Link><Link to="/admin">Administration</Link></div></div></div></footer>
  </div>;
}