"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getApplication,
  getProperty,
  isImageFile,
  listApplications,
  listMaintainers,
  makeReceiptNumber,
  makeTourCode,
  makeTransactionId,
  newId,
  saveApplication,
  saveUpload,
} from "@/lib/store";
import type { Application, PaymentMethod } from "@/lib/types";
import { APPLICATION_FEE, HOLD_AMOUNT } from "@/lib/fees";
import { rememberRenterApplication, renterOwnsApplication } from "@/lib/renter";
import { rememberMaintainer } from "@/lib/maintainer";
import { requireAdmin } from "@/lib/auth";
import { timingSafeEqual, createHmac } from "crypto";
import { validateSsn } from "@/lib/validate-ssn";
import { validateIdPhoto } from "@/lib/validate-id";
import { formatPhone } from "@/lib/phone";

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function landlordTxnMatches(entered: string, issued: string) {
  const a = entered.replace(/\s/g, "").toUpperCase();
  const b = issued.replace(/\s/g, "").toUpperCase();
  if (!a || !b || a.length !== b.length) return false;
  const secret = process.env.ADMIN_SECRET || "haven-dev-secret-change-me";
  const ha = createHmac("sha256", secret).update(a).digest();
  const hb = createHmac("sha256", secret).update(b).digest();
  return timingSafeEqual(ha, hb) && a === b;
}

function required(formData: FormData, keys: string[]) {
  for (const key of keys) {
    if (!str(formData, key)) {
      throw new Error(`Missing ${key}`);
    }
  }
}

async function saveRenterApplication(formData: FormData): Promise<{ error: string } | { id: string; propertyId: string }> {
  try {
    const propertyId = str(formData, "propertyId");
    const property = await getProperty(propertyId);
    if (!property || !property.published) {
      return { error: "That home is not available." };
    }

    required(formData, [
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
      "employmentStatus",
      "monthlyIncome",
      "emergencyName",
      "emergencyPhone",
    ]);

    if (str(formData, "certified") !== "on") {
      return { error: "You must certify the application." };
    }

    const ssnError = validateSsn(str(formData, "ssn"));
    if (ssnError) return { error: ssnError };

    const idFront = formData.get("idFront");
    const idBack = formData.get("idBack");
    if (!(idFront instanceof File) || idFront.size === 0) {
      return { error: "Front of ID is required" };
    }
    if (!(idBack instanceof File) || idBack.size === 0) {
      return { error: "Back of ID is required" };
    }

    const printedName = str(formData, "idPrintedName");
    const firstName = str(formData, "firstName");
    const lastName = str(formData, "lastName");
    const frontError = await validateIdPhoto(idFront, "front", printedName, firstName, lastName);
    if (frontError) return { error: frontError };
    const backError = await validateIdPhoto(idBack, "back", printedName, firstName, lastName);
    if (backError) return { error: backError };

    const id = newId("app");
    const idFrontPath = await saveUpload(idFront, "ids", `${id}_front`);
    const idBackPath = await saveUpload(idBack, "ids", `${id}_back`);

    const application: Application = {
    id,
    propertyId,
    status: "applied",
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
    housingStatus: str(formData, "housingStatus"),
    yearsAtAddress: str(formData, "yearsAtAddress"),
    landlordName: str(formData, "landlordName"),
    landlordPhone: formatPhone(str(formData, "landlordPhone")),
    currentRent: str(formData, "currentRent"),
    reasonForMoving: str(formData, "reasonForMoving"),
    employmentStatus: str(formData, "employmentStatus"),
    employer: str(formData, "employer"),
    jobTitle: str(formData, "jobTitle"),
    monthlyIncome: str(formData, "monthlyIncome"),
    yearsEmployed: str(formData, "yearsEmployed"),
    supervisorPhone: formatPhone(str(formData, "supervisorPhone")),
    occupants: str(formData, "occupants") || "1",
    occupantNames: str(formData, "occupantNames"),
    hasPets: str(formData, "hasPets"),
    petDetails: str(formData, "petDetails"),
    vehicles: str(formData, "vehicles"),
    smokes: str(formData, "smokes"),
    emergencyName: str(formData, "emergencyName"),
    emergencyPhone: formatPhone(str(formData, "emergencyPhone")),
    emergencyRelation: str(formData, "emergencyRelation"),
    idFrontPath,
    idBackPath,
    certified: true,
    tourDate: "",
    tourTime: "",
    tourNotes: "",
    paymentMethod: "",
    paymentReference: "",
    paymentProofPath: "",
    paymentConfirmedAt: "",
    transactionId: "",
    txnAttempts: 0,
    receiptNumber: "",
    tourCode: "",
    paidHold: false,
    amountPaid: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveApplication(application);
    await rememberRenterApplication(propertyId, application.id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { id: application.id, propertyId };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing ")) {
      return { error: error.message };
    }
    const message = error instanceof Error ? error.message : "Could not submit application.";
    if (message.includes("NEXT_REDIRECT")) throw error;
    return { error: message };
  }
}

export async function submitApplicationAction(_prev: string, formData: FormData) {
  const saved = await saveRenterApplication(formData);
  if ("error" in saved) return saved.error;
  redirect(`/tour/${saved.id}`);
}

export async function scheduleTourAction(formData: FormData) {
  const id = str(formData, "applicationId");
  const application = await getApplication(id);
  if (!application) throw new Error("Application not found");
  if (application.status === "paid") redirect(`/receipt/${id}`);
  if (application.status === "payment_submitted" || application.status === "txn_issued") {
    redirect(`/pay/${id}/pending`);
  }

  const tourDate = str(formData, "tourDate");
  const tourTime = str(formData, "tourTime");
  if (!tourDate || !tourTime) throw new Error("Choose a date and time");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const chosen = new Date(`${tourDate}T12:00:00`);
  if (chosen < today) throw new Error("Tour date must be today or later");

  application.tourDate = tourDate;
  application.tourTime = tourTime;
  application.tourNotes = str(formData, "tourNotes");
  application.status = "tour_scheduled";
  application.updatedAt = new Date().toISOString();
  await saveApplication(application);
  revalidatePath("/admin");
  redirect(`/pay/${application.id}`);
}

export async function submitPaymentProofAction(formData: FormData) {
  const id = str(formData, "applicationId");
  const application = await getApplication(id);
  if (!application) throw new Error("Application not found");
  if (application.status === "paid" && application.receiptNumber) {
    redirect(`/receipt/${id}`);
  }
  if (application.status === "payment_submitted" || application.status === "txn_issued") {
    redirect(`/pay/${id}/pending`);
  }
  if (!application.tourDate || !application.tourTime) {
    redirect(`/tour/${id}`);
  }

  const method = str(formData, "paymentMethod") as PaymentMethod;
  const allowed: PaymentMethod[] = ["cashapp", "walmart", "zelle", "crypto"];
  if (!allowed.includes(method)) throw new Error("Select a payment method");
  const reference = str(formData, "paymentReference");
  if (!reference) throw new Error("Enter your payment confirmation");

  const proof = formData.get("paymentProof");
  if (!(proof instanceof File) || proof.size === 0) {
    throw new Error("Upload proof of payment for the landlord to review.");
  }
  if (!isImageFile(proof)) {
    throw new Error("Proof must be an image or PDF");
  }

  const paidHold = formData.get("secureHold") === "on";
  application.paymentMethod = method;
  application.paymentReference = reference;
  application.paymentProofPath = await saveUpload(proof, "proofs", `${id}_proof`);
  application.paidHold = paidHold;
  application.amountPaid = APPLICATION_FEE + (paidHold ? HOLD_AMOUNT : 0);
  application.status = application.transactionId ? "txn_issued" : "payment_submitted";
  application.updatedAt = new Date().toISOString();
  await saveApplication(application);
  await rememberRenterApplication(application.propertyId, application.id);
  revalidatePath("/admin");
  redirect(`/pay/${application.id}/pending`);
}

export async function issueTransactionIdAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const application = await getApplication(id);
  if (!application) throw new Error("Application not found");
  if (application.status === "paid") {
    throw new Error("This renter already has a receipt.");
  }

  if (!application.transactionId) {
    application.transactionId = makeTransactionId();
  }
  if (
    application.status === "payment_submitted" ||
    application.status === "txn_issued" ||
    application.paymentProofPath
  ) {
    application.status = "txn_issued";
  }
  application.updatedAt = new Date().toISOString();
  await saveApplication(application);
  revalidatePath("/admin");
  redirect(`/admin/applications/${application.id}`);
}

export async function redeemTransactionIdAction(formData: FormData) {
  const id = str(formData, "applicationId");
  const application = await getApplication(id);
  if (!application) throw new Error("Application not found");
  if (!(await renterOwnsApplication(id))) {
    throw new Error("This Transaction ID page is only for the renter who applied.");
  }
  if (application.status === "paid" && application.receiptNumber) {
    redirect(`/receipt/${id}`);
  }
  if (application.status !== "txn_issued" || !application.transactionId) {
    throw new Error("The landlord has not issued a Transaction ID yet. You cannot skip this step.");
  }
  if ((application.txnAttempts || 0) >= 8) {
    throw new Error("Too many wrong IDs. A random number will not work. Ask the landlord for the ID from the admin desk.");
  }

  const entered = str(formData, "transactionId");
  if (!landlordTxnMatches(entered, application.transactionId)) {
    application.txnAttempts = (application.txnAttempts || 0) + 1;
    application.updatedAt = new Date().toISOString();
    await saveApplication(application);
    throw new Error("That is not the landlord’s Transaction ID. A random or guessed ID will not unlock a receipt.");
  }

  application.status = "paid";
  application.paymentConfirmedAt = new Date().toISOString();
  application.receiptNumber = makeReceiptNumber();
  application.tourCode = makeTourCode();
  application.updatedAt = new Date().toISOString();
  await saveApplication(application);
  revalidatePath("/admin");
  redirect(`/receipt/${application.id}`);
}

export async function unlockViewWithEmailAction(formData: FormData) {
  const propertyId = str(formData, "propertyId");
  const email = str(formData, "email").toLowerCase();
  if (!email) throw new Error("Enter the email on your application");
  const apps = await listApplications();
  const renterMatch = apps.find(
    (a) => a.propertyId === propertyId && a.email.toLowerCase() === email,
  );
  if (renterMatch) {
    await rememberRenterApplication(propertyId, renterMatch.id);
    redirect(`/properties/${propertyId}/view`);
  }
  const maintainers = await listMaintainers();
  const maintainerMatch = maintainers.find((m) => m.email.toLowerCase() === email);
  if (maintainerMatch) {
    await rememberMaintainer(maintainerMatch.id);
    redirect(`/properties/${propertyId}/view`);
  }
  throw new Error("No renter or maintainer application found for that email.");
}
