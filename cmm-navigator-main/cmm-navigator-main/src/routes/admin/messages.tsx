import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

const STATUS_LABELS: Record<string, string> = { NEW: "Nouveau", READ: "Lu", PROCESSED: "Traité" };

function AdminMessages() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: () => api.adminGetMessages(token) });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.adminUpdateMessageStatus(id, status, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success("Statut mis à jour"); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.adminDeleteMessage(id, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success("Supprimé"); },
  });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  return (
    <AdminShell active="messages" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Messages de contact</h1>
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <div className="space-y-3">
          {data.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold">{m.name}</p>
                    <span className="text-xs text-muted-foreground">{m.email} · {m.phone}</span>
                    <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="mt-2 text-sm">{m.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={m.status} onChange={(e) => updateStatus.mutate({ id: m.id, status: e.target.value })}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button onClick={() => { if (confirm(`Supprimer le message de ${m.name} ?`)) del.mutate(m.id); }} className="text-xs text-destructive hover:underline">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="py-8 text-center text-muted-foreground">Aucun message</p>}
        </div>
      )}
    </AdminShell>
  );
}
