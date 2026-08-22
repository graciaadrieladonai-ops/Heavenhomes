import { Header, Footer } from "@/components/SiteChrome";
import { MaintainerForm } from "@/components/MaintainerForm";

export default function MaintainPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        <p className="text-sm uppercase tracking-[0.18em] text-muted">Work with Haven</p>
        <h1 className="mt-2 font-serif text-4xl">Apply for job</h1>
        <p className="mt-2 text-muted">
          Apply to clean, upkeep, and care for listed homes. This is a job
          application, not a rental application. Choose your trade (plumber,
          cleaner, carpenter, and more), the days you can work, the pay you
          want for two visits a week, and your bank details for cheque deposit.
          You must submit this application before you can use Get code and view
          now.
        </p>
        <div className="mt-8">
          <MaintainerForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
