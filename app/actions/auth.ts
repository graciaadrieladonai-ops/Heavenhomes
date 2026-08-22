"use server";

import { redirect } from "next/navigation";
import { adminCredentials, clearAdminCookie, setAdminCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const creds = adminCredentials();
  if (email !== creds.email.toLowerCase() || password !== creds.password) {
    redirect("/admin/login?error=1");
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminCookie();
  redirect("/admin/login");
}
