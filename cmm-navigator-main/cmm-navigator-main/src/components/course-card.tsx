import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, BriefcaseBusiness } from "lucide-react";
import type { Course } from "@/lib/content";

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.categorySlug === "langues" ? BookOpen : BriefcaseBusiness;
  return <Link to="/courses/$id" params={{id:course.id}} className="card lift group flex min-h-72 flex-col overflow-hidden p-6">
    {course.coverImage ? (
      <div className="mb-6 -mx-6 -mt-6 aspect-video overflow-hidden">
        <img src={course.coverImage} alt={course.title} className="size-full object-cover transition-transform group-hover:scale-105" />
      </div>
    ) : (
      <div className="mb-12 flex items-center justify-between"><span className="grid size-11 place-items-center rounded-md bg-muted text-primary"><Icon className="size-5"/></span><ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></div>
    )}
    <p className="mb-2 text-xs font-bold uppercase text-primary">{course.category}</p><h3 className="text-2xl">{course.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{course.shortDescription}</p><p className="mt-auto pt-6 text-sm font-bold">Voir la formation</p>
  </Link>;
}
