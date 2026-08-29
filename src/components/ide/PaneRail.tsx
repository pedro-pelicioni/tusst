"use client";

// The stub a collapsed pane leaves behind. Without it a hidden pane is a pane
// the user cannot get back without knowing the shortcut — the whole reason
// "hide the files" felt broken was that nothing came back.
//
// `side` decides which way the label reads, so the text always runs away from
// the editor rather than into it.

export function PaneRail({
  side,
  label,
  title,
  onOpen,
  accent,
}: {
  side: "left" | "right" | "bottom";
  label: string;
  title: string;
  onOpen: () => void;
  /** optional trailing marker (the console uses it for the run status) */
  accent?: React.ReactNode;
}) {
  const horizontal = side === "bottom";

  return (
    <button
      type="button"
      onClick={onOpen}
      title={title}
      aria-label={title}
      aria-expanded={false}
      className={`group flex shrink-0 items-center justify-center gap-2 bg-bg-elev text-muted transition hover:text-fg ${
        horizontal
          ? "h-7 w-full border-t border-line px-3"
          : `w-7 flex-col border-line py-3 ${side === "left" ? "border-r" : "border-l"}`
      }`}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.2em]"
        style={
          horizontal
            ? undefined
            : {
                writingMode: "vertical-rl",
                transform: side === "left" ? "rotate(180deg)" : undefined,
              }
        }
      >
        {label}
      </span>
      {accent}
      <span
        aria-hidden
        className="font-mono text-[10px] leading-none text-muted/70 transition group-hover:text-accent"
      >
        {side === "left" ? "›" : side === "right" ? "‹" : "⌃"}
      </span>
    </button>
  );
}
