import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// All product pages (tracks, lessons, cards, login) share the standard
// chrome. The landing page at `/` ships its own cinematic nav + footer.
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
