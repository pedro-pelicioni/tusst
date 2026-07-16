import { getMessages } from "@/i18n/server";

export async function Footer() {
  const m = await getMessages();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] text-muted">
          {m.common.footer.tagline}
        </p>
        <p className="font-mono text-[11px] text-muted">
          {m.common.footer.motto}
        </p>
      </div>
    </footer>
  );
}
