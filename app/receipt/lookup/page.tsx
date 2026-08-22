import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { getApplicationByReceipt } from "@/lib/store";

export const dynamic = "force-dynamic";

async function lookup(formData: FormData) {
  "use server";
  const code = String(formData.get("receipt") || "").trim();
  const found = await getApplicationByReceipt(code);
  if (!found) redirect("/receipt/lookup?error=1");
  redirect(`/receipt/${found.id}`);
}

export default async function LookupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md px-5 py-16">
        <h1 className="font-serif text-4xl">Find your receipt</h1>
        <p className="mt-2 text-muted">
          Enter the receipt number from your confirmation (starts with HVN-).
          A Transaction ID from the landlord is not a receipt and will not open
          this page.
        </p>
        <form action={lookup} className="mt-8 space-y-4">
          <input
            name="receipt"
            required
            placeholder="HVN-XXXXXXXX"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 uppercase outline-none ring-sage/30 focus:ring-2"
          />
          {error ? (
            <p className="text-sm text-clay">No receipt found for that number.</p>
          ) : null}
          <button className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white hover:bg-sage-2">
            Open receipt
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
