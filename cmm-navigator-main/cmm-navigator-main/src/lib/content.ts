export type Category = { id: string; name: string; active: boolean };
export type Course = {
  id: string; title: string; category: string; categorySlug: string; coverImage: string; language: string | undefined;
  shortDescription: string; description: string; objectives: string[]; program: string[];
  level: string; duration: string; schedule: string; price: string; location: string;
  instructor: string; startDate: string; endDate: string; places: number;
  requirements: string[]; included: string[]; status: "active" | "inactive"; featured: boolean;
};
export type Registration = { id: string; name: string; phone: string; email: string; course: string; level: string; message: string; date: string; status: "Nouveau" | "Contacté" | "En cours" | "Confirmé" | "Refusé" | "Terminé" };
export type ContactMessage = { id: string; name: string; phone: string; email: string; message: string; date: string; status: "Nouveau" | "Lu" | "Traité" };
export type Opportunity = { id: string; type: "Ausbildung" | "Emploi"; title: string; description: string; requirements: string[]; germanLevel: string; duration: string; age: string; location: string; sessions: string; benefits: string[]; image?: string; status: "active" | "inactive" };
export type Testimonial = { id: string; name: string; quote: string; language: string; photo?: string; published: boolean };
export type HomepageContent = { heroTitle: string; heroSubtitle: string; heroDescription: string; germanyTitle: string; germanyText: string; ctaTitle: string; ctaText: string };
export type WebsiteSettings = { centerName: string; logo?: string; phone: string; whatsapp: string; email: string; address: string; hours: string; facebook: string; instagram: string; tiktok: string; footer: string };
export type ContentState = { courses: Course[]; categories: Category[]; registrations: Registration[]; messages: ContactMessage[]; opportunities: Opportunity[]; testimonials: Testimonial[]; homepage: HomepageContent; settings: WebsiteSettings };

export const initialContent: ContentState = {
  categories: [
    { id: "cat-1", name: "Langues", active: true }, { id: "cat-2", name: "Formation professionnelle", active: true }, { id: "cat-3", name: "Allemagne / Ausbildung", active: true }
  ],
  courses: [],
  registrations: [{ id: "r1", name: "Sarra Ben Amor", phone: "—", email: "sarra@example.com", course: "Allemand", level: "Débutant", message: "Demande d'informations", date: "23/09/2026", status: "Nouveau" }],
  messages: [{ id: "m1", name: "Mohamed Trabelsi", phone: "—", email: "mohamed@example.com", message: "Je souhaite connaître les prochaines sessions.", date: "23/09/2026", status: "Nouveau" }],
  opportunities: [
    { id: "o1", type: "Ausbildung", title: "Formation paramédicale", description: "Un parcours théorique et pratique au sein d'établissements de santé allemands.", requirements: ["Conditions à valider avant publication"], germanLevel: "B1 minimum — à confirmer", duration: "À confirmer", age: "À confirmer", location: "Allemagne", sessions: "Avril et octobre — à confirmer", benefits: ["Accompagnement administratif", "Préparation linguistique", "Aide à l'intégration"], status: "active" },
    { id: "o2", type: "Ausbildung", title: "LKW Fahrer", description: "Formation professionnelle dans le transport et la logistique combinant théorie et entreprise.", requirements: ["Expérience dans le domaine — à confirmer"], germanLevel: "B1 — à confirmer", duration: "3 ans — à confirmer", age: "33 ans maximum — à confirmer", location: "Allemagne", sessions: "À confirmer", benefits: ["Formation rémunérée", "Expérience professionnelle", "Perspectives d'emploi"], status: "active" },
    { id: "o3", type: "Emploi", title: "Professionnels médicaux et paramédicaux", description: "Accompagnement pour les infirmiers, instrumentistes et techniciens en radiologie.", requirements: ["Diplôme dans la spécialité", "Conditions exactes à confirmer"], germanLevel: "À confirmer", duration: "Selon le parcours", age: "À confirmer", location: "Allemagne", sessions: "Selon disponibilité", benefits: ["Reconnaissance du diplôme", "Préparation en allemand", "Mise en relation", "Suivi jusqu'à l'installation"], status: "active" }
  ],
  testimonials: [
    { id: "t1", name: "Eya Cherni", quote: "Service excellent et équipe chaleureuse. Je recommande.", language: "Français", published: false },
    { id: "t2", name: "Farah Zaghdoudi", quote: "Amazing service and very professional.", language: "Anglais", published: false }
  ],
  homepage: { heroTitle: "Le partenaire de votre réussite", heroSubtitle: "Créateur Centre Monastir", heroDescription: "Formations en langues, formations professionnelles et accompagnement vers les études ou l'emploi en Allemagne.", germanyTitle: "Démarrez votre carrière en Allemagne", germanyText: "Apprentissage de l'allemand, préparation du dossier et accompagnement vers une opportunité de formation ou de travail.", ctaTitle: "Parlons de votre projet", ctaText: "Notre équipe vous aide à choisir le parcours adapté à votre objectif." },
  settings: { centerName: "Créateur Centre Monastir", phone: "52 291 722", whatsapp: "52 291 722 — à confirmer", email: "createur.center@gmail.com", address: "Immeuble Ghomrassi, Monastir — à confirmer", hours: "Lun–Ven 9h–17h · Sam 9h–14h", facebook: "Créateur Centre Monastir CCM", instagram: "@createurcentre", tiktok: "@crateur.centre.mo", footer: "Formations, accompagnement et opportunités internationales." }
};