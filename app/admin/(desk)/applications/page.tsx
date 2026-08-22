import Link from "next/link";
import { listApplicationSummaries } from "@/lib/store";
import { formatShortDate } from "@/lib/format";
import { issueTransactionIdAction } from "@/app/actions/application";

export const dynamic = "force-dynamic";

export default async function ApplicationsAdminPage() {
  const applications = await listApplicationSummaries();
  const waiting = applications.filter((app) => app.status !== "paid" && !app.transactionId);

  return (
    <div>
      <h1 className="font-serif text-4xl">Renter applications</h1>
      <p className="mt-2 text-muted">
        Issue a Transaction ID for any renter who does not have one yet. Copy it
        from their application and give it to them so they can unlock a tour
        receipt.
      </p>
      {waiting.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-sage/30 bg-[#e7efe8] p-5">
          <p className="font-medium">
            {waiting.length === 1
              ? "1 renter still needs a Transaction ID"
              : `${waiting.length} renters still need a Transaction ID`}
          </p>
          <ul className="mt-4 divide-y divide-sage/20">
            {waiting.map((app) => (
              <li key={app.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium">
                    {app.firstName} {app.lastName}
                  </p>
                  <p className="text-sm text-muted">
                    {app.title} · {app.status.replaceAll("_", " ")}
                  </p>
                </div>
                <form action={issueTransactionIdAction}>
                  <input type="hidden" name="id" value={app.id} />
                  <button className="inline-flex h-10 items-center rounded-full bg-sage px-4 text-sm text-white">
                    Issue Transaction ID
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
        {applications.length === 0 ? (
          <p className="p-6 text-sm text-muted">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {applications.map((app) => (
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
                      {app.transactionId
                        ? app.status === "paid"
                          ? "receipt issued"
                          : "ID issued"
                        : app.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {app.title} · {formatShortDate(app.createdAt)}
                    {app.receiptNumber ? ` · ${app.receiptNumber}` : ""}
                    {!app.transactionId && app.status !== "paid" ? " · needs Transaction ID" : ""}
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
