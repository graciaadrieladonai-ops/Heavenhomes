export const MAINTAINER_CATEGORIES = [
  "Plumber",
  "Cleaner",
  "Carpenter",
  "Electrician",
  "Painter",
  "Landscaper",
  "HVAC",
  "Handyman",
  "Other",
] as const;

export type MaintainerCategory = (typeof MAINTAINER_CATEGORIES)[number];

export function parseMaintainerCategories(values: string[]) {
  return values.filter((value): value is MaintainerCategory =>
    (MAINTAINER_CATEGORIES as readonly string[]).includes(value),
  );
}

export function formatMaintainerCategories(categories: string[], other = "") {
  const labels = categories.map((c) =>
    c === "Other" && other.trim() ? `Other (${other.trim()})` : c,
  );
  return labels.join(", ");
}
