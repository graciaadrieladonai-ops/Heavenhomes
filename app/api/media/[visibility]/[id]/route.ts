import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { parseMediaParam } from "@/lib/media";
import { getSharedFile } from "@/lib/remote-db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ visibility: string; id: string }> },
) {
  const { visibility, id: raw } = await params;
  if (visibility !== "public" && visibility !== "private") {
    return new NextResponse("Not found", { status: 404 });
  }
  const { id } = parseMediaParam(raw);
  const file = await getSharedFile(id);
  if (!file || file.visibility !== visibility) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (file.visibility === "private" && !(await isAdmin())) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const bytes = Buffer.from(file.body, "base64");
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": file.mime || "application/octet-stream",
        "Cache-Control":
          file.visibility === "public"
            ? "public, max-age=86400"
            : "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
