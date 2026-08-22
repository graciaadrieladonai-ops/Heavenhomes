import { notFound } from "next/navigation";
import Link from "next/link";
import { PropertyForm } from "@/components/PropertyForm";
import { DeleteListingForm } from "@/components/DeleteListingForm";
import { getProperty } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-muted hover:text-ink">
        ← Properties
      </Link>
      <h1 className="mt-3 font-serif text-4xl">Edit listing</h1>
      <p className="mt-2 mb-8 text-muted">{property.title}</p>
      <PropertyForm property={property} />
      <div className="mt-10 max-w-3xl rounded-2xl border border-clay/30 bg-[#f8ece6] p-5">
        <p className="font-medium text-clay">Delete this listing</p>
        <p className="mt-1 text-sm text-muted">
          Removes it from this desk and from the public site. Renter applications
          for this home stay in Applications.
        </p>
        <div className="mt-4">
          <DeleteListingForm id={property.id} title={property.title} />
        </div>
      </div>
    </div>
  );
}
