"use client";

import { useState } from "react";
import { unlockViewWithEmailAction } from "@/app/actions/application";
import { isNextRedirect } from "@/lib/errors";

export function UnlockViewForm({ propertyId }: { propertyId: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-8 space-y-3 text-left"
      action={async (formData) => {
        setError("");
        setPending(true);
        try {
          await unlockViewWithEmailAction(formData);
        } catch (err) {
          if (isNextRedirect(err)) throw err;
          const message = err instanceof Error ? err.message : "Could not unlock viewing.";
          if (/Minified React error #441/.test(message)) throw err;
          setError(message);
          setPending(false);
        }
      }}
    >
      <input type="hidden" name="propertyId" value={propertyId} />
      <label className="block text-sm">
        Already applied as a renter or maintainer? Enter that email
        <input
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
        />
      </label>
      {error ? <p className="text-sm text-clay">{error}</p> : null}
      <button
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm text-white disabled:opacity-60"
      >
        {pending ? "Checking…" : "Unlock viewing"}
      </button>
    </form>
  );
}
