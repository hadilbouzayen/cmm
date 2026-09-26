import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Opportunity } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { ListEditor } from "@/components/list-editor";
import { ImageUpload } from "@/components/image-upload";

export const Route = createFileRoute("/admin/germany")({ component: AdminGermany });

const empty = { title: "", type: "Ausbildung" as const, description: "", requirements: [] as string[], germanLevel: "", duration: "", ageRequirement: "", location: "Allemagne", sessions: "", benefits: [] as string[], image: "", status: "active" as const };

function AdminGermany() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-germany"], queryFn: () => api.adminGetOpportunities(token) });
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);

  const create = useMutation({
    mutationFn: () => api.adminCreateOpportunity(form, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-germany"] }); setCreating(false); setForm(empty); toast.success("Créé"); },
  });

  const update = useMutation({
    mutationFn: () => api.adminUpdateOpportunity(editing!.id, form, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-germany"] }); setEditing(null); toast.success("Mis à jour"); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.adminDeleteOpportunity(id, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-germany"] }); toast.success("Supprimé"); },
  });

  function startEdit(opp: Opportunity) {
    setEditing(opp);
    setForm({ title: opp.title, type: opp.type as "Ausbildung", description: opp.description, requirements: opp.requirements, germanLevel: opp.germanLevel ?? "", duration: opp.duration ?? "", ageRequirement: opp.ageRequirement ?? "", location: opp.location ?? "", sessions: opp.sessions ?? "", benefits: opp.benefits, image: opp.image ?? "", status: opp.status as "active" });
  }

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  const showForm = creating || !!editing;

  return (
    <AdminShell active="germany" onLogout={logout}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Opportunités Allemagne</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(empty); }}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Plus className="size-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="mb-6 card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{editing ? "Modifier" : "Nouvelle opportunité"}</h2>
            <button onClick={() => { setCreating(false); setEditing(null); }}><X className="size-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Titre" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "Ausbildung" }))} className="input">
              <option value="Ausbildung">Ausbildung</option>
              <option value="Emploi">Emploi</option>
            </select>
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input sm:col-span-2" />
            <input placeholder="Niveau d'allemand" value={form.germanLevel} onChange={e => setForm(f => ({ ...f, germanLevel: e.target.value }))} className="input" />
            <input placeholder="Durée" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="input" />
            <input placeholder="Âge maximum" value={form.ageRequirement} onChange={e => setForm(f => ({ ...f, ageRequirement: e.target.value }))} className="input" />
            <input placeholder="Sessions" value={form.sessions} onChange={e => setForm(f => ({ ...f, sessions: e.target.value }))} className="input" />
          </div>

          <div className="mt-5 space-y-5">
            <ListEditor label="Prérequis" value={form.requirements} onChange={v => setForm(f => ({ ...f, requirements: v }))}
              placeholder="ex : Niveau d'allemand B1" />
            <ListEditor label="Avantages" value={form.benefits} onChange={v => setForm(f => ({ ...f, benefits: v }))}
              placeholder="ex : Formation rémunérée" hint="Liste « Avantages » affichée sur la page Allemagne." />
            <ImageUpload label="Image" value={form.image} onChange={path => setForm(f => ({ ...f, image: path }))} entityType="germany" />
          </div>

          <button onClick={() => editing ? update.mutate() : create.mutate()} disabled={!form.title || !form.description}
            className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
            {editing ? "Enregistrer" : "Créer"}
          </button>
        </div>
      )}

      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <div className="space-y-3">
          {data.map((opp) => (
            <div key={opp.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{opp.title} <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{opp.type}</span></p>
                  <p className="mt-1 text-sm text-muted-foreground">{opp.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(opp)} aria-label="Modifier"><Pencil className="size-4 text-muted-foreground hover:text-primary" /></button>
                  <button onClick={() => { if (confirm(`Supprimer « ${opp.title} » ?`)) del.mutate(opp.id); }} aria-label="Supprimer"><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="py-8 text-center text-muted-foreground">Aucune opportunité</p>}
        </div>
      )}
    </AdminShell>
  );
}
