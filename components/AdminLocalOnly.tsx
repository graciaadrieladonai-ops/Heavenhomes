import Link from "next/link";

export function AdminLocalOnly() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-8">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Haven
        </Link>
        <h1 className="mt-4 font-serif text-3xl">Owner desk is on this computer</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The public listings run on Vercel. Admin, applications, and uploaded IDs
          stay on your Mac so the hosted site does not try to write a database
          file.
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-6 text-ink">
          <li>
            On this Mac, in the project folder, run{" "}
            <code className="rounded bg-paper px-1.5 py-0.5 text-xs">npm run dev</code>
          </li>
          <li>
            Open{" "}
            <a className="underline" href="http://localhost:3000/admin/login">
              http://localhost:3000/admin/login
            </a>
          </li>
          <li>Sign in with the email and password in your local `.env.local` file.</li>
        </ol>
      </div>
    </main>
  );
}
