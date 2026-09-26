import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { BookOpen, Mail, Globe2, Menu, Settings, Users, Star, Tag, LayoutDashboard, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const navigate = useNavigate();
  const token = authStore.getToken();


  const registrations = useQuery({ queryKey: ["admin-registrations"], queryFn: () => api.adminGetRegistrations(token) });
  const messages = useQuery({ queryKey: ["admin-messages"], queryFn: () => api.adminGetMessages(token) });
  const courses = useQuery({ queryKey: ["admin-courses"], queryFn: () => api.adminGetCourses(token) });
  const testimonials = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => api.adminGetTestimonials(token) });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  const newRegistrations = registrations.data?.filter((r) => r.status === "NEW").length ?? 0;
  const newMessages = messages.data?.filter((m) => m.status === "NEW").length ?? 0;

  return (
    <AdminShell active="dashboard" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Formations" value={courses.data?.length ?? 0} icon={BookOpen} to="/admin/courses" />
        <StatCard label="Inscriptions" value={registrations.data?.length ?? 0} badge={newRegistrations} icon={Users} to="/admin/registrations" />
        <StatCard label="Messages" value={messages.data?.length ?? 0} badge={newMessages} icon={Mail} to="/admin/messages" />
        <StatCard label="Témoignages" value={testimonials.data?.length ?? 0} icon={Star} to="/admin/testimonials" />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-bold">Dernières inscriptions</h2>
          {registrations.data?.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
              <span>{r.name} — <span className="text-muted-foreground">{r.course?.title ?? "Non précisé"}</span></span>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
        <div className="card p-5">
          <h2 className="mb-3 font-bold">Derniers messages</h2>
          {messages.data?.slice(0, 5).map((m) => (
            <div key={m.id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
              <span>{m.name}</span>
              <span className="max-w-40 truncate text-muted-foreground">{m.message}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, badge, icon: Icon, to }: { label: string; value: number; badge?: number; icon: React.ComponentType<{ className?: string }>; to: string }) {
  return (
    <Link to={to} className="card flex items-center gap-4 p-5 hover:border-primary">
      <div className="grid size-10 place-items-center rounded-md bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}{badge ? <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-xs text-white">{badge}</span> : null}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800", CONTACTED: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800", CONFIRMED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800", COMPLETED: "bg-gray-100 text-gray-800",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted"}`}>{status}</span>;
}

// ─── Shared Admin Shell ──────────────────────────────────────────────────────

const navItems = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/courses", label: "Formations", icon: BookOpen },
  { to: "/admin/categories", label: "Catégories", icon: Tag },
  { to: "/admin/registrations", label: "Inscriptions", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/germany", label: "Allemagne", icon: Globe2 },
  { to: "/admin/testimonials", label: "Témoignages", icon: Star },
  { to: "/admin/homepage", label: "Page d'accueil", icon: LayoutDashboard },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
] as const;

export function AdminShell({ children, active, onLogout }: { children: React.ReactNode; active: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 border-r border-border bg-background transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center border-b border-border px-4">
          <span className="font-bold">CMM Admin</span>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-primary/10 text-primary" }}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}>
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-border p-3">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <LogOut className="size-4" /> Se déconnecter
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex flex-1 flex-col lg:pl-56">
        <header className="flex h-16 items-center border-b border-border bg-background px-4 lg:px-6">
          <button className="mr-3 lg:hidden" onClick={() => setOpen(v => !v)} aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </button>
          <Link to="/" className="ml-auto text-xs text-muted-foreground hover:text-primary">← Voir le site</Link>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
