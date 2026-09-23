"use client";

/* eslint-disable @next/next/no-img-element */
// The island stage: world image (or stand-in), roads + route overlay, mission
// nodes, the walking hero and the floating HUD. Server pages hand it the
// world config and per-node state; this component only knows how to walk.

import "./overworld.css";

import { useCallback, useMemo, useRef, useState } from "react";
import { preload } from "react-dom";
import { useRouter } from "next/navigation";
import type { HeroView, NodeState, Point, WorldConfig } from "@/content/overworld/types";
import { HERO_FORMS } from "@/content/heroes";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { trackEvent } from "@/lib/analytics";
import { BadgeStrip, type BadgeGroup } from "./BadgeStrip";
import { GuideBanner } from "./GuideBanner";
import { HeroFigure } from "./HeroFigure";
import { HeroHud } from "./HeroHud";
import { MissionNode } from "./MissionNode";
import { EditorOverlay, useNodeEditor } from "./NodeEditor";
import { QuestPanel } from "./QuestPanel";
import { TutorialDialog } from "./TutorialDialog";
import { WorldStandIn } from "./WorldStandIn";
import { useOverworld } from "./useOverworld";

export interface OverworldStageProps {
  world: WorldConfig;
  /** resolved on the server (fs check) — null draws the stand-in */
  imageSrc: string | null;
  nodes: NodeState[];
  groups: BadgeGroup[];
  hero: HeroView;
  /** user id or "guest" — namespaces the stored position */
  userKey: string;
  arriveAt?: string | null;
  go?: string | null;
  editable?: boolean;
  regionLabels: Record<string, string>;
  changeHeroHref: string;
}

export function OverworldStage({
  world,
  imageSrc,
  nodes,
  groups,
  hero,
  userKey,
  arriveAt,
  go,
  editable = false,
  regionLabels,
  changeHeroHref,
}: OverworldStageProps) {
  const m = useMessages();
  const router = useRouter();
  // the island is one big webp: ask for it before hydration finishes so the
  // first paint is the map, not bare sea
  if (imageSrc) preload(imageSrc, { as: "image", fetchPriority: "high" });
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const placed = useMemo(
    () => world.nodes.map((wn) => nodeById.get(wn.id)).filter((n): n is NodeState => !!n),
    [world.nodes, nodeById],
  );
  // the guide counts missions, not gates: on the campaign island the
  // fortresses open the act but are not steps of their own
  const missions = useMemo(
    () => (placed.some((n) => n.kind === "waypoint") ? placed.filter((n) => n.kind === "waypoint") : placed),
    [placed],
  );
  const recommended = placed.find((n) => n.recommended) ?? null;
  const recommendedIndex = recommended ? missions.indexOf(recommended) + 1 : 0;
  const canTravel = useCallback((id: string) => nodeById.get(id)?.status !== "locked", [nodeById]);

  const [hint, setHint] = useState<string | null>(null);
  /** the node this visitor last clicked — see `activate` */
  const clickedRef = useRef<string | null>(null);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);

  /** client pixels → world percent (the editor's coordinate readout) */
  const toWorldPercent = useCallback((clientX: number, clientY: number): Point | null => {
    const el = worldRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return [((clientX - r.left) / r.width) * 100, ((clientY - r.top) / r.height) * 100];
  }, []);
  const editor = useNodeEditor(world, editable, toWorldPercent);

  const ow = useOverworld({
    refs: { shellRef, worldRef, heroRef, routePathRef },
    world,
    nodes: placed,
    storageKey: `tusst:ow:${world.id}:${userKey}`,
    arriveAt,
    go,
    defaultSelected: recommended?.id ?? placed[0]?.id ?? null,
    canTravel,
    overrides: editable ? editor.overrides : undefined,
    roadsOverride: editable ? editor.roads : undefined,
    onArrive: () => setHint(null),
  });
  const selected = ow.selectedId ? nodeById.get(ow.selectedId) ?? null : null;
  const aspect = ow.aspect;
  const H = 100 / aspect;

  const positionOf = (id: string): Point => {
    const wn = world.nodes.find((n) => n.id === id);
    return (editable ? editor.overrides[id] : undefined) ?? wn?.pos ?? world.start;
  };

  const walk = () => {
    if (!selected) return;
    if (!ow.travel(selected.id)) setHint(selected.lockedNote ?? m.overworld.quest.lockedRegion);
  };
  const enter = () => {
    if (!selected?.href) return;
    trackEvent("mission_enter", { world: world.id, id: selected.id });
    router.push(selected.href);
  };
  // Point-and-click on the island itself. The first click on a node opens its
  // card (unchanged), a second click on the SAME node sets off: walking there,
  // or entering when the hero already stands on it. Peeking at a mission stays
  // free, and nobody has to find the side panel to move.
  const activate = (id: string) => {
    // A pan that happens to end over a node still fires a click.
    if (ow.consumeDragClick()) return;
    // Gate on what this visitor actually clicked, not on `selectedId`: coming
    // back from a mission restores both the selection AND the hero's position,
    // so keying off selection alone would make a single click re-enter the
    // chapter the player just left.
    if (clickedRef.current !== id) {
      clickedRef.current = id;
      setHint(null);
      ow.select(id);
      return;
    }
    const node = nodeById.get(id);
    if (!node) return;
    if (node.href && ow.isNear(id)) {
      trackEvent("mission_enter", { world: world.id, id });
      router.push(node.href);
      return;
    }
    if (!ow.travel(id)) setHint(node.lockedNote ?? m.overworld.quest.lockedRegion);
  };

  const goCurrent = () => {
    if (!recommended) return;
    ow.select(recommended.id);
    ow.travel(recommended.id);
  };

  const roads = editable ? editor.roads : world.roads;

  return (
    <div
      ref={shellRef}
      className="ow-shell"
      role="application"
      aria-label={m.overworld.map.ariaLabel}
      tabIndex={-1}
      {...ow.dragHandlers}
    >
      <div
        ref={worldRef}
        className={`ow-world ${ow.dragging ? "is-dragging" : ""}`}
        onClick={editable ? editor.onWorldClick : undefined}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="" fetchPriority="high" decoding="async" draggable={false} />
        ) : (
          <WorldStandIn world={world} roads={roads} />
        )}
        <div className="ow-vignette" />

        <svg className="ow-route" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden>
          {editable &&
            roads.map((road, i) => (
              <path
                key={i}
                className="ow-route-roads"
                d={road.map((p, j) => `${j ? "L" : "M"}${p[0]} ${p[1] / aspect}`).join(" ")}
              />
            ))}
          {editable && editor.draft.length > 1 && (
            <path
              className="ow-route-roads"
              style={{ stroke: "#ff5f9e" }}
              d={editor.draft.map((p, j) => `${j ? "L" : "M"}${p[0]} ${p[1] / aspect}`).join(" ")}
            />
          )}
          <path ref={routePathRef} d="" />
        </svg>

        {world.regions.map((r) => (
          <span key={r.id} className="ow-region" style={{ left: `${r.pos[0]}%`, top: `${r.pos[1]}%` }}>
            {regionLabels[r.id] ?? r.id}
          </span>
        ))}

        {placed.map((n) => (
          <MissionNode
            key={n.id}
            node={n}
            pos={positionOf(n.id)}
            selected={n.id === ow.selectedId}
            onSelect={activate}
            onDragStart={editable ? editor.onNodeDragStart : undefined}
          />
        ))}

        <div
          ref={heroRef}
          className={`ow-hero ${ow.moving ? "is-walking" : ""} ${ow.arrivedAt ? "is-arriving" : ""} ${hero.form >= HERO_FORMS - 1 ? "is-divine" : hero.form >= 5 ? "is-ascended" : ""}`}
          data-level={hero.level}
          aria-label={`${hero.name} · ${fmt(m.overworld.hud.level, { level: hero.level })} · ${hero.formName}`}
        >
          <span className="ow-hero-level">{fmt(m.overworld.hud.level, { level: hero.level })}</span>
          <HeroFigure hero={hero} />
        </div>

        {editable && <EditorOverlay cursor={editor.cursor} draft={editor.draft} copied={editor.copied} />}
      </div>

      {/* ── HUD ── */}
      <HeroHud hero={hero} changeHref={changeHeroHref} />
      <GuideBanner
        recommended={recommended}
        index={recommendedIndex}
        total={missions.length}
        near={recommended ? ow.isNear(recommended.id) : false}
      />
      <QuestPanel
        node={selected}
        near={ow.nearSelected}
        moving={ow.moving}
        currentId={recommended?.id ?? null}
        onWalk={walk}
        onEnter={enter}
        onGoCurrent={goCurrent}
      />
      <BadgeStrip groups={groups} onSelect={ow.select} />
      <button
        type="button"
        className="ow-hud ow-btn-dark bottom-4 left-3 text-[11px] max-md:bottom-14"
        onClick={ow.centerCamera}
        title={m.overworld.hud.centerCamera}
      >
        ◎ {m.overworld.hud.recenter}
      </button>
      {!imageSrc && (
        <p className="ow-hud ow-eyebrow bottom-16 left-3 text-[#ffe7a6] drop-shadow max-md:hidden">{m.overworld.map.standIn}</p>
      )}
      {hint && (
        <div className="ow-hud ow-panel-parchment bottom-[92px] left-1/2 -translate-x-1/2 px-4 py-2 text-[12px]" role="status">
          {hint}
        </div>
      )}

      <TutorialDialog hero={hero} />
    </div>
  );
}
