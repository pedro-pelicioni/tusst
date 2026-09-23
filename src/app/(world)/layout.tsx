import { Nav } from "@/components/Nav";

// The overworld surfaces (world map, the two islands) are full-viewport
// stages: the shared Nav stays, the Footer goes, and `main` is a fixed-height
// box the stage fills — the map itself is the page.
export default function WorldLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Nav />
      <main className="relative min-h-0 flex-1 overflow-clip">{children}</main>
    </div>
  );
}
