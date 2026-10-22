// AniList GraphQL client and queries
import { isMediaSessionStale, markMediaSessionFresh, invalidateMediaSession } from "./session";
import { fetchApikumeDetail, fetchApikumeEpisodes } from "./apikume";
const ANILIST_URL = "https://graphql.anilist.co";

async function fetchMal(endpoint: string) {
  // Strip leading slash if present to avoid double slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = endpoint.startsWith("http") ? endpoint : `/api/mal/${cleanEndpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MAL API Error ${res.status}`);
  return res.json();
}

function mapMalToAnilistMedia(malNode: any, overrideType?: string): AnilistMedia {
  const m = malNode.node || malNode;
  const isManga =
    m.media_type === "manga" ||
    m.media_type === "novel" ||
    m.media_type === "one_shot" ||
    m.media_type === "doujinshi" ||
    m.media_type === "manhwa" ||
    m.media_type === "manhua" ||
    m.media_type === "oel" ||
    m.media_type === "light_novel" ||
    overrideType === "MANGA";

  let format = m.media_type?.toUpperCase() || (isManga ? "MANGA" : "TV");
  if (
    format === "TV" &&
    m.num_episodes &&
    m.average_episode_duration &&
    m.average_episode_duration < 600
  )
    format = "TV_SHORT";

  let status = "NOT_YET_RELEASED";
  if (m.status === "finished_airing" || m.status === "finished") status = "FINISHED";
  else if (m.status === "currently_airing" || m.status === "publishing") status = "RELEASING";
  else if (m.status === "on_hiatus") status = "HIATUS";

  // Use am prefix for anime MAL IDs, mm prefix for manga MAL IDs
  const idPrefix = isManga ? "mm" : "am";

  return {
    id: `${idPrefix}${m.id}`,
    idMal: m.id,
    title: {
      romaji: m.title || "",
      english: m.alternative_titles?.en || null,
      native: m.alternative_titles?.ja || null,
    },
    coverImage: {
      extraLarge: m.main_picture?.large || m.main_picture?.medium || "",
      large: m.main_picture?.medium || "",
      color: null,
    },
    bannerImage: m.background ? m.main_picture?.large : null,
    format,
    episodes: m.num_episodes || null,
    chapters: m.num_chapters || null,
    duration: m.average_episode_duration ? Math.floor(m.average_episode_duration / 60) : null,
    status,
    season: m.start_season?.season ? m.start_season.season.toUpperCase() : null,
    seasonYear:
      m.start_season?.year || (m.start_date ? parseInt(m.start_date.substring(0, 4)) : null),
    startDate: {
      year: m.start_date ? parseInt(m.start_date.substring(0, 4)) : null,
      month:
        m.start_date && m.start_date.length >= 7 ? parseInt(m.start_date.substring(5, 7)) : null,
      day:
        m.start_date && m.start_date.length >= 10 ? parseInt(m.start_date.substring(8, 10)) : null,
    },
    averageScore: m.mean ? m.mean * 10 : null,
    meanScore: m.mean ? m.mean * 10 : null,
    popularity: m.num_list_users || null,
    favourites: null,
    genres: (m.genres || []).map((g: any) => g.name),
    description: m.synopsis || null,
    isAdult: m.nsfw === "gray" || m.nsfw === "black",
  };
}

async function fetchMalRanking(
  type: "anime" | "manga",
  ranking_type: string,
  limit: number = 16,
): Promise<AnilistMedia[]> {
  const fields =
    "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,num_chapters,num_volumes";
  const data = await fetchMal(
    `/${type}/ranking?ranking_type=${ranking_type}&limit=${limit}&fields=${fields}`,
  );
  return data.data.map((m: any) => mapMalToAnilistMedia(m, type.toUpperCase()));
}

async function fetchMalSeason(
  year: number,
  season: string,
  limit: number = 16,
): Promise<AnilistMedia[]> {
  const fields =
    "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background";
  const data = await fetchMal(
    `/anime/season/${year}/${season.toLowerCase()}?limit=${limit}&fields=${fields}`,
  );
  return data.data.map((m: any) => mapMalToAnilistMedia(m, "ANIME"));
}
// ------------------------------

export type AnilistMedia = {
  id: number | string;
  idMal?: number | null;
  title: { romaji: string; english: string | null; native: string | null };
  coverImage: { extraLarge: string; large: string; color: string | null };
  bannerImage: string | null;
  format: string | null;
  episodes: number | null;
  chapters?: number | null;
  duration: number | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  startDate: { year: number | null; month: number | null; day: number | null };
  endDate?: { year: number | null; month: number | null; day: number | null };
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  favourites: number | null;
  genres: string[];
  studios?: { nodes: { id: number | string; name: string }[] };
  description: string | null;
  trailer?: { id: string | null; site: string | null; thumbnail: string | null } | null;
  source?: string | null;
  countryOfOrigin?: string | null;
  isAdult?: boolean;
  characters?: {
    edges: {
      role: string;
      node: { id: number | string; name: { full: string }; image: { large: string } };
      voiceActors: {
        id: number | string;
        name: { full: string };
        image: { large: string };
        languageV2: string;
      }[];
    }[];
  };
  relations?: {
    edges: {
      relationType: string;
      node: AnilistMedia;
    }[];
  };
  recommendations?: {
    nodes: { mediaRecommendation: AnilistMedia | null }[];
  };
  nextAiringEpisode?: { episode: number; airingAt: number } | null;
  streamingEpisodes?: {
    title: string | null;
    thumbnail: string | null;
    url: string | null;
    site: string | null;
  }[];
  synonyms?: string[];
  tags?: { name: string; rank: number | null; isMediaSpoiler: boolean }[];
  externalLinks?: {
    id: number | string;
    site: string;
    url: string;
    type?: string | null;
    icon?: string | null;
    color?: string | null;
  }[];
};

const MEDIA_FIELDS = `
  id
  idMal
  title { romaji english native }
  coverImage { extraLarge large color }
  bannerImage
  format
  countryOfOrigin
  episodes
  chapters
  duration
  status
  season
  seasonYear
  startDate { year month day }
  averageScore
  meanScore
  popularity
  favourites
  genres
  isAdult
  description(asHtml: false)
  nextAiringEpisode { episode airingAt }
`;

// Fast In-Memory & Session AniList GraphQL Cache & In-Flight Request Deduplicator
const anilistCache = new Map<string, { timestamp: number; data: any }>();
const anilistInFlight = new Map<string, Promise<any>>();
const ANILIST_CACHE_TTL = 1000 * 60 * 30; // 30 minutes cache

// AniList rate-limit circuit breaker
let anilistRateLimitedUntil = 0;

function getSessionCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`al_gql_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < ANILIST_CACHE_TTL) {
      return parsed.data as T;
    }
    sessionStorage.removeItem(`al_gql_${key}`);
  } catch {}
  return null;
}

function setSessionCache(key: string, data: any) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`al_gql_${key}`, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {}
}

async function anilist<T>(
  query: string,
  variables: Record<string, unknown> = {},
  timeoutMs: number = 3500,
): Promise<T> {
  const cacheKey = JSON.stringify({ query, variables });

  // 1. Instant L1 memory cache
  const memCached = anilistCache.get(cacheKey);
  if (memCached && Date.now() - memCached.timestamp < ANILIST_CACHE_TTL) {
    return memCached.data as T;
  }

  // 2. Instant L2 sessionStorage cache
  const sessCached = getSessionCache<T>(cacheKey);
  if (sessCached) {
    anilistCache.set(cacheKey, { timestamp: Date.now(), data: sessCached });
    return sessCached;
  }

  // 3. Rate-limit circuit breaker (fail fast to MAL fallback)
  if (Date.now() < anilistRateLimitedUntil) {
    throw new Error("AniList rate-limited or throttling; using fallback");
  }

  // 4. Deduplicate in-flight requests
  if (anilistInFlight.has(cacheKey)) {
    return anilistInFlight.get(cacheKey) as Promise<T>;
  }

  const fetchPromise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(ANILIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        anilistRateLimitedUntil = Date.now() + 30000; // back off for 30s
        throw new Error("AniList 429 Too Many Requests");
      }

      if (!res.ok) {
        if (res.status >= 500) {
          anilistRateLimitedUntil = Date.now() + 15000;
        }
        throw new Error(`AniList ${res.status}`);
      }

      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0]?.message ?? "AniList error");
      const result = json.data as T;

      anilistCache.set(cacheKey, { timestamp: Date.now(), data: result });
      setSessionCache(cacheKey, result);
      return result;
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn(`AniList query timed out after ${timeoutMs}ms; triggering fallback`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
      anilistInFlight.delete(cacheKey);
    }
  })();

  anilistInFlight.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export function currentSeason(): { season: string; year: number } {
  const m = new Date().getMonth();
  const year = new Date().getFullYear();
  const season = m <= 1 || m === 11 ? "WINTER" : m <= 4 ? "SPRING" : m <= 7 ? "SUMMER" : "FALL";
  const y = m === 11 ? year + 1 : year;
  return { season, year: y };
}

export async function fetchHero(): Promise<AnilistMedia[]> {
  const q = `query { Page(perPage: 20) {
    media(type: ANIME, sort: TRENDING_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }
  }}`;
  try {
    const data = await anilist<{ Page: { media: AnilistMedia[] } }>(q);
    return data.Page.media.filter((m) => m.bannerImage).slice(0, 10);
  } catch (e) {
    console.warn("AniList fetchHero failed, falling back to MAL:", e);
    const data = await fetchMalRanking("anime", "airing", 20);
    return data.filter((m) => m.bannerImage).slice(0, 10);
  }
}

export async function fetchTrending() {
  const q = `query { Page(perPage: 16) { media(type: ANIME, sort: TRENDING_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchTrending failed, falling back to MAL:", e);
    return fetchMalRanking("anime", "airing", 16);
  }
}
export async function fetchSeasonal() {
  const { season, year } = currentSeason();
  const q = `query ($s: MediaSeason, $y: Int) { Page(perPage: 16) {
    media(type: ANIME, season: $s, seasonYear: $y, sort: POPULARITY_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }
  }}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q, { s: season, y: year })).Page
      .media;
  } catch (e) {
    console.warn("AniList fetchSeasonal failed, falling back to MAL:", e);
    return fetchMalSeason(year, season, 16);
  }
}
export async function fetchFavorites() {
  const q = `query { Page(perPage: 16) { media(type: ANIME, sort: FAVOURITES_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchFavorites failed, falling back to MAL:", e);
    return fetchMalRanking("anime", "favorite", 16);
  }
}
export async function fetchUpcoming() {
  const q = `query { Page(perPage: 16) { media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC, isAdult: false) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchUpcoming failed, falling back to MAL:", e);
    return fetchMalRanking("anime", "upcoming", 16);
  }
}
export async function fetchTopAnime() {
  const q = `query { Page(perPage: 10) { media(type: ANIME, format_in: [TV, TV_SHORT, OVA, SPECIAL], sort: SCORE_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchTopAnime failed, falling back to MAL:", e);
    return fetchMalRanking("anime", "tv", 10);
  }
}
export async function fetchPopularMovies() {
  const q = `query { Page(perPage: 10) { media(type: ANIME, format: MOVIE, sort: SCORE_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchPopularMovies failed, falling back to MAL:", e);
    return fetchMalRanking("anime", "movie", 10);
  }
}

export async function searchAnime(q: string): Promise<AnilistMedia[]> {
  if (!q.trim()) return [];
  const query = `query ($s: String) { Page(perPage: 12) {
    media(type: ANIME, search: $s, sort: SEARCH_MATCH) { ${MEDIA_FIELDS} }
  }}`;
  try {
    const anilistRes = await anilist<{ Page: { media: AnilistMedia[] } }>(query, { s: q }, 2500);
    if (anilistRes.Page.media.length > 0) return anilistRes.Page.media;
  } catch (e) {
    console.warn("AniList searchAnime failed, falling back to MAL:", e);
  }

  try {
    const data = await fetchMal(
      `/anime?q=${encodeURIComponent(q)}&limit=12&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background`,
    );
    return data.data.map((m: any) => mapMalToAnilistMedia(m, "ANIME"));
  } catch {
    return [];
  }
}

export async function searchManga(q: string): Promise<AnilistMedia[]> {
  if (!q.trim()) return [];
  const query = `query ($s: String) { Page(perPage: 12) {
    media(type: MANGA, search: $s, sort: SEARCH_MATCH) { ${MEDIA_FIELDS} }
  }}`;

  try {
    const anilistRes = await anilist<{ Page: { media: AnilistMedia[] } }>(query, { s: q }, 2500);
    if (anilistRes.Page.media.length > 0) return anilistRes.Page.media;
  } catch (e) {
    console.warn("AniList searchManga failed, falling back to MAL:", e);
  }

  try {
    const malData = await fetchMal(
      `/manga?q=${encodeURIComponent(q)}&limit=12&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_chapters,num_volumes`,
    );
    return malData.data.map((m: any) => mapMalToAnilistMedia(m, "MANGA"));
  } catch {
    return [];
  }
}

export type BrowseParams = {
  search?: string;
  genre?: string;
  season?: string;
  year?: string;
  format?: string;
  status?: string;
  sort?: string;
  page?: number;
};

export async function browseAnime(
  p: BrowseParams,
): Promise<{ items: AnilistMedia[]; hasNext: boolean; lastPage: number; currentPage: number }> {
  const coreGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Hentai",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ];
  const genres: string[] = [];
  const tags: string[] = [];
  if (p.genre) {
    p.genre.split(",").forEach((g) => {
      const trimmed = g.trim();
      if (coreGenres.includes(trimmed)) genres.push(trimmed);
      else tags.push(trimmed);
    });
  }

  const query = `query (
    $s: String, $genre_in: [String], $tag_in: [String], $sea_in: [MediaSeason], $y_in: [Int],
    $f_in: [MediaFormat], $st_in: [MediaStatus], $sort: [MediaSort], $page: Int
  ) {
    Page(perPage: 30, page: $page) {
      pageInfo { hasNextPage lastPage currentPage total }
      media(type: ANIME,
        search: $s, genre_in: $genre_in, tag_in: $tag_in, season_in: $sea_in, seasonYear_in: $y_in,
        format_in: $f_in, status_in: $st_in, sort: $sort
      ) { ${MEDIA_FIELDS} }
    }
  }`;
  const vars = {
    s: p.search || undefined,
    genre_in: genres.length > 0 ? genres : undefined,
    tag_in: tags.length > 0 ? tags : undefined,
    sea_in: p.season ? p.season.split(",") : undefined,
    y_in: p.year ? p.year.split(",").map(Number) : undefined,
    f_in: p.format ? p.format.split(",") : undefined,
    st_in: p.status ? p.status.split(",") : undefined,
    sort: [p.sort || "POPULARITY_DESC"],
    page: p.page ?? 1,
  };
  try {
    const r = await anilist<{
      Page: {
        pageInfo: { hasNextPage: boolean; lastPage: number; currentPage: number; total: number };
        media: AnilistMedia[];
      };
    }>(query, vars);
    return {
      items: r.Page.media,
      hasNext: r.Page.pageInfo.hasNextPage,
      lastPage: r.Page.pageInfo.lastPage || r.Page.pageInfo.currentPage || 1,
      currentPage: r.Page.pageInfo.currentPage || (p.page ?? 1),
    };
  } catch (e) {
    const isDown =
      e instanceof Error &&
      (e.message.includes("403") || e.message.includes("500") || e.message.includes("503"));
    if (typeof window !== "undefined") {
      import("sonner").then(({ toast }) => {
        toast.error("AniList API is temporarily down", {
          description: "Falling back to basic search. Advanced filters are temporarily disabled.",
          id: "anilist-down-toast",
        });
      });
    }
    console.warn("AniList browseAnime failed, falling back to MAL:", e);
    const limit = 30;
    const offset = ((p.page ?? 1) - 1) * limit;
    let endpoint = `/anime/ranking?ranking_type=all&limit=${limit}&offset=${offset}`;
    if (p.search) {
      endpoint = `/anime?q=${encodeURIComponent(p.search)}&limit=${limit}&offset=${offset}`;
    }
    try {
      const data = await fetchMal(
        `${endpoint}&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background`,
      );
      return {
        items: data.data.map((m: any) => mapMalToAnilistMedia(m, "ANIME")),
        hasNext: !!data.paging?.next,
        lastPage: p.page ?? 1,
        currentPage: p.page ?? 1,
      };
    } catch {
      return { items: [], hasNext: false, lastPage: 1, currentPage: 1 };
    }
  }
}

export async function browseManga(
  p: BrowseParams,
): Promise<{ items: AnilistMedia[]; hasNext: boolean; lastPage: number; currentPage: number }> {
  const coreGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Hentai",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ];
  const genres: string[] = [];
  const tags: string[] = [];
  if (p.genre) {
    p.genre.split(",").forEach((g) => {
      const trimmed = g.trim();
      if (coreGenres.includes(trimmed)) genres.push(trimmed);
      else tags.push(trimmed);
    });
  }

  const query = `query (
    $s: String, $genre_in: [String], $tag_in: [String], $sea_in: [MediaSeason], $y_in: [Int],
    $f_in: [MediaFormat], $st_in: [MediaStatus], $sort: [MediaSort], $page: Int,
    $country: CountryCode
  ) {
    Page(perPage: 30, page: $page) {
      pageInfo { hasNextPage lastPage currentPage total }
      media(type: MANGA,
        search: $s, genre_in: $genre_in, tag_in: $tag_in, season_in: $sea_in, seasonYear_in: $y_in,
        format_in: $f_in, status_in: $st_in, sort: $sort, countryOfOrigin: $country
      ) { ${MEDIA_FIELDS} }
    }
  }`;

  let f_in = p.format ? p.format.split(",") : undefined;
  let country: string | undefined = undefined;

  if (p.format && !p.format.includes(",")) {
    if (p.format === "MANHWA") {
      f_in = ["MANGA"];
      country = "KR";
    } else if (p.format === "MANHUA") {
      f_in = ["MANGA"];
      country = "CN";
    } else if (p.format === "MANGA") {
      f_in = ["MANGA"];
      country = "JP";
    }
  } else if (p.format) {
    // If multiple selected, map MANHWA and MANHUA to MANGA
    f_in = f_in!.map((fmt) => (fmt === "MANHWA" || fmt === "MANHUA" ? "MANGA" : fmt));
    // Remove duplicates
    f_in = Array.from(new Set(f_in));
  }

  const vars = {
    s: p.search || undefined,
    genre_in: genres.length > 0 ? genres : undefined,
    tag_in: tags.length > 0 ? tags : undefined,
    sea_in: p.season ? p.season.split(",") : undefined,
    y_in: p.year ? p.year.split(",").map(Number) : undefined,
    f_in: f_in,
    st_in: p.status ? p.status.split(",") : undefined,
    sort: [p.sort || "POPULARITY_DESC"],
    page: p.page ?? 1,
    country: country,
  };
  try {
    const r = await anilist<{
      Page: {
        pageInfo: { hasNextPage: boolean; lastPage: number; currentPage: number; total: number };
        media: AnilistMedia[];
      };
    }>(query, vars);

    if (r.Page.media.length === 0 && p.search) {
      throw new Error("Empty search result");
    }

    return {
      items: r.Page.media,
      hasNext: r.Page.pageInfo.hasNextPage,
      lastPage: r.Page.pageInfo.lastPage || r.Page.pageInfo.currentPage || 1,
      currentPage: r.Page.pageInfo.currentPage || (p.page ?? 1),
    };
  } catch (e) {
    if (typeof window !== "undefined") {
      import("sonner").then(({ toast }) => {
        toast.error("AniList API is temporarily down", {
          description: "Falling back to basic search. Advanced filters are temporarily disabled.",
          id: "anilist-down-toast",
        });
      });
    }
    console.warn("AniList browseManga failed (or empty search), falling back to MAL:", e);
    const limit = 30;
    const offset = ((p.page ?? 1) - 1) * limit;
    let endpoint = `/manga/ranking?ranking_type=manga&limit=${limit}&offset=${offset}`;
    if (p.search) {
      endpoint = `/manga?q=${encodeURIComponent(p.search)}&limit=${limit}&offset=${offset}`;
    }
    try {
      const data = await fetchMal(
        `${endpoint}&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_chapters,num_volumes`,
      );
      return {
        items: data.data.map((m: any) => mapMalToAnilistMedia(m, "MANGA")),
        hasNext: !!data.paging?.next,
        lastPage: p.page ?? 1,
        currentPage: p.page ?? 1,
      };
    } catch {
      return { items: [], hasNext: false, lastPage: 1, currentPage: 1 };
    }
  }
}

const DETAIL_FIELDS = `
  ${MEDIA_FIELDS}
  endDate { year month day }
  source
  countryOfOrigin
  synonyms
  trailer { id site thumbnail }
  studios(isMain: true) { nodes { id name } }
  streamingEpisodes { title thumbnail url site }
  tags { name rank isMediaSpoiler }
  externalLinks { id site url type icon color }
  characters(perPage: 12, sort: ROLE) {
    edges {
      role
      node { id name { full } image { large } }
      voiceActors(language: JAPANESE) { id name { full } image { large } languageV2 }
    }
  }
  relations {
    edges {
      relationType
      node { ${MEDIA_FIELDS} }
    }
  }
  recommendations(perPage: 12, sort: RATING_DESC) {
    nodes { mediaRecommendation { ${MEDIA_FIELDS} } }
  }
`;

export function mapApikumeToAnilistMedia(d: any, id: string): AnilistMedia {
  const ratingNum = d.score || (d.rating ? parseFloat(String(d.rating)) : null);
  const score100 =
    ratingNum != null ? Math.round(ratingNum <= 10 ? ratingNum * 10 : ratingNum) : null;
  return {
    id: id,
    idMal: null,
    title: {
      romaji: d.title?.romaji || d.title?.english || d.title?.native || "Untitled",
      english: d.title?.english || d.title?.romaji || null,
      native: d.title?.native || null,
    },
    synonyms: d.title?.synonyms || [],
    coverImage: {
      extraLarge: d.poster || "",
      large: d.poster || "",
      color: null,
    },
    bannerImage: d.banner || d.poster || null,
    format: d.format?.toUpperCase() || "TV",
    episodes:
      typeof d.total_episodes === "number"
        ? d.total_episodes
        : d.next_airing_episode?.episode
          ? d.next_airing_episode.episode - 1
          : typeof d.episodes === "number"
            ? d.episodes
            : null,
    chapters: null,
    duration: null,
    status: d.status || "RELEASING",
    season: null,
    seasonYear: d.year || null,
    startDate: {
      year: d.year || null,
      month: null,
      day: null,
    },
    averageScore: score100,
    meanScore: score100,
    popularity: null,
    favourites: null,
    genres: d.genres || [],
    description: d.synopsis || null,
    isAdult: !!d.is_adult,
    source: d.source || null,
    studios: d.studios
      ? { nodes: d.studios.map((s: string) => ({ id: 0, name: s })) }
      : { nodes: [] },
    nextAiringEpisode: d.next_airing_episode
      ? {
          episode: d.next_airing_episode.episode,
          airingAt:
            d.next_airing_episode.airing_at ||
            Math.floor(
              new Date(
                `${d.next_airing_episode.date} ${d.next_airing_episode.time || ""}`,
              ).getTime() / 1000,
            ) ||
            0,
        }
      : null,
    characters: d.characters
      ? {
          edges: d.characters.map((c: any) => ({
            role: c.role || "MAIN",
            node: {
              id: 0,
              name: { full: c.character },
              image: { large: c.image || "" },
            },
            voiceActors: c.actor
              ? [
                  {
                    id: 0,
                    name: { full: c.actor },
                    image: { large: c.actor_image || "" },
                    languageV2: c.language || "Japanese",
                  },
                ]
              : [],
          })),
        }
      : { edges: [] },
    relations: d.related
      ? {
          edges: d.related.map((r: any) => ({
            relationType: r.relation || "SIDE_STORY",
            node: {
              id: r.anikume_id,
              title: {
                romaji: r.title?.romaji || r.title?.english || "",
                english: r.title?.english || null,
                native: r.title?.native || null,
              },
              coverImage: {
                extraLarge: r.poster || "",
                large: r.poster || "",
                color: null,
              },
              bannerImage: null,
              format: r.format?.toUpperCase() || "TV",
              status: r.status || null,
              isAdult: !!r.is_adult,
            },
          })),
        }
      : { edges: [] },
    recommendations: d.recommendations
      ? {
          nodes: d.recommendations.map((rec: any) => ({
            mediaRecommendation: {
              id: rec.anikume_id,
              title: {
                romaji: rec.title?.romaji || rec.title?.english || "",
                english: rec.title?.english || null,
                native: rec.title?.native || null,
              },
              coverImage: {
                extraLarge: rec.poster || "",
                large: rec.poster || "",
                color: null,
              },
              bannerImage: null,
              format: rec.format?.toUpperCase() || "TV",
              status: rec.status || null,
              isAdult: !!rec.is_adult,
            },
          })),
        }
      : { nodes: [] },
    externalLinks: d.external_links
      ? d.external_links.map((l: any) => ({
          id: l.site || l.link || l.url,
          site: l.site || "External",
          url: l.link || l.url || "",
          type: "INFO",
          icon: l.logo || null,
          color: null,
        }))
      : [],
    trailer: (() => {
      if (!d.trailer) return null;
      let ytId = typeof d.trailer === "object" ? d.trailer.id : null;
      const url =
        typeof d.trailer === "object"
          ? d.trailer.url
          : typeof d.trailer === "string"
            ? d.trailer
            : "";
      if (!ytId && url) {
        const match = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
        if (match) ytId = match[1];
      }
      if (!ytId && typeof d.trailer === "string" && d.trailer.length === 11) {
        ytId = d.trailer;
      }
      if (!ytId) return null;
      return {
        id: ytId,
        site: "youtube",
        thumbnail: d.trailer?.thumbnail || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      };
    })(),
  };
}

export async function fetchAnimeById(id: number | string): Promise<AnilistMedia> {
  const strId = String(id);
  const isAmId = strId.startsWith("am");

  // If not explicitly a MAL am-prefixed ID, use Apikume API /api/anime/:id directly
  if (!isAmId) {
    try {
      const data = await fetchApikumeDetail(strId);
      if (data && (data.title || data.poster || data.synopsis)) {
        return mapApikumeToAnilistMedia(data, strId);
      }
    } catch (e) {
      console.warn("AniKume detail fetch failed, attempting fallback:", e);
    }
  }

  const cacheKey = `anime_detail_${strId}`;

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp, isFinished } = JSON.parse(cached);
        if (isFinished || Date.now() - timestamp < 12 * 60 * 60 * 1000) {
          return data;
        }
      } catch (e) {}
    }
  }

  let media: AnilistMedia;

  if (isAmId) {
    // Direct MAL fetch for am-prefixed IDs
    const malId = strId.slice(2);
    const data = await fetchMal(
      `/anime/${malId}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`,
    );
    media = mapMalToAnilistMedia(data, "ANIME");

    // Enrich with ani.zip using mal_id (since this is a MAL-sourced anime)
    const builtInLinks: AnilistMedia["externalLinks"] = [
      {
        id: `mal_${malId}`,
        site: "MyAnimeList",
        url: `https://myanimelist.net/anime/${malId}`,
        type: "INFO",
        icon: null,
        color: "#2e51a2",
      },
    ];
    try {
      const aniZipRes = await fetch(`https://api.ani.zip/mappings?mal_id=${malId}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (aniZipRes.ok) {
        const aniZipData = await aniZipRes.json();
        if (aniZipData.links && Array.isArray(aniZipData.links)) {
          const existingSites = new Set(builtInLinks.map((l) => l.site.toLowerCase()));
          for (const link of aniZipData.links) {
            if (!existingSites.has((link.site || "").toLowerCase())) {
              builtInLinks.push({
                id: `anizip_${link.site}`,
                site: link.site || "",
                url: link.url || "",
                type: link.type || null,
                icon: link.icon || null,
                color: link.color || null,
              });
            }
          }
        }
        // Also store anilist_id from ani.zip if available
        if (aniZipData.anilist_id) {
          builtInLinks.unshift({
            id: `anilist_${aniZipData.anilist_id}`,
            site: "AniList",
            url: `https://anilist.co/anime/${aniZipData.anilist_id}`,
            type: "INFO",
            icon: null,
            color: "#02a9ff",
          });
        }
      }
    } catch {
      // ani.zip enrichment is optional
    }
    media = { ...media, externalLinks: builtInLinks };
  } else {
    const numId = Number(strId);
    const q = `query ($id: Int) { Media(id: $id, type: ANIME) { ${DETAIL_FIELDS} } }`;
    try {
      media = (await anilist<{ Media: AnilistMedia }>(q, { id: numId })).Media;

      // Always inject AniList and MAL links directly from AniList DB data
      const builtInLinks: AnilistMedia["externalLinks"] = [];
      builtInLinks.push({
        id: `anilist_${media.id}`,
        site: "AniList",
        url: `https://anilist.co/anime/${media.id}`,
        type: "INFO",
        icon: null,
        color: "#02a9ff",
      });
      if (media.idMal) {
        builtInLinks.push({
          id: `mal_${media.idMal}`,
          site: "MyAnimeList",
          url: `https://myanimelist.net/anime/${media.idMal}`,
          type: "INFO",
          icon: null,
          color: "#2e51a2",
        });
      }

      // Enrich with ani.zip for additional external links (clearlogos etc.)
      if (media.idMal) {
        try {
          const aniZipRes = await fetch(`https://api.ani.zip/mappings?anilist_id=${media.id}`, {
            signal: AbortSignal.timeout(2000),
          });
          if (aniZipRes.ok) {
            const aniZipData = await aniZipRes.json();
            // Merge any extra external links from ani.zip (e.g. streaming services)
            if (aniZipData.links && Array.isArray(aniZipData.links)) {
              const existingSites = new Set(
                (media.externalLinks || []).map((l: any) => l.site.toLowerCase()),
              );
              for (const link of aniZipData.links) {
                if (!existingSites.has((link.site || "").toLowerCase())) {
                  builtInLinks.push({
                    id: `anizip_${link.site}`,
                    site: link.site || "",
                    url: link.url || "",
                    type: link.type || null,
                    icon: link.icon || null,
                    color: link.color || null,
                  });
                }
              }
            }
          }
        } catch {
          // ani.zip enrichment is optional, ignore errors
        }
      }

      media = {
        ...media,
        externalLinks: [
          ...builtInLinks,
          ...(media.externalLinks || []).filter(
            (l) => !builtInLinks.some((b) => b.site === l.site),
          ),
        ],
      };
    } catch (e) {
      console.warn("AniList fetchAnimeById failed, falling back to MAL:", e);
      // Use MAL directly — no ani.zip needed here
      const malId: string | number = numId;
      // If we somehow have idMal from a partial fetch, use it; otherwise use anilist id as MAL id
      const data = await fetchMal(
        `/anime/${malId}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`,
      );
      media = mapMalToAnilistMedia(data, "ANIME");
    }
  }

  if (typeof window !== "undefined" && media) {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: media,
        timestamp: Date.now(),
        isFinished: media.status === "FINISHED",
      }),
    );
  }
  return media;
}

import { getPreferredTitle } from "./utils";

export function titleOf(m: AnilistMedia) {
  return getPreferredTitle(m.title);
}
export function prettyFormat(m: AnilistMedia | string | null) {
  if (!m) return "";
  let f: string;
  let country: string | null = null;

  if (typeof m === "object") {
    f = m.format || "";
    country = m.countryOfOrigin || null;
  } else {
    f = m;
  }

  if (!f) return "";

  if (f === "MANGA" || f === "NOVEL" || f === "ONE_SHOT") {
    let formatText = f.replace(/_/g, " ");
    formatText = formatText.charAt(0).toUpperCase() + formatText.slice(1).toLowerCase();

    if (country === "KR") formatText = "Manhwa";
    else if (country === "CN") formatText = "Manhua";
    else if (country === "JP") formatText = "Manga";

    if (f === "ONE_SHOT") formatText = "One Shot";
    return formatText;
  }
  return (
    (
      {
        TV: "TV Show",
        TV_SHORT: "TV Short",
        MOVIE: "Movie",
        SPECIAL: "Special",
        OVA: "OVA",
        ONA: "ONA",
        MUSIC: "Music",
      } as Record<string, string>
    )[f] ?? f.replace(/_/g, " ")
  );
}
export function prettyDuration(d: number | null | undefined) {
  if (!d) return "";
  if (d < 60) return `${d} mins`;
  const h = Math.floor(d / 60);
  const m = d % 60;
  return m === 0 ? `${h} hour${h > 1 ? "s" : ""}` : `${h}h ${m}m`;
}
export function stripHtml(s: string | null | undefined) {
  if (!s) return "";
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type Episode = {
  episode: number;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  filler?: boolean;
};

export async function fetchEpisodes(
  anilistId: number | string,
  media?: AnilistMedia,
  forceRefresh: boolean = false,
): Promise<Episode[]> {
  try {
    // If anime is upcoming / not released yet, never request episodes
    if (media?.status === "NOT_YET_RELEASED" || media?.status?.toUpperCase() === "UPCOMING") {
      return [];
    }

    const strId = String(anilistId);

    // Fallback image from media banner or poster
    const fallbackImage = media?.bannerImage || media?.coverImage?.extraLarge || "";
    // Fallback description from anime synopsis
    const fallbackDesc = media?.description ? stripHtml(media.description) : "";

    // Primary: fetch from /api/anime/episodes/:id
    try {
      const epRes = await fetchApikumeEpisodes(strId);
      if (epRes?.episodes && Array.isArray(epRes.episodes) && epRes.episodes.length > 0) {
        return epRes.episodes
          .map((ep: any) => {
            const epNum = typeof ep.episode === "number" ? ep.episode : Number(ep.episode) || 1;
            return {
              episode: epNum,
              title: ep.title || `Episode ${epNum}`,
              description: ep.description || fallbackDesc,
              image: ep.image || fallbackImage,
              date: "",
            };
          })
          .sort((a: Episode, b: Episode) => a.episode - b.episode);
      }
    } catch (err) {
      console.warn("fetchApikumeEpisodes failed, checking secondary fallback:", err);
    }

    // Secondary fallback for legacy MAL/AniList items if Apikume had no episodes
    const isMalId = strId.startsWith("am");
    const pureId = isMalId ? strId.slice(2) : strId;
    const param = isMalId ? "mal_id" : "anilist_id";

    try {
      const res = await fetch(`https://api.ani.zip/mappings?${param}=${pureId}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.episodes && Object.keys(data.episodes).length > 0) {
          return Object.values(data.episodes)
            .map((ep: any) => {
              const epNum = Number(ep.episode);
              return {
                episode: epNum,
                title: ep.title?.en || `Episode ${epNum}`,
                description: ep.overview || ep.summary || fallbackDesc,
                image: ep.image || fallbackImage,
                date: ep.airDateUtc || ep.airDate || "",
              };
            })
            .sort((a: Episode, b: Episode) => a.episode - b.episode);
        }
      }
    } catch {}

    // Generate stubs from known episode count if available
    if (media) {
      const knownTotal = totalEpisodeCount(media);
      if (knownTotal > 0) {
        return Array.from({ length: knownTotal }, (_, i) => ({
          episode: i + 1,
          title: `Episode ${i + 1}`,
          description: fallbackDesc,
          image: fallbackImage,
          date: "",
        }));
      }
    }

    return [];
  } catch {
    return [];
  }
}

export function totalEpisodeCount(m: AnilistMedia, fetched?: Episode[]): number {
  const nextEp = m.nextAiringEpisode?.episode;
  if (nextEp && nextEp > 1) return nextEp - 1;
  if (fetched && fetched.length > 0) return fetched.length;
  if (m.episodes != null) return m.episodes;
  return 0;
}

export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
  "4-koma",
  "Achromatic",
  "Achronological Order",
  "Acrobatics",
  "Acting",
  "Adoption",
  "Advertisement",
  "Afterlife",
  "Age Gap",
  "Age Regression",
  "Agender",
  "Agriculture",
  "Airsoft",
  "Alchemy",
  "Aliens",
  "Alternate Universe",
  "American Football",
  "Amnesia",
  "Anachronism",
  "Ancient China",
  "Angels",
  "Animals",
  "Anthology",
  "Anthropomorphism",
  "Anti-Hero",
  "Archery",
  "Aromantic",
  "Arranged Marriage",
  "Artificial Intelligence",
  "Asexual",
  "Assassins",
  "Astronomy",
  "Athletics",
  "Augmented Reality",
  "Autobiographical",
  "Aviation",
  "Badminton",
  "Ballet",
  "Band",
  "Bar",
  "Baseball",
  "Basketball",
  "Battle Royale",
  "Biographical",
  "Bisexual",
  "Blackmail",
  "Board Game",
  "Boarding School",
  "Body Horror",
  "Body Image",
  "Body Swapping",
  "Bowling",
  "Boxing",
  "Boys' Love",
  "Brainwashing",
  "Bullying",
  "Butler",
  "Calligraphy",
  "Camping",
  "Cannibalism",
  "Card Battle",
  "Cars",
  "Centaur",
  "CGI",
  "Cheating",
  "Cheerleading",
  "Chibi",
  "Chimera",
  "Chuunibyou",
  "Circus",
  "Class Struggle",
  "Classic Literature",
  "Classical Music",
  "Clone",
  "Coastal",
  "Cohabitation",
  "College",
  "Coming of Age",
  "Conspiracy",
  "Cosmic Horror",
  "Cosplay",
  "Cowboys",
  "Creature Taming",
  "Crime",
  "Criminal Organization",
  "Crossdressing",
  "Crossover",
  "Cult",
  "Cultivation",
  "Curses",
  "Cute Boys Doing Cute Things",
  "Cute Girls Doing Cute Things",
  "Cyberpunk",
  "Cyborg",
  "Cycling",
  "Dancing",
  "Death Game",
  "Delinquents",
  "Demons",
  "Denpa",
  "Desert",
  "Detective",
  "Dinosaurs",
  "Disability",
  "Dissociative Identities",
  "Dragons",
  "Drawing",
  "Drugs",
  "Dullahan",
  "Dungeon",
  "Dystopian",
  "E-Sports",
  "Eco-Horror",
  "Economics",
  "Educational",
  "Elderly Protagonist",
  "Elf",
  "Ensemble Cast",
  "Environmental",
  "Episodic",
  "Ero Guro",
  "Espionage",
  "Estranged Family",
  "Exiled",
  "Exorcism",
  "Fairy",
  "Fairy Tale",
  "Fake Relationship",
  "Family Life",
  "Fashion",
  "Female Harem",
  "Female Protagonist",
  "Femboy",
  "Fencing",
  "Filmmaking",
  "Firefighters",
  "Fishing",
  "Fitness",
  "Flash",
  "Food",
  "Football",
  "Foreign",
  "Found Family",
  "Fugitive",
  "Full CGI",
  "Full Color",
  "Gambling",
  "Gangs",
  "Gekiga",
  "Gender Bending",
  "Ghost",
  "Go",
  "Goblin",
  "Gods",
  "Golf",
  "Gore",
  "Graduation Project",
  "Guns",
  "Gyaru",
  "Handball",
  "Henshin",
  "Heterosexual",
  "Hikikomori",
  "Hip-hop Music",
  "Historical",
  "Homeless",
  "Horticulture",
  "Human Experimentation",
  "Ice Sports",
  "Idol",
  "Incest",
  "Indigenous Cultures",
  "Inn",
  "Inseki",
  "Interspecies",
  "Isekai",
  "Iyashikei",
  "Jazz Music",
  "Josei",
  "Judo",
  "Kabuki",
  "Kaiju",
  "Karuta",
  "Kemonomimi",
  "Kids",
  "Kingdom Management",
  "Konbini",
  "Kuudere",
  "Lacrosse",
  "Language Barrier",
  "LGBTQ+ Themes",
  "Long Strip",
  "Lost Civilization",
  "Love Triangle",
  "Mafia",
  "Magic",
  "Mahjong",
  "Maids",
  "Makeup",
  "Male Harem",
  "Male Protagonist",
  "Manzai",
  "Marriage",
  "Martial Arts",
  "Matchmaking",
  "Matriarchy",
  "Medicine",
  "Medieval",
  "Memory Manipulation",
  "Mermaid",
  "Meta",
  "Metal Music",
  "Middle east",
  "Military",
  "Mixed Gender Harem",
  "Mixed Media",
  "Modeling",
  "Monster Boy",
  "Monster Girl",
  "Mopeds",
  "Motorcycles",
  "Mountaineering",
  "Musical Theater",
  "Mythology",
  "Natural Disaster",
  "Necromancy",
  "Nekomimi",
  "Ninja",
  "No Dialogue",
  "Noir",
  "Non-fiction",
  "Nudity",
  "Nun",
  "Office",
  "Office Lady",
  "Oiran",
  "Ojou-sama",
  "Orphan",
  "Otaku Culture",
  "Outdoor Activities",
  "Pandemic",
  "Parenthood",
  "Parkour",
  "Parody",
  "Philosophy",
  "Photography",
  "Pirates",
  "Poker",
  "Police",
  "Politics",
  "Polyamorous",
  "Post-Apocalyptic",
  "POV",
  "Pregnancy",
  "Primarily Adult Cast",
  "Primarily Animal Cast",
  "Primarily Child Cast",
  "Primarily Female Cast",
  "Primarily Male Cast",
  "Primarily Teen Cast",
  "Prison",
  "Prophecy",
  "Proxy Battle",
  "Psychosexual",
  "Puppetry",
  "Rakugo",
  "Real Robot",
  "Rehabilitation",
  "Reincarnation",
  "Religion",
  "Rescue",
  "Restaurant",
  "Revenge",
  "Reverse Isekai",
  "Robots",
  "Rock Music",
  "Rotoscoping",
  "Royal Affairs",
  "Rugby",
  "Rural",
  "Samurai",
  "Satire",
  "School",
  "School Club",
  "Scuba Diving",
  "Seinen",
  "Shapeshifting",
  "Ships",
  "Shogi",
  "Short-Form Chapter",
  "Shoujo",
  "Shounen",
  "Shrine Maiden",
  "Skateboarding",
  "Skeleton",
  "Slapstick",
  "Slavery",
  "Snowscape",
  "Software Development",
  "Space",
  "Space Opera",
  "Spearplay",
  "Steampunk",
  "Stop Motion",
  "Succubus",
  "Suicide",
  "Sumo",
  "Super Power",
  "Super Robot",
  "Superhero",
  "Surfing",
  "Surreal Comedy",
  "Survival",
  "Swimming",
  "Swordplay",
  "Table Tennis",
  "Tanks",
  "Tanned Skin",
  "Teacher",
  "Teens' Love",
  "Tennis",
  "Terrorism",
  "Time Loop",
  "Time Manipulation",
  "Time Skip",
  "Tokusatsu",
  "Tomboy",
  "Torture",
  "Tragedy",
  "Trains",
  "Transgender",
  "Travel",
  "Triads",
  "Tsundere",
  "Twins",
  "Unrequited Love",
  "Urban",
  "Urban Fantasy",
  "Vampire",
  "Vertical Video",
  "Veterinarian",
  "Video Games",
  "Vikings",
  "Villainess",
  "Virtual World",
  "Vocal Synth",
  "Volleyball",
  "VTuber",
  "War",
  "Werewolf",
  "Wilderness",
  "Witch",
  "Work",
  "Wrestling",
  "Writing",
  "Wuxia",
  "Yakuza",
  "Yandere",
  "Youkai",
  "Yuri",
  "Zombie",
];
export const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];
export const FORMATS = ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"];
export const MANGA_FORMATS = ["MANGA", "MANHWA", "MANHUA", "NOVEL", "ONE_SHOT"];
export const STATUSES = ["RELEASING", "FINISHED", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"];
export const SORTS = [
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "FAVOURITES_DESC", label: "Favorites" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "TITLE_ROMAJI", label: "A–Z" },
];

export type AiringScheduleItem = {
  id: number;
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
  media: AnilistMedia;
};

export async function fetchSchedule(
  start: number,
  end: number,
  page: number = 1,
): Promise<{ items: AiringScheduleItem[]; hasNextPage: boolean }> {
  const q = `
    query ($start: Int, $end: Int, $page: Int) {
      Page(page: $page, perPage: 50) {
        pageInfo { hasNextPage }
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
          id
          episode
          airingAt
          timeUntilAiring
          media { ${MEDIA_FIELDS} }
        }
      }
    }
  `;
  try {
    const res = await anilist<{
      Page: { pageInfo: { hasNextPage: boolean }; airingSchedules: AiringScheduleItem[] };
    }>(q, { start, end, page });
    return { items: res.Page.airingSchedules, hasNextPage: res.Page.pageInfo.hasNextPage };
  } catch (e) {
    console.warn("AniList fetchSchedule failed, falling back to MAL:", e);
    // MAL doesn't have a schedule endpoint, use airing season as fallback
    const { season, year } = currentSeason();
    const data = await fetchMalSeason(year, season, 50);
    return {
      items: data.map((m, i) => ({
        id: m.id as number,
        episode: 1, // Dummy episode since we don't know the exact schedule
        airingAt: Math.floor(Date.now() / 1000) + i * 3600, // Dummy time
        timeUntilAiring: 3600,
        media: m,
      })),
      hasNextPage: false,
    };
  }
}

export async function fetchHeroManga(): Promise<AnilistMedia[]> {
  const q = `query { Page(perPage: 20) {
    media(type: MANGA, sort: TRENDING_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }
  }}`;
  try {
    const data = await anilist<{ Page: { media: AnilistMedia[] } }>(q);
    return data.Page.media.filter((m) => m.bannerImage).slice(0, 10);
  } catch (e) {
    console.warn("AniList fetchHeroManga failed, falling back to MAL:", e);
    const data = await fetchMalRanking("manga", "manga", 20);
    return data.filter((m) => m.bannerImage).slice(0, 10);
  }
}

export async function fetchTrendingManga() {
  const q = `query { Page(perPage: 16) { media(type: MANGA, sort: TRENDING_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchTrendingManga failed, falling back to MAL:", e);
    return fetchMalRanking("manga", "manga", 16);
  }
}

export async function fetchSeasonalManga() {
  const q = `query { Page(perPage: 16) {
    media(type: MANGA, sort: POPULARITY_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }
  }}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchSeasonalManga failed, falling back to MAL:", e);
    return fetchMalRanking("manga", "bypopularity", 16);
  }
}

export async function fetchFavoritesManga() {
  const q = `query { Page(perPage: 16) { media(type: MANGA, sort: FAVOURITES_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchFavoritesManga failed, falling back to MAL:", e);
    return fetchMalRanking("manga", "favorite", 16);
  }
}

export async function fetchUpcomingManga() {
  const q = `query { Page(perPage: 16) { media(type: MANGA, status: NOT_YET_RELEASED, sort: POPULARITY_DESC, isAdult: false) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchUpcomingManga failed, falling back to MAL:", e);
    return fetchMalRanking("manga", "manga", 16); // MAL doesn't have an upcoming manga ranking, use default
  }
}

export async function fetchMangaById(id: number | string): Promise<AnilistMedia> {
  const strId = String(id);
  const cacheKey = `manga_detail_${strId}`;

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data } = JSON.parse(cached);
        if (data) return data;
      } catch (e) {}
    }
  }

  let media: AnilistMedia;
  const MAL_MANGA_FIELDS =
    "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_chapters,num_volumes,authors,pictures,background,related_anime,related_manga,recommendations,serialization";

  // mm / mmc prefix → pure MAL manga ID
  if (strId.startsWith("mmc") || strId.startsWith("mm")) {
    const malId = strId.startsWith("mmc") ? strId.slice(3) : strId.slice(2);
    const data = await fetchMal(`/manga/${malId}?fields=${MAL_MANGA_FIELDS}`);
    media = mapMalToAnilistMedia(data, "MANGA");
  } else {
    // AniList numeric ID (or mc prefix — colored AniList)
    const fetchId = strId.startsWith("mc") ? strId.slice(2) : strId;
    const q = `query ($id: Int) { Media(id: $id, type: MANGA) { ${DETAIL_FIELDS} } }`;
    try {
      media = (await anilist<{ Media: AnilistMedia }>(q, { id: Number(fetchId) })).Media;

      // Always inject AniList and MAL links directly from AniList DB data
      const builtInLinks: AnilistMedia["externalLinks"] = [];
      builtInLinks.push({
        id: `anilist_${media.id}`,
        site: "AniList",
        url: `https://anilist.co/manga/${media.id}`,
        type: "INFO",
        icon: null,
        color: "#02a9ff",
      });
      if (media.idMal) {
        builtInLinks.push({
          id: `mal_${media.idMal}`,
          site: "MyAnimeList",
          url: `https://myanimelist.net/manga/${media.idMal}`,
          type: "INFO",
          icon: null,
          color: "#2e51a2",
        });
      }

      const existingLinks = media.externalLinks || [];
      media = {
        ...media,
        externalLinks: [
          ...builtInLinks,
          ...existingLinks.filter((l) => !builtInLinks.some((b) => b.site === l.site)),
        ],
      };
    } catch (e) {
      console.warn("AniList fetchMangaById failed, falling back to MAL:", e);
      // Use idMal if we cached it, otherwise try same numeric ID on MAL
      const malId = fetchId;
      const data = await fetchMal(`/manga/${malId}?fields=${MAL_MANGA_FIELDS}`);
      media = mapMalToAnilistMedia(data, "MANGA");
    }
  }

  if (typeof window !== "undefined" && media) {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: media,
        timestamp: Date.now(),
        isFinished: media.status === "FINISHED",
      }),
    );
  }
  return media;
}

export async function fetchMangaballDataWithCache(
  mediaOrId: number | string | AnilistMedia,
  status?: string | null,
  isColored?: boolean,
  idMalOverride?: number | string | null,
  forceRefresh: boolean = false,
) {
  const baseId = typeof mediaOrId === "object" ? mediaOrId.id : mediaOrId;
  const idMalFromMedia = typeof mediaOrId === "object" && mediaOrId.idMal ? mediaOrId.idMal : null;
  const malId = idMalOverride || idMalFromMedia;
  const cacheKey = `mangaball_${baseId}${isColored ? "_colored" : ""}`;

  if (forceRefresh && typeof window !== "undefined") {
    try {
      localStorage.removeItem(cacheKey);
      invalidateMediaSession(baseId);
    } catch {}
  }

  try {
    const strId = typeof baseId === "string" ? baseId : String(baseId);
    let anilistId = strId;
    let isMalExplicit = false;

    if (strId.startsWith("mmc")) {
      anilistId = strId.slice(3);
      isMalExplicit = true;
    } else if (strId.startsWith("mm")) {
      anilistId = strId.slice(2);
      isMalExplicit = true;
    } else if (strId.startsWith("mc")) {
      anilistId = strId.slice(2);
    } else if (strId.startsWith("am")) {
      anilistId = strId.slice(2);
    }

    const isReleasing = status !== "FINISHED";
    const cacheBuster =
      forceRefresh || isReleasing || isMediaSessionStale(baseId, status)
        ? String(Date.now())
        : undefined;

    // 1. Prioritize MAL ID when present (either explicit or from AniList response idMal): /api/mangaball/(mal)?mal=true
    const targetMalId = isMalExplicit ? anilistId : malId ? String(malId) : null;

    if (targetMalId) {
      const searchParams = new URLSearchParams();
      searchParams.set("mal", "true");
      if (isColored) searchParams.set("color", "true");
      if (cacheBuster) searchParams.set("_t", cacheBuster);

      const qs = searchParams.toString();
      const url = `https://api.akadevs.xyz/api/mangaball/${targetMalId}${qs ? `?${qs}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.chapters && data.chapters.length > 0) {
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({
                  data,
                  timestamp: Date.now(),
                  isFinished: status === "FINISHED",
                }),
              );
            } catch (e) {
              console.warn("Storage quota exceeded", e);
            }
          }
          markMediaSessionFresh(baseId);
          return data;
        }
      }
    }

    // 2. Fallback / direct AniList ID when MAL ID is not available or returned no chapters
    if (!isMalExplicit && anilistId) {
      const searchParams = new URLSearchParams();
      if (isColored) searchParams.set("color", "true");
      if (cacheBuster) searchParams.set("_t", cacheBuster);
      const qs = searchParams.toString();
      const url = `https://api.akadevs.xyz/api/mangaball/${anilistId}${qs ? `?${qs}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.chapters && data.chapters.length > 0) {
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({
                  data,
                  timestamp: Date.now(),
                  isFinished: status === "FINISHED",
                }),
              );
            } catch (e) {
              console.warn("Storage quota exceeded", e);
            }
          }
          markMediaSessionFresh(baseId);
          return data;
        }
      }
    }

    return null;
  } catch (e) {
    console.error("Mangaball fetch error:", e);
    return { error: "Fetch failed", chapters: [] };
  }
}

export async function fetchTopManga() {
  const q = `query { Page(perPage: 10) { media(type: MANGA, sort: SCORE_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchTopManga failed, falling back to MAL:", e);
    return fetchMalRanking("manga", "manga", 10); // Default manga ranking is usually by score/popularity
  }
}

export async function fetchTopManhwa() {
  const q = `query { Page(perPage: 10) { media(type: MANGA, countryOfOrigin: "KR", sort: SCORE_DESC, isAdult: false, status_not: NOT_YET_RELEASED) { ${MEDIA_FIELDS} }}}`;
  try {
    return (await anilist<{ Page: { media: AnilistMedia[] } }>(q)).Page.media;
  } catch (e) {
    console.warn("AniList fetchTopManhwa failed, falling back to MAL:", e);
    return fetchMalRanking("manga", "manhwa", 10);
  }
}

export async function fetchMangaSchedule(
  start: number,
  end: number,
  page: number = 1,
): Promise<{ results: AnilistMedia[]; hasNextPage: boolean }> {
  // Manga doesn't have an airing schedule in the same way, so we fallback to upcoming
  const q = `query ($page: Int) { Page(page: $page, perPage: 50) { pageInfo { hasNextPage } media(type: MANGA, status: RELEASING, sort: UPDATED_AT_DESC, isAdult: false) { ${MEDIA_FIELDS} } } }`;
  try {
    const data = await queryAnilist(q, { page });
    return {
      results: (data.Page.media || []).map((m: any) => mapAnilistMedia(m, "MANGA")),
      hasNextPage: !!data.Page.pageInfo?.hasNextPage,
    };
  } catch (e) {
    console.error("fetchMangaSchedule failed:", e);
    return { results: [], hasNextPage: false };
  }
}

export async function fetchChapters(
  id: any,
  media: AnilistMedia,
  _dub?: boolean,
): Promise<{ chapter: string; date: string; id: string }[]> {
  const count = media.num_chapters || 10;
  return Array.from({ length: count }).map((_, i) => ({
    chapter: String(i + 1),
    date: new Date().toISOString(),
    id: String(i + 1),
  }));
}

export function totalChapterCount(media: AnilistMedia): number {
  return media.num_chapters || 10;
}
