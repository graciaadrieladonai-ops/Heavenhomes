"use client";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(value)}
      className="rounded-full border border-line bg-white px-4 py-1.5 text-sm hover:bg-paper"
    >
      {label}
    </button>
  );
}
