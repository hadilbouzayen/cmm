import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ButtonLink({ to, children, variant = "primary", search }: { to: string; children: ReactNode; variant?: "primary" | "secondary" | "light"; search?: Record<string, string> }) {
  return <Link to={to} search={search} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition-all", variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-strong", variant === "secondary" && "border border-border bg-background text-foreground hover:border-primary hover:text-primary", variant === "light" && "bg-background text-foreground hover:bg-accent")}><span>{children}</span><ArrowRight className="size-4" /></Link>;
}
export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <section className="page-intro"><div className="container-shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead max-w-2xl">{text}</p></div></section>; }
export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) { return <div className="mb-10 max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="lead mt-4">{text}</p>}</div>; }
export function EmptyState({ children }: { children: ReactNode }) { return <div className="rounded-md border border-dashed border-border bg-muted p-10 text-center text-muted-foreground">{children}</div>; }