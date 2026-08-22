import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { isAdmin } from "@/lib/auth";

export default async function AdminDeskLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-line bg-white p-5 md:block">
        <Link href="/" className="font-serif text-xl">
          Haven
        </Link>
        <p className="mt-1 text-xs text-muted">Owner desk</p>
        <nav className="mt-8 grid gap-1 text-sm">
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-paper">
            Overview
          </Link>
          <Link href="/admin/properties" className="rounded-lg px-3 py-2 hover:bg-paper">
            Properties
          </Link>
          <Link href="/admin/payments" className="rounded-lg px-3 py-2 hover:bg-paper">
            Payment accounts
          </Link>
          <Link href="/admin/applications" className="rounded-lg px-3 py-2 hover:bg-paper">
            Renter applications
          </Link>
          <Link href="/admin/maintainers" className="rounded-lg px-3 py-2 hover:bg-paper">
            Home maintainers
          </Link>
        </nav>
        <form action={logoutAction} className="absolute bottom-5 left-5 right-5">
          <button className="w-full rounded-full border border-line px-3 py-2 text-sm hover:bg-paper">
            Sign out
          </button>
        </form>
      </aside>
      <div className="md:pl-56">
        <header className="flex items-center justify-between border-b border-line px-5 py-4 md:hidden">
          <Link href="/admin" className="font-serif text-lg">
            Owner desk
          </Link>
          <form action={logoutAction}>
            <button className="text-sm text-muted">Sign out</button>
          </form>
        </header>
        <nav className="flex gap-4 overflow-x-auto border-b border-line px-5 py-3 text-sm md:hidden">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/properties">Properties</Link>
          <Link href="/admin/payments">Payments</Link>
          <Link href="/admin/applications">Renters</Link>
          <Link href="/admin/maintainers">Maintainers</Link>
        </nav>
        <div className="px-5 py-8">{children}</div>
      </div>
    </div>
  );
}
