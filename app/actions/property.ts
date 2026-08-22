"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  deleteProperty,
  getProperty,
  isImageFile,
  newId,
  saveProperty,
  saveUpload,
} from "@/lib/store";
import type { Property } from "@/lib/types";

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function num(formData: FormData, key: string) {
  return Number(str(formData, key) || 0);
}

async function propertyFromForm(formData: FormData, existing?: Property | null) {
  const id = existing?.id || newId("prop");
  const urlLines = str(formData, "imageUrls")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const keptUploads =
    existing?.images.filter(
      (src) =>
        src.startsWith("/uploads/") ||
        src.startsWith("/api/files/") ||
        src.startsWith("/api/media/") ||
        src.startsWith("data:"),
    ) ?? [];
  const uploaded: string[] = [];
  const files = formData
    .getAll("imageFiles")
    .filter((f): f is File => f instanceof File && f.size > 0);

  for (const [i, file] of files.entries()) {
    if (!isImageFile(file)) continue;
    uploaded.push(await saveUpload(file, "properties", `${id}_${Date.now()}_${i}`));
  }

  const images = Array.from(new Set([...urlLines, ...keptUploads, ...uploaded]));

  const property: Property = {
    id,
    title: str(formData, "title"),
    description: str(formData, "description"),
    address: str(formData, "address"),
    city: str(formData, "city"),
    state: str(formData, "state"),
    zip: str(formData, "zip"),
    price: num(formData, "price"),
    beds: num(formData, "beds"),
    baths: num(formData, "baths"),
    sqft: num(formData, "sqft"),
    type: str(formData, "type") || "Apartment",
    availableDate: str(formData, "availableDate"),
    images,
    amenities: str(formData, "amenities")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    applicationFee: 100,
    viewCodeUrl: str(formData, "viewCodeUrl"),
    published: formData.get("published") === "on",
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!property.title || !property.address || !property.city) {
    throw new Error("Title, address, and city are required.");
  }
  return property;
}

export async function upsertPropertyAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const existing = id ? await getProperty(id) : null;
  const property = await propertyFromForm(formData, existing);
  await saveProperty(property);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/properties/${property.id}`);
  revalidatePath(`/properties/${property.id}/view`);
  redirect("/admin/properties");
}

export async function deletePropertyAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await deleteProperty(id);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/properties");
}
