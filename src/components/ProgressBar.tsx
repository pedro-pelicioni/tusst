export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const empty = clamped === 0;

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-accent transition-[width]"
        style={{
          width: empty ? "14px" : `${clamped}%`,
          opacity: empty ? 0.45 : 1,
        }}
      />
    </div>
  );
}
