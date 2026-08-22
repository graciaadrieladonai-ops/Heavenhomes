import { neon } from "@neondatabase/serverless";
import type { Database } from "./types";

export function hasSharedDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

let tableReady = false;

function client() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return neon(url);
}

async function ready() {
  const sql = client();
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
    return false;
  }
}
