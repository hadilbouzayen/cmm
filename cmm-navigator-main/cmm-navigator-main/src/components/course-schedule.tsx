export type Slot = { day: string; start: string; end: string };

const DAY_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAY_SHORT: Record<string, string> = {
  Lundi: "Lun", Mardi: "Mar", Mercredi: "Mer", Jeudi: "Jeu",
  Vendredi: "Ven", Samedi: "Sam", Dimanche: "Dim",
};

/** Weekly visual representation of a course's schedule slots. */
export function CourseSchedule({ slots }: { slots: Slot[] }) {
  const byDay = new Map<string, Slot[]>();
  for (const s of slots) {
    if (!byDay.has(s.day)) byDay.set(s.day, []);
    byDay.get(s.day)!.push(s);
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {DAY_ORDER.map((day) => {
        const daySlots = (byDay.get(day) ?? []).slice().sort((a, b) => a.start.localeCompare(b.start));
        const active = daySlots.length > 0;
        return (
          <div
            key={day}
            className={`rounded-lg border p-3 text-center ${
              active ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-60"
            }`}
          >
            <p className={`text-xs font-bold uppercase tracking-wide ${active ? "text-primary" : "text-muted-foreground"}`}>
              {DAY_SHORT[day] ?? day}
            </p>
            <div className="mt-3 space-y-2">
              {active ? (
                daySlots.map((s, i) => (
                  <div key={i} className="rounded-md bg-background px-1.5 py-1 text-xs font-medium leading-tight shadow-sm">
                    <span>{s.start}</span>
                    <span className="mx-0.5 text-muted-foreground">–</span>
                    <span>{s.end}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">—</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
