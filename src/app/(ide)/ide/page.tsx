import type { Metadata } from "next";
import { IdeShell } from "@/components/ide/IdeShell";

export const metadata: Metadata = {
  title: "Forge — IDE Online | TUSST",
  description:
    "Write, test and deploy Soroban smart contracts on Stellar testnet — right from the browser.",
};

// The Forge is open to everyone: projects live in the browser (localStorage),
// compilation runs in the sandbox, and deploys are signed client-side. No
// auth gate — signed-in users just get a higher rate limit.
export default function IdePage() {
  return <IdeShell />;
}
