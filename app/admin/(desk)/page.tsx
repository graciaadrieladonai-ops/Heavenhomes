import Link from "next/link";
import { listApplications, listMaintainers, stats } from "@/lib/store";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [counts, applications, maintainers] = await Promise.all([
    stats(),
    listApplications(),
    listMaintainers(),
  ]);
  const recentApps = applications.slice(0, 5);
  const recentMaintainers = maintainers.slice(0, 5);

  return (
    <div>
      <h1 className="font-serif text-4xl">Overview</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Every form a visitor fills is saved here — renter applications, IDs, tour
        dates, receipts, and home-maintainer applications. No extra service is
        required; open the records below.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Published homes", counts.published],
          ["Renter applications", counts.applications],
          ["Waiting on proof review", counts.pendingPayments],
          ["Home maintainers", counts.maintainers],
          ["Paid receipts", counts.paid],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 font-serif text-4xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/properties/new"
          className="inline-flex h-11 items-center rounded-full bg-sage px-5 text-sm text-white"
        >
          Add a property
        </Link>
        <Link
          href="/admin/payments"
          className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm"
        >
          Update payment accounts
        </Link>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Renter applications</h2>
            <Link href="/admin/applications" className="text-sm underline">
              View all
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            {recentApps.length === 0 ? (
              <p className="p-6 text-sm text-muted">No renter applications yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentApps.map((app) => (
                  <li key={app.id}>
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-paper"
                    >
                      <span>
                        {app.firstName} {app.lastName}
                        <span className="ml-2 text-sm text-muted">
                          {app.status.replaceAll("_", " ")}
                        </span>
                      </span>
                      <span className="text-sm text-muted">{formatShortDate(app.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Home maintainers</h2>
            <Link href="/admin/maintainers" className="text-sm underline">
              View all
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            {recentMaintainers.length === 0 ? (
              <p className="p-6 text-sm text-muted">No maintainer applications yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentMaintainers.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/admin/maintainers/${m.id}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-paper"
                    >
                      <span>
                        {m.firstName} {m.lastName}
                        <span className="ml-2 text-sm text-muted">{m.payPerTwoVisits}</span>
                      </span>
                      <span className="text-sm text-muted">{formatShortDate(m.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
