import Link from "next/link";
import { listMaintainers } from "@/lib/store";
import { formatShortDate } from "@/lib/format";
import { formatMaintainerCategories } from "@/lib/trades";

export const dynamic = "force-dynamic";

export default async function MaintainersAdminPage() {
  const maintainers = await listMaintainers();

  return (
    <div>
      <h1 className="font-serif text-4xl">Home maintainers</h1>
      <p className="mt-2 text-muted">
        Full applications, IDs, availability, and cheque-deposit bank details.
        Open a name to see everything they submitted.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
        {maintainers.length === 0 ? (
          <p className="p-6 text-sm text-muted">No maintainer applications yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {maintainers.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/admin/maintainers/${m.id}`}
                  className="block px-5 py-4 hover:bg-paper"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {m.firstName} {m.lastName}
                    </p>
                    <span className="text-sm text-muted">{formatShortDate(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatMaintainerCategories(m.categories, m.categoryOther) || "No category"}{" "}
                    · {m.payPerTwoVisits} / 2× week · cheque deposit · {m.bankName} ·{" "}
                    {m.availableDays.join(", ")}
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
