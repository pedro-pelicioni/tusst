"use client";

// The island before its art lands: sea, soft region blobs and the road
// network drawn from the config — the hero can already walk the trail, so
// authoring and testing never wait for a master. Same viewBox convention as
// the route overlay (100 × 100/aspect).

import type { WorldConfig } from "@/content/overworld/types";

const TONE: Record<string, string> = {
  foundations: "#e9c46a",
  craft: "#2a9d8f",
  realm: "#8f7bff",
  rust: "#c96a3a",
  sea: "#1b6e86",
};

export function WorldStandIn({ world, roads }: { world: WorldConfig; roads: [number, number][][] }) {
  const aspect = world.image.width / world.image.height;
  const H = 100 / aspect;
  return (
    <svg className="ow-standin" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        {world.regions.map((r) => (
          <radialGradient key={r.id} id={`ow-blob-${r.id}`}>
            <stop offset="0" stopColor={TONE[r.tone] ?? "#888"} stopOpacity="0.55" />
            <stop offset="1" stopColor={TONE[r.tone] ?? "#888"} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      <rect width="100" height={H} fill="#1b6e86" />
      <ellipse cx="50" cy={H / 2} rx="44" ry={H / 2 - 4} fill="#3f6b3a" opacity="0.9" />
      <ellipse cx="50" cy={H / 2} rx="41" ry={H / 2 - 6} fill="#4d7d43" />
      {world.regions.map((r) => (
        <circle
          key={r.id}
          cx={r.pos[0]}
          cy={r.pos[1] / aspect}
          r={r.radius ?? 18}
          fill={`url(#ow-blob-${r.id})`}
        />
      ))}
      {roads.map((road, i) => (
        <polyline
          key={i}
          points={road.map((p) => `${p[0]},${p[1] / aspect}`).join(" ")}
          fill="none"
          stroke="#e9d8a6"
          strokeWidth="0.9"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}
