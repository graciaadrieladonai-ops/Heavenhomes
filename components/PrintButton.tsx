"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-12 items-center rounded-full bg-sage px-6 text-sm font-medium text-white hover:bg-sage-2"
    >
      Print / save PDF
    </button>
  );
}
