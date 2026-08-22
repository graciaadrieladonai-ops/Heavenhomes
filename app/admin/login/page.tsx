import { loginAction } from "@/app/actions/auth";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Haven
        </Link>
        <h1 className="mt-4 font-serif text-3xl">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to review applications, update listings, and change payout accounts.
        </p>
        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            />
          </label>
          {error ? (
            <p className="text-sm text-clay">Those credentials were not accepted.</p>
          ) : null}
          <button className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white hover:bg-sage-2">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
