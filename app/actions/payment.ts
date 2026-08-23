"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPaymentAccounts, savePaymentAccounts } from "@/lib/store";
import type { PaymentAccounts } from "@/lib/types";
import { formatPhone } from "@/lib/phone";

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function updatePaymentAccountsAction(formData: FormData) {
  await requireAdmin();
  const existing = await getPaymentAccounts();
  const updatedAt = new Date().toISOString();
  const accounts: PaymentAccounts = {
    cashapp: {
      cashtag: str(formData, "cashapp_cashtag"),
      name: str(formData, "cashapp_name"),
      notes: str(formData, "cashapp_notes"),
      updatedAt:
        str(formData, "cashapp_cashtag") !== existing.cashapp.cashtag ||
        str(formData, "cashapp_name") !== existing.cashapp.name ||
        str(formData, "cashapp_notes") !== existing.cashapp.notes
          ? updatedAt
          : existing.cashapp.updatedAt,
    },
    walmart: {
      receiverName: str(formData, "walmart_receiverName"),
      phone: formatPhone(str(formData, "walmart_phone")),
      notes: str(formData, "walmart_notes"),
      updatedAt:
        str(formData, "walmart_receiverName") !== existing.walmart.receiverName ||
        str(formData, "walmart_phone") !== existing.walmart.phone ||
        str(formData, "walmart_notes") !== existing.walmart.notes
          ? updatedAt
          : existing.walmart.updatedAt,
    },
    zelle: {
      emailOrPhone: str(formData, "zelle_emailOrPhone"),
      name: str(formData, "zelle_name"),
      notes: str(formData, "zelle_notes"),
      updatedAt:
        str(formData, "zelle_emailOrPhone") !== existing.zelle.emailOrPhone ||
        str(formData, "zelle_name") !== existing.zelle.name ||
        str(formData, "zelle_notes") !== existing.zelle.notes
          ? updatedAt
          : existing.zelle.updatedAt,
    },
    crypto: {
      network: str(formData, "crypto_network"),
      address: str(formData, "crypto_address"),
      notes: str(formData, "crypto_notes"),
      updatedAt:
        str(formData, "crypto_network") !== existing.crypto.network ||
        str(formData, "crypto_address") !== existing.crypto.address ||
        str(formData, "crypto_notes") !== existing.crypto.notes
          ? updatedAt
          : existing.crypto.updatedAt,
    },
  };
  await savePaymentAccounts(accounts);
  revalidatePath("/admin/payments");
  redirect("/admin/payments?saved=1");
}
