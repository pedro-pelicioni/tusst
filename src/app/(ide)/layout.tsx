import { Nav } from "@/components/Nav";

// The Forge IDE wants the full viewport: shared Nav, no Footer, and a main
// region that owns its own scrolling (the editor/console panes scroll, the
// page never does).
export default function IdeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col">
      <Nav />
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
