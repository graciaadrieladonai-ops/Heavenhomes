import type { Maintainer } from "./types";
import { formatDate, fullName } from "./format";
import { formatMaintainerCategories } from "./trades";

export function employmentLetterFileName(maintainer: Maintainer) {
  const name = [maintainer.firstName, maintainer.lastName]
    .filter(Boolean)
    .join("-")
    .replace(/[^a-z0-9-]+/gi, "-");
  return `Haven-employment-letter-${name || maintainer.letterNumber}.txt`;
}

export function employmentLetterText(maintainer: Maintainer) {
  const name = fullName(maintainer.firstName, maintainer.lastName, maintainer.middleName);
  const role = formatMaintainerCategories(maintainer.categories, maintainer.categoryOther) || "home maintainer";
  const date = formatDate(maintainer.createdAt.slice(0, 10));
  const address = `${maintainer.currentAddress}, ${maintainer.currentCity}, ${maintainer.currentState} ${maintainer.currentZip}`;
  return [
    "HAVEN",
    "Employment letter",
    "",
    `Letter number: ${maintainer.letterNumber}`,
    `Date: ${date}`,
    "",
    "To whom it may concern:",
    "",
    `This letter confirms that ${name} is employed by Haven as a home maintainer (${role}) for owner-listed properties.`,
    "",
    `Work days: ${maintainer.availableDays.join(", ") || "as assigned"}`,
    `Pay: ${maintainer.payPerTwoVisits} per two visits a week, paid by cheque deposit.`,
    `Address on file: ${address}`,
    `Contact: ${maintainer.email} · ${maintainer.phone}`,
    "",
    "This letter may be presented as proof of employment with Haven. It does not replace a government ID.",
    "",
    "Haven",
    "Owner-listed rentals",
  ].join("\n");
}
