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
}

export function ApikumeTopListSection({
  stacked = false,
  top10,
  top10Movies,
  isLoading = false,
}: Props) {
  return (
    <div className={stacked ? "space-y-8" : "grid gap-8 lg:grid-cols-2"}>
      <ApikumeColumn
        title="Top 10 Anime"
        items={top10}
        loading={isLoading || !top10}
        accent="hot"
        limit={10}
      />
      <ApikumeColumn
        title="Top 10 Movies"
        items={top10Movies}
        loading={isLoading || !top10Movies}
        accent="info"
        limit={10}
      />
    </div>
  );
}

function ApikumeColumn({
  title,
  items,
  loading,
  accent,
  limit,
}: {
  title: string;
  items: ApikumeAnimeItem[] | undefined;
  loading: boolean;
  accent: "hot" | "info";
  limit: number;
}) {
  return (
    <div className="duration-300 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="section-title mb-4">{title}</h2>
      <ul className="space-y-2 rounded-2xl border border-white/5 bg-card/30 p-3">
        {loading || !items
          ? Array.from({ length: limit }).map((_, i) => (
              <li
                key={i}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-card/40 p-2 pr-3"
              >
                <span className="grid w-8 shrink-0 place-items-center text-xl font-black text-muted-foreground/40 sm:text-2xl">
                  {i + 1}
                </span>
                <div className="size-14 shrink-0 rounded-lg skeleton-box sm:size-16" />
                <div className="min-w-0 flex-1 space-y-2 pr-1">
                  <div className="h-4 w-3/4 skeleton-text" />
                  <div className="h-3 w-1/3 skeleton-text opacity-70" />
                </div>
              </li>
            ))
          : items.slice(0, limit).map((m, i) => (
              <li key={m.anikume_id} className="min-w-0">
                <ApikumeRow item={m} index={i + 1} accent={accent} />
              </li>
            ))}
      </ul>
    </div>
  );
}

function ApikumeRow({
  item,
  index,
  accent,
}: {
  item: ApikumeAnimeItem;
  index: number;
  accent: "hot" | "info";
}) {
  const score = item.rating ? parseFloat(String(item.rating)) : null;
  const numberColor =
    index <= 3
      ? accent === "hot"
        ? "text-[var(--hot)]"
        : "text-[var(--info)]"
      : "text-muted-foreground/60";
  const title = apikumeTitle(item.title);

  return (
    <Link
      to="/anime/$id"
      params={{ id: item.anikume_id }}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-card/40 p-2 pr-3 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-card"
    >
      <span
        className={`grid w-8 shrink-0 place-items-center text-2xl font-black tabular-nums ${numberColor} sm:text-3xl`}
      >
        {index}
      </span>
      <div className="size-14 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/5 sm:size-16">
        <img
          src={item.poster}
          alt={title}
          referrerPolicy="no-referrer"
          decoding="async"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 pr-1">
        <h3 className="block w-full truncate text-sm font-bold text-foreground transition group-hover:text-primary">
          {title}
        </h3>
        <div className="mt-1 flex min-w-0 items-center gap-x-2 gap-y-0.5 overflow-hidden text-[11px] font-semibold text-muted-foreground">
          {score != null ? (
            <>
              <span
                className="inline-flex shrink-0 items-center gap-1 font-bold"
                style={{ color: getScoreColor(score * 10) }}
              >
                <Star className="size-3 fill-current" />
                {score.toFixed(1)}
              </span>
              <span aria-hidden className="shrink-0">
                •
              </span>
            </>
          ) : null}
          <span className="shrink-0 uppercase tracking-wide">{item.format || "TV"}</span>
          {item.status ? (
            <>
              <span aria-hidden className="shrink-0">
                •
              </span>
              <span
                className={`shrink-0 truncate font-bold uppercase tracking-wide ${getStatusColor(item.status)}`}
              >
                {formatStatus(item.status)}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
