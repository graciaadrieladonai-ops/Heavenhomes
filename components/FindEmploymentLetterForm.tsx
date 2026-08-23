"use client";

import { useState } from "react";
import { findEmploymentLetterAction } from "@/app/actions/maintainer";
import { isNextRedirect } from "@/lib/errors";

export function FindEmploymentLetterForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-6 space-y-3"
      action={async (formData) => {
        setError("");
        setPending(true);
        try {
          await findEmploymentLetterAction(formData);
        } catch (err) {
          if (isNextRedirect(err)) throw err;
          const message = err instanceof Error ? err.message : "Could not find that letter.";
          setError(message);
          setPending(false);
        }
      }}
    >
      <label className="block text-sm">
        Email on your job application
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
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Looking…" : "Open employment letter"}
      </button>
    </form>
  );
}
