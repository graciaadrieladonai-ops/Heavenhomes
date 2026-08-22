const FAMOUS_FAKES = new Set([
  "078051120",
  "219099999",
  "111111111",
  "222222222",
  "333333333",
  "444444444",
  "555555555",
  "666666666",
  "777777777",
  "888888888",
  "999999999",
  "123456789",
  "012345678",
  "987654321",
  "123121234",
  "000000000",
]);

export function ssnDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function validateSsn(value: string): string | null {
  const digits = ssnDigits(value);
  if (digits.length !== 9) {
    return "Enter a full 9-digit Social Security Number.";
  }
  if (FAMOUS_FAKES.has(digits)) {
    return "That Social Security Number is not valid.";
  }
  if (/^(\d)\1{8}$/.test(digits)) {
    return "That Social Security Number is not valid.";
  }
  if ("0123456789".includes(digits) || "9876543210".includes(digits)) {
    return "That Social Security Number looks sequential and is not accepted.";
  }

  const area = Number(digits.slice(0, 3));
  const group = Number(digits.slice(3, 5));
  const serial = Number(digits.slice(5));

  if (area === 0 || area === 666 || area >= 900) {
    return "That Social Security Number is not a valid issued number.";
  }
  if (group === 0) {
    return "That Social Security Number is not a valid issued number.";
  }
  if (serial === 0) {
    return "That Social Security Number is not a valid issued number.";
  }

  return null;
}
