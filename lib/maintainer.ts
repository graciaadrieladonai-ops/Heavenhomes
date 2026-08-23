import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "haven_maintainer";

function secret() {
  return process.env.ADMIN_SECRET || "haven-dev-secret-change-me";
}

type MaintainerSession = {
  applied: boolean;
  maintainerIds: string[];
  exp: number;
};

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(session: MaintainerSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token: string | undefined): MaintainerSession | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as MaintainerSession;
    if (!data || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return {
      applied: Boolean(data.applied),
      maintainerIds: Array.isArray(data.maintainerIds) ? data.maintainerIds : [],
      exp: data.exp,
    };
  } catch {
    return null;
  }
}

export async function getMaintainerSession(): Promise<MaintainerSession> {
  const empty: MaintainerSession = { applied: false, maintainerIds: [], exp: 0 };
  try {
    const jar = await cookies();
    return decode(jar.get(COOKIE)?.value) ?? empty;
  } catch {
    return empty;
  }
}

export async function rememberMaintainer(maintainerId: string) {
  try {
    const current = await getMaintainerSession();
    const session: MaintainerSession = {
      applied: true,
      maintainerIds: Array.from(new Set([...current.maintainerIds, maintainerId])),
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
  } catch {
    // Application is already saved.
  }
}

export async function maintainerHasApplied() {
  const session = await getMaintainerSession();
  return session.applied;
}

export async function maintainerOwns(maintainerId: string) {
  const session = await getMaintainerSession();
  return session.maintainerIds.includes(maintainerId);
}
