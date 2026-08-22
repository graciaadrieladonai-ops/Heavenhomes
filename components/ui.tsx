import type { InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { money, propertyAddress } from "@/lib/format";

export function PropertyCard({
  property,
  applied = false,
}: {
  property: Property;
  applied?: boolean;
}) {
  const image = property.images[0];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_50px_-32px_rgba(23,20,16,0.45)]">
      <Link href={`/properties/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">No photo</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium">
          {property.type}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-muted">
          {property.city}, {property.state}
        </p>
        <h3 className="mt-1 font-serif text-2xl leading-tight">
          <Link href={`/properties/${property.id}`} className="hover:underline">
            {property.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{propertyAddress(property)}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink/80">
          <span>{property.beds === 0 ? "Studio" : `${property.beds} bed`}</span>
          <span className="text-line">·</span>
          <span>{property.baths} bath</span>
          <span className="text-line">·</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        <p className="mt-4 font-serif text-3xl tracking-tight">
          {money(property.price)}
          <span className="ml-1 text-base font-sans text-muted">/mo</span>
        </p>
        <div className="mt-5 grid gap-2">
          <Link
            href={`/apply/${property.id}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white transition hover:bg-sage-2"
          >
            Apply and schedule a tour
          </Link>
          <GetCodeButton propertyId={property.id} applied={applied} />
        </div>
      </div>
    </article>
  );
}

export function GetCodeButton({
  propertyId,
  applied,
}: {
  propertyId: string;
  applied: boolean;
}) {
  if (!applied) {
    return (
      <div>
        <span className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full border border-line bg-paper-2 text-sm font-medium text-muted">
          Get code and view now
        </span>
        <p className="mt-1.5 text-center text-xs text-muted">
          Renters apply for this home first. To work on homes, apply for a job first.
        </p>
      </div>
    );
  }
  return (
    <Link
      href={`/properties/${propertyId}/view`}
      className="inline-flex h-12 w-full items-center justify-center rounded-full border border-ink bg-white text-sm font-medium text-ink hover:bg-paper"
    >
      Get code and view now
    </Link>
  );
}

export function Stepper({
  current,
}: {
  current: "apply" | "tour" | "pay" | "receipt";
}) {
  const steps = [
    { id: "apply", label: "Application" },
    { id: "tour", label: "Tour date" },
    { id: "pay", label: "Payment" },
    { id: "receipt", label: "Receipt" },
  ] as const;
  const index = steps.findIndex((s) => s.id === current);
  return (
    <ol className="mb-8 grid grid-cols-4 gap-2 text-xs sm:text-sm">
      {steps.map((step, i) => (
        <li
          key={step.id}
          className={`rounded-full px-2 py-2 text-center ${
            i <= index ? "bg-sage text-white" : "bg-paper-2 text-muted"
          }`}
        >
          {i + 1}. {step.label}
        </li>
      ))}
    </ol>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  defaultValue,
  value,
  onChange,
  maxLength,
  inputMode,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  children?: ReactNode;
}) {
  const cls =
    "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2";
  const controlled = value !== undefined;
  return (
    <label className="block text-sm">
      <span className="font-medium">
        {label}
        {required ? <span className="text-clay"> *</span> : null}
      </span>
      {children ? (
        children
      ) : type === "textarea" ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          value={controlled ? value : undefined}
          defaultValue={controlled ? undefined : defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          maxLength={maxLength}
          rows={4}
          className={cls}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={controlled ? value : undefined}
          defaultValue={controlled ? undefined : defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          maxLength={maxLength}
          inputMode={inputMode}
          className={cls}
        />
      )}
    </label>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-white p-6 shadow-[0_12px_40px_-28px_rgba(23,20,16,0.4)]">
      <h2 className="font-serif text-2xl">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
