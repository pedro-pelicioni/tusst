"use client";

// The island's state machine: where the hero stands, where they're walking,
// which node is selected, and the camera. Movement is imperative (refs +
// requestAnimationFrame painting CSS variables) so the 30-odd nodes never
// re-render per frame; React state only carries the discrete facts the HUD
// reads (selection, moving, near, arrival).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import {
  advance,
  buildGraph,
  shortestPath,
  worldDistance,
  type Graph,
} from "@/lib/overworld/graph";
import type { NodeState, Point, WorldConfig } from "@/content/overworld/types";

export const NEAR_DISTANCE = 3.1;
const SPEED = 24; // world units per second
const CAMERA_LERP = 0.12;
// A pan must out-travel the platform's tap slop, or a normal thumb tap (which
// rolls a few pixels) gets read as a drag and the tap is lost. Android's slop
// is 8dp, iOS's ~10px, so touch needs a higher bar than a mouse. Measured as
// real distance: a Manhattan sum trips at 3.5px on the diagonal.
const DRAG_THRESHOLD_MOUSE = 5;
const DRAG_THRESHOLD_TOUCH = 14;
const SAVE_EVERY_MS = 2500;

interface Stored {
  pos: Point;
  selected: string | null;
}

function readStored(key: string): Stored | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (
      Array.isArray(parsed.pos) &&
      parsed.pos.length === 2 &&
      parsed.pos.every((n) => Number.isFinite(n))
    ) {
      return { pos: [parsed.pos[0], parsed.pos[1]], selected: typeof parsed.selected === "string" ? parsed.selected : null };
    }
  } catch {
    /* private mode / quota — the hero just starts at the pier */
  }
  return null;
}

function writeStored(key: string, value: Stored) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export interface OverworldRefs {
  shellRef: RefObject<HTMLDivElement | null>;
  worldRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLDivElement | null>;
  routePathRef: RefObject<SVGPathElement | null>;
}

export interface UseOverworldOptions {
  /** DOM refs owned by the stage (kept out of the returned object so the
   *  React compiler can tell state from refs) */
  refs: OverworldRefs;
  world: WorldConfig;
  nodes: NodeState[];
  /** localStorage key for the hero position (per world + user) */
  storageKey: string;
  /** stand on this node on mount (returning from a mission) */
  arriveAt?: string | null;
  /** auto-travel to this node right after mount (victory → next) */
  go?: string | null;
  /** first selection when nothing is stored */
  defaultSelected: string | null;
  canTravel: (id: string) => boolean;
  onArrive?: (id: string) => void;
  /** position overrides while the dev editor is dragging nodes */
  overrides?: Record<string, Point>;
  roadsOverride?: Point[][];
}

export interface OverworldController {
  graph: Graph;
  aspect: number;
  selectedId: string | null;
  select: (id: string) => void;
  travel: (id: string) => boolean;
  stop: () => void;
  centerCamera: () => void;
  moving: boolean;
  nearSelected: boolean;
  arrivedAt: string | null;
  dragging: boolean;
  ready: boolean;
  /** current hero position (only refreshed on discrete events, not per frame) */
  position: Point;
  isNear: (id: string) => boolean;
  /**
   * True when the gesture that just ended was a pan, not a pick — and clears
   * the flag. A click fires after pointerup even when the pointer travelled,
   * so anything that acts on a node click must consume this first or dragging
   * the map across a node would set off on a journey.
   */
  consumeDragClick: () => boolean;
  dragHandlers: {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void;
  };
}

export function useOverworld(opts: UseOverworldOptions): OverworldController {
  const { refs, world, nodes, storageKey, arriveAt, go, defaultSelected, canTravel, onArrive, overrides, roadsOverride } = opts;
  const { shellRef, worldRef, heroRef, routePathRef } = refs;
  const aspect = world.image.width / world.image.height;

  const nodePositions = useMemo(() => {
    const map = new Map<string, Point>();
    for (const n of world.nodes) map.set(n.id, overrides?.[n.id] ?? n.pos);
    return map;
  }, [world.nodes, overrides]);

  const graph = useMemo(
    () =>
      buildGraph(
        roadsOverride ?? world.roads,
        world.nodes.map((n) => ({ id: n.id, pos: nodePositions.get(n.id) ?? n.pos })),
        aspect,
      ),
    [world.roads, world.nodes, roadsOverride, nodePositions, aspect],
  );

  const posRef = useRef<Point>([...world.start] as Point);
  const routeRef = useRef<Point[]>([]);
  const targetRef = useRef<string | null>(null);
  const facingRef = useRef<-1 | 1>(1);
  const followRef = useRef(true);
  const cameraRef = useRef({ x: 0, y: 0 });
  const shellSize = useRef({ w: 1, h: 1 });
  const worldSize = useRef({ w: 1, h: 1 });
  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    cx: number;
    cy: number;
    moved: boolean;
    slop: number;
  } | null>(null);
  const draggedRef = useRef(false);
  const lastTick = useRef(0);
  const lastSave = useRef(0);
  const selectedRef = useRef<string | null>(null);
  const onArriveRef = useRef(onArrive);
  useEffect(() => {
    onArriveRef.current = onArrive;
  }, [onArrive]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [nearSelected, setNearSelected] = useState(false);
  const [arrivedAt, setArrivedAt] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const [position, setPosition] = useState<Point>(world.start);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const isNear = useCallback(
    (id: string) => {
      const p = nodePositions.get(id);
      return !!p && worldDistance(posRef.current, p, aspect) < NEAR_DISTANCE;
    },
    [nodePositions, aspect],
  );

  const persist = useCallback(() => {
    writeStored(storageKey, { pos: [...posRef.current] as Point, selected: selectedRef.current });
    setPosition([...posRef.current] as Point);
  }, [storageKey]);

  // ── painting ────────────────────────────────────────────────────
  const clampCamera = useCallback((x: number, y: number) => {
    const { w: W, h: H } = shellSize.current;
    const { w, h } = worldSize.current;
    return {
      x: Math.min(0, Math.max(W - w, x)),
      y: Math.min(0, Math.max(H - h, y)),
    };
  }, []);

  const paintCamera = useCallback(() => {
    const el = worldRef.current;
    if (!el) return;
    const { x, y } = cameraRef.current;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }, [worldRef]);

  const paintHero = useCallback(() => {
    const el = heroRef.current;
    if (!el) return;
    const [x, y] = posRef.current;
    el.style.setProperty("--map-x", `${x}%`);
    el.style.setProperty("--map-y", `${y}%`);
    el.style.setProperty("--facing", String(facingRef.current));
  }, [heroRef]);

  const paintRoute = useCallback(() => {
    const el = routePathRef.current;
    if (!el) return;
    const route = routeRef.current;
    if (!route.length) {
      el.setAttribute("d", "");
      return;
    }
    const pts = [posRef.current, ...route];
    el.setAttribute(
      "d",
      pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${(p[1] / aspect).toFixed(2)}`).join(" "),
    );
  }, [aspect, routePathRef]);

  const cameraTarget = useCallback(() => {
    const { w: W, h: H } = shellSize.current;
    const { w, h } = worldSize.current;
    const [x, y] = posRef.current;
    return clampCamera(W / 2 - (x / 100) * w, H / 2 - (y / 100) * h);
  }, [clampCamera]);

  const centerCamera = useCallback(() => {
    followRef.current = true;
  }, []);

  // ── sizing ──────────────────────────────────────────────────────
  useEffect(() => {
    const shell = shellRef.current;
    const worldEl = worldRef.current;
    if (!shell || !worldEl) return;
    const apply = () => {
      const W = shell.clientWidth || 1;
      const H = shell.clientHeight || 1;
      shellSize.current = { w: W, h: H };
      const zoom = W < 760 ? 1.7 : 1.15;
      const w = Math.max(W, H * aspect) * zoom;
      const h = w / aspect;
      worldSize.current = { w, h };
      worldEl.style.width = `${w}px`;
      worldEl.style.height = `${h}px`;
      cameraRef.current = clampCamera(cameraRef.current.x, cameraRef.current.y);
      if (followRef.current) cameraRef.current = cameraTarget();
      paintCamera();
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(shell);
    return () => ro.disconnect();
  }, [aspect, clampCamera, cameraTarget, paintCamera, shellRef, worldRef]);

  // ── mount: restore position / arrive / select ───────────────────
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = readStored(storageKey);
      let pos: Point = stored?.pos ?? ([...world.start] as Point);
      if (arriveAt && nodePositions.has(arriveAt)) pos = [...(nodePositions.get(arriveAt) as Point)] as Point;
      posRef.current = pos;
      const initial =
        (stored?.selected && nodeById.has(stored.selected) ? stored.selected : null) ?? defaultSelected;
      selectedRef.current = initial;
      setSelectedId(initial);
      if (initial) setNearSelected(isNear(initial));
      cameraRef.current = cameraTarget();
      paintCamera();
      paintHero();
      paintRoute();
      persist();
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // ── selection & travel ──────────────────────────────────────────
  const select = useCallback(
    (id: string) => {
      if (!nodeById.has(id)) return;
      selectedRef.current = id;
      setSelectedId(id);
      setNearSelected(isNear(id));
      setArrivedAt(null);
      writeStored(storageKey, { pos: [...posRef.current] as Point, selected: id });
    },
    [nodeById, isNear, storageKey],
  );

  const stop = useCallback(() => {
    routeRef.current = [];
    targetRef.current = null;
    setMoving(false);
    paintRoute();
    persist();
  }, [paintRoute, persist]);

  const travel = useCallback(
    (id: string) => {
      if (!nodeById.has(id) || !canTravel(id)) return false;
      const route = shortestPath(graph, posRef.current, id);
      if (!route.length) return false;
      select(id);
      if (worldDistance(posRef.current, route[route.length - 1], aspect) < 0.6) {
        posRef.current = [...route[route.length - 1]] as Point;
        routeRef.current = [];
        paintHero();
        setNearSelected(true);
        setArrivedAt(id);
        onArriveRef.current?.(id);
        persist();
        return true;
      }
      routeRef.current = route;
      targetRef.current = id;
      followRef.current = true;
      setMoving(true);
      setArrivedAt(null);
      paintRoute();
      return true;
    },
    [nodeById, canTravel, graph, select, aspect, paintHero, paintRoute, persist],
  );

  // auto-travel (victory → next mission)
  useEffect(() => {
    if (!ready || !go) return;
    const t = window.setTimeout(() => travel(go), 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, go]);

  // ── the loop ────────────────────────────────────────────────────
  useEffect(() => {
    let frame = 0;
    const tick = (t: number) => {
      const dt = Math.min((t - (lastTick.current || t)) / 1000, 0.04);
      lastTick.current = t;

      // No `document.hidden` guard: a backgrounded tab already stops firing
      // rAF, so the check only adds a failure mode — an embedded preview pane
      // reports hidden while it keeps animating, and the hero freezes there.
      // `dt` is clamped above, so resuming never teleports.
      if (routeRef.current.length) {
        const step = advance(posRef.current, routeRef.current, SPEED * dt, aspect);
        posRef.current = step.pos;
        routeRef.current = step.route;
        if (step.facing) facingRef.current = step.facing;
        paintHero();
        paintRoute();
        if (t - lastSave.current > SAVE_EVERY_MS) {
          lastSave.current = t;
          writeStored(storageKey, { pos: [...posRef.current] as Point, selected: selectedRef.current });
        }
        if (step.arrived) {
          const id = targetRef.current;
          routeRef.current = [];
          targetRef.current = null;
          setMoving(false);
          if (id) {
            setNearSelected(selectedRef.current === id ? true : isNear(selectedRef.current ?? ""));
            setArrivedAt(id);
            onArriveRef.current?.(id);
          }
          persist();
        }
      }

      if (followRef.current && !dragRef.current) {
        const target = cameraTarget();
        const cam = cameraRef.current;
        const dx = target.x - cam.x;
        const dy = target.y - cam.y;
        if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
          cameraRef.current = { x: cam.x + dx * CAMERA_LERP, y: cam.y + dy * CAMERA_LERP };
          paintCamera();
        } else if (dx || dy) {
          cameraRef.current = target;
          paintCamera();
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [aspect, cameraTarget, isNear, paintCamera, paintHero, paintRoute, persist, storageKey]);

  // ── drag to pan ─────────────────────────────────────────────────
  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    draggedRef.current = false;
    dragRef.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      cx: cameraRef.current.x,
      cy: cameraRef.current.y,
      moved: false,
      slop: e.pointerType === "touch" ? DRAG_THRESHOLD_TOUCH : DRAG_THRESHOLD_MOUSE,
    };
  }, []);
  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) > d.slop) {
        d.moved = true;
        draggedRef.current = true;
        followRef.current = false;
        setDragging(true);
        shellRef.current?.setPointerCapture(e.pointerId);
      }
      if (d.moved) {
        cameraRef.current = clampCamera(d.cx + dx, d.cy + dy);
        paintCamera();
      }
    },
    [clampCamera, paintCamera, shellRef],
  );
  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    // The click lands right after pointerup, so the flag has to survive that
    // one dispatch and no longer: a pan that ends on empty sea produces no
    // node click to consume it, and a stale `true` would eat the next
    // keyboard or screen-reader activation, which has no pointerdown to
    // clear it.
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 0);
    try {
      shellRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* not captured */
    }
  }, [shellRef]);

  const consumeDragClick = useCallback(() => {
    const dragged = draggedRef.current;
    draggedRef.current = false;
    return dragged;
  }, []);

  return {
    graph,
    aspect,
    selectedId,
    select,
    travel,
    stop,
    centerCamera,
    moving,
    nearSelected,
    arrivedAt,
    dragging,
    ready,
    position,
    isNear,
    consumeDragClick,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag },
  };
}
