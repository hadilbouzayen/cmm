import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/registrations")({ component: AdminRegistrations });

const STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "CONFIRMED", "REJECTED", "COMPLETED"] as const;
const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau", CONTACTED: "Contacté", IN_PROGRESS: "En cours",
  CONFIRMED: "Confirmé", REJECTED: "Refusé", COMPLETED: "Terminé",
};

function AdminRegistrations() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-registrations"], queryFn: () => api.adminGetRegistrations(token) });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.adminUpdateRegistrationStatus(id, status, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-registrations"] }); toast.success("Statut mis à jour"); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.adminDeleteRegistration(id, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-registrations"] }); toast.success("Supprimé"); },
  });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  return (
    <AdminShell active="registrations" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Inscriptions</h1>
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <div className="overflow-x-auto rounded-md border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>{["Nom", "Email", "Téléphone", "Formation", "Niveau", "Date", "Statut", ""].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="px-4 py-3">{r.course?.title ?? "—"}</td>
                  <td className="px-4 py-3">{r.currentLevel ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm(`Supprimer l'inscription de ${r.name} ?`)) del.mutate(r.id); }} className="text-xs text-destructive hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="px-4 py-8 text-center text-muted-foreground">Aucune inscription</p>}
        </div>
      )}
    </AdminShell>
  );
}
