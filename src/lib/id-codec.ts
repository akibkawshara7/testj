const XOR_KEY = 0x55555555;

// Internal ID prefixes (all lowercase):
//   a<n>   = AniList anime numeric ID
//   am<n>  = MAL anime ID
//   m<n>   = AniList manga numeric ID
//   mm<n>  = MAL manga ID
//   mc<n>  = AniList manga colored ID
//   mmc<n> = MAL manga colored ID

export function encodeId(
  id: string | number,
  type: "anime" | "manga" | "fallback" = "fallback",
): string {
  if (type === "anime") {
    if (typeof id === "string" && id.startsWith("am")) {
      // Anime MAL ID (internal lowercase)
      const num = Number(id.slice(2));
      const str = ((num ^ XOR_KEY) >>> 0).toString(36).padStart(6, "0");
      return "am" + str;
    }
    if (typeof id === "string" && id.startsWith("AM")) {
      // Legacy uppercase AM — treat as anime MAL
      const num = Number(id.slice(2));
      const str = ((num ^ XOR_KEY) >>> 0).toString(36).padStart(6, "0");
      return "am" + str;
    }
    if (typeof id === "string" && id.startsWith("J")) {
      // Legacy J-prefixed anime MAL
      const num = Number(id.slice(1));
      const str = ((num ^ XOR_KEY) >>> 0).toString(36).padStart(6, "0");
      return "am" + str;
    }
    const num = Number(id);
    if (isNaN(num)) return String(id);
    const str = ((num ^ XOR_KEY) >>> 0).toString(36).padStart(7, "0");
    return "a" + str;
  } else if (type === "manga") {
    const strId = String(id);
    let numStr = strId;
    let prefix = "m";
    // Support both lowercase and legacy uppercase prefixes
    if (strId.startsWith("mmc") || strId.startsWith("MMC")) {
      prefix = "mmc";
      numStr = strId.slice(3);
    } else if (strId.startsWith("mc") || strId.startsWith("MC")) {
      prefix = "mc";
      numStr = strId.slice(2);
    } else if (strId.startsWith("mm") || strId.startsWith("MM")) {
      prefix = "mm";
      numStr = strId.slice(2);
    }

    const num = Number(numStr);
    if (isNaN(num)) return strId;
    const str = ((num ^ XOR_KEY) >>> 0).toString(36);

    if (prefix === "mmc") return "mmc" + str.padStart(5, "0");
    if (prefix === "mm") return "mm" + str.padStart(6, "0");
    if (prefix === "mc") return "mc" + str.padStart(6, "0");
    return "m" + str.padStart(7, "0");
  }

  const num = Number(id);
  if (isNaN(num)) return String(id);

  const obfuscated = (num ^ XOR_KEY) >>> 0;
  const str = obfuscated.toString(36);
  return str.padStart(8, "0");
}

export function decodeId(encoded: string): number | string {
  if (!encoded) return "";

  if (encoded.startsWith("am") && encoded.length >= 8) {
    const obf = parseInt(encoded.slice(2), 36);
    if (!isNaN(obf)) return "am" + ((obf ^ XOR_KEY) >>> 0);
  }
  // Legacy aa- prefix (old J/anime MAL) → decode as am
  if (encoded.startsWith("aa") && encoded.length >= 8) {
    const obf = parseInt(encoded.slice(2), 36);
    if (!isNaN(obf)) return "am" + ((obf ^ XOR_KEY) >>> 0);
  }
  if (encoded.startsWith("a") && encoded.length === 8) {
    const obf = parseInt(encoded.slice(1), 36);
    if (!isNaN(obf)) return (obf ^ XOR_KEY) >>> 0;
  }
  if (encoded.startsWith("mmc") && encoded.length === 8) {
    const obf = parseInt(encoded.slice(3), 36);
    if (!isNaN(obf)) return "mmc" + ((obf ^ XOR_KEY) >>> 0);
  }
  if (encoded.startsWith("mm") && encoded.length === 8) {
    const obf = parseInt(encoded.slice(2), 36);
    if (!isNaN(obf)) return "mm" + ((obf ^ XOR_KEY) >>> 0);
  }
  if (encoded.startsWith("mc") && encoded.length === 8) {
    const obf = parseInt(encoded.slice(2), 36);
    if (!isNaN(obf)) return "mc" + ((obf ^ XOR_KEY) >>> 0);
  }
  if (encoded.startsWith("m") && encoded.length === 8) {
    const obf = parseInt(encoded.slice(1), 36);
    if (!isNaN(obf)) return (obf ^ XOR_KEY) >>> 0;
  }

  // Pure numeric string
  if (/^\d+$/.test(encoded)) {
    return Number(encoded);
  }

  // Preserve as original string ID (e.g. AniKume ID 'Ygo3ckQHig')
  return encoded;
}
