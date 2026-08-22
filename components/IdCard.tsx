import { isPdfSrc } from "@/lib/media";

export function IdCard({ label, src }: { label: string; src: string }) {
  if (!src || src === "uploaded") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-line bg-white">
        <figcaption className="border-b border-line px-4 py-2 text-sm">{label}</figcaption>
        <p className="p-4 text-sm text-muted">No file uploaded</p>
      </figure>
    );
  }
  const isPdf = isPdfSrc(src);
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white">
      <figcaption className="border-b border-line px-4 py-2 text-sm">{label}</figcaption>
      {isPdf ? (
        <a href={src} className="block p-4 text-sm underline" target="_blank" rel="noreferrer">
          Open PDF
        </a>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="max-h-80 w-full object-contain bg-paper-2" />
      )}
    </figure>
  );
}
