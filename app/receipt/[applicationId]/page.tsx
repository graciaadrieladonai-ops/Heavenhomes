import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { Stepper } from "@/components/ui";
import { getApplication, getProperty } from "@/lib/store";
import {
  formatDate,
  formatTime,
  fullName,
  maskSsn,
  money,
  paymentLabel,
  propertyAddress,
} from "@/lib/format";
import { APPLICATION_FEE, HOLD_AMOUNT, SECURITY_DEPOSIT } from "@/lib/fees";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = await getApplication(applicationId);
  if (!application || application.status !== "paid") notFound();
  const property = await getProperty(application.propertyId);
  if (!property) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="no-print">
          <Stepper current="receipt" />
        </div>
        <article className="print-sheet rounded-3xl border border-line bg-white p-8 shadow-[0_18px_50px_-32px_rgba(23,20,16,0.45)] sm:p-12">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Haven tour receipt</p>
              <h1 className="mt-2 font-serif text-4xl">Payment received</h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm">{application.receiptNumber}</p>
              <p className="mt-1 text-xs text-muted">Keep this for your tour</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Applicant</h2>
              <p className="mt-2 font-medium">
                {fullName(application.firstName, application.lastName, application.middleName)}
              </p>
              <p className="text-sm text-muted">{application.email}</p>
              <p className="text-sm text-muted">{application.phone}</p>
              <p className="mt-2 text-sm">SSN {maskSsn(application.ssn)}</p>
              <p className="text-sm">Government ID submitted (front & back)</p>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Property</h2>
              <p className="mt-2 font-medium">{property.title}</p>
              <p className="text-sm text-muted">{propertyAddress(property)}</p>
              <p className="mt-2 text-sm">{money(property.price)} / month</p>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Scheduled tour</h2>
              <p className="mt-2 font-serif text-2xl">{formatDate(application.tourDate)}</p>
              <p className="text-lg">{formatTime(application.tourTime)}</p>
              {application.tourNotes ? (
                <p className="mt-2 text-sm text-muted">{application.tourNotes}</p>
              ) : null}
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Fees</h2>
              <p className="mt-2 font-serif text-2xl">
                {money(application.amountPaid || APPLICATION_FEE)} paid
              </p>
              <p className="text-sm">
                {money(APPLICATION_FEE)} refundable application fee
              </p>
              {application.paidHold ? (
                <p className="text-sm">
                  {money(HOLD_AMOUNT)} hold toward {money(SECURITY_DEPOSIT)} deposit
                </p>
              ) : (
                <p className="text-sm text-muted">
                  {money(SECURITY_DEPOSIT)} security deposit due after viewing
                </p>
              )}
              <p className="mt-2 text-sm">{paymentLabel(application.paymentMethod)}</p>
              <p className="text-sm text-muted">Ref {application.paymentReference}</p>
              <p className="text-sm text-muted">
                Confirmed {new Date(application.paymentConfirmedAt).toLocaleString()}
              </p>
            </section>
          </div>

          <div className="mt-10 flex items-center justify-between rounded-2xl bg-sage px-5 py-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/70">Tour code</p>
              <p className="font-mono text-3xl tracking-[0.2em]">{application.tourCode}</p>
            </div>
            <p className="max-w-[12rem] text-right text-xs text-white/80">
              Present this receipt and code at the property on your tour date.
            </p>
          </div>
        </article>

        <div className="no-print mt-6 flex flex-wrap gap-3">
          <PrintButton />
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm"
          >
            Back to listings
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
