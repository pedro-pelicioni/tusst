import { HARBOR_WORLD, HARBOR_STREETS, harborTracks, dockId } from "../../src/content/overworld/harbor-world";
import { buildGraph, shortestPath, worldDistance, nearestPointOnRoads } from "../../src/lib/overworld/graph";
const NEAR = 3.1;
const w = HARBOR_WORLD;
const aspect = w.image.width / w.image.height;
const g = buildGraph(w.roads, w.nodes, aspect);
const byVertex = new Map<string, string[]>();
for (const n of w.nodes) {
  const k = g.nodeVertex.get(n.id)!;
  byVertex.set(k, [...(byVertex.get(k) ?? []), n.id]);
}
console.log("shared vertices:");
for (const [k, ids] of byVertex) if (ids.length > 1) console.log(" ", k, ids);
let snapped = 0;
const pos = new Map(w.nodes.map((n) => [n.id, n.pos] as const));
for (const n of w.nodes) {
  const v = g.vertices.get(g.nodeVertex.get(n.id)!)!;
  const d = worldDistance(v.pos, n.pos, aspect);
  if (d > 0.01) snapped++;
  // hero stands at vertex after travel: which other nodes are near?
  const nearOthers = w.nodes.filter((o) => o.id !== n.id && worldDistance(v.pos, o.pos, aspect) < NEAR).map((o) => `${o.id}(${worldDistance(v.pos, o.pos, aspect).toFixed(2)})`);
  if (nearOthers.length) console.log(`after walking to ${n.id} (vertex off by ${d.toFixed(2)}): also near ${nearOthers.join(", ")}`);
}
console.log("nodes snapped away from their pos:", snapped, "of", w.nodes.length);
// travel between consecutive lessons of each track
for (const t of harborTracks()) {
  const slugs = t.lessons.map((l) => l.slug);
  for (let i = 0; i + 1 < slugs.length; i++) {
    const from = pos.get(slugs[i])!;
    const route = shortestPath(g, from, slugs[i + 1]);
    if (route.length <= 1) console.log(`go ${slugs[i]} -> ${slugs[i+1]}: route len ${route.length} (instant arrival)`, route);
  }
}
// arcPosition sanity: first spot distance to street[0] and last spot to dock
for (const t of harborTracks()) {
  const s = HARBOR_STREETS[t.slug];
  const first = pos.get(t.lessons[0].slug)!;
  const last = pos.get(t.lessons[t.lessons.length - 1].slug)!;
  const dock = pos.get(dockId(t.slug))!;
  console.log(t.slug, "n=", t.lessons.length, "first-start", worldDistance(first, s[0], aspect).toFixed(2), "last-dock", worldDistance(last, dock, aspect).toFixed(2));
}
