export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function makeId(prefix: string, n: number): string {
  return `${prefix}-${n}`;
}

export function getWeekday(dateStr: string): number {
  return new Date(dateStr).getDay();
}
