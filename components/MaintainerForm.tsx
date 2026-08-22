"use client";

import { useState } from "react";
import { submitMaintainerAction } from "@/app/actions/maintainer";
import { Field, Section } from "@/components/ui";
import { isNextRedirect } from "@/lib/errors";
import { validateSsn } from "@/lib/validate-ssn";
import { MAINTAINER_CATEGORIES } from "@/lib/trades";

function formatSsn(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length > 5) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return digits;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function MaintainerForm() {
  const [ssn, setSsn] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [otherSelected, setOtherSelected] = useState(false);

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        setError("");
        const ssnError = validateSsn(String(formData.get("ssn") || ""));
        if (ssnError) {
          setError(ssnError);
          return;
        }
        setPending(true);
        try {
          await submitMaintainerAction(formData);
        } catch (err) {
          if (isNextRedirect(err)) throw err;
          setError(err instanceof Error ? err.message : "Could not submit application.");
          setPending(false);
        }
      }}
    >
      <Section
        title="Your details"
        description="This application is for people who want to maintain listed homes, not for renting them."
      >
        <Field label="First name" name="firstName" required autoComplete="given-name" />
        <Field label="Middle name" name="middleName" />
        <Field label="Last name" name="lastName" required autoComplete="family-name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Mobile phone" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Date of birth" name="dateOfBirth" type="date" required />
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium">
            Social Security Number <span className="text-clay">*</span>
          </span>
          <input
            name="ssn"
            required
            inputMode="numeric"
            autoComplete="off"
            placeholder="XXX-XX-XXXX"
            value={ssn}
            onChange={(e) => setSsn(formatSsn(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
          />
        </label>
      </Section>

      <Section title="Where you live">
        <div className="sm:col-span-2">
          <Field label="Street address" name="currentAddress" required />
        </div>
        <Field label="City" name="currentCity" required />
        <Field label="State" name="currentState" required />
        <Field label="ZIP" name="currentZip" required />
      </Section>

      <Section
        title="What you do"
        description="Select every trade that applies. Renters apply to live here; this is the job you want to do on the homes."
      >
        <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
          {MAINTAINER_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
            >
              <input
                type="checkbox"
                name="categories"
                value={category}
                onChange={
                  category === "Other"
                    ? (e) => setOtherSelected(e.target.checked)
                    : undefined
                }
              />
              {category}
            </label>
          ))}
        </div>
        {otherSelected ? (
          <div className="sm:col-span-2">
            <Field
              label="If other, what work do you do?"
              name="categoryOther"
              required
              placeholder="e.g. roofing, appliance repair"
            />
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <Field
            label="More about your experience"
            name="experience"
            type="textarea"
            placeholder="Years of work, licenses, the kinds of homes you have maintained…"
          />
        </div>
      </Section>

      <Section
        title="Days you can work"
        description="Select every day you are available. Work is typically twice a week."
      >
        <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
          {DAYS.map((day) => (
            <label key={day} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm">
              <input type="checkbox" name="availableDays" value={day} />
              {day}
            </label>
          ))}
        </div>
      </Section>

      <Section
        title="Cheque deposit — bank details"
        description="Maintainers are paid by cheque deposit only. Enter the bank account where the cheque should be deposited."
      >
        <Field
          label="Pay per 2 times a week"
          name="payPerTwoVisits"
          required
          placeholder="e.g. $120"
        />
        <Field label="Bank name" name="bankName" required placeholder="e.g. Chase, Bank of America" />
        <Field label="Name on the account" name="accountHolderName" required />
        <label className="block text-sm">
          <span className="font-medium">
            Account type <span className="text-clay">*</span>
          </span>
          <select
            name="accountType"
            required
            defaultValue="checking"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </label>
        <Field label="Routing number" name="routingNumber" required placeholder="9 digits" />
        <Field label="Account number" name="accountNumber" required />
      </Section>

      <Section
        title="Government ID"
        description="Clear photos of a real government ID. The name on the card must match this form."
      >
        <div className="sm:col-span-2">
          <Field
            label="Name printed on the ID"
            name="idPrintedName"
            required
            placeholder="Exactly as it appears on the card"
          />
        </div>
        <label className="block text-sm">
          <span className="font-medium">
            Front of ID <span className="text-clay">*</span>
          </span>
          <input
            name="idFront"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1.5"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">
            Back of ID <span className="text-clay">*</span>
          </span>
          <input
            name="idBack"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1.5"
          />
        </label>
      </Section>

      {error ? (
        <p className="rounded-xl border border-clay/30 bg-[#f8ece6] px-4 py-3 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white hover:bg-sage-2 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {pending ? "Submitting…" : "Submit maintainer application"}
      </button>
    </form>
  );
}
