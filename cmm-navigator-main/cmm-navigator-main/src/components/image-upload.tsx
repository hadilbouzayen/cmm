import { useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authStore } from "@/lib/auth-store";

export function ImageUpload({
  label,
  value,
  onChange,
  entityType,
}: {
  label: string;
  value?: string;
  onChange: (path: string) => void;
  entityType: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    // entityType must be appended BEFORE the file so multer's storage sees it.
    fd.append("entityType", entityType);
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await api.uploadFile(fd, authStore.getToken());
      onChange(res.path);
      toast.success("Image téléversée");
    } catch {
      toast.error("Échec du téléversement de l'image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="size-16 rounded-md border border-border object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-destructive text-white"
              aria-label="Retirer l'image"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="grid size-16 place-items-center rounded-md border border-dashed border-border text-muted-foreground">
            <Upload className="size-5" />
          </div>
        )}
        <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
          {uploading ? "Téléversement…" : value ? "Remplacer" : "Choisir une image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
