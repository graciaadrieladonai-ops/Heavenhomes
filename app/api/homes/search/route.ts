import { NextResponse } from "next/server";
import { filterProperties, propertySearchLabel } from "@/lib/search";
import { listPublishedProperties } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") || "";
  try {
    const matches = filterProperties(await listPublishedProperties(), q).slice(0, 8);
    return NextResponse.json(
      matches.map((property) => ({
        id: property.id,
        title: property.title,
        label: propertySearchLabel(property),
        href: `/properties/${property.id}`,
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}
