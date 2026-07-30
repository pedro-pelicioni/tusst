#!/usr/bin/env node
// Guards the invariant both manifests document but nothing enforced: the
// Cargo.toml the Forge IDE hands users (CURATED_CARGO_TOML in
// src/content/soroban-templates.ts) must pin the SAME crate versions as the
// sandbox image warms (runner-soroban/warm/Cargo.toml).
//
// Why this is load-bearing: the runner builds with CARGO_NET_OFFLINE=true and
// --network none, so the only versions resolvable inside the container are the
// ones `cargo fetch` downloaded at image build time — i.e. exactly what the
// warm manifest pinned. Any drift means every user project dies in dependency
// resolution ("failed to select a version for `soroban-sdk`") the moment the
// image is rebuilt, with no way to recover from inside the sandbox.
//
// This has now bitten twice. Dependabot PR #31 proposed a major bump that a
// human caught; PR #39 landed a patch bump (soroban-sdk =26.1.0 -> =26.1.1)
// through the auto-merge group and took Forge down in production, because the
// minor/patch group is exempt from review and CI had nothing to say about it.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const WARM = "runner-soroban/warm/Cargo.toml";
const TEMPLATE = "src/content/soroban-templates.ts";

// Exact pins only (`= "=x.y.z"` / `= { version = "=x.y.z", ... }`). Ranged
// requirements are deliberately out of scope: they float to whatever the image
// resolved, which is the separate hazard the Dockerfile handles by reading
// versions back out of the generated Cargo.lock.
function parsePins(manifest) {
  const sections = new Map();
  let current = null;
  for (const raw of manifest.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("#")) continue;
    const header = line.match(/^\[([^\]]+)\]$/);
    if (header) {
      current = header[1];
      continue;
    }
    if (current !== "dependencies" && current !== "dev-dependencies") continue;
    const pin = line.match(/^([A-Za-z0-9_-]+)\s*=[^\n]*?"=(\d+\.\d+\.\d+)"/);
    if (!pin) continue;
    if (!sections.has(current)) sections.set(current, new Map());
    sections.get(current).set(pin[1], pin[2]);
  }
  return sections;
}

const [warmSrc, templateSrc] = await Promise.all([
  readFile(join(root, WARM), "utf8"),
  readFile(join(root, TEMPLATE), "utf8"),
]);

const embedded = templateSrc.match(
  /export const CURATED_CARGO_TOML = `([\s\S]*?)\n`;/,
);
if (!embedded) {
  console.error(`✗ could not locate CURATED_CARGO_TOML in ${TEMPLATE}`);
  process.exit(1);
}
// The template lives in a JS template literal, so `use` and ${...} are escaped.
const curated = embedded[1].replace(/\\`/g, "`").replace(/\\\$/g, "$");

const warm = parsePins(warmSrc);
const template = parsePins(curated);
const problems = [];

for (const section of ["dependencies", "dev-dependencies"]) {
  const warmDeps = warm.get(section) ?? new Map();
  const templateDeps = template.get(section) ?? new Map();

  for (const [name, version] of templateDeps) {
    const warmVersion = warmDeps.get(name);
    if (warmVersion === undefined) {
      problems.push(
        `[${section}] ${name} ${version} is offered to users but never warmed ` +
          `in ${WARM} — it cannot be downloaded inside the offline sandbox.`,
      );
    } else if (warmVersion !== version) {
      problems.push(
        `[${section}] ${name}: template pins ${version}, image warms ` +
          `${warmVersion} — the sandbox has no ${version} to resolve against.`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(
    `✗ Forge pin drift — ${TEMPLATE} and ${WARM} disagree:\n\n` +
      problems.map((p) => `  • ${p}`).join("\n") +
      `\n\nFix: bring the pins back in sync (usually by updating ` +
      `CURATED_CARGO_TOML to match the warm manifest), and add the superseded ` +
      `version to STALE_SDK_PINS in src/lib/forge-store.ts so projects already ` +
      `saved in users' browsers get migrated instead of failing to build.\n`,
  );
  process.exit(1);
}

const counted = [...template.values()].reduce((n, m) => n + m.size, 0);
console.log(`✓ Forge pins in sync (${counted} exact pins match ${WARM})`);
