import Link from "next/link";
import { getProperty, listApplications } from "@/lib/store";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ApplicationsAdminPage() {
  const applications = await listApplications();
  const withListings = await Promise.all(
    applications.map(async (app) => ({
      app,
      title: (await getProperty(app.propertyId))?.title ?? "Listing removed",
    })),
  );

  return (
    <div>
      <h1 className="font-serif text-4xl">Renter applications</h1>
      <p className="mt-2 text-muted">
        Everything a renter submitted — contact, SSN, IDs, tour time, payment
        proof, and receipts. If status is payment submitted, issue a Transaction
        ID. If it is already issued, copy the ID and give it to the renter so they
        can get a receipt.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
        {withListings.length === 0 ? (
          <p className="p-6 text-sm text-muted">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {withListings.map(({ app, title }) => (
              <li key={app.id}>
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="block px-5 py-4 hover:bg-paper"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {app.firstName} {app.lastName}
                    </p>
                    <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs capitalize">
                      {app.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {title} · {formatShortDate(app.createdAt)}
                    {app.receiptNumber ? ` · ${app.receiptNumber}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
