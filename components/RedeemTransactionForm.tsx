"use client";

import { useState } from "react";
import { redeemTransactionIdAction } from "@/app/actions/application";
import { isNextRedirect } from "@/lib/errors";

export function RedeemTransactionForm({ applicationId }: { applicationId: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-6 space-y-3"
      action={async (formData) => {
        setError("");
        setPending(true);
        try {
          await redeemTransactionIdAction(formData);
        } catch (err) {
          if (isNextRedirect(err)) throw err;
          const message = err instanceof Error ? err.message : "That ID was not accepted.";
          if (/Minified React error #441/.test(message)) throw err;
          setError(message);
          setPending(false);
        }
      }}
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <label className="block text-sm">
        Transaction ID from the landlord
        <input
          name="transactionId"
          required
          autoComplete="off"
          spellCheck={false}
          placeholder="Paste the ID the landlord sent you"
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 uppercase outline-none ring-sage/30 focus:ring-2"
        />
        <span className="mt-1 block text-xs text-muted">
          Only the ID the landlord gives you will work. A random ID will not unlock a receipt.
        </span>
      </label>
      {error ? <p className="text-sm text-clay">{error}</p> : null}
      <button
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Checking…" : "Submit landlord ID and get tour receipt"}
      </button>
    </form>
  );
}
