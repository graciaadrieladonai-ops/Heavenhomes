import type { Metadata } from "next";
import "./globals.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Haven — Owner-listed rentals",
    template: "%s · Haven",
  },
  description:
    "Private rental listings from the owner. Apply, schedule a tour, and keep a receipt for your visit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
