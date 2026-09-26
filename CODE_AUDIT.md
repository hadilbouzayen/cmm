# CMM Website — Code Audit & Issue Report

A review of the current codebase (frontend `cmm-navigator-main`, backend `backend`) listing dead
buttons/links, missing components, bugs, and things that should be done better. Each item notes the
**file**, **why it matters**, and a **suggested fix**. Ordered by severity.

Legend: 🔴 broken / data-losing · 🟠 missing feature · 🟡 code quality / UX · 🔵 infra / security

---

## 🔴 Broken / dead things

### 1. Admin session is lost on every page refresh
- **Where:** `src/lib/auth-store.ts` — the JWT lives in a plain module variable (`let _auth`), in memory only.
- **Why it matters:** Refreshing (or deep-linking) any `/admin` page wipes the token, so every admin page's `useEffect` guard immediately bounces you back to `/admin/login`. There's also a visible flash of the protected page before the redirect.
- **Fix:** Persist the token in `localStorage`/`sessionStorage`, rehydrate on load, and validate it with the already-built `GET /api/auth/me`. Replace per-page `useEffect` guards with a single route guard (see #11).

### 2. Floating action button dials the phone — it is not a WhatsApp button
- **Where:** `src/components/site-shell.tsx` — the fixed green button is `href="tel:..."` with a `Phone` icon.
- **Why it matters:** The content spec (PDF §Éléments communs) explicitly requires a **fixed WhatsApp button**. The green color implies WhatsApp but it opens the dialer. The `settings.whatsapp` value is stored but never used.
- **Fix:** Link to `https://wa.me/<international-number>` and use a WhatsApp icon, driven by `settings.whatsapp`.

### 3. Social media links are stored but never displayed
- **Where:** `settings.facebookUrl / instagramUrl / tiktokUrl` are editable in `/admin/settings`, but the footer in `src/components/site-shell.tsx` renders none of them.
- **Why it matters:** Dead data — an admin edits social links that never appear. The PDF requires social networks in the footer.
- **Fix:** Render the three social links in the footer when present.

### 4. Homepage language links are fragile and can 404
- **Where:** `src/routes/index.tsx` — a hardcoded `languages = ["Allemand", ...]` array is matched to courses by exact title (`c.title === l`) to resolve the id, falling back to `id: ""`.
- **Why it matters:** If a language course is renamed, deactivated, or removed in admin, the match fails and the link points to `/courses/` → **404**. The list also won't reflect newly added languages.
- **Fix:** Render the language grid from `data.courses` filtered by the Langues category instead of a static array.

---

## 🟠 Missing components / features

### 5. No category management UI
- **Where:** No `/admin/categories` route exists (only `admin/{index,login,courses,registrations,messages,germany,testimonials,homepage,settings}.tsx`).
- **Why it matters:** Creating a course requires picking a `categoryId`, but categories can only be created via the seed. Admins can't add/rename/delete categories, and if the list is ever emptied, no course can be created. Backend CRUD endpoints already exist — only the UI is missing.
- **Fix:** Add an `/admin/categories` page (list + add/edit/delete) using the existing `api.adminGetCategories / adminCreateCategory / ...`.

### 6. Germany opportunity form can't edit benefits or requirements
- **Where:** `src/routes/admin/germany.tsx` keeps `benefits[]` and `requirements[]` in form state but renders **no inputs** for them; the public page (`src/routes/germany.tsx`) prominently lists `benefits`.
- **Why it matters:** Same gap the course form had before it was fixed — an admin cannot fill the most visible part of a Germany opportunity.
- **Fix:** Add the existing `ListEditor` component for `benefits` and `requirements`.

### 7. No image upload anywhere in the admin UI
- **Where:** Backend `POST /api/uploads` and `api.uploadFile()` exist and work, but **no admin form uses them**.
- **Why it matters:** `coverImage` (courses), `photo` (testimonials), `image` (germany), and `logo`/hero images (settings/homepage) can never be set. Course and Germany cards show icon placeholders instead of real photos, which the PDF requires.
- **Fix:** Add an image field (upload → returns `path`) to the course, testimonial, germany, and settings forms.

### 8. Form submissions notify no one
- **Where:** `backend` — `submitRegistration` / `submitContact` only write to SQLite.
- **Why it matters:** The PDF requires forms to email a recipient and show a confirmation. Nobody is alerted when a lead comes in; staff must manually watch the admin.
- **Fix:** Send an email (e.g., Nodemailer/SMTP) on submission, plus an optional auto-reply.

### 9. No spam protection on public forms
- **Where:** `POST /api/registrations` and `POST /api/contact` are open with no rate limiting, honeypot, or captcha.
- **Why it matters:** The PDF explicitly requires spam-protected forms. As-is the DB can be flooded.
- **Fix:** Add rate limiting (e.g., `express-rate-limit`) and a honeypot field; optionally captcha.

### 10. Contact page map is a placeholder
- **Where:** `src/routes/contact.tsx` renders a "Carte disponible après validation" box.
- **Why it matters:** No Google Map embed (listed as recommended in the PDF). Fine to defer, but currently non-functional.

---

## 🟡 Should be done better (code quality / UX)

### 11. Auth guard duplicated in every admin page
- **Where:** Each admin route repeats `const token = authStore.getToken(); useEffect(() => { if (!token) navigate(...) }, [token])`.
- **Why it matters:** Boilerplate in ~8 files and a flash of protected content before redirect.
- **Fix:** Introduce a pathless `admin` layout route with a `beforeLoad` guard that redirects unauthenticated users once, centrally.

### 12. Hardcoded category-name string matching
- **Where:** `src/routes/professional-training.tsx` and `languages.tsx` filter by `c.category === "Formation professionnelle"` / `"Langues"`; `src/components/course-card.tsx` picks its icon by `course.category === "Langues"`.
- **Why it matters:** Renaming a category in admin silently breaks these pages (empty lists / wrong icons).
- **Fix:** Filter/branch on a stable category id rather than the display name.

### 13. Inconsistent delete confirmations
- **Where:** `admin/courses.tsx` asks `confirm()` before delete; `registrations`, `messages`, `testimonials`, and `germany` delete instantly.
- **Why it matters:** One misclick permanently deletes a lead/opportunity with no undo.
- **Fix:** Use a consistent confirm dialog (or the existing `alert-dialog` component) across all destructive actions.

### 14. Wrong icon for the mobile admin menu toggle
- **Where:** `src/routes/admin/index.tsx` — the sidebar hamburger uses `MessageSquare`.
- **Why it matters:** Confusing affordance; it looks like a messages button, not a menu.
- **Fix:** Use the `Menu` icon.

### 15. No loading / skeleton states on public pages
- **Where:** `src/lib/content-store.tsx` returns empty arrays while React Query is fetching.
- **Why it matters:** Pages (notably the homepage hero) render blank for a beat on load — this is the "blank hero" seen earlier.
- **Fix:** Show skeletons or a spinner while `isLoading`, and keep hero text from the settings/homepage query.

### 16. API failures are invisible to visitors
- **Where:** `src/lib/content-store.tsx` swallows query errors and falls back to empty content.
- **Why it matters:** If the backend is down, visitors see empty sections with no explanation.
- **Fix:** Surface a friendly error/retry state when the core queries fail.

---

## 🔵 Backend / security / infra

### 17. Weak default JWT secret shipped in `.env`
- **Where:** `backend/.env` — `JWT_SECRET="change-this-secret-in-production-min-32-chars"`.
- **Why it matters:** Anyone who knows the default can forge admin tokens. Must be rotated before any real deployment.
- **Fix:** Generate a strong secret per environment; never commit real secrets.

### 18. No automated database/uploads backup
- **Where:** `architecture.md` §15 specifies scheduled `cmm.db` + uploads backups; not implemented.
- **Fix:** Add a scheduled job that copies `data/cmm.db` (+ `uploads/`) to `backups/` daily.

### 19. Migration history was abandoned in favor of `db push`
- **Where:** Schema changes are applied with `prisma db push` (no migration files after the reset).
- **Why it matters:** Fine for local dev, but production deploys should use versioned migrations for safe, repeatable schema changes.
- **Fix:** Baseline a migration and use `prisma migrate deploy` for releases.

### 20. Secrets file not protected
- **Where:** `backend/.env` exists with no `.gitignore` (the project isn't a git repo yet).
- **Fix:** Add `.gitignore` covering `.env`, `data/`, `uploads/`, `node_modules/` before initializing git.

### 21. `Category.slug` is now dead weight
- **Where:** After course slugs were removed, `Category.slug` is still generated but used for no link.
- **Fix:** Either use it (e.g., category landing pages) or drop it from the schema.

---

## Quick-win priority

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 1 | Persist admin token + central route guard (#1, #11) | ~1–2h | High |
| 6 | Germany benefits/requirements list editors (#6) | ~30m | High |
| 5 | Category management page (#5) | ~1–2h | High |
| 7 | Image upload in admin forms (#7) | ~2–3h | High |
| 2/3 | WhatsApp button + footer social links (#2, #3) | ~45m | Medium |
| 4/12 | De-hardcode category/language matching (#4, #12) | ~1h | Medium |
| 8/9 | Email notifications + spam protection (#8, #9) | ~2–3h | Medium |
| 13/14/15 | Delete confirms, menu icon, loading states | ~1–2h | Polish |

**Note:** Items #5, #6, #7 are the same class of gap as the course-content issue already fixed — the
data model supports them, but the admin UI to populate them is missing.
