import { notFound, redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { PaymentForm } from "@/components/PaymentForm";
import { Stepper } from "@/components/ui";
import { getApplication, getPaymentAccounts, getProperty } from "@/lib/store";
import { formatDate, formatTime, money } from "@/lib/format";
import { APPLICATION_FEE } from "@/lib/fees";

export const dynamic = "force-dynamic";

export default async function PayPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = await getApplication(applicationId);
  if (!application) notFound();
  if (!application.tourDate) redirect(`/tour/${application.id}`);
  if (application.status === "paid") redirect(`/receipt/${application.id}`);
  if (application.status === "payment_submitted" || application.status === "txn_issued") {
    redirect(`/pay/${application.id}/pending`);
  }
  const [property, accounts] = await Promise.all([
    getProperty(application.propertyId),
    getPaymentAccounts(),
  ]);
  if (!property) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl px-5 py-10">
        <Stepper current="pay" />
        <h1 className="font-serif text-4xl">Pay application fee</h1>
        <p className="mt-2 text-muted">
          Tour reserved for {formatDate(application.tourDate)} at{" "}
          {formatTime(application.tourTime)}. The {money(APPLICATION_FEE)}{" "}
          application fee is refundable. You can also pay $500 now to hold this
          home; the $1,000 security deposit is due after viewing. After you send
          proof of payment, the landlord must approve it before you can get a
          tour receipt.
        </p>
        <div className="mt-8">
          <PaymentForm applicationId={application.id} accounts={accounts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
