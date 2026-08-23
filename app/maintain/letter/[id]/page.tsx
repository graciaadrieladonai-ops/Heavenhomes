import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { PrintButton } from "@/components/PrintButton";
import { getMaintainer } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import { maintainerOwns } from "@/lib/maintainer";
import { formatDate, fullName } from "@/lib/format";
import { formatMaintainerCategories } from "@/lib/trades";

export const dynamic = "force-dynamic";

export default async function EmploymentLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const maintainer = await getMaintainer(id);
  if (!maintainer) notFound();
  if (!(await maintainerOwns(id)) && !(await isAdmin())) notFound();

  const name = fullName(maintainer.firstName, maintainer.lastName, maintainer.middleName);
  const role =
    formatMaintainerCategories(maintainer.categories, maintainer.categoryOther) ||
    "home maintainer";

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        <p className="no-print text-sm text-muted">Your job application was received.</p>
        <h1 className="no-print mt-2 font-serif text-4xl">Employment letter</h1>
        <p className="no-print mt-2 text-muted">
          Download or print this letter as proof of employment with Haven. You can
          also use Get code and view now on listed homes.
        </p>

        <article className="print-sheet mt-8 rounded-3xl border border-line bg-white p-8 shadow-[0_18px_50px_-32px_rgba(23,20,16,0.45)] sm:p-12">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="font-serif text-2xl">Haven</p>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Employment letter</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm">{maintainer.letterNumber}</p>
              <p className="mt-1 text-xs text-muted">{formatDate(maintainer.createdAt.slice(0, 10))}</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted">To whom it may concern:</p>
          <p className="mt-4 leading-7">
            This letter confirms that <span className="font-medium">{name}</span> is
            employed by Haven as a home maintainer ({role}) for owner-listed
            properties.
          </p>
          <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Employee</dt>
              <dd className="font-medium">{name}</dd>
            </div>
            <div>
              <dt className="text-muted">Role</dt>
              <dd>{role}</dd>
            </div>
            <div>
              <dt className="text-muted">Work days</dt>
              <dd>{maintainer.availableDays.join(", ") || "As assigned"}</dd>
            </div>
            <div>
              <dt className="text-muted">Pay</dt>
              <dd>{maintainer.payPerTwoVisits} per two visits a week, cheque deposit</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted">Contact</dt>
              <dd>
                {maintainer.email} · {maintainer.phone}
              </dd>
            </div>
          </dl>
          <p className="mt-8 text-sm leading-6 text-muted">
            This letter may be presented as proof of employment with Haven. It does
            not replace a government ID.
          </p>
          <p className="mt-10 font-serif text-xl">Haven</p>
          <p className="text-sm text-muted">Owner-listed rentals</p>
        </article>

        <div className="no-print mt-6 flex flex-wrap gap-3">
          <a
            href={`/maintain/letter/${maintainer.id}/download`}
            className="inline-flex h-12 items-center rounded-full bg-sage px-6 text-sm font-medium text-white hover:bg-sage-2"
          >
            Download employment letter
          </a>
          <PrintButton label="Print / save PDF" />
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm"
          >
            Back to homes
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
