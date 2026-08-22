import { PropertyForm } from "@/components/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl">New listing</h1>
      <p className="mt-2 mb-8 text-muted">This home will appear on the public site if published.</p>
      <PropertyForm />
    </div>
  );
}
