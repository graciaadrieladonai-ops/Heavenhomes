import { notFound, redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { TourForm } from "@/components/TourForm";
import { Stepper } from "@/components/ui";
import { getApplication, getProperty } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function TourPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = await getApplication(applicationId);
  if (!application) notFound();
  if (application.status === "paid") redirect(`/receipt/${application.id}`);
  if (application.status === "payment_submitted" || application.status === "txn_issued") {
    redirect(`/pay/${application.id}/pending`);
  }
  const property = await getProperty(application.propertyId);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-xl px-5 py-10">
        <Stepper current="tour" />
        <h1 className="font-serif text-4xl">Schedule your tour</h1>
        <p className="mt-2 text-muted">
          Hi {application.firstName}. Pick a date and time to walk through{" "}
          {property?.title ?? "this home"} with the owner.
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-white p-6">
          <TourForm applicationId={application.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
