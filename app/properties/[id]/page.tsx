import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { getProperty } from "@/lib/store";
import { formatShortDate, money, propertyAddress } from "@/lib/format";
import { canViewProperty } from "@/lib/view-access";
import { GetCodeButton } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property || !property.published) notFound();
  const applied = await canViewProperty(property.id);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <Link href="/#listings" className="text-sm text-muted hover:text-ink">
          ← All listings
        </Link>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-paper-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={property.images[0]}
                alt={property.title}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            {property.images.length > 1 ? (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {property.images.slice(1, 4).map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            ) : null}

            <h1 className="mt-8 font-serif text-4xl sm:text-5xl">{property.title}</h1>
            <p className="mt-2 text-muted">{propertyAddress(property)}</p>
            <p className="mt-6 max-w-2xl leading-7 text-ink/85">{property.description}</p>

            {property.amenities.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {property.amenities.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside className="h-fit rounded-3xl border border-line bg-white p-6 shadow-[0_18px_50px_-32px_rgba(23,20,16,0.45)] lg:sticky lg:top-24">
            <p className="font-serif text-4xl">
              {money(property.price)}
              <span className="ml-1 text-lg font-sans text-muted">/mo</span>
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Beds</dt>
                <dd>{property.beds === 0 ? "Studio" : property.beds}</dd>
              </div>
              <div>
                <dt className="text-muted">Baths</dt>
                <dd>{property.baths}</dd>
              </div>
              <div>
                <dt className="text-muted">Size</dt>
                <dd>{property.sqft.toLocaleString()} sqft</dd>
              </div>
              <div>
                <dt className="text-muted">Available</dt>
                <dd>{formatShortDate(property.availableDate)}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-muted">
              Application fee $100 (refundable). Security deposit $1,000 is due
              after viewing. Pay $500 now if you want to hold this home from other
              applicants.
            </p>
            <div className="mt-6 grid gap-2">
              <Link
                href={`/apply/${property.id}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white hover:bg-sage-2"
              >
                Apply and schedule a tour
              </Link>
              <GetCodeButton propertyId={property.id} applied={applied} />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
