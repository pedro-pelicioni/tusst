import type { Metadata } from "next";
import { getMessages } from "@/i18n/server";
import { IdeShell } from "@/components/ide/IdeShell";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.ide.meta.title,
    description: m.ide.meta.description,
  };
}

// The Forge is open to everyone: projects live in the browser (localStorage),
// compilation runs in the sandbox, and deploys are signed client-side. No
// auth gate — signed-in users just get a higher rate limit.
export default function IdePage() {
  return <IdeShell />;
}
