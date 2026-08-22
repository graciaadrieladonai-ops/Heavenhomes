import type { ReactNode } from "react";
import { updatePaymentAccountsAction } from "@/app/actions/payment";
import { getPaymentAccounts } from "@/lib/store";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PaymentsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const accounts = await getPaymentAccounts();
  const { saved } = await searchParams;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">Payment accounts</h1>
      <p className="mt-2 text-muted">
        Applicants see these details on the payment step. Update them whenever an
        account changes — each method shows its last-updated date.
      </p>
      {saved ? (
        <p className="mt-4 rounded-xl bg-[#e7efe8] px-4 py-3 text-sm text-sage">
          Payment accounts saved.
        </p>
      ) : null}
      <form action={updatePaymentAccountsAction} className="mt-8 space-y-8">
        <fieldset className="rounded-2xl border border-line bg-white p-5">
          <legend className="px-1 font-medium">Cash App</legend>
          <p className="mb-4 text-xs text-muted">
            Updated {formatShortDate(accounts.cashapp.updatedAt)}
          </p>
          <Grid>
            <Input label="Cashtag" name="cashapp_cashtag" defaultValue={accounts.cashapp.cashtag} />
            <Input label="Name on account" name="cashapp_name" defaultValue={accounts.cashapp.name} />
            <div className="sm:col-span-2">
              <Input label="Notes" name="cashapp_notes" defaultValue={accounts.cashapp.notes} />
            </div>
          </Grid>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-white p-5">
          <legend className="px-1 font-medium">Walmart</legend>
          <p className="mb-4 text-xs text-muted">
            Updated {formatShortDate(accounts.walmart.updatedAt)}
          </p>
          <Grid>
            <Input
              label="Receiver name"
              name="walmart_receiverName"
              defaultValue={accounts.walmart.receiverName}
            />
            <Input label="Phone" name="walmart_phone" defaultValue={accounts.walmart.phone} />
            <div className="sm:col-span-2">
              <Input label="Notes" name="walmart_notes" defaultValue={accounts.walmart.notes} />
            </div>
          </Grid>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-white p-5">
          <legend className="px-1 font-medium">Zelle</legend>
          <p className="mb-4 text-xs text-muted">
            Updated {formatShortDate(accounts.zelle.updatedAt)}
          </p>
          <Grid>
            <Input
              label="Email or phone"
              name="zelle_emailOrPhone"
              defaultValue={accounts.zelle.emailOrPhone}
            />
            <Input label="Name" name="zelle_name" defaultValue={accounts.zelle.name} />
            <div className="sm:col-span-2">
              <Input label="Notes" name="zelle_notes" defaultValue={accounts.zelle.notes} />
            </div>
          </Grid>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-white p-5">
          <legend className="px-1 font-medium">Crypto</legend>
          <p className="mb-4 text-xs text-muted">
            Updated {formatShortDate(accounts.crypto.updatedAt)}
          </p>
          <Grid>
            <Input label="Network" name="crypto_network" defaultValue={accounts.crypto.network} />
            <Input label="Wallet address" name="crypto_address" defaultValue={accounts.crypto.address} />
            <div className="sm:col-span-2">
              <Input label="Notes" name="crypto_notes" defaultValue={accounts.crypto.notes} />
            </div>
          </Grid>
        </fieldset>

        <button className="inline-flex h-12 items-center rounded-full bg-sage px-8 text-sm font-medium text-white hover:bg-sage-2">
          Save payment details
        </button>
      </form>
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Input({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
      />
    </label>
  );
}
