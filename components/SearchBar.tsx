"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { suggestHomes, type HomeSearchHit } from "@/lib/search";

export function SearchBar({
  defaultValue = "",
  variant = "plain",
  homes,
}: {
  defaultValue?: string;
  variant?: "hero" | "plain";
  homes: HomeSearchHit[];
}) {
  const hero = variant === "hero";
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  const hits = useMemo(() => suggestHomes(homes, q), [homes, q]);

  useEffect(() => {
    function hide(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", hide);
    return () => document.removeEventListener("mousedown", hide);
  }, []);

  function goToResults(value = q) {
    const needle = value.trim();
    setOpen(false);
    router.push(needle ? `/?q=${encodeURIComponent(needle)}#homes` : "/#homes");
  }

  return (
    <div className="relative w-full" ref={box}>
      <form
        action="/"
        method="get"
        className={`flex w-full overflow-hidden rounded-full ${hero ? "bg-white shadow-lg" : "border border-line bg-white"}`}
        onSubmit={(event) => {
          event.preventDefault();
          goToResults();
        }}
      >
        <input
          name="q"
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Start typing a listed home, city, or address…"
          className={`min-w-0 flex-1 bg-transparent px-5 py-3.5 outline-none ${hero ? "text-ink" : ""}`}
          aria-label="Search homes"
          autoComplete="off"
        />
        <button
          type="submit"
          className={`m-1.5 shrink-0 rounded-full px-5 py-2.5 text-sm font-medium ${hero ? "bg-sage text-white hover:bg-sage-2" : "bg-ink text-white hover:bg-sage"}`}
        >
          Search
        </button>
      </form>
      {open && hits.length > 0 ? (
        <ul className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-line bg-white py-1 shadow-lg">
          {hits.map((hit) => (
            <li key={hit.id}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left hover:bg-paper"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => router.push(hit.href)}
              >
                <span className="block text-sm font-medium">{hit.title}</span>
                <span className="block text-xs text-muted">{hit.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
