import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "haven_admin";

function secret() {
  return process.env.ADMIN_SECRET || "haven-dev-secret-change-me";
}

export function adminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
  };
}

export function createSessionToken() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp })).toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const expected = createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.role === "admin" && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    throw new Error("Unauthorized");
  }
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
