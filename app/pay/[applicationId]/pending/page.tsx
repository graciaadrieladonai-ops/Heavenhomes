import { notFound, redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { RedeemTransactionForm } from "@/components/RedeemTransactionForm";
import { getApplication, getProperty } from "@/lib/store";
import { renterOwnsApplication } from "@/lib/renter";

export const dynamic = "force-dynamic";

export default async function PaymentPendingPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = await getApplication(applicationId);
  if (!application) notFound();
  if (application.status === "paid") redirect(`/receipt/${application.id}`);
  if (application.status !== "payment_submitted" && application.status !== "txn_issued") {
    redirect(`/pay/${application.id}`);
  }
  if (!(await renterOwnsApplication(application.id))) {
    notFound();
  }
  const property = await getProperty(application.propertyId);
  const ready = application.status === "txn_issued";

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-xl px-5 py-10">
        {ready ? (
          <>
            <h1 className="font-serif text-4xl">Enter the landlord’s Transaction ID</h1>
            <p className="mt-3 text-muted">
              You cannot skip this page. A receipt is issued only after you enter
              the unique Transaction ID the landlord copied from the admin desk
              and gave you. A random or made-up ID will not work.
            </p>
            <RedeemTransactionForm applicationId={application.id} />
          </>
        ) : (
          <>
            <h1 className="font-serif text-4xl">Stay on this page — waiting on the landlord</h1>
            <p className="mt-3 text-muted">
              Your payment proof for {property?.title ?? "this home"} is with the
              owner. You cannot skip this page or open a receipt yet. When they
              approve the proof they will copy a Transaction ID and send it to
              you. Refresh this page and enter that exact ID. A random ID will
              not work.
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
