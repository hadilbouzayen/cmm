import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormRegister } from "react-hook-form";
import { api, type WebsiteSettings } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { AdminShell } from "./index";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const navigate = useNavigate();
  const token = authStore.getToken();

  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => api.adminGetSettings(token) });

  const { register, handleSubmit, reset, watch, setValue } = useForm<WebsiteSettings>();
  useEffect(() => { if (data) reset(data); }, [data]);

  const save = useMutation({
    mutationFn: (values: Partial<WebsiteSettings>) => api.adminUpdateSettings(values, token),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings", "admin-settings"] }); toast.success("Paramètres enregistrés"); },
    onError: (e) => toast.error(e.message),
  });

  function logout() { authStore.clear(); navigate({ to: "/admin/login" }); }

  return (
    <AdminShell active="settings" onLogout={logout}>
      <h1 className="mb-6 text-2xl font-bold">Paramètres du site</h1>
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : (
        <form onSubmit={handleSubmit((v) => save.mutate(v))} className="card space-y-5 p-6 max-w-2xl">
          <ImageUpload label="Logo" value={watch("logo") || ""} onChange={(p) => setValue("logo", p, { shouldDirty: true })} entityType="branding" />
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Nom du centre" name="centerName" register={register} />
            <F label="Téléphone" name="phone" register={register} />
            <F label="WhatsApp" name="whatsapp" register={register} />
            <F label="Email" name="email" register={register} type="email" />
            <F label="Adresse" name="address" register={register} />
            <F label="Horaires d'ouverture" name="openingHours" register={register} />
            <F label="Facebook URL" name="facebookUrl" register={register} />
            <F label="Instagram URL" name="instagramUrl" register={register} />
            <F label="TikTok URL" name="tiktokUrl" register={register} />
          </div>
          <F label="Texte du footer" name="footerText" register={register} textarea />
          <button type="submit" disabled={save.isPending} className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {save.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      )}
    </AdminShell>
  );
}

function F({ label, name, register, textarea, type = "text" }: { label: string; name: string; register: UseFormRegister<any>; textarea?: boolean; type?: string }) {
  const props = { ...register(name), className: "input w-full mt-1", id: name, type };
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      {textarea ? <textarea {...props as object} rows={2} className="input w-full mt-1" /> : <input {...props} />}
    </div>
  );
}
