const BASE = "/api";

async function request<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const init: RequestInit = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const get = <T>(path: string, token?: string) => request<T>("GET", path, undefined, token);
const post = <T>(path: string, body: unknown, token?: string) => request<T>("POST", path, body, token);
const put = <T>(path: string, body: unknown, token?: string) => request<T>("PUT", path, body, token);
const patch = <T>(path: string, body: unknown, token?: string) => request<T>("PATCH", path, body, token);
const del = (path: string, token?: string) => request<void>("DELETE", path, undefined, token);

export const api = {
  // Public
  getCourses: () => get<Course[]>("/courses"),
  getCourse: (id: string) => get<Course>(`/courses/${id}`),
  getCategories: () => get<Category[]>("/categories"),
  getOpportunities: () => get<Opportunity[]>("/germany-opportunities"),
  getTestimonials: () => get<Testimonial[]>("/testimonials"),
  getHomepage: () => get<HomepageContent>("/homepage"),
  getSettings: () => get<WebsiteSettings>("/settings"),
  submitRegistration: (data: unknown) => post<void>("/registrations", data),
  submitContact: (data: unknown) => post<void>("/contact", data),

  // Auth
  login: (email: string, password: string) =>
    post<{ token: string; admin: AdminUser }>("/auth/login", { email, password }),
  me: (token: string) => get<AdminUser>("/auth/me", token),

  // Admin — courses
  adminGetCourses: (token: string) => get<Course[]>("/admin/courses", token),
  adminGetCourse: (id: string, token: string) => get<Course>(`/admin/courses/${id}`, token),
  adminCreateCourse: (data: unknown, token: string) => post<Course>("/admin/courses", data, token),
  adminUpdateCourse: (id: string, data: unknown, token: string) => put<Course>(`/admin/courses/${id}`, data, token),
  adminDeleteCourse: (id: string, token: string) => del(`/admin/courses/${id}`, token),

  // Admin — categories
  adminGetCategories: (token: string) => get<Category[]>("/admin/categories", token),
  adminCreateCategory: (data: unknown, token: string) => post<Category>("/admin/categories", data, token),
  adminUpdateCategory: (id: string, data: unknown, token: string) => put<Category>(`/admin/categories/${id}`, data, token),
  adminDeleteCategory: (id: string, token: string) => del(`/admin/categories/${id}`, token),

  // Admin — registrations
  adminGetRegistrations: (token: string) => get<Registration[]>("/admin/registrations", token),
  adminUpdateRegistrationStatus: (id: string, status: string, token: string) =>
    patch<Registration>(`/admin/registrations/${id}/status`, { status }, token),
  adminDeleteRegistration: (id: string, token: string) => del(`/admin/registrations/${id}`, token),

  // Admin — messages
  adminGetMessages: (token: string) => get<ContactMessage[]>("/admin/messages", token),
  adminUpdateMessageStatus: (id: string, status: string, token: string) =>
    patch<ContactMessage>(`/admin/messages/${id}/status`, { status }, token),
  adminDeleteMessage: (id: string, token: string) => del(`/admin/messages/${id}`, token),

  // Admin — germany
  adminGetOpportunities: (token: string) => get<Opportunity[]>("/admin/germany", token),
  adminCreateOpportunity: (data: unknown, token: string) => post<Opportunity>("/admin/germany", data, token),
  adminUpdateOpportunity: (id: string, data: unknown, token: string) => put<Opportunity>(`/admin/germany/${id}`, data, token),
  adminDeleteOpportunity: (id: string, token: string) => del(`/admin/germany/${id}`, token),

  // Admin — testimonials
  adminGetTestimonials: (token: string) => get<Testimonial[]>("/admin/testimonials", token),
  adminCreateTestimonial: (data: unknown, token: string) => post<Testimonial>("/admin/testimonials", data, token),
  adminUpdateTestimonial: (id: string, data: unknown, token: string) => put<Testimonial>(`/admin/testimonials/${id}`, data, token),
  adminDeleteTestimonial: (id: string, token: string) => del(`/admin/testimonials/${id}`, token),

  // Admin — homepage
  adminGetHomepage: (token: string) => get<HomepageContent>("/admin/homepage", token),
  adminUpdateHomepage: (data: unknown, token: string) => patch<HomepageContent>("/admin/homepage", data, token),

  // Admin — settings
  adminGetSettings: (token: string) => get<WebsiteSettings>("/admin/settings", token),
  adminUpdateSettings: (data: unknown, token: string) => patch<WebsiteSettings>("/admin/settings", data, token),

  // Uploads
  uploadFile: (formData: FormData, token: string) => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${BASE}/uploads`, { method: "POST", headers, body: formData }).then(r => r.json()) as Promise<{ id: string; path: string; url: string }>;
  },
};

// Shared types (mirrors backend Prisma models)
export type AdminUser = { id: string; email: string; name: string };
export type Category = { id: string; name: string; slug: string; description?: string; status: string };
export type Course = {
  id: string; title: string; shortDescription: string; description: string;
  objectives: string[]; program: string[]; categoryId: string; category?: Category;
  language?: string; coverImage?: string; level?: string; duration?: string;
  schedule?: string; price?: string; location?: string; instructor?: string;
  startDate?: string; endDate?: string; availablePlaces: number;
  requirements: string[]; includedItems: string[]; status: string; featured: boolean;
};
export type Registration = {
  id: string; name: string; phone: string; email: string; courseId?: string;
  course?: { title: string }; currentLevel?: string; message?: string;
  consent: boolean; status: string; createdAt: string;
};
export type ContactMessage = {
  id: string; name: string; phone: string; email: string; message: string;
  consent: boolean; status: string; createdAt: string;
};
export type Opportunity = {
  id: string; title: string; type: string; description: string;
  requirements: string[]; germanLevel?: string; duration?: string;
  ageRequirement?: string; location?: string; sessions?: string;
  benefits: string[]; applicationInfo?: string; image?: string; status: string;
};
export type Testimonial = {
  id: string; name: string; testimonial: string; photo?: string;
  language?: string; published: boolean;
};
export type HomepageContent = {
  id: string; heroTitle: string; heroSubtitle: string; heroDescription: string;
  germanyTitle: string; germanyText: string; ctaTitle: string; ctaText: string;
};
export type WebsiteSettings = {
  id: string; centerName: string; logo?: string; phone: string; whatsapp?: string;
  email: string; address?: string; openingHours?: string; facebookUrl?: string;
  instagramUrl?: string; tiktokUrl?: string; footerText?: string;
};
