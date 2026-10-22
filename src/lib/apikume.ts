export interface ApikumeTitle {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
  synonyms?: string[];
}

export interface ApikumeHeroItem {
  anikume_id: string;
  title: ApikumeTitle;
  poster: string;
  banner?: string | null;
  description?: string | null;
  rating?: string | number | null;
  status?: string | null;
  year?: number | null;
  is_adult?: boolean | null;
}

export interface ApikumeAnimeItem {
  anikume_id: string;
  title: ApikumeTitle;
  poster: string;
  format?: string | null;
  status?: string | null;
  rating?: string | number | null;
  is_adult?: boolean | null;
}

export interface ApikumeHomeResponse {
  hero_slider: ApikumeHeroItem[];
  trending_now: ApikumeAnimeItem[];
  popular_this_season: ApikumeAnimeItem[];
  upcoming: ApikumeAnimeItem[];
  all_time_popular: ApikumeAnimeItem[];
  top_10: ApikumeAnimeItem[];
  top_10_movies: ApikumeAnimeItem[];
}

export interface ApikumeEpisodeItem {
  episode: number;
  "season-episode"?: string;
  absoluteepisode?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface ApikumeEpisodesResponse {
  total_episodes: number;
  episodes: ApikumeEpisodeItem[];
}

export interface ApikumeCharacterItem {
  character: string;
  role?: string;
  image?: string;
  actor?: string;
  actor_image?: string;
  language?: string;
}

export interface ApikumeRelatedItem {
  relation?: string;
  anikume_id: string;
  title: ApikumeTitle;
  poster: string;
  format?: string;
  status?: string;
  is_adult?: boolean;
}

export interface ApikumeExternalLink {
  site?: string;
  link?: string;
  url?: string;
  logo?: string;
}

export interface ApikumeAnimeDetail {
  anikume_id?: string;
  is_adult?: boolean;
  title: ApikumeTitle;
  poster: string;
  banner?: string | null;
  rating?: string | number | null;
  status?: string | null;
  format?: string | null;
  score?: number | string | null;
  year?: number | null;
  source?: string | null;
  studios?: string[];
  next_airing_episode?: {
    episode: number;
    date?: string;
    time?: string;
    timezone?: string;
    airing_at?: number;
  } | null;
  trailer?: any;
  synopsis?: string | null;
  genres?: string[];
  related?: ApikumeRelatedItem[];
  external_links?: ApikumeExternalLink[];
  characters?: ApikumeCharacterItem[];
  recommendations?: ApikumeRelatedItem[];
}

import { getPreferredTitle } from "./utils";

export function apikumeTitle(title?: ApikumeTitle | null): string {
  if (!title) return "Untitled";
  return getPreferredTitle(title);
}

// In-session data persistence map: stores every fetched endpoint response in active session memory
const sessionPageStore = new Map<string, any>();
const inFlightPromises = new Map<string, Promise<any>>();

// Restore cached endpoints from sessionStorage if available
if (typeof window !== "undefined") {
  try {
    const saved = sessionStorage.getItem("apikume_endpoint_cache");
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const [k, v] of Object.entries(parsed)) {
        sessionPageStore.set(k, v);
      }
    }
  } catch {}
}

function persistCacheToSession() {
  if (typeof window === "undefined") return;
  try {
    const obj: Record<string, any> = {};
    // Only persist up to 200 items to avoid quota issues
    let count = 0;
    for (const [k, v] of sessionPageStore.entries()) {
      if (count++ > 200) break;
      obj[k] = v;
    }
    sessionStorage.setItem("apikume_endpoint_cache", JSON.stringify(obj));
  } catch {}
}

export function getSessionEndpointData<T = any>(key: string): T | undefined {
  return sessionPageStore.get(key);
}

export async function fetchApikumeEndpoint<T = any>(endpoint: string): Promise<T> {
  // If already fetched in this session, return it instantly without any delay
  if (sessionPageStore.has(endpoint)) {
    return sessionPageStore.get(endpoint) as T;
  }

  // If a request is currently in flight, deduplicate and reuse it
  if (inFlightPromises.has(endpoint)) {
    return inFlightPromises.get(endpoint) as Promise<T>;
  }

  const fetchPromise = (async () => {
    try {
      const url =
        typeof window === "undefined"
          ? endpoint.startsWith("http")
            ? endpoint
            : `https://apikume.onrender.com${endpoint}`
          : endpoint;

      let res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok && typeof window !== "undefined" && !url.startsWith("http")) {
        // Direct fallback if proxy has an issue
        res = await fetch(`https://apikume.onrender.com${endpoint}`, {
          headers: { Accept: "application/json" },
        });
      }

      if (!res.ok) {
        throw new Error(`Failed to load ${endpoint}: ${res.status}`);
      }

      const data = await res.json();
      sessionPageStore.set(endpoint, data);
      persistCacheToSession();
      return data as T;
    } finally {
      inFlightPromises.delete(endpoint);
    }
  })();

  inFlightPromises.set(endpoint, fetchPromise);
  return fetchPromise;
}

export async function fetchApikumeHome(): Promise<ApikumeHomeResponse> {
  return fetchApikumeEndpoint<ApikumeHomeResponse>("/api/anime");
}

export async function fetchApikumeDetail(id: string): Promise<ApikumeAnimeDetail> {
  return fetchApikumeEndpoint<ApikumeAnimeDetail>(`/api/anime/${id}`);
}

export async function fetchApikumeEpisodes(id: string): Promise<ApikumeEpisodesResponse> {
  return fetchApikumeEndpoint<ApikumeEpisodesResponse>(`/api/anime/episodes/${id}`);
}

export interface ApikumeWatchSource {
  source: string;
  embed?: string;
  hls?: string;
  url?: string;
  video?: string;
  mp4?: string;
  file?: string;
  src?: string;
  type?: string;
  subtitle?: string;
  caption?: string;
  [key: string]: any;
}

export interface ApikumeWatchResponse {
  sub?: ApikumeWatchSource[];
  dub?: ApikumeWatchSource[];
  hindi?: ApikumeWatchSource[];
  tamil?: ApikumeWatchSource[];
  telugu?: ApikumeWatchSource[];
  malayalam?: ApikumeWatchSource[];
  raw?: ApikumeWatchSource[];
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  [key: string]: any;
}

export async function fetchApikumeWatch(
  id: string | number,
  ep: number,
): Promise<ApikumeWatchResponse> {
  return fetchApikumeEndpoint<ApikumeWatchResponse>(`/api/anime/watch/${id}/${ep}`);
}

// Safe no-op prefetch to prevent unwanted rate-limiting triggers on hover
export function prefetchApikumeAnime(_id: string) {
  // No-op: Only load when the user actually clicks to avoid hitting API rate limits
}
