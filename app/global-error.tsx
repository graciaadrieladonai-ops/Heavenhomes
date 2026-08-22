"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Georgia, serif", background: "#f4efe6", color: "#171410", margin: 0 }}>
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: 36 }}>Haven is starting</h1>
          <p style={{ color: "#6d665c" }}>
            Reload this tab. If this is vercel.com, open your project URL ending in
            .vercel.app instead.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 24,
              height: 48,
              padding: "0 24px",
              border: 0,
              borderRadius: 999,
              background: "#2f4a3e",
              color: "white",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
