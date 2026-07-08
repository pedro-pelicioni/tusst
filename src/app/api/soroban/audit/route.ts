import { createForgeHandler } from "@/lib/soroban/forge-route";

// Runs the Scout static analyzer in the sandbox; streams NDJSON ForgeEvents.
export const POST = createForgeHandler("audit");
