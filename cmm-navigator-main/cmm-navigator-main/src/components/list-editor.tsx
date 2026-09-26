import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function ListEditor({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  function add() { onChange([...value, ""]); }
  function update(i: number, v: string) { onChange(value.map((x, idx) => (idx === i ? v : x))); }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
    onChange(next);
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
        >
          <Plus className="size-3" /> Ajouter
        </button>
      </div>
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">Aucun élément. Cliquez sur « Ajouter ».</p>
      )}
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="mt-1 flex flex-col text-muted-foreground">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30" aria-label="Monter">
                <ChevronUp className="size-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="disabled:opacity-30" aria-label="Descendre">
                <ChevronDown className="size-3.5" />
              </button>
            </div>
            <span className="mt-2 w-5 shrink-0 text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="input flex-1"
            />
            <button type="button" onClick={() => remove(i)} className="mt-1.5" aria-label="Supprimer">
              <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
