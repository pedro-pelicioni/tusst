// Parity gate for the overworld: every live chapter, every act and every
// skirmish, every active Advanced track and lesson has a node, every node
// points at real content, the roads reach every node, and no two nodes sit on
// top of each other. Run:
//
//   npm run check:overworld

import { journeyChapters } from "../src/content/journey";
import { acts } from "../src/content/campaign";
import { JOURNEY_WORLD } from "../src/content/overworld/journey-world";
import { CAMPAIGN_WORLD, fortressId } from "../src/content/overworld/campaign-world";
import { HARBOR_WORLD, dockId, harborTracks } from "../src/content/overworld/harbor-world";
import { advancedTracks } from "../src/content/advanced/curriculum";
import { WORLD_MAP } from "../src/content/overworld/world-map";
import { buildGraph, reachability, worldDistance } from "../src/lib/overworld/graph";
import type { WorldConfig } from "../src/content/overworld/types";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`✗ ${msg}`);
};

function checkWorld(world: WorldConfig, expectedIds: string[], minGap: number) {
  const ids = new Set(world.nodes.map((n) => n.id));
  for (const id of expectedIds) if (!ids.has(id)) fail(`${world.id}: no node for "${id}"`);
  const expected = new Set(expectedIds);
  for (const id of ids) if (!expected.has(id)) fail(`${world.id}: node "${id}" has no content`);
  const dupes = world.nodes.length - ids.size;
  if (dupes) fail(`${world.id}: ${dupes} duplicate node id(s)`);

  const aspect = world.image.width / world.image.height;
  for (const n of world.nodes) {
    const [x, y] = n.pos;
    if (!(x >= 0 && x <= 100 && y >= 0 && y <= 100)) fail(`${world.id}: "${n.id}" is off the map at [${x}, ${y}]`);
  }
  for (let i = 0; i < world.nodes.length; i++) {
    for (let j = i + 1; j < world.nodes.length; j++) {
      const a = world.nodes[i];
      const b = world.nodes[j];
      if (worldDistance(a.pos, b.pos, aspect) < minGap) {
        fail(`${world.id}: "${a.id}" and "${b.id}" overlap (${worldDistance(a.pos, b.pos, aspect).toFixed(2)} < ${minGap})`);
      }
    }
  }
  if (world.roads.length) {
    const graph = buildGraph(world.roads, world.nodes, aspect);
    const reach = reachability(graph, world.nodes.map((n) => n.id));
    if (!reach.ok) fail(`${world.id}: roads do not reach ${reach.unreachable.join(", ")}`);
  }
}

checkWorld(
  JOURNEY_WORLD,
  journeyChapters.map((c) => c.meta.slug),
  2,
);
checkWorld(
  CAMPAIGN_WORLD,
  acts.flatMap((a) => [...a.skirmishes.map((s) => s.lessonSlug), fortressId(a.trackSlug)]),
  1.2,
);
// The harbor spaces its stops wider than the hero's arrival radius (3.1), so
// standing on one lesson never counts as standing on the next.
checkWorld(
  HARBOR_WORLD,
  harborTracks().flatMap((t) => [...t.lessons.map((l) => l.slug), dockId(t.slug)]),
  3.2,
);
for (const t of advancedTracks) {
  if (t.status === "active" && !harborTracks().includes(t)) fail(`harbor: active track "${t.slug}" has no street`);
}
checkWorld(WORLD_MAP, ["island:journey", "island:campaign", "landmark:forge", "landmark:advanced"], 5);

if (failures) {
  console.error(`\noverworld check FAILED: ${failures} problem(s)`);
  process.exit(1);
}
console.log(
  `overworld OK: ${JOURNEY_WORLD.nodes.length} journey nodes, ${CAMPAIGN_WORLD.nodes.length} campaign nodes, ${HARBOR_WORLD.nodes.length} harbor nodes, ${WORLD_MAP.nodes.length} world-map doors`,
);
