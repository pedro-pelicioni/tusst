import Link from "next/link";
import { getMessages } from "@/i18n/server";

export async function Footer() {
  const m = await getMessages();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] text-muted">
          {m.common.footer.tagline}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="font-mono text-[11px] text-muted">
            {m.common.footer.motto}
          </p>
          <Link
            href="/privacy"
            className="font-mono text-[11px] text-muted2 underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg"
          >
            {m.common.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
