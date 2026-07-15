import { createForgeHandler, createForgeOptionsHandler } from "@/lib/soroban/forge-route";

// Compiles a Soroban project to wasm in the sandbox; streams NDJSON ForgeEvents.
export const POST = createForgeHandler("build");
export const OPTIONS = createForgeOptionsHandler();
