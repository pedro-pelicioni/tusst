// Tiny `{name}`-style interpolation for message strings.
// Usage: fmt(m.lesson.goldEarned, { gold: 25 }) with "You earned {gold} gold".
export function fmt(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
