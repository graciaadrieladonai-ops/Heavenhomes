/** US 10-digit phone: (555) 010-2040 */
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (digits.length > 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length > 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return "";
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
}
