import { createForgeHandler, createForgeOptionsHandler } from "@/lib/soroban/forge-route";

// Runs `cargo test` for a Soroban project in the sandbox; streams NDJSON ForgeEvents.
export const POST = createForgeHandler("test");
export const OPTIONS = createForgeOptionsHandler();
