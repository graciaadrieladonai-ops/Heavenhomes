import { NextResponse } from "next/server";
import { getMaintainer } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import { maintainerOwns } from "@/lib/maintainer";
import { employmentLetterFileName, employmentLetterText } from "@/lib/employment-letter";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const maintainer = await getMaintainer(id);
  if (!maintainer) return new NextResponse("Not found", { status: 404 });
  if (!(await maintainerOwns(id)) && !(await isAdmin())) {
    return new NextResponse("Not found", { status: 404 });
  }
  const body = employmentLetterText(maintainer);
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${employmentLetterFileName(maintainer)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
