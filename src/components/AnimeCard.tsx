import { Link } from "@tanstack/react-router";
import { Play, BookOpen } from "lucide-react";
import { prettyFormat, titleOf, type AnilistMedia } from "@/lib/anilist";
import { encodeId } from "@/lib/id-codec";
import { getStatusBgColor } from "@/lib/utils";

type Props = {
  media: AnilistMedia;
  /** kept for API compatibility; badges are no longer rendered. */
  badge?: "episode" | "soon" | null;
  type?: "anime" | "manga";
};

export function AnimeCard({ media, type: overrideType }: Props) {
  const isManga =
    overrideType === "manga" ||
    media.format === "MANGA" ||
    media.format === "NOVEL" ||
    media.format === "ONE_SHOT";

  const isAdultTag =
    media.isAdult ||
    (media.genres || []).some((g) => g.toLowerCase() === "hentai" || g.toLowerCase() === "adult");

  const statusColor = getStatusBgColor(media.status);

  return (
    <Link
      to={isManga ? "/manga/$id" : "/anime/$id"}
      params={{ id: encodeId(media.id, isManga ? "manga" : "anime") }}
      className="group block w-[130px] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1 sm:w-[165px] lg:w-[190px]"
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-card ring-1 ring-white/5 shadow-lg transition group-hover:ring-primary/60"
        style={{ paddingBottom: "140%" }}
      >
        <img
          src={media.coverImage.large}
          alt={titleOf(media)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 block size-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {isAdultTag && (
          <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-md bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            18+
          </span>
        )}

        <span className="absolute bottom-2 right-2 grid size-9 translate-y-2 place-items-center rounded-full bg-foreground text-background opacity-0 shadow-[var(--shadow-glow)] transition group-hover:translate-y-0 group-hover:opacity-100">
          {isManga ? <BookOpen className="size-4" /> : <Play className="size-4 fill-current" />}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className={`size-2 shrink-0 rounded-full ${statusColor}`} />
        <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-foreground/90 group-hover:text-foreground">
          {titleOf(media)}
        </h3>
      </div>
      <p className="mt-0.5 ml-3.5 line-clamp-1 text-[11px] text-muted-foreground">
        {prettyFormat(media)}
      </p>
    </Link>
  );
}
