"use client";

import { useState } from "react";

export function MotherSiteNotice({ url }: { url: string }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="mt-8">
      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I understand the mother-site monthly price is higher because they take
          a percentage if I apply there. I will only view the home: click{" "}
          <strong>Let yourself in</strong> for the lockbox code. I will not
          contact, message, call, or apply on that site — otherwise I pay those
          extra charges (the higher price per month they show).
        </span>
      </label>
      <a
        href={agreed ? url : undefined}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!agreed}
        onClick={(e) => {
          if (!agreed) e.preventDefault();
        }}
        className={`mt-4 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-medium ${
          agreed
            ? "bg-sage text-white hover:bg-sage-2"
            : "pointer-events-none cursor-not-allowed bg-paper-2 text-muted"
        }`}
      >
        Continue — then click Let yourself in for the lockbox code
      </a>
    </div>
  );
}
