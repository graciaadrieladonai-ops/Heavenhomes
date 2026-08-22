import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/PropertyForm";
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
      <h1 className="font-serif text-4xl">Edit listing</h1>
      <p className="mt-2 mb-8 text-muted">{property.title}</p>
      <PropertyForm property={property} />
    </div>
  );
}
