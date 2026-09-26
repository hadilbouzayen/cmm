import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Category } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

function AdminCategories() {
  const navigate = useNavigate();
  const token = authStore.getToken();
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({ queryKey: ["admin-categories"], queryFn: () => api.adminGetCategories(token) });

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const create = useMutation({
    mutationFn: () => api.adminCreateCategory({ name: newName.trim() }, token),
    onSuccess: () => { invalidate(); setNewName(""); toast.success("Catégorie créée"); },
    onError: (e) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: (id: string) => api.adminUpdateCategory(id, { name: editName.trim() }, token),
    onSuccess: () => { invalidate(); setEditingId(null); toast.success("Catégorie mise à jour"); },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.adminDeleteCategory(id, token),
    onSuccess: () => { invalidate(); toast.success("Catégorie supprimée"); },
    onError: (e) => toast.error(e.message),
  });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  return (
    <AdminShell active="categories" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Catégories</h1>

      <div className="mb-6 card p-5">
        <h2 className="mb-3 font-bold">Ajouter une catégorie</h2>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && newName.trim()) create.mutate(); }}
            placeholder="Nom de la catégorie"
            className="input flex-1"
          />
          <button
            onClick={() => create.mutate()}
            disabled={!newName.trim() || create.isPending}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            <Plus className="size-4" /> Ajouter
          </button>
        </div>
      </div>

      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <div className="overflow-x-auto rounded-md border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Identifiant</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((c: Category) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {editingId === c.id ? (
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input" autoFocus />
                    ) : (
                      <span className="font-medium">{c.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      {editingId === c.id ? (
                        <>
                          <button onClick={() => update.mutate(c.id)} aria-label="Enregistrer"><Check className="size-4 text-primary" /></button>
                          <button onClick={() => setEditingId(null)} aria-label="Annuler"><X className="size-4 text-muted-foreground" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} aria-label="Modifier"><Pencil className="size-4 text-muted-foreground hover:text-primary" /></button>
                          <button onClick={() => { if (confirm(`Supprimer la catégorie « ${c.name} » ?`)) del.mutate(c.id); }} aria-label="Supprimer"><Trash2 className="size-4 text-muted-foreground hover:text-destructive" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="px-4 py-8 text-center text-muted-foreground">Aucune catégorie.</p>}
        </div>
      )}
    </AdminShell>
  );
}
