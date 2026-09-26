import { useQuery } from "@tanstack/react-query";
import { api, type Course, type HomepageContent, type WebsiteSettings, type Testimonial, type Opportunity } from "./api";
import { initialContent } from "./content";

// Maps API types to the shape the existing public routes expect
function toPublicData(
  courses: Course[],
  homepage: HomepageContent | undefined,
  settings: WebsiteSettings | undefined,
  testimonials: Testimonial[],
  opportunities: Opportunity[],
) {
  return {
    courses: courses.map((c) => ({
      id: c.id, title: c.title, category: c.category?.name ?? "", categorySlug: c.category?.slug ?? "",
      coverImage: c.coverImage ?? "",
      language: c.language, shortDescription: c.shortDescription, description: c.description,
      objectives: c.objectives, program: c.program, level: c.level ?? "", duration: c.duration ?? "",
      schedule: c.schedule ?? "", price: c.price ?? "", location: c.location ?? "",
      instructor: c.instructor ?? "", startDate: c.startDate ?? "", endDate: c.endDate ?? "",
      places: c.availablePlaces, requirements: c.requirements, included: c.includedItems,
      status: c.status as "active" | "inactive", featured: c.featured,
    })),
    categories: [] as typeof initialContent.categories,
    registrations: [] as typeof initialContent.registrations,
    messages: [] as typeof initialContent.messages,
    opportunities: opportunities.map((o) => ({
      id: o.id, type: o.type as "Ausbildung" | "Emploi", title: o.title,
      description: o.description, requirements: o.requirements, germanLevel: o.germanLevel ?? "",
      duration: o.duration ?? "", age: o.ageRequirement ?? "", location: o.location ?? "",
      sessions: o.sessions ?? "", benefits: o.benefits, image: o.image ?? "", status: o.status as "active" | "inactive",
    })),
    testimonials: testimonials.map((t) => ({
      id: t.id, name: t.name, quote: t.testimonial, language: t.language ?? "",
      photo: t.photo ?? "", published: t.published,
    })),
    homepage: homepage
      ? { heroTitle: homepage.heroTitle, heroSubtitle: homepage.heroSubtitle, heroDescription: homepage.heroDescription, germanyTitle: homepage.germanyTitle, germanyText: homepage.germanyText, ctaTitle: homepage.ctaTitle, ctaText: homepage.ctaText }
      : initialContent.homepage,
    settings: settings
      ? { centerName: settings.centerName, logo: settings.logo ?? "", phone: settings.phone, whatsapp: settings.whatsapp ?? "", email: settings.email, address: settings.address ?? "", hours: settings.openingHours ?? "", facebook: settings.facebookUrl ?? "", instagram: settings.instagramUrl ?? "", tiktok: settings.tiktokUrl ?? "", footer: settings.footerText ?? "" }
      : { ...initialContent.settings, logo: "" },
  };
}

export function useContent() {
  const courses = useQuery({ queryKey: ["courses"], queryFn: api.getCourses, placeholderData: [] });
  const homepage = useQuery({ queryKey: ["homepage"], queryFn: api.getHomepage });
  const settings = useQuery({ queryKey: ["settings"], queryFn: api.getSettings });
  const testimonials = useQuery({ queryKey: ["testimonials"], queryFn: api.getTestimonials, placeholderData: [] });
  const opportunities = useQuery({ queryKey: ["opportunities"], queryFn: api.getOpportunities, placeholderData: [] });

  const isLoading = courses.isLoading || homepage.isLoading || settings.isLoading;

  const data = toPublicData(
    courses.data ?? [],
    homepage.data,
    settings.data,
    testimonials.data ?? [],
    opportunities.data ?? [],
  );

  return { data, isLoading };
}
