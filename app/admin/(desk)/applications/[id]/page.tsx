import { notFound } from "next/navigation";
import Link from "next/link";
import { getApplication, getProperty } from "@/lib/store";
import { issueTransactionIdAction } from "@/app/actions/application";
import { CopyButton } from "@/components/CopyButton";
import { IdCard } from "@/components/IdCard";
import {
  formatDate,
  formatTime,
  fullName,
  money,
  paymentLabel,
  propertyAddress,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();
  const property = await getProperty(application.propertyId);

  const rows: [string, string][] = [
    ["Name", fullName(application.firstName, application.lastName, application.middleName)],
    ["Email", application.email],
    ["Phone", application.phone],
    ["Date of birth", application.dateOfBirth],
    ["SSN", application.ssn],
    [
      "Current address",
      `${application.currentAddress}, ${application.currentCity}, ${application.currentState} ${application.currentZip}`,
    ],
    ["Housing", application.housingStatus],
    ["Time at address", application.yearsAtAddress],
    ["Landlord", `${application.landlordName} ${application.landlordPhone}`.trim()],
    ["Current rent", application.currentRent],
    ["Reason for moving", application.reasonForMoving],
    ["Employment", application.employmentStatus],
    ["Employer", application.employer],
    ["Title", application.jobTitle],
    ["Monthly income", application.monthlyIncome],
    ["Occupants", `${application.occupants} — ${application.occupantNames}`],
    ["Pets", `${application.hasPets} ${application.petDetails}`.trim()],
    ["Vehicles", application.vehicles],
    ["Smokes", application.smokes],
    [
      "Emergency",
      `${application.emergencyName} · ${application.emergencyPhone} · ${application.emergencyRelation}`,
    ],
    ["Tour", application.tourDate ? `${formatDate(application.tourDate)} at ${formatTime(application.tourTime)}` : "Not scheduled"],
    ["Payment", application.paymentMethod ? `${paymentLabel(application.paymentMethod)} · ${application.paymentReference}` : "Unpaid"],
    ["Amount paid", application.amountPaid ? money(application.amountPaid) : "—"],
    ["Hold ($500)", application.paidHold ? "Yes — counts toward $1,000 deposit" : "No"],
    ["Transaction ID", application.transactionId || "Not issued yet"],
    ["Receipt", application.receiptNumber || "—"],
    ["Tour code", application.tourCode || "—"],
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/applications" className="text-sm text-muted hover:text-ink">
        ← Applications
      </Link>
      <h1 className="mt-3 font-serif text-4xl">
        {application.firstName} {application.lastName}
      </h1>
      <p className="mt-2 text-muted">
        {property ? (
          <>
            {property.title} · {propertyAddress(property)} · {money(property.price)}/mo
          </>
        ) : (
          "Listing removed"
        )}
        <span className="ml-2 capitalize">· {application.status.replaceAll("_", " ")}</span>
      </p>
      {application.status !== "paid" && !application.transactionId ? (
        <form action={issueTransactionIdAction} className="mt-6 rounded-2xl border border-sage/30 bg-[#e7efe8] p-5">
          <input type="hidden" name="id" value={application.id} />
          <p className="font-medium">
            {application.paymentProofPath
              ? "Payment proof is waiting for you"
              : "This renter does not have a Transaction ID yet"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {application.paymentProofPath
              ? "Review the screenshot below. If the transfer is real, issue a unique Transaction ID. Copy it and give it to the renter — they must enter it to get a tour receipt."
              : "Issue a unique Transaction ID now, copy it, and give it to the renter. They enter it after payment to unlock a tour receipt."}
          </p>
          <button className="mt-4 inline-flex h-11 items-center rounded-full bg-sage px-5 text-sm text-white">
            Issue Transaction ID
          </button>
        </form>
      ) : null}
      {application.transactionId && application.status !== "paid" ? (
        <div className="mt-6 rounded-2xl border border-sage/30 bg-[#e7efe8] p-5">
          <p className="font-medium">Give this Transaction ID to the renter</p>
          <p className="mt-1 text-sm text-muted">
            They enter this on their waiting page to unlock the tour receipt. Do
            not post it publicly.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-mono text-2xl tracking-wide">{application.transactionId}</p>
            <CopyButton value={application.transactionId} label="Copy ID" />
          </div>
        </div>
      ) : null}
      <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-3 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm">{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <IdCard label="Front of ID" src={application.idFrontPath} />
        <IdCard label="Back of ID" src={application.idBackPath} />
        {application.paymentProofPath ? (
          <IdCard label="Proof of payment" src={application.paymentProofPath} />
        ) : null}
      </div>
      {application.status === "paid" ? (
        <Link href={`/receipt/${application.id}`} className="mt-8 inline-block text-sm underline">
          Open public receipt
        </Link>
      ) : null}
    </div>
  );
}
