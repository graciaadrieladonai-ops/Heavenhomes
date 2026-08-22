"use client";

import { useMemo, useState } from "react";
import { scheduleTourAction } from "@/app/actions/application";
import { isNextRedirect } from "@/lib/errors";

function slotsForDate(iso: string) {
  if (!iso) return [];
  const day = new Date(`${iso}T12:00:00`).getDay();
  const weekend = day === 0 || day === 6;
  return weekend
    ? ["11:00", "12:00", "13:00", "14:00", "15:00"]
    : ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
}

function labelTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function TourForm({ applicationId }: { applicationId: string }) {
  const min = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const slots = slotsForDate(date);

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        setError("");
        setPending(true);
        try {
          await scheduleTourAction(formData);
        } catch (err) {
          if (isNextRedirect(err)) throw err;
          const message = err instanceof Error ? err.message : "Could not save tour.";
          if (/Minified React error #441/.test(message)) throw err;
          setError(message);
          setPending(false);
        }
      }}
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <input type="hidden" name="tourTime" value={time} />

      <label className="block text-sm">
        <span className="font-medium">Tour date</span>
        <input
          name="tourDate"
          type="date"
          required
          min={min}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
        />
      </label>

      <div>
        <p className="text-sm font-medium">Available times</p>
        {!date ? (
          <p className="mt-2 text-sm text-muted">Choose a date to see times.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`rounded-full border px-3 py-2.5 text-sm ${
                  time === slot
                    ? "border-sage bg-sage text-white"
                    : "border-line bg-white hover:border-sage/40"
                }`}
              >
                {labelTime(slot)}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="block text-sm">
        <span className="font-medium">Notes for the owner (optional)</span>
        <textarea
          name="tourNotes"
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-sage/30 focus:ring-2"
          placeholder="Gate code, who will attend, preferred entrance…"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-clay/30 bg-[#f8ece6] px-4 py-3 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !date || !time}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-sage text-sm font-medium text-white hover:bg-sage-2 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Continue to payment"}
      </button>
    </form>
  );
}
