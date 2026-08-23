"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/phone";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2";

export function PhoneField({
  label,
  name,
  required,
  autoComplete = "tel",
  value,
  onChange,
  defaultValue = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const [inner, setInner] = useState(() => formatPhone(defaultValue));
  const controlled = value !== undefined;
  const shown = controlled ? value : inner;

  function update(next: string) {
    const formatted = formatPhone(next);
    if (!controlled) setInner(formatted);
    onChange?.(formatted);
  }

  return (
    <label className="block text-sm">
      <span className="font-medium">
        {label}
        {required ? <span className="text-clay"> *</span> : null}
      </span>
      <input
        name={name}
        type="tel"
        required={required}
        inputMode="numeric"
        autoComplete={autoComplete}
        placeholder="(555) 010-2040"
        maxLength={14}
        value={shown}
        onChange={(event) => update(event.target.value)}
        className={inputClass}
      />
      <span className="mt-1 block text-xs text-muted">10-digit US number.</span>
    </label>
  );
}
