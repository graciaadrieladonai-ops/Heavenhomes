import type { Database } from "./types";

export function hasSharedDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function connectionString() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    if (!url.searchParams.has("sslmode")) url.searchParams.set("sslmode", "require");
    return url.toString();
  } catch {
    return raw.replace(/([?&])channel_binding=require&?/g, "$1").replace(/[?&]$/, "");
  }
}

type Sql = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<unknown>;
};

let tableReady = false;
let sqlClient: Sql | null | undefined;

async function client(): Promise<Sql | null> {
  const url = connectionString();
  if (!url) return null;
  if (sqlClient !== undefined) return sqlClient;
  try {
    const { neon } = await import("@neondatabase/serverless");
    sqlClient = neon(url) as unknown as Sql;
    return sqlClient;
  } catch {
    sqlClient = null;
    return null;
  }
}

async function ready() {
  const sql = await client();
  if (!sql) return null;
  if (!tableReady) {
    await sql`CREATE TABLE IF NOT EXISTS haven_state (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )`;
    tableReady = true;
  }
  return sql;
}

export async function readSharedDb(seed: Database): Promise<Database | null> {
  if (!hasSharedDatabase()) return null;
  try {
    const sql = await ready();
    if (!sql) return null;
    const rows = (await sql`SELECT data FROM haven_state WHERE id = 1 LIMIT 1`) as {
      data: Database;
    }[];
    if (!rows[0]) {
      const wrote = await writeSharedDb(seed);
      return wrote ? seed : null;
    }
    return rows[0].data;
  } catch {
    return null;
  }
}

function slimForWrite(db: Database): Database {
  const copy = JSON.parse(JSON.stringify(db)) as Database;
  const trim = (value: string) => (value.startsWith("data:") && value.length > 200_000 ? "uploaded" : value);
  for (const application of copy.applications) {
    application.idFrontPath = trim(application.idFrontPath);
    application.idBackPath = trim(application.idBackPath);
    application.paymentProofPath = trim(application.paymentProofPath);
  }
  for (const maintainer of copy.maintainers) {
    maintainer.idFrontPath = trim(maintainer.idFrontPath);
    maintainer.idBackPath = trim(maintainer.idBackPath);
  }
  for (const property of copy.properties) {
    property.images = property.images.map(trim).filter(Boolean);
  }
  return copy;
}

async function insertState(db: Database) {
  const sql = await ready();
  if (!sql) return false;
  const payload = JSON.stringify(db);
  await sql`
    INSERT INTO haven_state (id, data)
    VALUES (1, CAST(${payload} AS jsonb))
    ON CONFLICT (id) DO UPDATE SET data = CAST(${payload} AS jsonb)
  `;
  return true;
}

export async function writeSharedDb(db: Database): Promise<boolean> {
  if (!hasSharedDatabase()) return false;
  try {
    if (await insertState(db)) return true;
  } catch (error) {
    tableReady = false;
    sqlClient = undefined;
    console.error("haven shared db write failed", error);
  }
  try {
    return await insertState(slimForWrite(db));
  } catch (error) {
    tableReady = false;
    sqlClient = undefined;
    console.error("haven shared db slim write failed", error);
    return false;
  }
}
