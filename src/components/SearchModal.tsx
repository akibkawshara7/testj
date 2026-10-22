import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Star } from "lucide-react";
import { titleOf, prettyFormat, searchAnime } from "@/lib/anilist";
import { encodeId } from "@/lib/id-codec";
import { formatScore, formatStatus, getScoreColor, getStatusColor } from "@/lib/utils";
import { fetchApikumeEndpoint } from "@/lib/apikume";
import { usePosterTransition } from "@/lib/shared-poster-transition";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchModal({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { startPosterTransition } = usePosterTransition();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setDebounced("");
    }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 700);
    return () => clearTimeout(t);
  }, [q]);

  const isTyping = q !== debounced;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const { data: results, isFetching } = useQuery({
    queryKey: ["search-modal", debounced],
    queryFn: async () => {
      try {
        const res = await fetchApikumeEndpoint(
          `/api/anime/search?q=${encodeURIComponent(debounced)}`,
        );
        const items = Array.isArray(res) ? res : res?.results || [];
        if (items.length > 0) return items;
      } catch {}
      return searchAnime(debounced);
    },
    enabled: debounced.trim().length > 0,
    staleTime: 60_000,
  });

  if (!open) return null;

  const submit = () => {
    const term = q.trim();
    onClose();
    navigate({
      to: "/anime/browse",
      search: term ? { search: term } : {},
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-md duration-150 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl duration-150 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            For quick access:
            <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-foreground">
              CTRL
            </kbd>
            <span>+</span>
            <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-foreground">
              K
            </kbd>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition hover:bg-white/10"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Search Anime..."
            className="flex-1 bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </div>

        {(debounced || isTyping) && (
          <div className="max-h-[55vh] overflow-y-auto border-t border-white/5">
            {(isFetching || isTyping) && (
              <div className="space-y-2 p-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[72px] animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            )}
            {results?.length === 0 && !isFetching && !isTyping && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No anime matches “{debounced}”. Press Enter to browse.
              </p>
            )}
            {!isTyping && (
              <ul className="divide-y divide-white/5">
                {results?.map((m: any) => {
                  const isAdultTag =
                    m.is_adult ||
                    m.isAdult ||
                    (m.genres || []).some(
                      (g: string) => g.toLowerCase() === "hentai" || g.toLowerCase() === "adult",
                    );
                  let scoreDisplay: string | null = null;
                  let scoreColor: string | null = null;

                  const rawScore = m.rating ?? m.score ?? m.averageScore ?? m.meanScore;
                  if (rawScore != null && rawScore !== "" && rawScore !== "N/A") {
                    const num = parseFloat(String(rawScore).replace(/[^0-9.]/g, ""));
                    if (!isNaN(num) && num > 0) {
                      const val = num > 10 ? num / 10 : num;
                      scoreDisplay = val.toFixed(1);
                      scoreColor = getScoreColor(val * 10);
                    }
                  }

                  const mId = m.anikume_id || m.id;
                  const mTitle = titleOf(m);
                  const posterSrc =
                    m.poster || m.coverImage?.large || m.coverImage?.extraLarge || "";

                  const handleItemClick = (e: React.MouseEvent) => {
                    onClose();
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    const el = e.currentTarget.querySelector("img") as HTMLElement;
                    const targetUrl = `/anime/${encodeId(mId, "anime")}`;
                    if (el) {
                      startPosterTransition({
                        id: mId,
                        poster: posterSrc,
                        element: el,
                        targetUrl,
                      });
                    } else {
                      navigate({
                        to: "/anime/$id",
                        params: { id: encodeId(mId, "anime") },
                      });
                    }
                  };

                  return (
                    <li key={mId}>
                      <Link
                        to="/anime/$id"
                        params={{ id: encodeId(mId, "anime") }}
                        onClick={handleItemClick}
                        className="group flex items-center gap-3 px-3 py-2.5 transition hover:bg-white/5 active:scale-[0.99]"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={posterSrc}
                            alt=""
                            className="size-14 rounded-md object-cover ring-1 ring-white/10"
                          />
                          {isAdultTag && (
                            <span className="pointer-events-none absolute -right-1 -top-1 z-10 rounded-md bg-red-600/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white backdrop-blur">
                              18+
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pr-1">
                          <p className="truncate text-sm font-bold text-foreground transition group-hover:text-primary">
                            {mTitle}
                          </p>
                          <div className="mt-1 flex min-w-0 items-center gap-x-2 gap-y-0.5 overflow-hidden text-[11px] font-semibold text-muted-foreground">
                            {scoreDisplay && scoreColor ? (
                              <>
                                <span
                                  className="inline-flex shrink-0 items-center gap-1 font-bold"
                                  style={{ color: scoreColor }}
                                >
                                  <Star className="size-3 fill-current" />
                                  {scoreDisplay}
                                </span>
                                <span aria-hidden className="shrink-0">
                                  •
                                </span>
                              </>
                            ) : null}
                            <span className="shrink-0 uppercase tracking-wide">
                              {m.format || prettyFormat(m) || "—"}
                            </span>
                            {(m.episodes != null || m.latestEpisode != null) && (
                              <>
                                <span aria-hidden className="shrink-0">
                                  •
                                </span>
                                <span className="shrink-0 uppercase tracking-wide">
                                  {m.episodes || m.latestEpisode} {m.episodes === 1 ? "EP" : "EPS"}
                                </span>
                              </>
                            )}
                            {m.status ? (
                              <>
                                <span aria-hidden className="shrink-0">
                                  •
                                </span>
                                <span
                                  className={`shrink-0 truncate font-bold uppercase tracking-wide ${getStatusColor(
                                    m.status,
                                  )}`}
                                >
                                  {formatStatus(m.status)}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function useSearchHotkey(open: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
}
