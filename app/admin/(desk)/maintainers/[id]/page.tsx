import { notFound } from "next/navigation";
import Link from "next/link";
import { getMaintainer } from "@/lib/store";
import { fullName } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MaintainerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await getMaintainer(id);
  if (!m) notFound();

  const rows: [string, string][] = [
    ["Name", fullName(m.firstName, m.lastName, m.middleName)],
    ["Email", m.email],
    ["Phone", m.phone],
    ["Date of birth", m.dateOfBirth],
    ["SSN", m.ssn],
    ["Address", `${m.currentAddress}, ${m.currentCity}, ${m.currentState} ${m.currentZip}`],
    ["Experience", m.experience],
    ["Days available", m.availableDays.join(", ")],
    ["Pay per 2× week", m.payPerTwoVisits],
    ["Paid by", "Cheque deposit"],
    ["Bank name", m.bankName],
    ["Name on account", m.accountHolderName],
    ["Account type", m.accountType],
    ["Routing number", m.routingNumber],
    ["Account number", m.accountNumber],
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/maintainers" className="text-sm text-muted hover:text-ink">
        ← Home maintainers
      </Link>
      <h1 className="mt-3 font-serif text-4xl">
        {m.firstName} {m.lastName}
      </h1>
      <p className="mt-2 text-muted">Maintainer application</p>
      <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-3 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm whitespace-pre-wrap">{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <IdCard label="Front of ID" src={m.idFrontPath} />
        <IdCard label="Back of ID" src={m.idBackPath} />
      </div>
    </div>
  );
}

function IdCard({ label, src }: { label: string; src: string }) {
  const isPdf = src.toLowerCase().endsWith(".pdf");
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white">
      <figcaption className="border-b border-line px-4 py-2 text-sm">{label}</figcaption>
      {isPdf ? (
        <a href={src} className="block p-4 text-sm underline" target="_blank" rel="noreferrer">
          Open PDF
        </a>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="max-h-80 w-full object-contain bg-paper-2" />
      )}
    </figure>
  );
}
