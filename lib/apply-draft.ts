"use client";

import { useEffect, useState } from "react";

const EMPTY = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  ssn: "",
  currentAddress: "",
  currentCity: "",
  currentState: "",
  currentZip: "",
  housingStatus: "rent",
  yearsAtAddress: "",
  landlordName: "",
  landlordPhone: "",
  currentRent: "",
  reasonForMoving: "",
  employmentStatus: "employed",
  employer: "",
  jobTitle: "",
  monthlyIncome: "",
  yearsEmployed: "",
  supervisorPhone: "",
  occupants: "1",
  occupantNames: "",
  hasPets: "no",
  petDetails: "",
  vehicles: "",
  smokes: "no",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  idPrintedName: "",
  certified: false,
};

export type ApplyDraft = typeof EMPTY;

export function useApplyDraft(propertyId: string) {
  const key = `haven-apply-${propertyId}`;
  const [draft, setDraft] = useState<ApplyDraft>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* keep empty */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(draft));
    } catch {
      /* ignore quota */
    }
  }, [draft, key, ready]);

  function set<K extends keyof ApplyDraft>(name: K, value: ApplyDraft[K]) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  return { draft, set };
}
