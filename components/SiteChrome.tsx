import Link from "next/link";

export async function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-sage text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-serif text-xl tracking-tight">Haven</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/maintain"
            className="inline-flex items-center rounded-full bg-sage px-4 py-2.5 text-center font-medium leading-tight text-white hover:bg-sage-2 sm:px-5"
          >
            Become a home maintainer
          </Link>
          <Link
            href="/#homes"
            className="inline-flex items-center rounded-full bg-ink px-4 py-2.5 font-medium text-white hover:bg-sage sm:px-5"
          >
            Schedule a tour
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-line bg-sage-2 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-2xl">Haven</p>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            Search homes, schedule a tour, and apply. Home maintainers can also
            apply to work on listed properties.
          </p>
        </div>
        <div className="flex items-end justify-between gap-6 text-sm sm:block sm:text-right">
          <div className="flex gap-6 text-white/70">
            <Link href="/maintain" className="hover:text-white">
              Become a home maintainer
            </Link>
            <Link href="/#homes" className="hover:text-white">
              Schedule a tour
            </Link>
          </div>
          <Link href="/admin/login" className="mt-6 inline-block text-[11px] text-white/35 hover:text-white/70">
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
