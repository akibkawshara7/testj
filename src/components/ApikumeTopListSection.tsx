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

export function TopListSection({
  stacked = false,
  top10,
  top10Movies,
  isLoading = false,
}: Props) {
  // Remove skeleton loader completely
  if (isLoading || (!top10 && !top10Movies)) {
    return null;
  }

  return (
    <div className={stacked ? "space-y-8" : "grid gap-8 lg:grid-cols-2"}>
      {top10 && top10.length > 0 && (
        <TopColumn
          title="Top 10 Anime"
          items={top10}
          accent="hot"
          limit={10}
        />
      )}
      {top10Movies && top10Movies.length > 0 && (
        <TopColumn
          title="Top 10 Movies"
          items={top10Movies}
          accent="info"
          limit={10}
        />
      )}
    </div>
  );
}

function TopColumn({
  title,
  items,
  accent,
  limit,
}: {
  title: string;
  items: ApikumeAnimeItem[];
  accent: "hot" | "info";
  limit: number;
}) {
  return (
    <div>
      <h2 className="section-title mb-4">{title}</h2>
      <ul className="space-y-2 rounded-2xl border border-white/5 bg-card/30 p-3">
        {items.slice(0, limit).map((m, i) => (
          <li key={`top_${m.anikume_id || "item"}_${i}`} className="min-w-0">
            <TopRowItem item={m} index={i + 1} accent={accent} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopRowItem({
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
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-card/40 p-2 pr-3 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-card active:scale-[0.98] cursor-pointer select-none"
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

export { TopListSection as ApikumeTopListSection };
