import { useEffect } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAniZipFull } from "@/lib/anizip";
import { CachedImage } from "./CachedImage";

// AniDB favicon as base64 PNG (provided by user)
const ANIDB_FAVICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAeFBMVEVHcExbaYxlbYqChpOysrCDh5cPKXCFeX+Vl592e5F4hqJ+hJubnKNycIaZocBITF8mLUWrq6x0eIkvOVamp6k5RWMdJ0E+Q1ZOU2sdLUxbXXD///+wgV+NcWiceWVuYWbdkkHWj0XAh1a5hVqBiJqXeW5jdph5b3v7nsUjAAAAKHRSTlMARYP+/9QStv+pLjr/WxX///////////////8C//////////9OzGeXOsbzzwAAAQZJREFUeAFioDIAFDdfWRKCQABFzTkUIrSYKEyz/x0O0Dl99zMV56q4nvsd/SC8LyLd4zNO0otkuV8URRK6WZmY0jwLizDLjFU1GCRBA7QlRUsI475e1BZPAKzrmiDR2FKRBL1BXg9n9AMdMUgov6FjkQWk7xuL7RueAuL7/pcvoWkJIe0jkjsCtQE8XjcUJg46cR1v2I+miWmb7TjXN+QSlUJE1YFYUKeX7AFXxtiIqxArSsY6hZI/oADeITKDlGrsnhEYYi1WpUM1CfiI6zguuNAn5LxHZX7bc07tnsMVFynlgqPQOEk5WXRM27ajbfW2Y1Xn8dg251y5m/4yPcZ2TF3nV/0DyWMnW5ge9ioAAAAASUVORK5CYII=";

type Mapping = {
  label: string;
  href: string;
  favicon: string;
};

function buildMappings(mappings: Record<string, string | number | null> | undefined): Mapping[] {
  if (!mappings) return [];
  const out: Mapping[] = [];
  if (mappings.anilist_id) {
    out.push({
      label: "AniList",
      href: `https://anilist.co/anime/${mappings.anilist_id}`,
      favicon:
        "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://anilist.co&size=128",
    });
  }
  if (mappings.mal_id) {
    out.push({
      label: "MyAnimeList",
      href: `https://myanimelist.net/anime/${mappings.mal_id}`,
      favicon: "https://cdn.myanimelist.net/images/favicon.ico",
    });
  }
  if (mappings.animeplanet_id) {
    out.push({
      label: "Anime-Planet",
      href: `https://www.anime-planet.com/anime/${mappings.animeplanet_id}`,
      favicon: "https://www.anime-planet.com/favicon.ico",
    });
  }
  if (mappings.anidb_id) {
    out.push({
      label: "AniDB",
      href: `https://anidb.net/anime/${mappings.anidb_id}`,
      favicon: ANIDB_FAVICON,
    });
  }
  if (mappings.anisearch_id) {
    out.push({
      label: "AniSearch",
      href: `https://www.anisearch.com/anime/${mappings.anisearch_id}`,
      favicon: "https://www.anisearch.com/favicon.ico",
    });
  }
  if (mappings.livechart_id) {
    out.push({
      label: "LiveChart",
      href: `https://www.livechart.me/anime/${mappings.livechart_id}`,
      favicon: "https://www.livechart.me/favicon.ico",
    });
  }
  if (mappings.kitsu_id) {
    out.push({
      label: "Kitsu",
      href: `https://kitsu.app/anime/${mappings.kitsu_id}`,
      favicon: "https://kitsu.io/favicon.ico",
    });
  }
  return out;
}

// Skeleton placeholder for each link card
function LinkSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-card/40 p-3">
      <div className="size-10 animate-pulse rounded-full bg-white/10" />
      <div className="h-3 w-14 animate-pulse rounded-full bg-white/10" />
    </div>
  );
}

export function LinksPopup({
  open,
  onClose,
  anilistId,
  extraLinks = [],
  isManga = false,
}: {
  open: boolean;
  onClose: () => void;
  anilistId: number | string;
  extraLinks?: any[];
  isManga?: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["anizip-full", anilistId],
    queryFn: () => (typeof anilistId === "number" && !isManga ? fetchAniZipFull(anilistId) : null),
    enabled: typeof anilistId === "number" && !isManga,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const baseItems = buildMappings(
    data?.mappings as Record<string, string | number | null> | undefined,
  );
  const items = [...baseItems];

  extraLinks.forEach((l) => {
    const displayLabel = l.site.replace(/\.[a-z]+$/i, "");
    const cleanLabel = displayLabel
      .toLowerCase()
      .replace(".co", "")
      .replace(".net", "")
      .replace(".com", "")
      .replace(".io", "");
    if (
      !items.some(
        (i) =>
          i.label.toLowerCase().includes(cleanLabel) || cleanLabel.includes(i.label.toLowerCase()),
      )
    ) {
      items.push({ label: displayLabel, href: l.url, favicon: l.icon });
    }
  });

  const showSkeleton = isLoading || (!data && items.length === 0);

  return (
    <div
      className="fixed inset-0 z-[150] grid place-items-center bg-black/70 p-4 backdrop-blur-sm duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl duration-300 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            External Links
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full bg-white/5 text-foreground/80 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-5">
          {showSkeleton ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/5 bg-card/40 p-2"
                >
                  <div className="size-8 animate-pulse rounded-full bg-white/10" />
                  <div className="h-2.5 w-12 animate-pulse rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((it) => (
                <a
                  key={it.label}
                  href={it.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/5 bg-card/40 p-2 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-card"
                >
                  <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                    <CachedImage src={it.favicon} alt="" className="size-5 object-contain" />
                  </span>
                  <span className="w-full truncate text-center text-[11px] font-bold text-foreground/90 group-hover:text-foreground">
                    {it.label}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
