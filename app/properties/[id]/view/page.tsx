import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { UnlockViewForm } from "@/components/UnlockViewForm";
import { MotherSiteNotice } from "@/components/MotherSiteNotice";
import { getProperty } from "@/lib/store";
import { propertyAddress } from "@/lib/format";
import { canViewProperty } from "@/lib/view-access";

export const dynamic = "force-dynamic";

export default async function ViewCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property || !property.published) notFound();
  const applied = await canViewProperty(property.id);
  const url = property.viewCodeUrl.trim();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-lg px-5 py-16">
        {!applied ? (
          <div className="text-center">
            <h1 className="font-serif text-4xl">Apply first to view this home</h1>
            <p className="mt-3 text-muted">
              Get code and view now is only available after a successful
              application. Renters apply for {property.title}. Maintainers
              submit the home-maintainer job application first.
            </p>
            <div className="mt-8 grid gap-3">
              <Link
                href={`/apply/${property.id}`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-sage px-6 text-sm text-white"
              >
                Apply as a renter
              </Link>
              <Link
                href="/maintain"
                className="inline-flex h-12 items-center justify-center rounded-full border border-ink bg-white px-6 text-sm"
              >
                Apply as a home maintainer
              </Link>
            </div>
            <UnlockViewForm propertyId={property.id} />
          </div>
        ) : (
          <div>
            <p className="text-center text-sm uppercase tracking-[0.18em] text-muted">
              Lockbox viewing
            </p>
            <h1 className="mt-3 text-center font-serif text-4xl">
              You are going to our mother site
            </h1>
            <p className="mt-4 text-center text-muted">
              Use this only to view {property.title} at {propertyAddress(property)}{" "}
              and get the lockbox code.
            </p>

            <div className="mt-8 rounded-3xl border border-clay/40 bg-[#f8ece6] p-5 text-sm">
              <p className="font-medium text-clay">Price on that site is not your rent</p>
              <p className="mt-2 text-ink/80">
                The monthly price you see on the mother site is higher because
                they add their percentage if you apply directly with them. Do not
                apply there. Do not message or call the mother site. If you
                contact them or apply through them, you will pay those extra
                charges — the higher monthly price they show.
              </p>
              <p className="mt-3 text-ink/80">
                On that page, click <span className="font-medium">Let yourself in</span>{" "}
                only. That is how you get the lockbox code and view the home.
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-line bg-white p-5 text-sm">
              <p className="font-medium">Turn on location before you continue</p>
              <p className="mt-2 text-muted">
                On the phone or computer you are using, open Safari or your
                browser settings and turn on:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
                <li>Location Services (Settings → Privacy &amp; Security → Location Services)</li>
                <li>
                  For Safari (or Chrome/Firefox): allow location{" "}
                  <span className="font-medium text-ink">While Using the App</span>
                </li>
              </ol>
            </div>

            {url ? (
              <MotherSiteNotice url={url} />
            ) : (
              <p className="mt-8 rounded-2xl border border-line bg-white px-5 py-4 text-center text-sm text-muted">
                The owner has not added a viewing link for this home yet.
              </p>
            )}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link href={`/properties/${property.id}`} className="text-sm text-muted underline">
            Back to this home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
