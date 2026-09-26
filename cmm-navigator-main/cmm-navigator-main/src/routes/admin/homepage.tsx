import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormRegister } from "react-hook-form";
import { api, type HomepageContent } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/homepage")({ component: AdminHomepage });

function AdminHomepage() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-homepage"], queryFn: () => api.adminGetHomepage(token) });

  const { register, handleSubmit, reset } = useForm<HomepageContent>();
  useEffect(() => { if (data) reset(data); }, [data]);

  const save = useMutation({
    mutationFn: (values: Partial<HomepageContent>) => api.adminUpdateHomepage(values, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["homepage", "admin-homepage"] }); toast.success("Page d'accueil mise à jour"); },
    onError: (e) => toast.error(e.message),
  });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  return (
    <AdminShell active="homepage" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Page d'accueil</h1>
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <form onSubmit={handleSubmit((v) => save.mutate(v))} className="card space-y-5 p-6 max-w-2xl">
          <Field label="Sous-titre (eyebrow)" name="heroSubtitle" register={register} />
          <Field label="Titre principal" name="heroTitle" register={register} />
          <Field label="Description héro" name="heroDescription" register={register} textarea />
          <Field label="Titre section Allemagne" name="germanyTitle" register={register} />
          <Field label="Texte section Allemagne" name="germanyText" register={register} textarea />
          <Field label="Titre appel à l'action" name="ctaTitle" register={register} />
          <Field label="Texte appel à l'action" name="ctaText" register={register} />
          <button type="submit" disabled={save.isPending} className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {save.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      )}
    </AdminShell>
  );
}

function Field({ label, name, register, textarea }: { label: string; name: string; register: UseFormRegister<any>; textarea?: boolean }) {
  const props = { ...register(name), className: "input w-full mt-1", id: name };
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      {textarea ? <textarea {...props} rows={3} /> : <input {...props} />}
    </div>
  );
}
