import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Course, type Category } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListEditor } from "@/components/list-editor";
import { ImageUpload } from "@/components/image-upload";

export const Route = createFileRoute("/admin/courses")({ component: AdminCourses });

// ─── Schedule Builder ────────────────────────────────────────────────────────

type Slot = { day: string; start: string; end: string };
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function ScheduleBuilder({ value, onChange }: { value: Slot[]; onChange: (slots: Slot[]) => void }) {
  function addSlot() {
    onChange([...value, { day: "Lundi", start: "09:00", end: "11:00" }]);
  }
  function removeSlot(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function updateSlot(i: number, field: keyof Slot, val: string) {
    onChange(value.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium">Créneaux horaires</label>
        <button type="button" onClick={addSlot}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
          <Plus className="size-3" /> Ajouter
        </button>
      </div>
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">Aucun créneau. Cliquez sur "Ajouter" pour créer un horaire.</p>
      )}
      <div className="space-y-2">
        {value.map((slot, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={slot.day} onChange={e => updateSlot(i, "day", e.target.value)}
              className="input flex-1">
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <input type="time" value={slot.start} onChange={e => updateSlot(i, "start", e.target.value)}
              className="input w-28" />
            <span className="text-muted-foreground">→</span>
            <input type="time" value={slot.end} onChange={e => updateSlot(i, "end", e.target.value)}
              className="input w-28" />
            <button type="button" onClick={() => removeSlot(i)}>
              <X className="size-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Empty form state ─────────────────────────────────────────────────────────

const emptyForm = () => ({
  title: "", shortDescription: "", description: "", categoryId: "",
  level: "", duration: "", scheduleSlots: [] as Slot[],
  price: "Sur demande", location: "Créateur Centre Monastir",
  instructor: "Équipe pédagogique CMM", availablePlaces: 12,
  coverImage: "",
  objectives: [] as string[], program: [] as string[],
  requirements: [] as string[], includedItems: [] as string[],
  status: "active" as const, featured: false,
});

type FormState = ReturnType<typeof emptyForm>;

// ─── Main component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function AdminCourses() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => api.adminGetCourses(token),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.adminGetCategories(token),
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setSheetOpen(true);
  }

  function openEdit(c: Course) {
    setEditing(c);
    let slots: Slot[] = [];
    if (c.schedule) {
      try {
        const parsed = JSON.parse(c.schedule);
        if (Array.isArray(parsed) && parsed[0]?.day) slots = parsed;
      } catch { /* plain text schedule, ignore */ }
    }
    setForm({
      title: c.title, shortDescription: c.shortDescription, description: c.description,
      categoryId: c.categoryId, level: c.level ?? "", duration: c.duration ?? "",
      scheduleSlots: slots, price: c.price ?? "", location: c.location ?? "",
      instructor: c.instructor ?? "", availablePlaces: c.availablePlaces,
      coverImage: c.coverImage ?? "",
      objectives: c.objectives, program: c.program,
      requirements: c.requirements, includedItems: c.includedItems,
      status: c.status as "active", featured: c.featured,
    });
    setSheetOpen(true);
  }

  function buildPayload() {
    return {
      ...form,
      schedule: form.scheduleSlots.length > 0
        ? JSON.stringify(form.scheduleSlots)
        : undefined,
    };
  }

  const create = useMutation({
    mutationFn: () => api.adminCreateCourse(buildPayload(), token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setSheetOpen(false);
      toast.success("Formation créée");
    },
    onError: (e) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: () => api.adminUpdateCourse(editing!.id, buildPayload(), token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setSheetOpen(false);
      toast.success("Formation mise à jour");
    },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.adminDeleteCourse(id, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Supprimé");
    },
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(c =>
      c.title.toLowerCase().includes(q) ||
      (c.category?.name ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search]);

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  const saving = create.isPending || update.isPending;

  return (
    <AdminShell active="courses" onLogout={logout}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Formations</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="size-4" /> Nouvelle formation
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Rechercher une formation…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <>
          <div className="overflow-x-auto rounded-md border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  {["Formation", "Catégorie", "Niveau", "Statut", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-medium">{c.title}</span>
                      {c.featured && <Star className="ml-2 inline size-3 text-yellow-500" />}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.category?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.level || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {c.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(c)} title="Modifier">
                          <Pencil className="size-4 text-muted-foreground hover:text-primary" />
                        </button>
                        <button onClick={() => { if (confirm(`Supprimer "${c.title}" ?`)) del.mutate(c.id); }} title="Supprimer">
                          <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginated.length === 0 && (
              <p className="px-4 py-8 text-center text-muted-foreground">
                {search ? "Aucune formation correspondante." : "Aucune formation."}
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{filtered.length} formation{filtered.length > 1 ? "s" : ""}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-md border border-border p-1 disabled:opacity-40">
                  <ChevronLeft className="size-4" />
                </button>
                <span>Page {page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="rounded-md border border-border p-1 disabled:opacity-40">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Slide-out Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{editing ? "Modifier la formation" : "Nouvelle formation"}</SheetTitle>
          </SheetHeader>

          <form className="mt-6" onSubmit={e => { e.preventDefault(); editing ? update.mutate() : create.mutate(); }}>
            <Tabs defaultValue="general">
              <TabsList className="mb-4 flex w-full">
                <TabsTrigger value="general" className="flex-1">Général</TabsTrigger>
                <TabsTrigger value="contenu" className="flex-1">Contenu</TabsTrigger>
                <TabsTrigger value="pratique" className="flex-1">Pratique</TabsTrigger>
              </TabsList>

              {/* ─── Général ─── */}
              <TabsContent value="general" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Titre *</label>
                  <input value={form.title} onChange={e => set("title", e.target.value)} required className="input mt-1 w-full" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">Catégorie *</label>
                    <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)} required className="input mt-1 w-full">
                      <option value="">Sélectionner…</option>
                      {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Niveau</label>
                    <input value={form.level} onChange={e => set("level", e.target.value)} placeholder="ex : A1 à B2, Débutant…" className="input mt-1 w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Description courte *</label>
                  <textarea value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} required rows={2} className="input mt-1 w-full" />
                  <p className="mt-1 text-xs text-muted-foreground">Affichée sur les cartes de formation.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Description complète</label>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} className="input mt-1 w-full" />
                  <p className="mt-1 text-xs text-muted-foreground">Affichée en haut de la page de la formation.</p>
                </div>
                <ImageUpload label="Image de couverture" value={form.coverImage} onChange={p => set("coverImage", p)} entityType="courses" />
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} />
                    En vedette
                  </label>
                  <select value={form.status} onChange={e => set("status", e.target.value as "active")} className="input w-auto">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </TabsContent>

              {/* ─── Contenu (the sections rendered on the public page) ─── */}
              <TabsContent value="contenu" className="space-y-6">
                <ListEditor label="Objectifs" value={form.objectives} onChange={v => set("objectives", v)}
                  placeholder="ex : Acquérir les bases du néerlandais" hint="Liste à puces « Objectifs »." />
                <ListEditor label="Programme" value={form.program} onChange={v => set("program", v)}
                  placeholder="ex : Évaluation du niveau" hint="Étapes numérotées « Programme »." />
                <ListEditor label="Ce qui est inclus" value={form.includedItems} onChange={v => set("includedItems", v)}
                  placeholder="ex : Supports pédagogiques" />
                <ListEditor label="Prérequis" value={form.requirements} onChange={v => set("requirements", v)}
                  placeholder="ex : Aucun prérequis" hint="Section « Prérequis » de la formation." />
              </TabsContent>

              {/* ─── Pratique ─── */}
              <TabsContent value="pratique" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">Durée</label>
                    <input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="ex : 3 mois, 8 semaines…" className="input mt-1 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Prix</label>
                    <input value={form.price} onChange={e => set("price", e.target.value)} className="input mt-1 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Lieu</label>
                    <input value={form.location} onChange={e => set("location", e.target.value)} className="input mt-1 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Places disponibles</label>
                    <input type="number" value={form.availablePlaces} onChange={e => set("availablePlaces", parseInt(e.target.value) || 12)} min={1} className="input mt-1 w-full" />
                  </div>
                </div>
                <ScheduleBuilder value={form.scheduleSlots} onChange={slots => set("scheduleSlots", slots)} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-3 border-t border-border pt-4">
              <button type="submit" disabled={saving || !form.title || !form.categoryId}
                className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
                {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Créer"}
              </button>
              <button type="button" onClick={() => setSheetOpen(false)}
                className="rounded-md border border-border px-5 py-2 text-sm">
                Annuler
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
