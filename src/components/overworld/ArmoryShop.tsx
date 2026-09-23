// The Armory shop floor. A server component on purpose: the only thing that
// needs the client is the pending label on a button (<ArmoryAction>), so the
// 24 cards, their prices and their owned/worn state are rendered on the server
// straight out of the view model — nothing about the economy is shipped to the
// browser except what is already on screen.
//
// The slot tabs are LINKS, not client state, so the shop survives a JS-less
// visit and so the server action can redirect the player back to the slot they
// were shopping in (?slot=mascot).

import Link from "next/link";
import { buyItem, equipItem } from "@/app/(app)/armory/actions";
import type { ArmorySlot } from "@/content/armory";
import type { HeroView } from "@/content/overworld/types";
import type { Messages } from "@/i18n/messages";
import { fmt } from "@/i18n/format";
import type { ArmoryItemView, ArmoryView } from "@/lib/armory-view";
import { ArmoryAction } from "./ArmoryAction";
import { ItemSprite } from "./ItemSprite";
import { LoadoutFigure } from "./LoadoutFigure";
import "./armory.css";

type ArmoryCopy = Messages["armory"];

export function ArmoryShop({
  view,
  hero,
  active,
  error,
  m,
}: {
  view: ArmoryView;
  hero: HeroView;
  active: ArmorySlot;
  error: string | null;
  m: ArmoryCopy;
}) {
  const slot = view.slots.find((s) => s.slot === active) ?? view.slots[0];
  // `Object.hasOwn`, not `in`: `in` walks the prototype chain, so ?err=__proto__
  // or ?err=toString resolved to a non-string and crashed the render.
  const errorText =
    error && Object.hasOwn(m.err, error)
      ? m.err[error as keyof ArmoryCopy["err"]]
      : null;

  return (
    <div className="mt-8">
      {/* ── the mirror: what you are wearing right now ── */}
      <section className="flex flex-col items-center gap-5 border-2 border-ow-frame/60 bg-ow-wood p-5 sm:flex-row sm:items-start sm:gap-7">
        <LoadoutFigure hero={hero} slots={view.slots} size={128} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="font-pixel text-[13px] uppercase tracking-[0.16em] text-ow-parchment">
            {m.loadout.title}
          </h2>
          <ul className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            {view.slots.map((s) => {
              const piece = s.equipped;
              return (
                <li
                  key={s.slot}
                  className="flex items-center gap-2 border px-2.5 py-1.5"
                  style={{ borderColor: piece ? piece.color : "rgba(185,138,73,0.4)" }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ow-parchment2">
                    {m.slots[s.slot]}
                  </span>
                  <span className="font-pixel text-[10px] text-ow-parchment">
                    {piece ? m.items[piece.id].name : m.loadout.slotEmpty}
                  </span>
                </li>
              );
            })}
          </ul>
          {view.ownedCount === 0 ? (
            <p className="mt-3 text-[12px] leading-relaxed text-ow-parchment2">
              {m.loadout.empty}
            </p>
          ) : (
            <p className="mt-3 font-mono text-[11px] text-ow-parchment2">
              {fmt(m.collection, { owned: view.ownedCount, total: view.totalCount })}
            </p>
          )}
        </div>
      </section>

      {errorText && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-ow-crimson bg-ow-crimson/15 px-4 py-3 text-[12px] text-ow-ink"
        >
          {errorText}
        </p>
      )}

      {/* ── slot tabs ── */}
      <nav className="mt-7 flex flex-wrap gap-2" aria-label={m.slotsNav}>
        {view.slots.map((s) => {
          const isActive = s.slot === active;
          return (
            <Link
              key={s.slot}
              href={`/armory?slot=${s.slot}`}
              aria-current={isActive ? "page" : undefined}
              className={`border px-3.5 py-2 font-pixel text-[10px] uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "border-ow-frame-light bg-ow-wood text-ow-parchment"
                  : "border-ow-frame/45 text-ow-ink hover:border-ow-frame hover:bg-ow-frame/15"
              }`}
            >
              {m.slots[s.slot]}
              <span className="ml-2 font-mono text-[9px] opacity-75">
                {s.ownedCount}/{s.items.length}
              </span>
            </Link>
          );
        })}
      </nav>

      <p className="mt-4 text-[12px] leading-relaxed text-ow-ink-muted">
        {m.slotIntro[slot.slot]}
        {!slot.sheet && <span className="ml-2 text-ow-ink">{m.artPending}</span>}
      </p>

      <div className="ow-shop-grid mt-5">
        {slot.items.map((item) => (
          <ItemCard key={item.id} item={item} sheet={slot.sheet} m={m} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  sheet,
  m,
}: {
  item: ArmoryItemView;
  sheet: string | null;
  m: ArmoryCopy;
}) {
  const copy = m.items[item.id];
  const locked = !item.owned && !item.affordable;

  return (
    <article
      className={`ow-shop-card${item.equipped ? " is-equipped" : ""}${locked ? " is-locked" : ""}`}
      style={item.equipped ? { boxShadow: `0 0 0 2px ${item.color}, 3px 4px 0 #0d0714` } : undefined}
    >
      <ItemSprite
        cell={item.cell}
        slot={item.slot}
        sheet={sheet}
        color={item.color}
        size={72}
      />

      <h3 className="text-center font-pixel text-[11px] leading-tight text-ow-parchment">
        {copy.name}
      </h3>
      <span
        className="font-mono text-[9px] uppercase tracking-[0.2em]"
        style={{ color: item.color }}
      >
        {m.rarity[item.rarity]}
      </span>
      <p className="min-h-[48px] text-center text-[11px] leading-snug text-ow-parchment2/75">
        {copy.detail}
      </p>

      {item.owned ? (
        <div className="w-full space-y-2">
          {item.equipped ? (
            <>
              <p className="text-center font-pixel text-[10px] uppercase tracking-[0.14em] text-ow-frame-light">
                {m.equipped}
              </p>
              <form action={equipItem}>
                <input type="hidden" name="slot" value={item.slot} />
                <ArmoryAction
                  kind="equip"
                  itemId={item.id}
                  tone="quiet"
                  label={m.unequip}
                  pendingLabel={m.equipping}
                  ariaLabel={fmt(m.unequipAria, { name: copy.name })}
                />
              </form>
            </>
          ) : (
            <form action={equipItem}>
              <input type="hidden" name="slot" value={item.slot} />
              <input type="hidden" name="itemId" value={item.id} />
              <ArmoryAction
                kind="equip"
                itemId={item.id}
                tone="quiet"
                label={m.equip}
                pendingLabel={m.equipping}
                ariaLabel={fmt(m.equipAria, { name: copy.name })}
              />
            </form>
          )}
        </div>
      ) : (
        <div className="w-full space-y-2 text-center">
          <p className="ow-shop-price">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gold-coin.png" alt="" />
            {item.price}
          </p>
          {locked ? (
            <p className="text-center font-mono text-[10px] text-ow-parchment2/55">
              {fmt(m.missing, { missing: item.missing })}
            </p>
          ) : (
            <form action={buyItem}>
              <input type="hidden" name="itemId" value={item.id} />
              <ArmoryAction
                kind="buy"
                itemId={item.id}
                label={m.buy}
                pendingLabel={m.buying}
                ariaLabel={fmt(m.buyAria, { name: copy.name, price: item.price })}
              />
            </form>
          )}
        </div>
      )}
    </article>
  );
}
