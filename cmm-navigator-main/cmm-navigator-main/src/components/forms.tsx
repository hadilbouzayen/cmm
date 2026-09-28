import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useContent } from "@/lib/content-store";
import { api } from "@/lib/api";

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    if (!validEmail(email)) { toast.error("Veuillez saisir une adresse e-mail valide."); return; }
    setLoading(true);
    try {
      await api.submitContact({
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        email,
        message: String(fd.get("message")),
        consent: fd.get("consent") === "on",
        website: String(fd.get("website") || ""),
      });
      setSent(true);
      toast.success("Votre message a bien été envoyé.");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div className="card p-8">
      <h3>Merci.</h3>
      <p className="mt-2 text-muted-foreground">Votre demande a bien été envoyée. Notre équipe vous contactera prochainement.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="card grid gap-5 p-6 md:p-8">
      <label className="label">Nom et prénom<input className="field" name="name" required maxLength={100} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="label">Téléphone<input className="field" name="phone" type="tel" required maxLength={30} /></label>
        <label className="label">E-mail<input className="field" name="email" type="email" required maxLength={255} /></label>
      </div>
      <label className="label">Message<textarea className="field min-h-36" name="message" required maxLength={1000} /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-1" />
        J'accepte que mes informations soient utilisées pour répondre à ma demande. Voir notre <a href="/privacy" className="underline">politique de confidentialité</a>.
      </label>
      <button disabled={loading} className="rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary-strong disabled:opacity-60">
        {loading ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}

export function RegistrationForm({ initialCourse = "" }: { initialCourse?: string }) {
  const { data } = useContent();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    if (!validEmail(email)) { toast.error("Veuillez saisir une adresse e-mail valide."); return; }
    setLoading(true);
    try {
      const courseTitle = String(fd.get("course") || "");
      const course = data.courses.find((c) => c.title === courseTitle);
      await api.submitRegistration({
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        email,
        courseId: course?.id,
        currentLevel: String(fd.get("level") || ""),
        message: String(fd.get("message") || ""),
        consent: fd.get("consent") === "on",
        website: String(fd.get("website") || ""),
      });
      setSent(true);
      toast.success("Votre inscription a bien été envoyée.");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div className="card border-primary/30 p-8">
      <h3>Merci.</h3>
      <p className="mt-2 text-muted-foreground">Votre demande a bien été envoyée. Notre équipe vous contactera prochainement.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="card grid gap-5 p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="label">Nom et prénom<input className="field" name="name" required maxLength={100} /></label>
        <label className="label">Téléphone<input className="field" name="phone" type="tel" required maxLength={30} /></label>
      </div>
      <label className="label">E-mail<input className="field" name="email" type="email" required /></label>
      <label className="label">
        Formation souhaitée
        <select className="field" name="course" defaultValue={initialCourse} required>
          <option value="">Choisir une formation</option>
          {data.courses.filter((c) => c.status === "active").map((c) => (
            <option key={c.id}>{c.title}</option>
          ))}
        </select>
      </label>
      <label className="label">
        Niveau actuel
        <select className="field" name="level">
          <option>Non précisé</option>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
        </select>
      </label>
      <label className="label">Message<textarea className="field min-h-28" name="message" maxLength={1000} /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-1" />
        J'accepte le traitement de mes informations pour cette demande. Voir notre <a href="/privacy" className="underline">politique de confidentialité</a>.
      </label>
      <button disabled={loading} className="rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary-strong disabled:opacity-60">
        {loading ? "Envoi…" : "Envoyer mon inscription"}
      </button>
    </form>
  );
}
