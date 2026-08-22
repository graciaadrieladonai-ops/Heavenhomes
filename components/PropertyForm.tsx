import { upsertPropertyAction } from "@/app/actions/property";
import type { Property } from "@/lib/types";

export function PropertyForm({ property }: { property?: Property }) {
  return (
    <form action={upsertPropertyAction} className="max-w-3xl space-y-5">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}
      <Field label="Title" name="title" required defaultValue={property?.title} />
      <label className="block text-sm">
        Description
        <textarea
          name="description"
          rows={5}
          defaultValue={property?.description}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Street address" name="address" required defaultValue={property?.address} />
        <Field label="City" name="city" required defaultValue={property?.city} />
        <Field label="State" name="state" required defaultValue={property?.state} />
        <Field label="ZIP" name="zip" required defaultValue={property?.zip} />
        <Field label="Monthly rent" name="price" type="number" required defaultValue={property?.price} />
        <Field label="Beds (0 = studio)" name="beds" type="number" defaultValue={property?.beds ?? 1} />
        <Field label="Baths" name="baths" type="number" step="0.5" defaultValue={property?.baths ?? 1} />
        <Field label="Square feet" name="sqft" type="number" defaultValue={property?.sqft ?? 800} />
        <Field label="Type" name="type" defaultValue={property?.type ?? "Apartment"} />
        <Field
          label="Available date"
          name="availableDate"
          type="date"
          defaultValue={property?.availableDate}
        />
      </div>
      <Field
        label="Amenities (comma separated)"
        name="amenities"
        defaultValue={property?.amenities.join(", ")}
      />
      <label className="block text-sm">
        Image URLs (one per line)
        <textarea
          name="imageUrls"
          rows={4}
          defaultValue={property?.images.filter((s) => s.startsWith("http")).join("\n")}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
        />
      </label>
      {property?.images.some(
        (s) => s.startsWith("/uploads/") || s.startsWith("/api/files/") || s.startsWith("data:"),
      ) ? (
        <div className="text-sm">
          <p className="font-medium">Uploaded photos (kept automatically)</p>
          <ul className="mt-2 space-y-1 text-muted">
            {property.images
              .filter(
                (s) =>
                  s.startsWith("/uploads/") || s.startsWith("/api/files/") || s.startsWith("data:"),
              )
              .map((src) => (
                <li key={src}>{src.startsWith("data:") ? "Saved photo (syncs to the live site)" : src}</li>
              ))}
          </ul>
        </div>
      ) : null}
      <label className="block text-sm">
        Upload photos
        <input
          name="imageFiles"
          type="file"
          multiple
          accept="image/*"
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5"
        />
      </label>
      <Field
        label="Get code and view now — mother site link"
        name="viewCodeUrl"
        defaultValue={property?.viewCodeUrl}
      />
      <p className="-mt-3 text-xs text-muted">
        Renters who click Get code and view now are told they are going to the
        mother site, then this URL opens. Application fee is $100 refundable.
        Security deposit is $1,000 after viewing; $500 can be paid now to hold
        the home.
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked={property?.published ?? true} />
        Publish on the landing page
      </label>
      <button className="inline-flex h-12 items-center rounded-full bg-sage px-8 text-sm font-medium text-white hover:bg-sage-2">
        Save listing
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      {required ? <span className="text-clay"> *</span> : null}
      <input
        name={name}
        type={type}
        required={required}
        step={step}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
      />
    </label>
  );
}
