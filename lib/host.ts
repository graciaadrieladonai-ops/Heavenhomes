/** True on Vercel (and other hosts that set VERCEL=1). False on this Mac. */
export function isVercelHost() {
  return Boolean(process.env.VERCEL);
}

/** Owner desk writes a JSON file on disk. That only works locally. */
export function adminRunsHere() {
  return !isVercelHost();
}
