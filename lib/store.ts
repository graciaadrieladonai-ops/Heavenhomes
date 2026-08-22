import { promises as fs } from "fs";
import path from "path";
import type { Application, Database, Maintainer, PaymentAccounts, Property } from "./types";

const ON_VERCEL = Boolean(process.env.VERCEL);
const ROOT = ON_VERCEL ? "/tmp/haven" : process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
export const UPLOAD_DIR = ON_VERCEL
  ? path.join(ROOT, "uploads")
  : path.join(process.cwd(), "public", "uploads");

let memoryDb: Database | null = null;
let useMemory = false;

function nowIso() {
  return new Date().toISOString();
}

function seedPaymentAccounts(): PaymentAccounts {
  const updatedAt = nowIso();
  return {
    cashapp: {
      cashtag: "$HavenRentals",
      name: "Haven Estates",
      notes: "Send the exact application fee. Include the property address in the note.",
      updatedAt,
    },
    walmart: {
      receiverName: "Haven Estates",
      phone: "(555) 010-2040",
      notes: "Use Walmart2Walmart or Walmart Money Transfer. Bring a photo of the confirmation to your tour.",
      updatedAt,
    },
    zelle: {
      emailOrPhone: "pay@haven.local",
      name: "Haven Estates",
      notes: "Send via Zelle using the email above. Use your full name as the memo.",
      updatedAt,
    },
    crypto: {
      network: "USDT (TRC-20)",
      address: "THavenDemoWalletAddress00000000000001",
      notes: "Send the USD equivalent on the network listed. Network fees are the sender's responsibility.",
      updatedAt,
    },
  };
}

function seedProperties(): Property[] {
  const createdAt = nowIso();
  return [
    {
      id: "prop_loft_market",
      title: "Sunlit loft above the market",
      description:
        "A bright, open loft with soaring windows, original brick, and a chef's kitchen. Walk to cafes, the river trail, and weekend markets. Owner-listed and shown by appointment only.",
      address: "418 Market Street, Unit 4B",
      city: "Portland",
      state: "OR",
      zip: "97209",
      price: 2450,
      beds: 1,
      baths: 1,
      sqft: 920,
      type: "Loft",
      availableDate: "2026-09-01",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      ],
      amenities: ["In-unit laundry", "Dishwasher", "Central air", "Pet friendly", "Street parking"],
      applicationFee: 100,
      viewCodeUrl: "",
      published: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "prop_garden_cottage",
      title: "Garden cottage with private yard",
      description:
        "A quiet one-bedroom cottage behind a mature garden. Newly refinished floors, a wood stove, and a private patio. Ideal for someone who wants space without a large house.",
      address: "27 Cedar Lane",
      city: "Austin",
      state: "TX",
      zip: "78704",
      price: 1875,
      beds: 1,
      baths: 1,
      sqft: 740,
      type: "Cottage",
      availableDate: "2026-09-15",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      ],
      amenities: ["Private yard", "Washer/dryer hookups", "Off-street parking", "Storage shed"],
      applicationFee: 100,
      viewCodeUrl: "",
      published: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "prop_family_elm",
      title: "Elm Street family home",
      description:
        "A four-bedroom home on a tree-lined street near parks and schools. Updated kitchen, two living rooms, and a fenced backyard. Shown personally by the owner.",
      address: "1902 Elm Street",
      city: "Charlotte",
      state: "NC",
      zip: "28205",
      price: 3200,
      beds: 4,
      baths: 2.5,
      sqft: 2140,
      type: "House",
      availableDate: "2026-10-01",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=80",
      ],
      amenities: ["Fenced yard", "Garage", "Central heat & air", "Walk-in closets", "Near schools"],
      applicationFee: 100,
      viewCodeUrl: "",
      published: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "prop_river_studio",
      title: "River studio with balcony",
      description:
        "A compact studio with a full kitchen, spa bath, and a balcony overlooking the water. Utilities included. Perfect as a first apartment or a quiet landing place.",
      address: "88 Riverwalk, Studio 12",
      city: "Chicago",
      state: "IL",
      zip: "60611",
      price: 1650,
      beds: 0,
      baths: 1,
      sqft: 480,
      type: "Studio",
      availableDate: "2026-08-28",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      ],
      amenities: ["Utilities included", "Balcony", "Fitness room", "Package lockers"],
      applicationFee: 100,
      viewCodeUrl: "",
      published: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "prop_brownstone",
      title: "Historic brownstone floor-through",
      description:
        "An entire floor of a restored brownstone: two bedrooms, original millwork, and a marble bath. Quiet block, two blocks from the park. Owner-occupied building.",
      address: "314 Hancock Place, Floor 2",
      city: "Brooklyn",
      state: "NY",
      zip: "11216",
      price: 2900,
      beds: 2,
      baths: 1,
      sqft: 1100,
      type: "Apartment",
      availableDate: "2026-09-08",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80",
      ],
      amenities: ["Hardwood floors", "High ceilings", "Laundry in building", "Near park"],
      applicationFee: 100,
      viewCodeUrl: "",
      published: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "prop_sunny_two",
      title: "Sunny two-bedroom with parking",
      description:
        "Corner two-bedroom with south light all afternoon. Updated appliances, a dedicated parking stall, and a shared courtyard. Easy highway access.",
      address: "560 Oakridge Avenue, Apt 7",
      city: "Denver",
      state: "CO",
      zip: "80205",
      price: 2100,
      beds: 2,
      baths: 1,
      sqft: 880,
      type: "Apartment",
      availableDate: "2026-09-20",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7e54?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      ],
      amenities: ["Assigned parking", "Courtyard", "Updated kitchen", "Storage unit"],
      applicationFee: 100,
      viewCodeUrl: "",
      published: true,
      createdAt,
      updatedAt: createdAt,
    },
  ];
}

function emptyDb(): Database {
  return {
    properties: seedProperties(),
    applications: [],
    maintainers: [],
    paymentAccounts: seedPaymentAccounts(),
  };
}

function normalizeDb(raw: Partial<Database>): Database {
  return {
    properties: (raw.properties ?? []).map((p) => ({
      ...p,
      applicationFee: 100,
      viewCodeUrl: p.viewCodeUrl ?? "",
    })),
    applications: (raw.applications ?? []).map((a) => ({
      ...a,
      paidHold: Boolean(a.paidHold),
      amountPaid: a.amountPaid ?? 0,
      paymentProofPath: a.paymentProofPath ?? "",
      transactionId: a.transactionId ?? "",
      txnAttempts: a.txnAttempts ?? 0,
    })),
    maintainers: (raw.maintainers ?? []).map((m) => ({
      ...m,
      categories: Array.isArray(m.categories) ? m.categories : [],
      categoryOther: m.categoryOther ?? "",
    })),
    paymentAccounts: raw.paymentAccounts ?? seedPaymentAccounts(),
  };
}

function fallbackDb() {
  if (!memoryDb) memoryDb = emptyDb();
  useMemory = true;
  return memoryDb;
}

async function ensureDb() {
  if (useMemory) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "ids"), { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "properties"), { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "proofs"), { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify(emptyDb(), null, 2));
    }
  } catch {
    fallbackDb();
  }
}

async function readDb(): Promise<Database> {
  await ensureDb();
  if (useMemory && memoryDb) return memoryDb;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return normalizeDb(JSON.parse(raw) as Partial<Database>);
  } catch {
    return fallbackDb();
  }
}

async function writeDb(db: Database) {
  if (useMemory) {
    memoryDb = db;
    return;
  }
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch {
    memoryDb = db;
    useMemory = true;
  }
}

let queue: Promise<unknown> = Promise.resolve();

function mutate<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await fn(db);
    await writeDb(db);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function getDb() {
  return readDb();
}

export async function listPublishedProperties() {
  const db = await readDb();
  return db.properties
    .filter((p) => p.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAllProperties() {
  const db = await readDb();
  return [...db.properties].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProperty(id: string) {
  const db = await readDb();
  return db.properties.find((p) => p.id === id) ?? null;
}

export async function saveProperty(property: Property) {
  return mutate((db) => {
    const index = db.properties.findIndex((p) => p.id === property.id);
    if (index >= 0) db.properties[index] = property;
    else db.properties.unshift(property);
    return property;
  });
}

export async function deleteProperty(id: string) {
  return mutate((db) => {
    db.properties = db.properties.filter((p) => p.id !== id);
  });
}

export async function getPaymentAccounts() {
  const db = await readDb();
  return db.paymentAccounts;
}

export async function savePaymentAccounts(accounts: PaymentAccounts) {
  return mutate((db) => {
    db.paymentAccounts = accounts;
    return accounts;
  });
}

export async function listApplications() {
  const db = await readDb();
  return [...db.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getApplication(id: string) {
  const db = await readDb();
  return db.applications.find((a) => a.id === id) ?? null;
}

export async function getApplicationByReceipt(receiptNumber: string) {
  const db = await readDb();
  const needle = receiptNumber.trim().toUpperCase();
  if (!needle.startsWith("HVN-")) return null;
  return (
    db.applications.find(
      (a) => a.status === "paid" && a.receiptNumber === needle,
    ) ?? null
  );
}

export async function saveApplication(application: Application) {
  return mutate((db) => {
    const index = db.applications.findIndex((a) => a.id === application.id);
    if (index >= 0) db.applications[index] = application;
    else db.applications.unshift(application);
    return application;
  });
}

export async function listMaintainers() {
  const db = await readDb();
  return [...db.maintainers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getMaintainer(id: string) {
  const db = await readDb();
  return db.maintainers.find((m) => m.id === id) ?? null;
}

export async function saveMaintainer(maintainer: Maintainer) {
  return mutate((db) => {
    db.maintainers.unshift(maintainer);
    return maintainer;
  });
}

export function filterProperties(properties: Property[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return properties;
  return properties.filter((p) =>
    [p.title, p.city, p.state, p.zip, p.address, p.type, p.description, p.amenities.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
}

export async function stats() {
  const db = await readDb();
  return {
    properties: db.properties.length,
    published: db.properties.filter((p) => p.published).length,
    applications: db.applications.length,
    maintainers: db.maintainers.length,
    tours: db.applications.filter((a) => a.tourDate).length,
    pendingPayments: db.applications.filter(
      (a) => a.status === "payment_submitted" || a.status === "txn_issued",
    ).length,
    paid: db.applications.filter((a) => a.status === "paid").length,
  };
}

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function makeReceiptNumber() {
  const n = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `HVN-${n}`;
}

export function makeTransactionId() {
  const n = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `TXN-${n}`;
}

export function makeTourCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveUpload(file: File, folder: "ids" | "properties" | "proofs", name: string) {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ext || "bin";
  const filename = `${name}.${safeExt}`;
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return ON_VERCEL
    ? `/api/files/${folder}/${filename}`
    : `/uploads/${folder}/${filename}`;
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|pdf)$/i.test(file.name);
}
