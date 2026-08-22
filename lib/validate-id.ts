function jpegSize(buf: Buffer) {
  let offset = 2;
  while (offset + 8 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2 || marker === 0xc3) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      };
    }
    const length = buf.readUInt16BE(offset + 2);
    offset += 2 + length;
  }
  return null;
}

function pngSize(buf: Buffer) {
  if (buf.length < 24) return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function webpSize(buf: Buffer) {
  if (buf.length < 30) return null;
  const type = buf.toString("ascii", 12, 16);
  if (type === "VP8X") {
    const w = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16);
    const h = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16);
    return { width: w, height: h };
  }
  if (type === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  return null;
}

function isJpeg(buf: Buffer) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}
function isPng(buf: Buffer) {
  return buf.length > 8 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG";
}
function isWebp(buf: Buffer) {
  return (
    buf.length > 16 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  );
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

export async function validateIdPhoto(
  file: File,
  side: "front" | "back",
  printedName: string,
  legalFirst: string,
  legalLast: string,
) {
  if (file.size < 25_000) {
    return `The ${side} of the ID is too small or blurry. Upload a clear photo of the card.`;
  }
  if (file.size > 12 * 1024 * 1024) {
    return `The ${side} of the ID is too large. Use a photo under 12 MB.`;
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const jpeg = isJpeg(buf);
  const png = isPng(buf);
  const webp = isWebp(buf);
  if (!jpeg && !png && !webp) {
    return `The ${side} file is not a real photo of an ID. Upload a JPG, PNG, or WEBP of the card.`;
  }

  const size = jpeg ? jpegSize(buf) : png ? pngSize(buf) : webpSize(buf);
  if (!size || size.width < 400 || size.height < 220) {
    return `The ${side} photo is too low-resolution to be a government ID. Take a closer, sharper picture of the card.`;
  }

  if (side === "front") {
    const printed = normalizeName(printedName);
    const first = normalizeName(legalFirst);
    const last = normalizeName(legalLast);
    if (printed.length < 4) {
      return "Type your name exactly as it is printed on the ID.";
    }
    if (!first || !last) {
      return "Enter your first and last name as they appear on your ID.";
    }
    if (!printed.includes(first) || !printed.includes(last)) {
      return "The name on the ID must match the first and last name on this application.";
    }
  }

  return null;
}
