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
        Reload this page. If it keeps failing, the hosted site may still be on
        an old deploy. Admin is only on this computer at localhost:3000/admin/login.
      </p>
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
