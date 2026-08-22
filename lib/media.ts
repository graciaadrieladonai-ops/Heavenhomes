export type MediaVisibility = "public" | "private";

export function parseDataUrl(value: string): { mime: string; body: string } | null {
  const match = value.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  return { mime: match[1], body: match[2].replace(/\s/g, "") };
}

export function extensionFromMime(mime: string) {
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

export function mediaFileUrl(visibility: MediaVisibility, id: string, mime: string) {
  return `/api/media/${visibility}/${id}.${extensionFromMime(mime)}`;
}

export function parseMediaParam(raw: string) {
  const [id, ext] = raw.split(".");
  return { id, ext: (ext || "").toLowerCase() };
}

export function isPdfSrc(src: string) {
  return (
    src.toLowerCase().includes(".pdf") ||
    src.startsWith("data:application/pdf") ||
    src.toLowerCase().includes("application/pdf")
  );
}
