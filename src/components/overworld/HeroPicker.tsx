"use client";

// The hero picker — three champion cards as radio options inside a form
// that posts to `chooseHero`. The radios stay in the DOM (visually hidden)
// so keyboard and screen-reader users get native single-select semantics;
// the labels carry the visual state (accent ring, "your hero" tag). Copy
// comes from `overworld.heroes.<id>` and `overworld.heroPick`.
//
// Mobile: the cards stack. Desktop: three columns.

import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { chooseHero } from "@/app/(app)/hero/actions";
import { HERO_FORMS, isHeroId, type HeroId } from "@/content/heroes";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { trackEvent } from "@/lib/analytics";

export interface HeroPickerHero {
  id: HeroId;
  /** champion card id → /cards/<cardId>.png */
  cardId: string;
  /** accent for the selected ring */
  color: string;
}

export function HeroPicker({
  heroes,
  current,
  callbackUrl,
}: {
  heroes: HeroPickerHero[];
  /** `Character.heroId` — null on the first visit */
  current: string | null;
  /** already sanitised by the page; travels back through the form */
  callbackUrl: string;
}) {
  const m = useMessages().overworld;
  const [selected, setSelected] = useState<HeroId | null>(
    isHeroId(current) ? current : null,
  );

  return (
    <form
      action={chooseHero}
      onSubmit={() => {
        if (selected) trackEvent("hero_chosen", { hero: selected });
      }}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{m.heroPick.title}</legend>

        <div className="grid gap-5 md:grid-cols-3">
          {heroes.map((hero) => {
            const copy = m.heroes[hero.id];
            const isSelected = selected === hero.id;
            const inputId = `hero-pick-${hero.id}`;

            return (
              <div key={hero.id} className="relative">
                <input
                  type="radio"
                  id={inputId}
                  name="heroId"
                  value={hero.id}
                  checked={isSelected}
                  onChange={() => setSelected(hero.id)}
                  aria-label={fmt(m.heroPick.choose, { name: copy.name })}
                  className="peer sr-only"
                />
                <label
                  htmlFor={inputId}
                  aria-pressed={isSelected}
                  data-selected={isSelected || undefined}
                  className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-ow-wood transition-transform duration-200 hover:-translate-y-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ow-frame-light motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{
                    borderColor: isSelected ? hero.color : "var(--ow-frame)",
                    boxShadow: isSelected
                      ? `0 0 0 3px ${hero.color}, 0 0 32px ${hero.color}66, 3px 4px 0 #0d0714`
                      : "3px 4px 0 #0d0714",
                  }}
                >
                  <div className="relative">
                    <Image
                      src={`/cards/${hero.cardId}.png`}
                      alt={copy.name}
                      width={848}
                      height={1264}
                      quality={60}
                      sizes="(min-width:768px) 30vw, 80vw"
                      className="h-auto w-full"
                    />
                    {isSelected && (
                      <span
                        className="absolute left-2 top-2 rounded-sm px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.15em] text-ow-wood"
                        style={{ background: hero.color, boxShadow: "2px 2px 0 #0d0714" }}
                      >
                        {m.heroPick.chosen}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 px-4 py-4">
                    <span className="font-pixel text-[13px] uppercase tracking-[0.12em] text-ow-parchment">
                      {copy.name}
                    </span>
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.25em]"
                      style={{ color: hero.color }}
                    >
                      {copy.role}
                    </span>
                    <span className="text-[12px] leading-relaxed text-ow-parchment2/80">
                      {copy.detail}
                    </span>
                    <FormLadder
                      forms={copy.forms}
                      color={hero.color}
                      label={m.heroPick.forms}
                    />
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <ConfirmButton
          disabled={!selected}
          label={m.heroPick.confirm}
          saving={m.heroPick.saving}
        />
        <p className="font-mono text-[11px] text-ow-ink-muted">
          {m.heroPick.changeLater}
        </p>
      </div>
    </form>
  );
}

/** Eight pixel squares, the first one lit; the form names ride along as a tooltip + sr-only list. */
function FormLadder({
  forms,
  color,
  label,
}: {
  forms: string[];
  color: string;
  label: string;
}) {
  const steps = Array.from({ length: HERO_FORMS }, (_, i) => forms[i] ?? "");
  const tooltip = steps.map((form, i) => `${i + 1}. ${form}`).join("\n");

  return (
    <div className="mt-2 flex items-center gap-2" title={tooltip}>
      <span className="flex items-center gap-1" aria-hidden>
        {steps.map((form, i) => (
          <span
            key={`${i}-${form}`}
            className="block h-2 w-2"
            style={{
              background: i === 0 ? color : "rgba(241, 227, 191, 0.18)",
              boxShadow: i === 0 ? `0 0 6px ${color}` : undefined,
            }}
          />
        ))}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ow-parchment2/70">
        {label} · {steps[0]}
      </span>
      <ul className="sr-only">
        {steps.map((form, i) => (
          <li key={`${i}-${form}`}>{form}</li>
        ))}
      </ul>
    </div>
  );
}

function ConfirmButton({
  disabled,
  label,
  saving,
}: {
  disabled: boolean;
  label: string;
  saving: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className="rounded-md px-8 py-3.5 font-pixel text-[13px] uppercase tracking-[0.18em] text-ow-parchment transition-transform hover:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:transition-none"
      style={{
        background: "linear-gradient(180deg, var(--ow-crimson), var(--ow-crimson-2))",
        boxShadow: "var(--ow-gilding)",
      }}
    >
      {pending ? saving : label}
    </button>
  );
}
