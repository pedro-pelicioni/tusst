type BadgeKind = "popular" | "new" | "locked";

const styles: Record<BadgeKind, string> = {
  popular: "text-pop border-pop/30 bg-pop/10",
  new: "text-new border-new/30 bg-new/10",
  locked: "text-muted border-line bg-white/[0.03]",
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span
      className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${styles[kind]}`}
    >
      {kind}
    </span>
  );
}
