"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 48, textAlign: "center" }}>
        <h1>This page could not load</h1>
        <p>This is a single Next.js app. There is no separate database mixed in.</p>
        {error.digest ? <p>Error {error.digest}</p> : null}
        <button type="button" onClick={() => reset()}>
          Reload
        </button>
      </body>
    </html>
  );
}
