"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = {
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

type PlaceComponent = { long_name: string; short_name: string; types: string[] };

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2";
const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function parsePhoton(hit: {
  properties?: {
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    locality?: string;
    district?: string;
    state?: string;
    postcode?: string;
  };
}): Suggestion | null {
  const p = hit.properties;
  if (!p) return null;
  const street = [p.housenumber, p.street || p.name].filter(Boolean).join(" ");
  const city = p.city || p.locality || p.district || "";
  if (!street && !city) return null;
  return {
    label: [street, city, p.state, p.postcode].filter(Boolean).join(", "),
    address: street,
    city,
    state: p.state || "",
    zip: p.postcode || "",
  };
}

function fromGoogleComponents(parts: PlaceComponent[] | undefined): Suggestion | null {
  if (!parts?.length) return null;
  const get = (type: string, short = false) => {
    const part = parts.find((item) => item.types.includes(type));
    if (!part) return "";
    return short ? part.short_name : part.long_name;
  };
  const address = [get("street_number"), get("route")].filter(Boolean).join(" ");
  return {
    label: [address, get("locality"), get("administrative_area_level_1", true), get("postal_code")]
      .filter(Boolean)
      .join(", "),
    address,
    city: get("locality") || get("sublocality") || get("postal_town"),
    state: get("administrative_area_level_1", true),
    zip: get("postal_code"),
  };
}

export function AddressSuggest({
  address,
  city,
  state,
  zip,
  onChange,
}: {
  address: string;
  city: string;
  state: string;
  zip: string;
  onChange: (next: { address?: string; city?: string; state?: string; zip?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Suggestion[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const useGoogle = Boolean(googleKey);

  useEffect(() => {
    if (!useGoogle || !inputRef.current) return;
    const w = window as typeof window & {
      google?: {
        maps?: {
          places?: {
            Autocomplete: new (
              el: HTMLInputElement,
              opts?: object,
            ) => {
              addListener: (name: string, fn: () => void) => void;
              getPlace: () => { address_components?: PlaceComponent[] };
            };
          };
        };
      };
    };
    function attach() {
      const Autocomplete = w.google?.maps?.places?.Autocomplete;
      if (!Autocomplete || !inputRef.current) return;
      const autocomplete = new Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["address_components"],
        componentRestrictions: { country: ["us"] },
      });
      autocomplete.addListener("place_changed", () => {
        const parsed = fromGoogleComponents(autocomplete.getPlace().address_components);
        if (!parsed) return;
        onChangeRef.current({
          address: parsed.address,
          city: parsed.city,
          state: parsed.state,
          zip: parsed.zip,
        });
      });
    }
    if (w.google?.maps?.places) {
      attach();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`;
    script.async = true;
    script.dataset.havenMaps = "1";
    script.onload = attach;
    document.head.appendChild(script);
  }, [useGoogle]);

  useEffect(() => {
    if (useGoogle) return;
    const q = address.trim();
    if (q.length < 3) {
      setHits([]);
      return;
    }
    const ac = new AbortController();
    const timer = window.setTimeout(() => {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=en`;
      fetch(url, { signal: ac.signal })
        .then((res) => res.json())
        .then((data: { features?: unknown[] }) => {
          const next = (data.features ?? [])
            .map((feature) => parsePhoton(feature as Parameters<typeof parsePhoton>[0]))
            .filter((item): item is Suggestion => Boolean(item));
          setHits(next);
          setOpen(next.length > 0);
        })
        .catch((error: { name?: string }) => {
          if (error?.name === "AbortError") return;
          setHits([]);
        });
    }, 280);
    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [address, useGoogle]);

  useEffect(() => {
    function hide(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", hide);
    return () => document.removeEventListener("mousedown", hide);
  }, []);

  function pick(hit: Suggestion) {
    onChange({
      address: hit.address || address,
      city: hit.city || city,
      state: hit.state || state,
      zip: hit.zip || zip,
    });
    setOpen(false);
  }

  return (
    <>
      <div className="relative sm:col-span-2" ref={box}>
        <label className="block text-sm">
          <span className="font-medium">
            Street address <span className="text-clay"> *</span>
          </span>
          <input
            ref={inputRef}
            name="currentAddress"
            required
            autoComplete="off"
            placeholder="Start typing for map suggestions"
            value={address}
            onChange={(e) => {
              onChange({ address: e.target.value });
              if (!useGoogle) setOpen(true);
            }}
            onFocus={() => !useGoogle && hits.length > 0 && setOpen(true)}
            className={inputClass}
          />
        </label>
        {open && hits.length > 0 ? (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg">
            {hits.map((hit) => (
              <li key={hit.label}>
                <button
                  type="button"
                  className="w-full px-3.5 py-2 text-left text-sm hover:bg-paper"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(hit)}
                >
                  {hit.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-1 text-xs text-muted">
          {useGoogle
            ? "Google Maps suggestions fill city, state, and ZIP when you pick an address."
            : "Map suggestions fill city, state, and ZIP when you pick an address."}
        </p>
      </div>
      <label className="block text-sm">
        <span className="font-medium">
          City <span className="text-clay"> *</span>
        </span>
        <input
          name="currentCity"
          required
          autoComplete="address-level2"
          value={city}
          onChange={(e) => onChange({ city: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">
          State <span className="text-clay"> *</span>
        </span>
        <input
          name="currentState"
          required
          autoComplete="address-level1"
          maxLength={20}
          value={state}
          onChange={(e) => onChange({ state: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">
          ZIP <span className="text-clay"> *</span>
        </span>
        <input
          name="currentZip"
          required
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={10}
          value={zip}
          onChange={(e) => onChange({ zip: e.target.value.replace(/[^\d-]/g, "").slice(0, 10) })}
          className={inputClass}
        />
      </label>
    </>
  );
}
