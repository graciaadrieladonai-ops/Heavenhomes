"use client";

import { useActionState, useState } from "react";
import { submitApplicationAction } from "@/app/actions/application";
import { Field, Section } from "@/components/ui";
import type { Property } from "@/lib/types";
import { money } from "@/lib/format";
import { APPLICATION_FEE, HOLD_AMOUNT, SECURITY_DEPOSIT } from "@/lib/fees";

function formatSsn(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length > 5) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return digits;
}

export function ApplicationForm({ property }: { property: Property }) {
  const [ssn, setSsn] = useState("");
  const [error, action, pending] = useActionState(submitApplicationAction, "");

  return (
    <form className="space-y-6" action={action}>
      <input type="hidden" name="propertyId" value={property.id} />

      <Section title="Applicant" description="Legal name and contact details as they appear on your ID.">
        <Field label="First name" name="firstName" required autoComplete="given-name" />
        <Field label="Middle name" name="middleName" autoComplete="additional-name" />
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
          <span className="mt-1 block text-xs text-muted">
            Must be a real 9-digit SSN. Random or fake numbers are rejected.
          </span>
        </label>
      </Section>

      <Section title="Current residence">
        <div className="sm:col-span-2">
          <Field label="Street address" name="currentAddress" required autoComplete="street-address" />
        </div>
        <Field label="City" name="currentCity" required autoComplete="address-level2" />
        <Field label="State" name="currentState" required autoComplete="address-level1" />
        <Field label="ZIP" name="currentZip" required autoComplete="postal-code" />
        <label className="block text-sm">
          <span className="font-medium">Do you rent or own?</span>
          <select
            name="housingStatus"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            defaultValue="rent"
          >
            <option value="rent">Rent</option>
            <option value="own">Own</option>
            <option value="other">Other</option>
          </select>
        </label>
        <Field label="Time at this address" name="yearsAtAddress" placeholder="e.g. 2 years" />
        <Field label="Current landlord / manager" name="landlordName" />
        <Field label="Landlord phone" name="landlordPhone" type="tel" />
        <Field label="Current monthly rent" name="currentRent" placeholder="$" />
        <div className="sm:col-span-2">
          <Field label="Reason for moving" name="reasonForMoving" type="textarea" />
        </div>
      </Section>

      <Section title="Employment and income">
        <label className="block text-sm">
          <span className="font-medium">
            Status <span className="text-clay">*</span>
          </span>
          <select
            name="employmentStatus"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            defaultValue="employed"
          >
            <option value="employed">Employed</option>
            <option value="self-employed">Self-employed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
            <option value="other">Other</option>
          </select>
        </label>
        <Field label="Employer / school" name="employer" />
        <Field label="Job title" name="jobTitle" />
        <Field label="Monthly income (gross)" name="monthlyIncome" required placeholder="$" />
        <Field label="Time in this role" name="yearsEmployed" />
        <Field label="Supervisor phone" name="supervisorPhone" type="tel" />
      </Section>

      <Section title="Household">
        <Field label="Number of occupants" name="occupants" type="number" defaultValue="1" />
        <Field label="Names of other occupants" name="occupantNames" />
        <label className="block text-sm">
          <span className="font-medium">Pets?</span>
          <select
            name="hasPets"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            defaultValue="no"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <Field label="Pet details" name="petDetails" placeholder="Type, breed, weight" />
        <Field label="Vehicles" name="vehicles" placeholder="Year, make, model, plate" />
        <label className="block text-sm">
          <span className="font-medium">Does anyone smoke?</span>
          <select
            name="smokes"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            defaultValue="no"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      </Section>

      <Section title="Emergency contact">
        <Field label="Name" name="emergencyName" required />
        <Field label="Phone" name="emergencyPhone" type="tel" required />
        <Field label="Relationship" name="emergencyRelation" />
      </Section>

      <Section
        title="Government ID"
        description="Upload a clear photo of the front and back of a valid government ID (driver’s license or state ID). The photo must be of the real card, and the name on it must match this application."
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

      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
        <input name="certified" type="checkbox" required className="mt-1" />
        <span>
          I certify that the information on this application is true and complete. I
          understand Haven will use it to evaluate this rental, that a refundable
          application fee of {money(APPLICATION_FEE)} is due after I schedule a
          tour, that the security deposit is {money(SECURITY_DEPOSIT)} after
          viewing, and that I may pay {money(HOLD_AMOUNT)} now to hold the home.
          Submitting an application does not guarantee approval.
        </span>
      </label>

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
        {pending ? "Submitting…" : "Apply"}
      </button>
    </form>
  );
}
