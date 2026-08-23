"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newId, saveMaintainer, saveUpload, makeJobLetterNumber, listMaintainers } from "@/lib/store";
import type { Maintainer } from "@/lib/types";
import { rememberMaintainer } from "@/lib/maintainer";
import { parseMaintainerCategories } from "@/lib/trades";
import { validateSsn } from "@/lib/validate-ssn";
import { validateIdPhoto } from "@/lib/validate-id";
import { formatPhone } from "@/lib/phone";

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function submitMaintainerAction(formData: FormData) {
  const required = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "ssn",
    "currentAddress",
    "currentCity",
    "currentState",
    "currentZip",
    "payPerTwoVisits",
    "bankName",
    "accountHolderName",
    "routingNumber",
    "accountNumber",
    "accountType",
  ];
  for (const key of required) {
    if (!str(formData, key)) throw new Error(`Missing ${key}`);
  }

  const availableDays = formData
    .getAll("availableDays")
    .map((d) => String(d))
    .filter((d) => DAYS.includes(d));
  if (availableDays.length === 0) {
    throw new Error("Select at least one day you can work.");
  }

  const categories = parseMaintainerCategories(
    formData.getAll("categories").map((c) => String(c)),
  );
  if (categories.length === 0) {
    throw new Error("Select at least one work category.");
  }
  const categoryOther = str(formData, "categoryOther");
  if (categories.includes("Other") && !categoryOther) {
    throw new Error("Describe your other trade.");
  }

  const ssnError = validateSsn(str(formData, "ssn"));
  if (ssnError) throw new Error(ssnError);

  const idFront = formData.get("idFront");
  const idBack = formData.get("idBack");
  if (!(idFront instanceof File) || idFront.size === 0) {
    throw new Error("Front of ID is required");
  }
  if (!(idBack instanceof File) || idBack.size === 0) {
    throw new Error("Back of ID is required");
  }
  const frontError = await validateIdPhoto(
    idFront,
    "front",
    str(formData, "idPrintedName"),
    str(formData, "firstName"),
    str(formData, "lastName"),
  );
  if (frontError) throw new Error(frontError);
  const backError = await validateIdPhoto(
    idBack,
    "back",
    str(formData, "idPrintedName"),
    str(formData, "firstName"),
    str(formData, "lastName"),
  );
  if (backError) throw new Error(backError);

  const id = newId("mnt");
  const maintainer: Maintainer = {
    id,
    firstName: str(formData, "firstName"),
    lastName: str(formData, "lastName"),
    middleName: str(formData, "middleName"),
    email: str(formData, "email"),
    phone: formatPhone(str(formData, "phone")),
    dateOfBirth: str(formData, "dateOfBirth"),
    ssn: str(formData, "ssn"),
    currentAddress: str(formData, "currentAddress"),
    currentCity: str(formData, "currentCity"),
    currentState: str(formData, "currentState"),
    currentZip: str(formData, "currentZip"),
    categories,
    categoryOther: categories.includes("Other") ? categoryOther : "",
    experience: str(formData, "experience"),
    availableDays,
    payPerTwoVisits: str(formData, "payPerTwoVisits"),
    bankName: str(formData, "bankName"),
    accountHolderName: str(formData, "accountHolderName"),
    routingNumber: str(formData, "routingNumber"),
    accountNumber: str(formData, "accountNumber"),
    accountType: str(formData, "accountType"),
    idFrontPath: await saveUpload(idFront, "ids", `${id}_front`),
    idBackPath: await saveUpload(idBack, "ids", `${id}_back`),
    letterNumber: makeJobLetterNumber(),
    createdAt: new Date().toISOString(),
  };

  await saveMaintainer(maintainer);
  await rememberMaintainer(maintainer.id);
  revalidatePath("/admin");
  redirect(`/maintain/letter/${maintainer.id}`);
}

export async function findEmploymentLetterAction(formData: FormData) {
  const email = str(formData, "email").toLowerCase();
  if (!email) throw new Error("Enter the email on your job application");
  const match = (await listMaintainers()).find((m) => m.email.toLowerCase() === email);
  if (!match) throw new Error("No job application found for that email.");
  await rememberMaintainer(match.id);
  redirect(`/maintain/letter/${match.id}`);
}
