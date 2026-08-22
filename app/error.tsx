"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="font-serif text-4xl">This page could not load</h1>
      <p className="mt-3 text-muted">
        Reload and try again. If you were applying, use the Production site URL
        (not a preview link) after DATABASE_URL is set in Vercel.
      </p>
      {error.message && !error.message.includes("Minified React error") ? (
        <p className="mt-3 text-sm text-clay">{error.message}</p>
      ) : null}
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-muted">Error {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 inline-flex h-12 items-center rounded-full bg-sage px-6 text-sm text-white"
      >
        Reload
      </button>
    </main>
  );
}
