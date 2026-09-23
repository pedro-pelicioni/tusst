"use client";

// The buy / wear button. Its own client island so the shop grid itself stays a
// server component: all this needs the client for is the pending label
// (useFormStatus) and the analytics ping. The <form> around it posts to a
// server action, so it still works with JS off — the button just won't say
// "Paying…".

import { useFormStatus } from "react-dom";
import { trackEvent } from "@/lib/analytics";

export function ArmoryAction({
  label,
  pendingLabel,
  ariaLabel,
  kind,
  itemId,
  tone = "buy",
  disabled = false,
}: {
  label: string;
  pendingLabel: string;
  ariaLabel: string;
  kind: "buy" | "equip";
  itemId: string;
  /** "buy" = crimson call to action, "quiet" = outlined secondary */
  tone?: "buy" | "quiet";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      aria-label={ariaLabel}
      onClick={() => trackEvent(kind === "buy" ? "armory_buy" : "armory_equip", { item: itemId })}
      className={
        tone === "buy"
          ? "w-full rounded-sm px-3 py-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-ow-parchment transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          : "w-full rounded-sm border border-ow-frame/70 px-3 py-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-ow-parchment2 transition-colors hover:border-ow-frame-light hover:text-ow-parchment disabled:cursor-not-allowed disabled:opacity-45"
      }
      style={
        tone === "buy"
          ? {
              background: "linear-gradient(180deg, var(--ow-crimson), var(--ow-crimson-2))",
              boxShadow: "2px 3px 0 #0d0714",
            }
          : undefined
      }
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
