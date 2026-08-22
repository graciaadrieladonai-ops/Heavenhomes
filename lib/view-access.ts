import { renterAppliedTo } from "@/lib/renter";
import { maintainerHasApplied } from "@/lib/maintainer";

export async function canViewProperty(propertyId: string) {
  return (await renterAppliedTo(propertyId)) || (await maintainerHasApplied());
}
