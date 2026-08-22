import Link from "next/link";
import { deletePropertyAction } from "@/app/actions/property";
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
      <p className="mt-2 text-muted">Only published homes appear on the public landing page.</p>
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
                <div className="flex gap-2">
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="rounded-full border border-line px-4 py-1.5 text-sm"
                  >
                    Edit
                  </Link>
                  <form action={deletePropertyAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-full border border-clay/30 px-4 py-1.5 text-sm text-clay">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
