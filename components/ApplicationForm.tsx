"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import { submitApplicationAction } from "@/app/actions/application";
import { Field, Section } from "@/components/ui";
import { AddressSuggest } from "@/components/AddressSuggest";
import { PhoneField } from "@/components/PhoneField";
import type { Property } from "@/lib/types";
import { money } from "@/lib/format";
import { useApplyDraft } from "@/lib/apply-draft";
import { APPLICATION_FEE, HOLD_AMOUNT, SECURITY_DEPOSIT } from "@/lib/fees";

function formatSsn(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length > 5) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return digits;
}

export function ApplicationForm({ property }: { property: Property }) {
  const { draft, set } = useApplyDraft(property.id);
  const files = useRef({ front: null as File | null, back: null as File | null });
  const [frontName, setFrontName] = useState("");
  const [backName, setBackName] = useState("");
  const apply = useCallback(async (prev: string, formData: FormData) => {
    if (files.current.front) formData.set("idFront", files.current.front);
    if (files.current.back) formData.set("idBack", files.current.back);
    return submitApplicationAction(prev, formData);
  }, []);
  const [error, action, pending] = useActionState(apply, "");

  return (
    <form className="space-y-6" action={action}>
      <input type="hidden" name="propertyId" value={property.id} />

      <Section title="Applicant" description="Legal name and contact details as they appear on your ID.">
        <Field label="First name" name="firstName" required autoComplete="given-name" value={draft.firstName} onChange={(v) => set("firstName", v)} />
        <Field label="Middle name" name="middleName" autoComplete="additional-name" value={draft.middleName} onChange={(v) => set("middleName", v)} />
        <Field label="Last name" name="lastName" required autoComplete="family-name" value={draft.lastName} onChange={(v) => set("lastName", v)} />
        <Field label="Email" name="email" type="email" required autoComplete="email" value={draft.email} onChange={(v) => set("email", v)} />
        <PhoneField
          label="Mobile phone"
          name="phone"
          required
          value={draft.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field label="Date of birth" name="dateOfBirth" type="date" required value={draft.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} />
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
            maxLength={11}
            value={draft.ssn}
            onChange={(e) => set("ssn", formatSsn(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
          />
          <span className="mt-1 block text-xs text-muted">
            Must be a real 9-digit SSN. Random or fake numbers are rejected.
          </span>
        </label>
      </Section>

      <Section title="Current residence">
        <AddressSuggest
          address={draft.currentAddress}
          city={draft.currentCity}
          state={draft.currentState}
          zip={draft.currentZip}
          onChange={(next) => {
            if (next.address !== undefined) set("currentAddress", next.address);
            if (next.city !== undefined) set("currentCity", next.city);
            if (next.state !== undefined) set("currentState", next.state);
            if (next.zip !== undefined) set("currentZip", next.zip);
          }}
        />
        <label className="block text-sm">
          <span className="font-medium">Do you rent or own?</span>
          <select
            name="housingStatus"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            value={draft.housingStatus}
            onChange={(e) => set("housingStatus", e.target.value)}
          >
            <option value="rent">Rent</option>
            <option value="own">Own</option>
            <option value="other">Other</option>
          </select>
        </label>
        <Field label="Time at this address" name="yearsAtAddress" placeholder="e.g. 2 years" value={draft.yearsAtAddress} onChange={(v) => set("yearsAtAddress", v)} />
        <Field label="Current landlord / manager" name="landlordName" value={draft.landlordName} onChange={(v) => set("landlordName", v)} />
        <PhoneField
          label="Landlord phone"
          name="landlordPhone"
          autoComplete="off"
          value={draft.landlordPhone}
          onChange={(v) => set("landlordPhone", v)}
        />
        <Field label="Current monthly rent" name="currentRent" placeholder="$" value={draft.currentRent} onChange={(v) => set("currentRent", v)} />
        <div className="sm:col-span-2">
          <Field label="Reason for moving" name="reasonForMoving" type="textarea" value={draft.reasonForMoving} onChange={(v) => set("reasonForMoving", v)} />
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
            value={draft.employmentStatus}
            onChange={(e) => set("employmentStatus", e.target.value)}
          >
            <option value="employed">Employed</option>
            <option value="self-employed">Self-employed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
            <option value="other">Other</option>
          </select>
        </label>
        <Field label="Employer / school" name="employer" value={draft.employer} onChange={(v) => set("employer", v)} />
        <Field label="Job title" name="jobTitle" value={draft.jobTitle} onChange={(v) => set("jobTitle", v)} />
        <Field label="Monthly income (gross)" name="monthlyIncome" required placeholder="$" value={draft.monthlyIncome} onChange={(v) => set("monthlyIncome", v)} />
        <Field label="Time in this role" name="yearsEmployed" value={draft.yearsEmployed} onChange={(v) => set("yearsEmployed", v)} />
        <PhoneField
          label="Supervisor phone"
          name="supervisorPhone"
          autoComplete="off"
          value={draft.supervisorPhone}
          onChange={(v) => set("supervisorPhone", v)}
        />
      </Section>

      <Section title="Household">
        <Field label="Number of occupants" name="occupants" type="number" value={draft.occupants} onChange={(v) => set("occupants", v)} />
        <Field label="Names of other occupants" name="occupantNames" value={draft.occupantNames} onChange={(v) => set("occupantNames", v)} />
        <label className="block text-sm">
          <span className="font-medium">Pets?</span>
          <select
            name="hasPets"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            value={draft.hasPets}
            onChange={(e) => set("hasPets", e.target.value)}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <Field label="Pet details" name="petDetails" placeholder="Type, breed, weight" value={draft.petDetails} onChange={(v) => set("petDetails", v)} />
        <Field label="Vehicles" name="vehicles" placeholder="Year, make, model, plate" value={draft.vehicles} onChange={(v) => set("vehicles", v)} />
        <label className="block text-sm">
          <span className="font-medium">Does anyone smoke?</span>
          <select
            name="smokes"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
            value={draft.smokes}
            onChange={(e) => set("smokes", e.target.value)}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      </Section>

      <Section title="Emergency contact">
        <Field label="Name" name="emergencyName" required value={draft.emergencyName} onChange={(v) => set("emergencyName", v)} />
        <PhoneField
          label="Phone"
          name="emergencyPhone"
          required
          autoComplete="off"
          value={draft.emergencyPhone}
          onChange={(v) => set("emergencyPhone", v)}
        />
        <Field label="Relationship" name="emergencyRelation" value={draft.emergencyRelation} onChange={(v) => set("emergencyRelation", v)} />
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
            value={draft.idPrintedName}
            onChange={(v) => set("idPrintedName", v)}
          />
        </div>
        <label className="block text-sm">
          <span className="font-medium">
            Front of ID <span className="text-clay">*</span>
          </span>
          <input
            name="idFront"
            type="file"
            required={!files.current.front}
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              files.current.front = e.target.files?.[0] ?? null;
              setFrontName(files.current.front?.name ?? "");
            }}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1.5"
          />
          {frontName ? <span className="mt-1 block text-xs text-muted">Kept: {frontName}</span> : null}
        </label>
        <label className="block text-sm">
          <span className="font-medium">
            Back of ID <span className="text-clay">*</span>
          </span>
          <input
            name="idBack"
            type="file"
            required={!files.current.back}
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              files.current.back = e.target.files?.[0] ?? null;
              setBackName(files.current.back?.name ?? "");
            }}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1.5"
          />
          {backName ? <span className="mt-1 block text-xs text-muted">Kept: {backName}</span> : null}
        </label>
      </Section>

      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
        <input
          name="certified"
          type="checkbox"
          required
          checked={draft.certified}
          onChange={(e) => set("certified", e.target.checked)}
          className="mt-1"
        />
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
