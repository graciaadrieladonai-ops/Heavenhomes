import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Stepper } from "@/components/ui";
import { getProperty } from "@/lib/store";
import { money, propertyAddress } from "@/lib/format";
import { APPLICATION_FEE } from "@/lib/fees";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const property = await getProperty(propertyId);
  if (!property || !property.published) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        <Stepper current="apply" />
        <p className="text-sm text-muted">
          Applying for{" "}
          <Link href={`/properties/${property.id}`} className="underline">
            {property.title}
          </Link>
        </p>
        <h1 className="mt-2 font-serif text-4xl">Rental application</h1>
        <p className="mt-2 text-muted">
          {propertyAddress(property)} · {money(property.price)}/mo ·{" "}
          {money(APPLICATION_FEE)} refundable application fee
        </p>
        <div className="mt-8">
          <ApplicationForm property={property} />
        </div>
      </main>
      <Footer />
    </>
  );
}
