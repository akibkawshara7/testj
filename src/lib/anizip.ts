// ani.zip mappings + image cache.
// Cache key: anizip:<anilistId>  →  { logo, poster, fanart, ts }
// We keep this in localStorage so repeat visits don't refetch.

export type AniZipImages = {
  logo: string | null;
  poster: string | null;
  fanart: string | null;
};

type CacheEntry = AniZipImages & { ts: number };

// Clearlogo and posters are effectively immutable per-anime; cache for a year.
const TTL_MS = 1000 * 60 * 60 * 24 * 365;
const memCache = new Map<number, AniZipImages>();

function readLocal(id: number): AniZipImages | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`anizip:${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return { logo: parsed.logo, poster: parsed.poster, fanart: parsed.fanart };
  } catch {
    return null;
  }
}

function writeLocal(id: number, images: AniZipImages) {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { ...images, ts: Date.now() };
    localStorage.setItem(`anizip:${id}`, JSON.stringify(entry));
  } catch {
    /* quota — ignore */
  }
}

type AniZipImage = { coverType?: string; url?: string; lang?: string };
type AniZipResponse = {
  images?: AniZipImage[];
  mappings?: Record<string, string | number>;
};

function pickImage(images: AniZipImage[] | undefined, types: string[]): string | null {
  if (!images?.length) return null;
  for (const t of types) {
    // Prefer English where applicable.
    const en = images.find(
      (im) => im.coverType?.toLowerCase() === t && (im.lang ?? "en").toLowerCase() === "en",
    );
    if (en?.url) return en.url;
    const any = images.find((im) => im.coverType?.toLowerCase() === t);
    if (any?.url) return any.url;
  }
  return null;
}

export async function fetchAniZipImages(anilistId: number): Promise<AniZipImages> {
  if (memCache.has(anilistId)) return memCache.get(anilistId)!;
  const local = readLocal(anilistId);
  if (local) {
    memCache.set(anilistId, local);
    return local;
  }
  const empty: AniZipImages = { logo: null, poster: null, fanart: null };
  try {
    const res = await fetch(`https://api.ani.zip/mappings?anilist_id=${anilistId}`);
    if (!res.ok) {
      memCache.set(anilistId, empty);
      return empty;
    }
    const data = (await res.json()) as AniZipResponse;
    const images = data.images;
    const out: AniZipImages = {
      logo: pickImage(images, ["clearlogo"]),
      poster: pickImage(images, ["poster"]),
      fanart: pickImage(images, ["fanart", "banner"]),
    };
    memCache.set(anilistId, out);
    writeLocal(anilistId, out);
    return out;
  } catch {
    memCache.set(anilistId, empty);
    return empty;
  }
}

export async function fetchAniZipMany(ids: number[]): Promise<Record<number, AniZipImages>> {
  const results = await Promise.all(
    ids.map((id) => fetchAniZipImages(id).then((r) => [id, r] as const)),
  );
  return Object.fromEntries(results);
}

// Full mapping payload (for the external links popup, item #6 in the long list).
const fullCache = new Map<number, AniZipResponse>();
export async function fetchAniZipFull(anilistId: number): Promise<AniZipResponse | null> {
  if (fullCache.has(anilistId)) return fullCache.get(anilistId)!;
  try {
    const res = await fetch(`https://api.ani.zip/mappings?anilist_id=${anilistId}`);
    if (!res.ok) return null;
    const data = (await res.json()) as AniZipResponse;
    fullCache.set(anilistId, data);
    return data;
  } catch {
    return null;
  }
}
