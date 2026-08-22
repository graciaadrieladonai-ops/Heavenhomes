export function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function moneyExact(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(time: string) {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m || 0, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function maskSsn(ssn: string) {
  const digits = ssn.replace(/\D/g, "");
  if (digits.length < 4) return "•••-••-••••";
  return `•••-••-${digits.slice(-4)}`;
}

export function propertyAddress(p: {
  address: string;
  city: string;
  state: string;
  zip: string;
}) {
  return `${p.address}, ${p.city}, ${p.state} ${p.zip}`;
}

export function fullName(first: string, last: string, middle = "") {
  return [first, middle, last].filter(Boolean).join(" ");
}

export function paymentLabel(method: string) {
  switch (method) {
    case "cashapp":
      return "Cash App";
    case "walmart":
      return "Walmart";
    case "zelle":
      return "Zelle";
    case "crypto":
      return "Crypto";
    case "bank":
      return "Bank account";
    default:
      return "—";
  }
}
