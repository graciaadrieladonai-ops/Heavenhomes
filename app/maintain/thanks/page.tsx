import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";

export default function MaintainThanksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-lg px-5 py-20 text-center">
        <h1 className="font-serif text-4xl">Application received</h1>
        <p className="mt-3 text-muted">
          The owner can review your trade, details, ID, availability, and payout
          account from the admin desk. You can now use Get code and view now on
          listed homes.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-sage px-6 text-sm text-white"
        >
          Back to homes
        </Link>
      </main>
      <Footer />
    </>
  );
}
