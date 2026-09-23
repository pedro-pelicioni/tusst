// Overworld routing — pure geometry over a world's road polylines.
//
// Coordinates are percentages of the world image (`Point = [x%, y%]`). The
// image is wider than tall, so every distance is measured in IMAGE space:
// the x delta is multiplied by `aspect = width / height` before the hypot.
// No React, no DOM, no content imports — the map, the hero tick and the
// `check:overworld` script all share this file.

import type { Point } from "@/content/overworld/types";

export interface GraphVertex {
  key: string;
  pos: Point;
  /** keys of the linked vertices (both directions are stored) */
  links: string[];
}

export interface Graph {
  aspect: number;
  vertices: Map<string, GraphVertex>;
  /** node id → vertex key */
  nodeVertex: Map<string, string>;
  /** every road segment, endpoints at vertex positions */
  edges: Array<[Point, Point]>;
}

/** Hero is "on" a node when within this many world units of its vertex. */
const ARRIVE_EPSILON = 0.5;
const EPSILON = 1e-9;

function fixed(n: number): string {
  const s = n.toFixed(2);
  return s === "-0.00" ? "0.00" : s;
}

/** `"x,y"` with two decimals — the identity of a vertex. */
export function pointKey(p: Point): string {
  return `${fixed(p[0])},${fixed(p[1])}`;
}

/** Isotropic distance in image space. */
export function worldDistance(a: Point, b: Point, aspect: number): number {
  return Math.hypot((b[0] - a[0]) * aspect, b[1] - a[1]);
}

function clone(p: Point): Point {
  return [p[0], p[1]];
}

function lerp(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

interface Projection {
  point: Point;
  /** 0..1 along a→b */
  t: number;
  distance: number;
}

/** Closest point of segment a→b to p, measured in image space. */
function projectOnSegment(p: Point, a: Point, b: Point, aspect: number): Projection {
  const dx = (b[0] - a[0]) * aspect;
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  let t = 0;
  if (len2 > EPSILON) {
    const px = (p[0] - a[0]) * aspect;
    const py = p[1] - a[1];
    t = Math.max(0, Math.min(1, (px * dx + py * dy) / len2));
  }
  const point = lerp(a, b, t);
  return { point, t, distance: worldDistance(point, p, aspect) };
}

function edgeId(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Turns road polylines into a vertex graph and attaches every node to it.
 *
 * - each polyline vertex is a graph vertex (deduped by `pointKey`), consecutive
 *   vertices are linked both ways and collected as edges;
 * - a node within `snap` world units of a vertex maps to that vertex;
 * - otherwise the node is projected onto its nearest edge, a vertex is inserted
 *   at the projection and the edge is split in two;
 * - with no roads at all every node becomes an isolated vertex — a node is
 *   never dropped.
 */
export function buildGraph(
  roads: Point[][],
  nodes: Array<{ id: string; pos: Point }>,
  aspect: number,
  snap = 2.5,
): Graph {
  const vertices = new Map<string, GraphVertex>();
  const nodeVertex = new Map<string, string>();
  const edges: Array<[Point, Point]> = [];
  const edgeIds = new Set<string>();

  const addVertex = (p: Point): GraphVertex => {
    const key = pointKey(p);
    let v = vertices.get(key);
    if (!v) {
      v = { key, pos: clone(p), links: [] };
      vertices.set(key, v);
    }
    return v;
  };

  const link = (a: GraphVertex, b: GraphVertex) => {
    if (a.key === b.key) return;
    if (!a.links.includes(b.key)) a.links.push(b.key);
    if (!b.links.includes(a.key)) b.links.push(a.key);
    const id = edgeId(a.key, b.key);
    if (!edgeIds.has(id)) {
      edgeIds.add(id);
      edges.push([a.pos, b.pos]);
    }
  };

  const unlink = (a: GraphVertex, b: GraphVertex) => {
    a.links = a.links.filter((k) => k !== b.key);
    b.links = b.links.filter((k) => k !== a.key);
    const id = edgeId(a.key, b.key);
    if (edgeIds.delete(id)) {
      const i = edges.findIndex(
        ([p, q]) => edgeId(pointKey(p), pointKey(q)) === id,
      );
      if (i >= 0) edges.splice(i, 1);
    }
  };

  for (const road of roads) {
    let prev: GraphVertex | null = null;
    for (const p of road) {
      const v = addVertex(p);
      if (prev) link(prev, v);
      prev = v;
    }
  }

  const graph: Graph = { aspect, vertices, nodeVertex, edges };

  for (const node of nodes) {
    // 1. snap to a vertex already on the roads
    let nearest: GraphVertex | null = null;
    let nearestD = Infinity;
    for (const v of vertices.values()) {
      const d = worldDistance(v.pos, node.pos, aspect);
      if (d < nearestD) {
        nearestD = d;
        nearest = v;
      }
    }
    if (nearest && nearestD <= snap) {
      nodeVertex.set(node.id, nearest.key);
      continue;
    }

    // 2. project onto the nearest edge and split it
    const near = nearestPointOnRoads(graph, node.pos);
    if (near) {
      const a = vertices.get(near.a);
      const b = vertices.get(near.b);
      if (a && b) {
        // the projection landed on an endpoint — nothing to split
        if (worldDistance(near.point, a.pos, aspect) < 0.01) {
          nodeVertex.set(node.id, a.key);
          continue;
        }
        if (worldDistance(near.point, b.pos, aspect) < 0.01) {
          nodeVertex.set(node.id, b.key);
          continue;
        }
        const v = addVertex(near.point);
        if (v.key !== a.key && v.key !== b.key) {
          unlink(a, b);
          link(a, v);
          link(v, b);
        }
        nodeVertex.set(node.id, v.key);
        continue;
      }
    }

    // 3. no roads — the node stands alone
    nodeVertex.set(node.id, addVertex(node.pos).key);
  }

  return graph;
}

/** Closest point on any edge, with the keys of that edge's endpoints. */
export function nearestPointOnRoads(
  graph: Graph,
  p: Point,
): { point: Point; a: string; b: string; distance: number } | null {
  let best: { point: Point; a: string; b: string; distance: number } | null = null;
  for (const [a, b] of graph.edges) {
    const proj = projectOnSegment(p, a, b, graph.aspect);
    if (!best || proj.distance < best.distance) {
      best = { point: proj.point, a: pointKey(a), b: pointKey(b), distance: proj.distance };
    }
  }
  return best;
}

/**
 * Dijkstra from the edge nearest to `from` to the node's vertex.
 *
 * Returns `[projection, ...vertex positions]` ending at the node's position,
 * `[nodePos]` when `from` already stands on the node, and `[]` when the node
 * is unknown or unreachable. With no roads at all the hero walks straight:
 * `[from, nodePos]`.
 */
export function shortestPath(graph: Graph, from: Point, toNodeId: string): Point[] {
  const targetKey = graph.nodeVertex.get(toNodeId);
  const target = targetKey ? graph.vertices.get(targetKey) : undefined;
  if (!targetKey || !target) return [];
  const { aspect } = graph;

  if (worldDistance(from, target.pos, aspect) <= ARRIVE_EPSILON) {
    return [clone(target.pos)];
  }

  const near = nearestPointOnRoads(graph, from);
  if (!near) {
    // no edges: only isolated vertices exist, so there is no road to follow
    return [clone(from), clone(target.pos)];
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const seed = (key: string) => {
    const v = graph.vertices.get(key);
    if (!v) return;
    const d = worldDistance(near.point, v.pos, aspect);
    if (d < (dist.get(key) ?? Infinity)) {
      dist.set(key, d);
      prev.set(key, null);
    }
  };
  seed(near.a);
  seed(near.b);

  const visited = new Set<string>();
  for (;;) {
    let u: string | null = null;
    let ud = Infinity;
    for (const [key, d] of dist) {
      if (!visited.has(key) && d < ud) {
        u = key;
        ud = d;
      }
    }
    if (u === null || u === targetKey) break;
    visited.add(u);
    const v = graph.vertices.get(u);
    if (!v) continue;
    for (const nk of v.links) {
      if (visited.has(nk)) continue;
      const n = graph.vertices.get(nk);
      if (!n) continue;
      const nd = ud + worldDistance(v.pos, n.pos, aspect);
      if (nd < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, nd);
        prev.set(nk, u);
      }
    }
  }

  if (!dist.has(targetKey)) return [];

  const keys: string[] = [];
  for (let k: string | null = targetKey; k; k = prev.get(k) ?? null) keys.push(k);
  keys.reverse();

  const route: Point[] = [clone(near.point)];
  for (const k of keys) {
    const v = graph.vertices.get(k);
    if (!v) continue;
    const last = route[route.length - 1];
    if (worldDistance(last, v.pos, aspect) < EPSILON) continue;
    route.push(clone(v.pos));
  }
  return route;
}

/**
 * Moves `dist` world units along `route`, consuming waypoints as they are
 * reached (several per call when `dist` is large). `facing` follows the last
 * segment that had a horizontal component (0 when none moved). Inputs are
 * never mutated.
 */
export function advance(
  pos: Point,
  route: Point[],
  dist: number,
  aspect: number,
): { pos: Point; route: Point[]; facing: -1 | 0 | 1; arrived: boolean } {
  let cur = clone(pos);
  let remaining = Math.max(0, Number.isFinite(dist) ? dist : 0);
  let facing: -1 | 0 | 1 = 0;
  let i = 0;

  const face = (dx: number) => {
    if (dx > EPSILON) facing = 1;
    else if (dx < -EPSILON) facing = -1;
  };

  while (i < route.length) {
    const target = route[i];
    const d = worldDistance(cur, target, aspect);
    if (d <= remaining + EPSILON) {
      face(target[0] - cur[0]);
      cur = clone(target);
      remaining = Math.max(0, remaining - d);
      i++;
      continue;
    }
    if (remaining > 0) {
      const next = lerp(cur, target, remaining / d);
      face(next[0] - cur[0]);
      cur = next;
    }
    remaining = 0;
    break;
  }

  return { pos: cur, route: route.slice(i), facing, arrived: i >= route.length };
}

/** Cumulative arc length at every vertex of a polyline. */
function arcLengths(road: Point[], aspect: number): number[] {
  const cum = [0];
  for (let i = 1; i < road.length; i++) {
    cum[i] = cum[i - 1] + worldDistance(road[i - 1], road[i], aspect);
  }
  return cum;
}

/** Arc position of the closest point of the polyline to `p`. */
function arcPosition(road: Point[], cum: number[], p: Point, aspect: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 1; i < road.length; i++) {
    const proj = projectOnSegment(p, road[i - 1], road[i], aspect);
    if (proj.distance < bestD) {
      bestD = proj.distance;
      best = cum[i - 1] + proj.t * (cum[i] - cum[i - 1]);
    }
  }
  return best;
}

/** Point of the polyline at arc position `s` (clamped to the polyline). */
function pointAtArc(road: Point[], cum: number[], s: number): Point {
  const total = cum[cum.length - 1];
  const target = Math.max(0, Math.min(total, s));
  for (let i = 1; i < road.length; i++) {
    if (target <= cum[i] + EPSILON) {
      const len = cum[i] - cum[i - 1];
      const t = len > EPSILON ? (target - cum[i - 1]) / len : 0;
      return lerp(road[i - 1], road[i], t);
    }
  }
  return clone(road[road.length - 1]);
}

/**
 * `count` points evenly spaced by arc length strictly between the projections
 * of `from` and `to` onto `road`, walking the polyline from→to. Used to derive
 * the campaign waypoints between two fortresses.
 */
export function spreadAlong(
  road: Point[],
  from: Point,
  to: Point,
  count: number,
  aspect: number,
): Point[] {
  const n = Math.max(0, Math.floor(count));
  if (n === 0 || road.length === 0) return [];
  if (road.length === 1) return Array.from({ length: n }, () => clone(road[0]));

  const cum = arcLengths(road, aspect);
  const sFrom = arcPosition(road, cum, from, aspect);
  const sTo = arcPosition(road, cum, to, aspect);
  const step = (sTo - sFrom) / (n + 1);

  return Array.from({ length: n }, (_, i) => pointAtArc(road, cum, sFrom + step * (i + 1)));
}

/** BFS from the first node over vertex links; lists the nodes it cannot reach. */
export function reachability(
  graph: Graph,
  nodeIds: string[],
): { ok: boolean; unreachable: string[] } {
  if (nodeIds.length === 0) return { ok: true, unreachable: [] };

  const seen = new Set<string>();
  const start = graph.nodeVertex.get(nodeIds[0]);
  if (start && graph.vertices.has(start)) {
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const key = queue.shift() as string;
      const v = graph.vertices.get(key);
      if (!v) continue;
      for (const nk of v.links) {
        if (!seen.has(nk)) {
          seen.add(nk);
          queue.push(nk);
        }
      }
    }
  }

  const unreachable = nodeIds.filter((id) => {
    const key = graph.nodeVertex.get(id);
    return !key || !seen.has(key);
  });
  return { ok: unreachable.length === 0, unreachable };
}
