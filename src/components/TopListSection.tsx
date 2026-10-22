import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { ApikumeAnimeItem } from "@/lib/apikume";
import { apikumeTitle } from "@/lib/apikume";
import { getScoreColor, getStatusColor, formatStatus } from "@/lib/utils";

interface Props {
  stacked?: boolean;
  top10?: ApikumeAnimeItem[];
  top10Movies?: ApikumeAnimeItem[];
  isLoading?: boolean;
  type?: "anime" | "manga";
}

export function TopListSection({ stacked = false, top10, top10Movies, isLoading = false }: Props) {
  return (
    <div className={stacked ? "space-y-8" : "grid gap-8 lg:grid-cols-2"}>
      <Column
        title="Top 10 Anime"
        items={top10}
        loading={isLoading || !top10}
        accent="hot"
        limit={10}
      />
      <Column
        title="Top 10 Movies"
        items={top10Movies}
        loading={isLoading || !top10Movies}
        accent="info"
        limit={10}
      />
    </div>
  );
}

function Column({
  title,
  items,
  loading,
  accent,
  limit,
}: {
  title: string;
  items?: ApikumeAnimeItem[];
  loading?: boolean;
  accent: "hot" | "info";
  limit: number;
}) {
  const displayItems = (items ?? []).slice(0, limit);

  return (
    <section>
      <h3 className="section-title mb-4 text-base font-bold tracking-tight text-foreground sm:text-lg">
        {title}
      </h3>

      <div className="space-y-2">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-card/40 p-2"
              >
                <div className="h-7 w-6 skeleton-text rounded" />
                <div className="size-12 rounded-lg skeleton-box shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-3/4 skeleton-text" />
                  <div className="h-3 w-1/3 skeleton-text opacity-70" />
                </div>
              </div>
            ))
          : displayItems.map((item, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              const title = apikumeTitle(item.title);

              return (
                <Link
                  key={`top_sec_${item.anikume_id || "item"}_${idx}`}
                  to="/anime/$id"
                  params={{ id: item.anikume_id }}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-card/40 p-2 transition hover:border-white/15 hover:bg-card/70"
                >
                  <span
                    className={`grid h-7 w-6 shrink-0 place-items-center font-display text-base font-black tabular-nums transition ${
                      isTop3
                        ? accent === "hot"
                          ? "text-primary"
                          : "text-sky-400"
                        : "text-muted-foreground/60 group-hover:text-foreground"
                    }`}
                  >
                    {rank}
                  </span>

                  <img
                    src={item.poster}
                    alt={title}
                    referrerPolicy="no-referrer"
                    decoding="async"
                    loading="lazy"
                    className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold text-foreground transition group-hover:text-primary sm:text-sm">
                      {title}
                    </h4>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="uppercase">{item.format || "TV"}</span>
                      {item.rating != null && (
                        <>
                          <span>•</span>
                          <span
                            className="inline-flex items-center gap-0.5 font-bold"
                            style={{ color: getScoreColor(Number(item.rating) * 10) }}
                          >
                            <Star className="size-3 fill-current" />
                            {Number(item.rating).toFixed(1)}
                          </span>
                        </>
                      )}
                      {item.status && (
                        <>
                          <span>•</span>
                          <span className={getStatusColor(item.status)}>
                            {formatStatus(item.status)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}

export { TopListSection as ApikumeTopListSection };
