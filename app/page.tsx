import { Header, Footer } from "@/components/SiteChrome";
import { PropertyCard } from "@/components/ui";
import { SearchBar } from "@/components/SearchBar";
import { listPublishedProperties } from "@/lib/store";
import { filterProperties, toSearchHits } from "@/lib/search";
import { getRenterSession } from "@/lib/renter";
import { maintainerHasApplied } from "@/lib/maintainer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  let all: Awaited<ReturnType<typeof listPublishedProperties>> = [];
  let renter = { propertyIds: [] as string[], applicationIds: [] as string[], exp: 0 };
  let maintainerApplied = false;
  try {
    all = await listPublishedProperties();
  } catch {
    all = [];
  }
  try {
    renter = await getRenterSession();
  } catch {
    /* viewing lock stays off */
  }
  try {
    maintainerApplied = await maintainerHasApplied();
  } catch {
    maintainerApplied = false;
  }
  const properties = filterProperties(all, q);
  const homes = toSearchHits(all);

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/20" />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Find a place to live</p>
            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] text-white sm:text-6xl">
              Search homes and schedule a tour.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Look up a property, apply, pick a visit time, and keep your receipt
              for the tour. Want to work on these homes instead? Apply for a job.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar defaultValue={q} variant="hero" homes={homes} />
            </div>
          </div>
        </section>

        <section id="homes" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Available homes</p>
              <h2 className="mt-2 font-serif text-4xl">
                {q ? `Results for “${q}”` : "Schedule a tour"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                {q
                  ? "These are listed homes that match your search. Pick one to apply and schedule a tour."
                  : "Choose a home, apply, then pick a tour date. Your receipt is proof of the appointment."}
              </p>
            </div>
            <div className="w-full max-w-md">
              <SearchBar defaultValue={q} homes={homes} />
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center">
              <p className="font-serif text-2xl">
                {q ? "No homes match that search" : "No homes listed yet"}
              </p>
              <p className="mt-2 text-muted">
                {q
                  ? "Try the street, city, ZIP, or the name of a listed home."
                  : "Check back soon for new listings."}
              </p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  applied={
                    maintainerApplied || renter.propertyIds.includes(property.id)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
