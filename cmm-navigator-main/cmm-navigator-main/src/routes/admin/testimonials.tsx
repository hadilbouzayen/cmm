import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export const Route = createFileRoute("/admin/testimonials")({ component: AdminTestimonials });

function AdminTestimonials() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => api.adminGetTestimonials(token) });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.adminUpdateTestimonial(id, data, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Mis à jour"); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.adminDeleteTestimonial(id, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Supprimé"); },
  });

  const [form, setForm] = useState({ name: "", testimonial: "", language: "Français", photo: "" });
  const create = useMutation({
    mutationFn: () => api.adminCreateTestimonial(form, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); setForm({ name: "", testimonial: "", language: "Français", photo: "" }); toast.success("Créé"); },
  });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  return (
    <AdminShell active="testimonials" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Témoignages</h1>

      <div className="mb-6 card p-5">
        <h2 className="mb-4 font-bold">Ajouter un témoignage</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input placeholder="Nom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" />
          <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className="input">
            {["Français", "Anglais", "Arabe"].map(l => <option key={l}>{l}</option>)}
          </select>
          <textarea placeholder="Témoignage" value={form.testimonial} onChange={e => setForm(f => ({ ...f, testimonial: e.target.value }))} rows={3}
            className="input sm:col-span-2" />
          <div className="sm:col-span-2">
            <ImageUpload label="Photo (optionnelle)" value={form.photo} onChange={p => setForm(f => ({ ...f, photo: p }))} entityType="testimonials" />
          </div>
        </div>
        <button onClick={() => create.mutate()} disabled={!form.name || !form.testimonial}
          className="mt-3 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
          <Plus className="size-4" /> Ajouter
        </button>
      </div>

      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <div className="space-y-3">
          {data.map((t) => (
            <div key={t.id} className="card flex items-start justify-between gap-4 p-5">
              <div className="flex flex-1 items-start gap-4">
                {t.photo && <img src={t.photo} alt={t.name} className="size-12 shrink-0 rounded-full border border-border object-cover" />}
                <div>
                  <p className="font-bold">{t.name} <span className="ml-2 text-xs text-muted-foreground">{t.language}</span></p>
                  <p className="mt-1 text-sm">{t.testimonial}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={t.published}
                    onChange={(e) => update.mutate({ id: t.id, data: { published: e.target.checked } })} />
                  Publié
                </label>
                <button onClick={() => { if (confirm(`Supprimer le témoignage de ${t.name} ?`)) del.mutate(t.id); }} aria-label="Supprimer"><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></button>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="py-8 text-center text-muted-foreground">Aucun témoignage</p>}
        </div>
      )}
    </AdminShell>
  );
}
