import { Header, Footer } from "@/components/SiteChrome";
import { FindEmploymentLetterForm } from "@/components/FindEmploymentLetterForm";
import { getMaintainerSession } from "@/lib/maintainer";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FindEmploymentLetterPage() {
  const session = await getMaintainerSession();
  const latest = session.maintainerIds.at(-1);
  if (latest) redirect(`/maintain/letter/${latest}`);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-lg px-5 py-16">
        <h1 className="font-serif text-4xl">Download employment letter</h1>
        <p className="mt-3 text-muted">
          Enter the email from your job application to open and download your
          Haven employment letter.
        </p>
        <FindEmploymentLetterForm />
      </main>
      <Footer />
    </>
  );
}
