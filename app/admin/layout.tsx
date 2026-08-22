import type { ReactNode } from "react";
import { AdminLocalOnly } from "@/components/AdminLocalOnly";
import { adminRunsHere } from "@/lib/host";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  if (!adminRunsHere()) return <AdminLocalOnly />;
  return children;
}
