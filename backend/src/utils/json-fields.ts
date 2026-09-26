export function parseArr(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeArr(value: unknown): string {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "string") return value;
  return "[]";
}
