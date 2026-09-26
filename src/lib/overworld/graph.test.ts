// `npx tsx --test src/lib/overworld/graph.test.ts`

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  advance,
  buildGraph,
  nearestPointOnRoads,
  pointKey,
  reachability,
  shortestPath,
  spreadAlong,
  worldDistance,
} from "./graph";

import type { Point } from "@/content/overworld/types";

function near(actual: Point, expected: Point, eps = 1e-6) {
  assert.ok(
    Math.abs(actual[0] - expected[0]) <= eps && Math.abs(actual[1] - expected[1]) <= eps,
    `expected [${expected}] got [${actual}]`,
  );
}

describe("worldDistance", () => {
  it("scales the horizontal delta by the aspect ratio", () => {
    assert.equal(worldDistance([0, 0], [10, 0], 1.5), 15);
    assert.equal(worldDistance([0, 0], [0, 10], 1.5), 10);
    assert.equal(worldDistance([0, 0], [3, 4], 1), 5);
    assert.equal(worldDistance([10, 20], [10, 20], 1.5), 0);
  });
});

describe("pointKey", () => {
  it("rounds to two decimals", () => {
    assert.equal(pointKey([12.345, 6.789]), "12.35,6.79");
    assert.equal(pointKey([50, 50]), "50.00,50.00");
    assert.equal(pointKey([-0.001, 0]), "0.00,0.00");
  });
});

describe("buildGraph", () => {
  const road: Point[] = [
    [0, 50],
    [50, 50],
    [100, 50],
  ];

  it("links consecutive polyline vertices both ways", () => {
    const g = buildGraph([road], [], 1.5);
    assert.equal(g.vertices.size, 3);
    assert.equal(g.edges.length, 2);
    assert.deepEqual(g.vertices.get("50.00,50.00")?.links.sort(), [
      "0.00,50.00",
      "100.00,50.00",
    ]);
    assert.deepEqual(g.vertices.get("0.00,50.00")?.links, ["50.00,50.00"]);
  });

  it("snaps a node to an existing vertex within the snap radius", () => {
    const g = buildGraph([road], [{ id: "mid", pos: [50, 51] }], 1.5);
    assert.equal(g.nodeVertex.get("mid"), "50.00,50.00");
    assert.equal(g.vertices.size, 3);
    assert.equal(g.edges.length, 2);
  });

  it("inserts a projected vertex for an off-road node and splits the edge", () => {
    const g = buildGraph([road], [{ id: "off", pos: [25, 60] }], 1.5);
    const key = g.nodeVertex.get("off");
    assert.equal(key, "25.00,50.00");
    assert.equal(g.vertices.size, 4);
    assert.equal(g.edges.length, 3);
    near(g.vertices.get(key as string)?.pos as Point, [25, 50]);
    assert.deepEqual(g.vertices.get(key as string)?.links.sort(), [
      "0.00,50.00",
      "50.00,50.00",
    ]);
    // the old direct link is gone
    assert.deepEqual(g.vertices.get("0.00,50.00")?.links, ["25.00,50.00"]);
    assert.ok(!g.vertices.get("50.00,50.00")?.links.includes("0.00,50.00"));
  });

  it("never drops a node: without roads each node is an isolated vertex", () => {
    const g = buildGraph(
      [],
      [
        { id: "a", pos: [10, 10] },
        { id: "b", pos: [80, 80] },
      ],
      1.5,
    );
    assert.equal(g.edges.length, 0);
    assert.equal(g.vertices.size, 2);
    assert.equal(g.nodeVertex.get("a"), "10.00,10.00");
    assert.equal(g.nodeVertex.get("b"), "80.00,80.00");
    assert.deepEqual(g.vertices.get("10.00,10.00")?.links, []);
  });

  it("does not mutate its inputs", () => {
    const roads: Point[][] = [[[0, 50], [50, 50]]];
    const nodes = [{ id: "n", pos: [25, 60] as Point }];
    const snapshot = JSON.stringify({ roads, nodes });
    buildGraph(roads, nodes, 1.5);
    assert.equal(JSON.stringify({ roads, nodes }), snapshot);
  });
});

describe("nearestPointOnRoads", () => {
  const L: Point[] = [
    [10, 10],
    [10, 50],
    [50, 50],
  ];

  it("projects onto the closest segment of an L-shaped road", () => {
    const g = buildGraph([L], [], 1.5);
    const hit = nearestPointOnRoads(g, [30, 40]);
    assert.ok(hit);
    near(hit.point, [30, 50]);
    assert.equal(hit.a, "10.00,50.00");
    assert.equal(hit.b, "50.00,50.00");
    assert.ok(Math.abs(hit.distance - 10) < 1e-9);
  });

  it("measures the distance in image space", () => {
    // [16,36] is 6 from the vertical leg and 14 from the horizontal one at aspect 1…
    const flat = nearestPointOnRoads(buildGraph([L], [], 1), [16, 36]);
    assert.ok(flat);
    near(flat.point, [10, 36]);
    // …but 18 vs 14 once the horizontal delta is stretched ×3
    const wide = nearestPointOnRoads(buildGraph([L], [], 3), [16, 36]);
    assert.ok(wide);
    near(wide.point, [16, 50]);
  });

  it("clamps to the segment ends", () => {
    const g = buildGraph([L], [], 1);
    const hit = nearestPointOnRoads(g, [90, 90]);
    assert.ok(hit);
    near(hit.point, [50, 50]);
  });

  it("returns null when there are no edges", () => {
    assert.equal(nearestPointOnRoads(buildGraph([], [], 1.5), [1, 1]), null);
  });
});

describe("shortestPath", () => {
  // stem ─ hub ─ two branches to the goal: the bottom one is shorter
  const roads: Point[][] = [
    [
      [0, 50],
      [50, 50],
      [50, 10],
      [100, 10],
      [100, 50],
    ],
    [
      [50, 50],
      [50, 70],
      [100, 70],
      [100, 50],
    ],
  ];
  const nodes = [
    { id: "start", pos: [0, 50] as Point },
    { id: "hub", pos: [50, 50] as Point },
    { id: "goal", pos: [100, 50] as Point },
  ];

  it("picks the shorter branch and ends at the node position", () => {
    const g = buildGraph(roads, nodes, 1.5);
    const path = shortestPath(g, [20, 50], "goal");
    assert.deepEqual(path, [
      [20, 50],
      [50, 50],
      [50, 70],
      [100, 70],
      [100, 50],
    ]);
  });

  it("starts at the projection of an off-road position", () => {
    const g = buildGraph(roads, nodes, 1.5);
    const path = shortestPath(g, [20, 58], "hub");
    near(path[0], [20, 50]);
    assert.deepEqual(path[path.length - 1], [50, 50]);
    assert.equal(path.length, 2);
  });

  it("returns just the node position when already there", () => {
    const g = buildGraph(roads, nodes, 1.5);
    assert.deepEqual(shortestPath(g, [100.2, 49.8], "goal"), [[100, 50]]);
  });

  it("returns [] for an unknown node", () => {
    const g = buildGraph(roads, nodes, 1.5);
    assert.deepEqual(shortestPath(g, [20, 50], "nope"), []);
  });

  it("returns [] when the node sits on a disconnected road", () => {
    const g = buildGraph(
      [...roads, [[0, 90], [30, 90]]],
      [...nodes, { id: "island", pos: [15, 90] as Point }],
      1.5,
    );
    assert.deepEqual(shortestPath(g, [20, 50], "island"), []);
  });

  it("walks straight when the world has no roads", () => {
    const g = buildGraph([], [{ id: "a", pos: [80, 80] }], 1.5);
    assert.deepEqual(shortestPath(g, [10, 10], "a"), [
      [10, 10],
      [80, 80],
    ]);
  });
});

describe("advance", () => {
  const route: Point[] = [
    [10, 0],
    [10, 10],
    [20, 10],
  ];

  it("consumes several waypoints in one step and faces the last move", () => {
    const step = advance([0, 0], route, 25, 1);
    near(step.pos, [15, 10]);
    assert.deepEqual(step.route, [[20, 10]]);
    assert.equal(step.facing, 1);
    assert.equal(step.arrived, false);
  });

  it("arrives when the route is exhausted", () => {
    const step = advance([15, 10], [[20, 10]], 10, 1);
    near(step.pos, [20, 10]);
    assert.deepEqual(step.route, []);
    assert.equal(step.facing, 1);
    assert.equal(step.arrived, true);
  });

  it("faces left and reports no facing for a vertical move", () => {
    assert.equal(advance([10, 10], [[0, 10]], 3, 1).facing, -1);
    assert.equal(advance([10, 10], [[10, 0]], 3, 1).facing, 0);
  });

  it("moves `dist` in image space", () => {
    const step = advance([0, 0], [[10, 0]], 3, 1.5);
    near(step.pos, [2, 0]);
    assert.equal(step.arrived, false);
  });

  it("stops exactly on a waypoint", () => {
    const step = advance([0, 0], route, 10, 1);
    near(step.pos, [10, 0]);
    assert.deepEqual(step.route, [
      [10, 10],
      [20, 10],
    ]);
    assert.equal(step.arrived, false);
  });

  it("is arrived on an empty route and never mutates inputs", () => {
    const pos: Point = [1, 2];
    const r: Point[] = [
      [10, 0],
      [10, 10],
    ];
    const before = JSON.stringify({ pos, r });
    const step = advance(pos, r, 100, 1);
    assert.equal(step.arrived, true);
    assert.equal(JSON.stringify({ pos, r }), before);
    assert.notEqual(step.route, r);
    assert.equal(advance([0, 0], [], 5, 1).arrived, true);
  });
});

describe("spreadAlong", () => {
  it("returns evenly spaced points that exclude both ends", () => {
    const road: Point[] = [
      [0, 50],
      [100, 50],
    ];
    const pts = spreadAlong(road, [10, 50], [90, 50], 3, 1.5);
    assert.equal(pts.length, 3);
    near(pts[0], [30, 50]);
    near(pts[1], [50, 50]);
    near(pts[2], [70, 50]);
    const gaps = [
      worldDistance([10, 50], pts[0], 1.5),
      worldDistance(pts[0], pts[1], 1.5),
      worldDistance(pts[1], pts[2], 1.5),
      worldDistance(pts[2], [90, 50], 1.5),
    ];
    for (const gap of gaps) assert.ok(Math.abs(gap - gaps[0]) < 1e-6, `gaps ${gaps}`);
    assert.ok(!pts.some((p) => p[0] === 10 || p[0] === 90));
  });

  it("follows the polyline around corners, projecting from/to onto it", () => {
    const road: Point[] = [
      [0, 0],
      [0, 100],
      [100, 100],
    ];
    const pts = spreadAlong(road, [5, 0], [100, 95], 3, 1);
    assert.equal(pts.length, 3);
    near(pts[0], [0, 50]);
    near(pts[1], [0, 100]);
    near(pts[2], [50, 100]);
  });

  it("walks the polyline in the from→to direction", () => {
    const road: Point[] = [
      [0, 0],
      [0, 100],
      [100, 100],
    ];
    const pts = spreadAlong(road, [100, 100], [0, 0], 3, 1);
    near(pts[0], [50, 100]);
    near(pts[1], [0, 100]);
    near(pts[2], [0, 50]);
  });

  it("returns [] for count 0", () => {
    assert.deepEqual(spreadAlong([[0, 0], [10, 10]], [0, 0], [10, 10], 0, 1.5), []);
  });
});

describe("reachability", () => {
  it("flags a node on a disconnected road", () => {
    const g = buildGraph(
      [
        [[0, 50], [50, 50], [100, 50]],
        [[0, 90], [40, 90]],
      ],
      [
        { id: "a", pos: [0, 50] },
        { id: "b", pos: [100, 50] },
        { id: "c", pos: [20, 90] },
      ],
      1.5,
    );
    assert.deepEqual(reachability(g, ["a", "b", "c"]), { ok: false, unreachable: ["c"] });
  });

  it("is ok when everything is connected", () => {
    const g = buildGraph(
      [[[0, 50], [50, 50], [100, 50]]],
      [
        { id: "a", pos: [0, 50] },
        { id: "b", pos: [100, 50] },
        { id: "mid", pos: [50, 58] },
      ],
      1.5,
    );
    assert.deepEqual(reachability(g, ["a", "b", "mid"]), { ok: true, unreachable: [] });
  });

  it("flags unknown ids and an isolated start", () => {
    const g = buildGraph([], [{ id: "solo", pos: [10, 10] }], 1.5);
    assert.deepEqual(reachability(g, ["solo", "ghost"]), { ok: false, unreachable: ["ghost"] });
    assert.deepEqual(reachability(g, ["ghost", "solo"]), {
      ok: false,
      unreachable: ["ghost", "solo"],
    });
    assert.deepEqual(reachability(g, []), { ok: true, unreachable: [] });
  });
});
