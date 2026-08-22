import Link from "next/link";
import { DeleteListingForm } from "@/components/DeleteListingForm";
import { listAllProperties } from "@/lib/store";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await listAllProperties();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="inline-flex h-11 items-center rounded-full bg-sage px-5 text-sm text-white"
        >
          New listing
        </Link>
      </div>
      <p className="mt-2 text-muted">
        Published homes appear on the public site. Use Delete listing to take one
        off this desk and the live page.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
        {properties.length === 0 ? (
          <p className="p-6 text-sm text-muted">No properties yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {properties.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-muted">
                    {p.city}, {p.state} · {money(p.price)}/mo · {p.published ? "Published" : "Hidden"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteListingForm id={p.id} title={p.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
