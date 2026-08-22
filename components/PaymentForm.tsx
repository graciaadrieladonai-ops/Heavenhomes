"use client";

import { useState } from "react";
import { submitPaymentProofAction } from "@/app/actions/application";
import type { PaymentAccounts, PaymentMethod } from "@/lib/types";
import { formatShortDate, moneyExact, paymentLabel } from "@/lib/format";
import { isNextRedirect } from "@/lib/errors";
import { APPLICATION_FEE, HOLD_AMOUNT, SECURITY_DEPOSIT } from "@/lib/fees";

const METHODS: { id: PaymentMethod; title: string; blurb: string }[] = [
  { id: "cashapp", title: "Cash App", blurb: "Send to the cashtag below." },
  { id: "walmart", title: "Walmart", blurb: "Money transfer / Walmart2Walmart." },
  { id: "zelle", title: "Zelle", blurb: "Send to the owner’s Zelle details." },
  { id: "crypto", title: "Crypto", blurb: "Transfer on the listed network." },
];

export function PaymentForm({
  applicationId,
  accounts,
}: {
  applicationId: string;
  accounts: PaymentAccounts;
}) {
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [hold, setHold] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const selected = method ? accounts[method] : null;
  const amount = APPLICATION_FEE + (hold ? HOLD_AMOUNT : 0);

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        setError("");
        setPending(true);
        try {
          await submitPaymentProofAction(formData);
        } catch (err) {
          if (isNextRedirect(err)) throw err;
          const message = err instanceof Error ? err.message : "Could not confirm payment.";
          if (/Minified React error #441/.test(message)) throw err;
          setError(message);
          setPending(false);
        }
      }}
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <input type="hidden" name="paymentMethod" value={method} />

      <div className="rounded-3xl border border-line bg-white p-5 text-sm">
        <p>
          <span className="font-medium">{moneyExact(APPLICATION_FEE)} application fee</span>
          {" — "}refundable.
        </p>
        <p className="mt-2 text-muted">
          Security deposit is {moneyExact(SECURITY_DEPOSIT)}, due after you view the
          home. To hold this listing so other applicants cannot take it, add{" "}
          {moneyExact(HOLD_AMOUNT)} now. That amount counts toward the deposit.
        </p>
        <label className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
          <input
            name="secureHold"
            type="checkbox"
            checked={hold}
            onChange={(e) => setHold(e.target.checked)}
            className="mt-1"
          />
          <span>
            Pay {moneyExact(HOLD_AMOUNT)} now to secure this home from other
            applicants. Remaining deposit after viewing:{" "}
            {moneyExact(hold ? SECURITY_DEPOSIT - HOLD_AMOUNT : SECURITY_DEPOSIT)}.
          </span>
        </label>
        <p className="mt-4 font-serif text-2xl">Due now {moneyExact(amount)}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {METHODS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMethod(item.id)}
            className={`rounded-2xl border p-4 text-left ${
              method === item.id ? "border-sage bg-sage text-white" : "border-line bg-white"
            }`}
          >
            <p className="font-medium">{item.title}</p>
            <p className={`mt-1 text-sm ${method === item.id ? "text-white/80" : "text-muted"}`}>
              {item.blurb}
            </p>
          </button>
        ))}
      </div>

      {method && selected ? (
        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-muted">
                Pay {moneyExact(amount)} via {paymentLabel(method)}
              </p>
              <p className="mt-1 text-xs text-muted">
                Details last updated {formatShortDate(selected.updatedAt)}
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            {method === "cashapp" && "cashtag" in selected ? (
              <>
                <Row label="Cashtag" value={selected.cashtag} />
                <Row label="Name" value={selected.name} />
              </>
            ) : null}
            {method === "walmart" && "receiverName" in selected ? (
              <>
                <Row label="Receiver" value={selected.receiverName} />
                <Row label="Phone" value={selected.phone} />
              </>
            ) : null}
            {method === "zelle" && "emailOrPhone" in selected ? (
              <>
                <Row label="Zelle to" value={selected.emailOrPhone} />
                <Row label="Name" value={selected.name} />
              </>
            ) : null}
            {method === "crypto" && "address" in selected ? (
              <>
                <Row label="Network" value={selected.network} />
                <Row label="Wallet" value={selected.address} />
              </>
            ) : null}
            <div>
              <dt className="text-muted">Instructions</dt>
              <dd className="mt-1">{selected.notes}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="text-sm text-muted">Choose a method to see the owner’s current account details.</p>
      )}

      <label className="block text-sm">
        <span className="font-medium">Payment confirmation / reference</span>
        <input
          name="paymentReference"
          required
          placeholder="Transaction ID, confirmation number, or last 4"
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">
          Proof of payment <span className="text-clay">*</span>
        </span>
        <input
          name="paymentProof"
          type="file"
          required
          accept="image/*,.pdf"
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1.5"
        />
        <span className="mt-1 block text-xs text-muted">
          Upload a screenshot or receipt of the transfer. The landlord reviews this
          before a tour receipt can be issued.
        </span>
      </label>

      {error ? (
        <p className="rounded-xl border border-clay/30 bg-[#f8ece6] px-4 py-3 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !method}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white hover:bg-sage-2 disabled:opacity-60"
      >
        {pending ? "Sending proof…" : "Send proof to landlord"}
      </button>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium break-all">{value}</dd>
    </div>
  );
}
