import type { Property } from "./types";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function haystack(property: Property) {
  return normalize(
    [
      property.title,
      property.address,
      property.city,
      property.state,
      property.zip,
      property.type,
      property.description,
      property.amenities.join(" "),
    ].join(" "),
  );
}

export function filterProperties(properties: Property[], query: string) {
  const words = normalize(query).split(" ").filter(Boolean);
  if (!words.length) return properties;
  return properties.filter((property) => {
    const hay = haystack(property);
    return words.every((word) => hay.includes(word));
  });
}

export function propertySearchLabel(property: Property) {
  return [property.address, property.city, property.state, property.zip]
    .filter(Boolean)
    .join(", ");
}

export type HomeSearchHit = {
  id: string;
  title: string;
  label: string;
  href: string;
};

export function toSearchHits(properties: Property[]): HomeSearchHit[] {
  return properties.map((property) => ({
    id: property.id,
    title: property.title,
    label: propertySearchLabel(property),
    href: `/properties/${property.id}`,
  }));
}

export function suggestHomes(hits: HomeSearchHit[], query: string, limit = 8) {
  const words = normalize(query).split(" ").filter(Boolean);
  if (!words.length) return hits.slice(0, limit);
  const needle = words.join(" ");
  return hits
    .map((hit) => {
      const title = normalize(hit.title);
      const label = normalize(hit.label);
      const hay = `${title} ${label}`;
      if (!words.every((word) => hay.includes(word))) return { hit, score: 0 };
      let score = 1;
      if (title.startsWith(needle)) score += 50;
      if (title.split(" ").some((word) => word.startsWith(words[0]))) score += 30;
      if (label.startsWith(needle)) score += 25;
      if (label.split(" ").some((word) => word.startsWith(words[0]))) score += 20;
      return { hit, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.hit);
}
