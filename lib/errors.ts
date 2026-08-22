export function isNextRedirect(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  const digest =
    "digest" in error && typeof (error as { digest: unknown }).digest === "string"
      ? String((error as { digest: string }).digest)
      : "";
  if (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND")) {
    return true;
  }
  const message = error instanceof Error ? error.message : "";
  return message.includes("NEXT_REDIRECT");
}

export function rethrowNavigation(error: unknown): void {
  if (isNextRedirect(error)) throw error;
}
