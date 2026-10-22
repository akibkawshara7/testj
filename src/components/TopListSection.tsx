import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import {
  fetchPopularMovies,
  fetchTopAnime,
  fetchTopManga,
  fetchTopManhwa,
  prettyFormat,
  titleOf,
  type AnilistMedia,
} from "@/lib/anilist";
import { encodeId } from "@/lib/id-codec";
import { formatScore, formatStatus, getScoreColor, getStatusColor } from "@/lib/utils";

export function TopListSection({
  stacked = false,
  type = "anime",
}: {
  stacked?: boolean;
  type?: "anime" | "manga";
}) {
  const top = useQuery({
    queryKey: [type === "manga" ? "top10Manga" : "top10"],
    queryFn: type === "manga" ? fetchTopManga : fetchTopAnime,
    staleTime: 6e5,
  });
  const secondList = useQuery({
    queryKey: [type === "manga" ? "top10Manhwa" : "movies"],
    queryFn: type === "manga" ? fetchTopManhwa : fetchPopularMovies,
    staleTime: 6e5,
  });

  return (
    <div className={stacked ? "space-y-8" : "grid gap-8 lg:grid-cols-2"}>
      <Column
        title={type === "manga" ? "Top 10 Manga" : "Top 10 Anime"}
        items={top.data}
        loading={top.isLoading}
        accent="hot"
        limit={10}
        type={type}
      />
      <Column
        title={type === "manga" ? "Top 10 Manhwa" : "Top 10 Movies"}
        items={secondList.data}
        loading={secondList.isLoading}
        accent="info"
        limit={10}
        type={type}
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
  type,
}: {
  title: string;
  items: AnilistMedia[] | undefined;
  loading: boolean;
  accent: "hot" | "info";
  limit: number;
  type: "anime" | "manga";
}) {
  return (
    <div className="duration-300 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="section-title mb-4">{title}</h2>
      <ul className="space-y-2 rounded-2xl border border-white/5 bg-card/30 p-3">
        {loading
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
          : items?.slice(0, limit).map((m, i) => (
              <li key={m.id} className="min-w-0">
                <Row media={m} index={i + 1} accent={accent} type={type} />
              </li>
            ))}
      </ul>
    </div>
  );
}

function Row({
  media,
  index,
  accent,
  type,
}: {
  media: AnilistMedia;
  index: number;
  accent: "hot" | "info";
  type: "anime" | "manga";
}) {
  const score = media.averageScore ?? media.meanScore;
  const numberColor =
    index <= 3
      ? accent === "hot"
        ? "text-[var(--hot)]"
        : "text-[var(--info)]"
      : "text-muted-foreground/60";

  return (
    <Link
      to={type === "manga" ? "/manga/$id" : "/anime/$id"}
      params={{ id: encodeId(media.id, type) }}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-card/40 p-2 pr-3 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-card"
    >
      <span
        className={`grid w-8 shrink-0 place-items-center text-2xl font-black tabular-nums ${numberColor} sm:text-3xl`}
      >
        {index}
      </span>
      <img
        src={media.coverImage.large}
        alt={titleOf(media)}
        loading="lazy"
        className="size-14 shrink-0 rounded-lg object-cover ring-1 ring-white/5 sm:size-16"
      />
      <div className="min-w-0 flex-1 pr-1">
        <h3 className="block w-full truncate text-sm font-bold text-foreground transition group-hover:text-primary">
          {titleOf(media)}
        </h3>
        <div className="mt-1 flex min-w-0 items-center gap-x-2 gap-y-0.5 overflow-hidden text-[11px] font-semibold text-muted-foreground">
          {score != null ? (
            <>
              <span
                className="inline-flex shrink-0 items-center gap-1 font-bold"
                style={{ color: getScoreColor(score) }}
              >
                <Star className="size-3 fill-current" />
                {formatScore(score)}
              </span>
              <span aria-hidden className="shrink-0">
                •
              </span>
            </>
          ) : null}
          <span className="shrink-0 uppercase tracking-wide">{prettyFormat(media)}</span>
          {media.status ? (
            <>
              <span aria-hidden className="shrink-0">
                •
              </span>
              <span
                className={`shrink-0 truncate font-bold uppercase tracking-wide ${getStatusColor(media.status)}`}
              >
                {formatStatus(media.status)}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
