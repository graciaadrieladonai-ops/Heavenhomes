"use client";

import { deletePropertyAction } from "@/app/actions/property";

export function DeleteListingForm({
  id,
  title,
  label = "Delete listing",
}: {
  id: string;
  title?: string;
  label?: string;
}) {
  return (
    <form
      action={deletePropertyAction}
      onSubmit={(event) => {
        const name = title ? `“${title}”` : "this listing";
        if (!window.confirm(`Delete ${name}? It will come off the public site.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-11 items-center rounded-full border border-clay/40 bg-white px-5 text-sm text-clay hover:bg-[#f8ece6]"
      >
        {label}
      </button>
    </form>
  );
}
