import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";

export default function MaintainThanksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-lg px-5 py-20 text-center">
        <h1 className="font-serif text-4xl">Application received</h1>
        <p className="mt-3 text-muted">
          Your employment letter is ready to download. You can also use Get code
          and view now on listed homes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/maintain/letter"
            className="inline-flex h-12 items-center rounded-full bg-sage px-6 text-sm text-white"
          >
            Download employment letter
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm"
          >
            Back to homes
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
