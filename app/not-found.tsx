import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-serif text-4xl">Page not found</h1>
        <p className="mt-3 text-muted">That listing, application, or receipt does not exist.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-sage px-6 text-sm text-white"
        >
          Back to listings
        </Link>
      </main>
      <Footer />
    </>
  );
}
