import "server-only";
import type { Database } from "./types";

export function hasSharedDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

type Sql = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<unknown>;
};

let tableReady = false;
let sqlClient: Sql | null | undefined;

async function client(): Promise<Sql | null> {
  if (!hasSharedDatabase()) return null;
  if (sqlClient !== undefined) return sqlClient;
  try {
    const { neon } = await import("@neondatabase/serverless");
    sqlClient = neon(process.env.DATABASE_URL!.trim()) as unknown as Sql;
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

export async function writeSharedDb(db: Database): Promise<boolean> {
  if (!hasSharedDatabase()) return false;
  try {
    const sql = await ready();
    if (!sql) return false;
    const payload = JSON.stringify(db);
    await sql`
      INSERT INTO haven_state (id, data)
      VALUES (1, CAST(${payload} AS jsonb))
      ON CONFLICT (id) DO UPDATE SET data = CAST(${payload} AS jsonb)
    `;
    return true;
  } catch {
    tableReady = false;
    sqlClient = undefined;
    return false;
  }
}
