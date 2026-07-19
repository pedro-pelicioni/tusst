"use client";

import { useMessages } from "@/i18n/client";

// Shown once per session when the Forge opens on a phone/tablet: sets the
// expectation that this is the compact, essentials-only Forge and the full
// smithy lives on desktop. Dismissing it hands off to the mobile tutorial.

export function MobileNotice({ onContinue }: { onContinue: () => void }) {
  const m = useMessages();

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-[#0b0817] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">
          {m.ide.mobile.noticeTag}
        </p>
        <h2 className="mt-2 font-display text-lg text-fg">{m.ide.mobile.noticeTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted2">{m.ide.mobile.noticeBody}</p>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-pop/80">
          {m.ide.mobile.noticeHereTitle}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {m.ide.mobile.noticeHereItems.map((item) => (
            <li key={item} className="flex gap-2 text-[13px] text-fg/90">
              <span className="text-pop">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
          {m.ide.mobile.noticeDesktopTitle}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {m.ide.mobile.noticeDesktopItems.map((item) => (
            <li key={item} className="flex gap-2 text-[13px] text-muted2">
              <span className="text-muted">✕</span>
              {item}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onContinue}
          className="mt-5 w-full rounded-full px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px]"
          style={{
            background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
            boxShadow: "0 0 20px rgba(143,123,255,0.35)",
          }}
        >
          {m.ide.mobile.noticeContinue}
        </button>
      </div>
    </div>
  );
}
