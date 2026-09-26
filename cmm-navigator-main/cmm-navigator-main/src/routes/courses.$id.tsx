import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Users, Target, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ButtonLink } from "@/components/ui";
import { CourseSchedule, type Slot } from "@/components/course-schedule";
import { api } from "@/lib/api";

export const Route = createFileRoute("/courses/$id")({ component: Details });

function parseSchedule(raw: string | undefined): Slot[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].day) return parsed;
  } catch { /* plain-text schedule */ }
  return null;
}

function Details() {
  const { id } = Route.useParams();
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ["course", id],
    queryFn: () => api.getCourse(id),
  });

  if (isLoading) return (
    <SiteShell>
      <div className="container-shell py-32 text-muted-foreground">Chargement…</div>
    </SiteShell>
  );

  if (isError || !course) return (
    <SiteShell>
      <div className="container-shell py-32 text-center">
        <h1 className="font-sans text-2xl font-bold">Formation introuvable</h1>
        <p className="mt-2 text-muted-foreground">Cette formation n'existe pas ou a été supprimée.</p>
        <Link to="/languages" className="mt-6 inline-block text-sm font-bold text-primary hover:underline">← Voir toutes les formations</Link>
      </div>
    </SiteShell>
  );

  const slots = parseSchedule(course.schedule ?? undefined);

  return (
    <SiteShell>
      <section className="bg-secondary py-20 text-secondary-foreground">
        <div className={`container-shell items-center gap-10 ${course.coverImage ? "grid lg:grid-cols-[1.2fr_.8fr]" : ""}`}>
          <div>
            <p className="eyebrow text-accent">{course.category?.name}</p>
            <h1>{course.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 opacity-70">{course.shortDescription}</p>
            <div className="mt-8">
              <ButtonLink to="/register" search={{ course: course.title }} variant="light">
                S'inscrire à cette formation
              </ButtonLink>
            </div>
          </div>
          {course.coverImage && (
            <div className="overflow-hidden rounded-lg">
              <img src={course.coverImage} alt={course.title} className="aspect-[4/3] w-full object-cover" />
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-14">
            {course.description && course.description !== course.shortDescription && (
              <div>
                <h2 className="text-3xl">Présentation</h2>
                <p className="mt-5 whitespace-pre-line text-lg leading-8 text-muted-foreground">{course.description}</p>
              </div>
            )}

            {course.objectives.length > 0 && (
              <div>
                <h2 className="text-3xl">Objectifs</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.objectives.map((x) => (
                    <div key={x} className="card flex items-start gap-3 p-5">
                      <Target className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="text-sm leading-6">{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.program.length > 0 && (
              <div>
                <h2 className="text-3xl">Programme</h2>
                <ol className="mt-6 grid gap-3">
                  {course.program.map((x, i) => (
                    <li key={x} className="card flex items-center gap-4 p-5">
                      <span className="font-display text-xl font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {slots && (
              <div>
                <h2 className="text-3xl">Horaires</h2>
                <p className="mt-2 text-sm text-muted-foreground">Créneaux hebdomadaires de la formation.</p>
                <div className="mt-6">
                  <CourseSchedule slots={slots} />
                </div>
              </div>
            )}

            {course.requirements.length > 0 && (
              <div>
                <h2 className="text-3xl">Prérequis</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.requirements.map((x) => (
                    <div key={x} className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
                      <ClipboardCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="text-sm leading-6">{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.includedItems.length > 0 && (
              <div>
                <h2 className="text-3xl">Ce qui est inclus</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.includedItems.map((x) => (
                    <div key={x} className="flex items-center gap-3 rounded-lg border border-border p-4">
                      <CheckCircle2 className="size-5 shrink-0 text-success" />
                      <span className="text-sm">{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="card h-fit p-6">
            <h3 className="font-sans text-lg">Informations pratiques</h3>
            <div className="mt-6 grid gap-5 text-sm">
              {course.duration && (
                <div className="flex gap-3">
                  <Clock className="size-5 text-primary shrink-0" />
                  <span>{course.duration}</span>
                </div>
              )}

              {!slots && course.schedule && (
                <div className="flex gap-3">
                  <Clock className="size-5 text-primary shrink-0" />
                  <span>{course.schedule}</span>
                </div>
              )}

              {course.location && (
                <div className="flex gap-3">
                  <MapPin className="size-5 text-primary shrink-0" />
                  <span>{course.location}</span>
                </div>
              )}
              <div className="flex gap-3">
                <Users className="size-5 text-primary shrink-0" />
                <span>{course.availablePlaces} places maximum</span>
              </div>
              {course.level && (
                <div>
                  <p className="text-muted-foreground">Niveau</p>
                  <p className="font-bold">{course.level}</p>
                </div>
              )}
              {course.price && (
                <div>
                  <p className="text-muted-foreground">Prix</p>
                  <p className="font-bold">{course.price}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
