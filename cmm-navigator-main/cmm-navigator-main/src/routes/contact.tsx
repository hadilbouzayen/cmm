import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ContactForm } from "@/components/forms";
import { PageIntro } from "@/components/ui";
import { useContent } from "@/lib/content-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Créateur Centre Monastir" },
      { name: "description", content: "Contactez CMM pour une formation ou un projet en Allemagne." },
      { property: "og:title", content: "Contactez CMM" },
      { property: "og:description", content: "Parlez-nous de votre projet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data } = useContent();
  const s = data.settings;
  const tel = s.phone.replace(/\s/g, "");
  const wa = (s.whatsapp || s.phone).replace(/[^0-9]/g, "");
  const mapsQuery = encodeURIComponent(s.address || "Monastir, Tunisie");
  return (
    <SiteShell>
      <PageIntro eyebrow="Contact" title="Parlez-nous de votre projet" text="Notre équipe vous répondra avec les informations adaptées à la formation ou au parcours qui vous intéresse." />
      <section className="py-20">
        <div className="container-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div className="space-y-7">
            <a href={`tel:${tel}`} className="flex gap-4 hover:text-primary">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-muted text-primary"><Phone className="size-5" /></span>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">Téléphone</p><p className="mt-1 font-semibold">{s.phone}</p></div>
            </a>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="flex gap-4 hover:text-primary">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-muted text-primary"><MessageCircle className="size-5" /></span>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">WhatsApp</p><p className="mt-1 font-semibold">{s.whatsapp || s.phone}</p></div>
            </a>
            <a href={`mailto:${s.email}`} className="flex gap-4 hover:text-primary">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-muted text-primary"><Mail className="size-5" /></span>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">E-mail</p><p className="mt-1 font-semibold">{s.email}</p></div>
            </a>
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-muted text-primary"><MapPin className="size-5" /></span>
              <div><p className="text-xs font-bold uppercase text-muted-foreground">Adresse</p><p className="mt-1 font-semibold">{s.address}</p></div>
            </div>
            <div className="border-t border-border pt-6">
              <p className="font-bold">Horaires</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.hours}</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <iframe
                title="Localisation Créateur Centre Monastir"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="h-56 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </SiteShell>
  );
}
