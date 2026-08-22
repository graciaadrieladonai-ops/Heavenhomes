import type { Database } from "./types";
import {
  mediaFileUrl,
  parseDataUrl,
  type MediaVisibility,
} from "./media";

export function hasSharedDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export type SharedFile = {
  id: string;
  mime: string;
  body: string;
  visibility: MediaVisibility;
};

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
let cachedDb: { db: Database; at: number } | null = null;
const CACHE_MS = 8_000;

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
    await sql`CREATE TABLE IF NOT EXISTS haven_files (
      id TEXT PRIMARY KEY,
      mime TEXT NOT NULL,
      body TEXT NOT NULL,
      visibility TEXT NOT NULL
    )`;
    tableReady = true;
  }
  return sql;
}

function remember(db: Database) {
  cachedDb = { db, at: Date.now() };
  return db;
}

function forget() {
  cachedDb = null;
}

function hoistPath(value: string, visibility: MediaVisibility, files: SharedFile[]) {
  if (!value?.startsWith("data:")) return value;
  const parsed = parseDataUrl(value);
  if (!parsed) return value;
  const id = crypto.randomUUID();
  files.push({ id, mime: parsed.mime, body: parsed.body, visibility });
  return mediaFileUrl(visibility, id, parsed.mime);
}

function hoistDataUrls(db: Database): { db: Database; files: SharedFile[] } {
  const copy = JSON.parse(JSON.stringify(db)) as Database;
  const files: SharedFile[] = [];
  for (const application of copy.applications) {
    application.idFrontPath = hoistPath(application.idFrontPath, "private", files);
    application.idBackPath = hoistPath(application.idBackPath, "private", files);
    application.paymentProofPath = hoistPath(application.paymentProofPath, "private", files);
  }
  for (const maintainer of copy.maintainers) {
    maintainer.idFrontPath = hoistPath(maintainer.idFrontPath, "private", files);
    maintainer.idBackPath = hoistPath(maintainer.idBackPath, "private", files);
  }
  for (const property of copy.properties) {
    property.images = property.images
      .map((src) => hoistPath(src, "public", files))
      .filter(Boolean);
  }
  return { db: copy, files };
}

export async function putSharedFile(file: SharedFile): Promise<boolean> {
  if (!hasSharedDatabase()) return false;
  try {
    const sql = await ready();
    if (!sql) return false;
    await sql`
      INSERT INTO haven_files (id, mime, body, visibility)
      VALUES (${file.id}, ${file.mime}, ${file.body}, ${file.visibility})
      ON CONFLICT (id) DO UPDATE SET
        mime = EXCLUDED.mime,
        body = EXCLUDED.body,
        visibility = EXCLUDED.visibility
    `;
    return true;
  } catch (error) {
    tableReady = false;
    sqlClient = undefined;
    console.error("haven shared file write failed", error);
    return false;
  }
}

export async function getSharedFile(id: string): Promise<SharedFile | null> {
  if (!hasSharedDatabase() || !id) return null;
  try {
    const sql = await ready();
    if (!sql) return null;
    const rows = (await sql`
      SELECT id, mime, body, visibility FROM haven_files WHERE id = ${id} LIMIT 1
    `) as SharedFile[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function insertFiles(files: SharedFile[]) {
  for (const file of files) {
    if (!(await putSharedFile(file))) return false;
  }
  return true;
}

async function persistHoisted(db: Database): Promise<Database> {
  const { db: hoisted, files } = hoistDataUrls(db);
  if (!files.length) return db;
  if (await insertFiles(files)) return hoisted;
  return db;
}

export async function readSharedDb(seed: Database): Promise<Database | null> {
  if (!hasSharedDatabase()) return null;
  if (cachedDb && Date.now() - cachedDb.at < CACHE_MS) return cachedDb.db;
  try {
    const sql = await ready();
    if (!sql) return null;
    const rows = (await sql`SELECT data FROM haven_state WHERE id = 1 LIMIT 1`) as {
      data: Database;
    }[];
    if (!rows[0]) {
      const wrote = await writeSharedDb(seed);
      return wrote ? remember(seed) : null;
    }
    const next = await persistHoisted(rows[0].data);
    if (next !== rows[0].data) {
      const wrote = await insertState(next);
      if (!wrote) return remember(rows[0].data);
    }
    return remember(next);
  } catch {
    return cachedDb?.db ?? null;
  }
}

function slimForWrite(db: Database): Database {
  const copy = JSON.parse(JSON.stringify(db)) as Database;
  const trim = (value: string) =>
    value.startsWith("data:") && value.length > 200_000 ? "uploaded" : value;
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
  forget();
  const hoisted = await persistHoisted(db);
  try {
    if (await insertState(hoisted)) {
      remember(hoisted);
      return true;
    }
  } catch (error) {
    tableReady = false;
    sqlClient = undefined;
    console.error("haven shared db write failed", error);
  }
  try {
    const slim = slimForWrite(hoisted);
    const ok = await insertState(slim);
    if (ok) remember(slim);
    return ok;
  } catch (error) {
    tableReady = false;
    sqlClient = undefined;
    console.error("haven shared db slim write failed", error);
    return false;
  }
}
