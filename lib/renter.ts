import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "haven_renter";

function secret() {
  return process.env.ADMIN_SECRET || "haven-dev-secret-change-me";
}

type RenterSession = {
  propertyIds: string[];
  applicationIds: string[];
  exp: number;
};

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(session: RenterSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token: string | undefined): RenterSession | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as RenterSession;
    if (!data || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return {
      propertyIds: Array.isArray(data.propertyIds) ? data.propertyIds : [],
      applicationIds: Array.isArray(data.applicationIds) ? data.applicationIds : [],
      exp: data.exp,
    };
  } catch {
    return null;
  }
}

export async function getRenterSession(): Promise<RenterSession> {
  const jar = await cookies();
  return (
    decode(jar.get(COOKIE)?.value) ?? {
      propertyIds: [],
      applicationIds: [],
      exp: 0,
    }
  );
}

export async function rememberRenterApplication(propertyId: string, applicationId: string) {
  const current = await getRenterSession();
  const session: RenterSession = {
    propertyIds: Array.from(new Set([...current.propertyIds, propertyId])),
    applicationIds: Array.from(new Set([...current.applicationIds, applicationId])),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  const jar = await cookies();
  jar.set(COOKIE, encode(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function renterAppliedTo(propertyId: string) {
  const session = await getRenterSession();
  return session.propertyIds.includes(propertyId);
}

export async function renterOwnsApplication(applicationId: string) {
  const session = await getRenterSession();
  return session.applicationIds.includes(applicationId);
}
