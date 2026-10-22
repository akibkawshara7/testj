import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Star,
  Calendar,
  Radio,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { fetchHero, fetchHeroManga, stripHtml, titleOf, type AnilistMedia } from "@/lib/anilist";
import { encodeId } from "@/lib/id-codec";
import { getScoreColor, formatScore } from "@/lib/utils";

function statusLabel(s?: string | null) {
  switch (s) {
    case "RELEASING":
      return { label: "Releasing", icon: Radio, tone: "text-[#df7426]" };
    case "FINISHED":
      return { label: "Finished", icon: CheckCircle2, tone: "text-green-500" };
    case "NOT_YET_RELEASED":
      return { label: "Upcoming", icon: Calendar, tone: "text-red-500" };
    case "CANCELLED":
      return { label: "Cancelled", icon: Info, tone: "text-red-600" };
    case "HIATUS":
      return { label: "On Hiatus", icon: Info, tone: "text-yellow-500" };
    default:
      return { label: "Anime", icon: Info, tone: "text-muted-foreground" };
  }
}

export function HeroSlider({ type = "anime" }: { type?: "anime" | "manga" }) {
  const fetchFn = type === "anime" ? fetchHero : fetchHeroManga;
  const { data, isLoading } = useQuery({
    queryKey: ["hero", type],
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 10,
  });

  const slides = (data ?? []).slice(0, 6);

  const [i, setI] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % count), 7000);
    return () => clearInterval(id);
  }, [count]);

  if (isLoading || count === 0) {
    return <HeroSliderSkeleton />;
  }

  const m = slides[i];

  return (
    <section className="relative h-[65vh] min-h-[460px] md:h-[72vh] md:min-h-[530px] w-full overflow-hidden">
      {slides.map((s, idx) => {
        const desktopSrc = s.bannerImage ?? s.coverImage.extraLarge;
        const mobileSrc = s.coverImage.extraLarge ?? s.bannerImage ?? "";
        return (
          <picture key={s.id} aria-hidden={idx !== i}>
            <source media="(min-width: 768px)" srcSet={desktopSrc} />
            <img
              src={mobileSrc}
              alt=""
              className={
                "absolute inset-0 size-full object-cover transition-all duration-700 ease-out " +
                (idx === i ? "scale-100 opacity-100" : "scale-105 opacity-0")
              }
            />
          </picture>
        );
      })}

      {/* Subtle gradient — preserves banner brightness, just fades to bg at bottom/left */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-16 sm:px-6 md:pb-20">
        <div className="mx-auto max-w-[1500px]">
          <SlideContent key={m.id} m={m} type={type} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-3 z-10 flex items-center gap-3 sm:inset-x-6 sm:bottom-5">
        <div className="pointer-events-auto flex min-w-0 flex-1 items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={
                "h-1 rounded-full transition-all duration-300 " +
                (idx === i ? "w-6 bg-foreground" : "w-3 bg-foreground/30 hover:bg-foreground/60")
              }
            />
          ))}
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="tabular-nums">
            <span className="text-foreground">{i + 1}</span>/{count}
          </span>
          <button
            aria-label="Previous"
            onClick={() => setI((p) => (p - 1 + count) % count)}
            className="grid size-8 place-items-center rounded-full bg-black/60 text-foreground transition hover:bg-white/10"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setI((p) => (p + 1) % count)}
            className="grid size-8 place-items-center rounded-full bg-black/60 text-foreground transition hover:bg-white/10"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SlideContent({ m, type }: { m: AnilistMedia; type: "anime" | "manga" }) {
  const score = m.averageScore ?? m.meanScore;
  const st = statusLabel(m.status);
  const StatusIcon = st.icon;
  const imageSrc = m.bannerImage ?? m.coverImage.extraLarge ?? "";
  const filterId = `displacement-${m.id}`;

  const continueWatchingItem = useMemo(() => {
    try {
      const raw = localStorage.getItem("continue_watching_list");
      if (raw) {
        const list = JSON.parse(raw);
        return list.find((item: any) => item.animeId === m.id);
      }
    } catch {}
    return null;
  }, [m.id]);

  const titleColor = m.coverImage?.color || "var(--brand, #df7426)";

  return (
    <div className="max-w-2xl duration-300 animate-in fade-in slide-in-from-bottom-6">
      <div className="relative mb-2">
        <h1
          className="relative z-10 w-fit text-xl font-black leading-tight tracking-tight sm:text-2xl md:text-3xl animate-in fade-in max-w-[95%] line-clamp-3 drop-shadow-xl"
          style={{
            backgroundImage: `linear-gradient(to right, ${titleColor} 0%, #ffffff 55%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {titleOf(m)}
        </h1>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 ${st.tone}`}
        >
          <StatusIcon className="size-3.5" />
          {st.label}
        </span>
        {score != null && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
            <Star
              className="size-3"
              style={{ fill: getScoreColor(score), color: getScoreColor(score) }}
            />
            <span style={{ color: getScoreColor(score) }}>{formatScore(score)}</span>
          </span>
        )}
        {m.startDate.year && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-muted-foreground">
            <Calendar className="size-3" />
            {m.startDate.year}
          </span>
        )}
      </div>

      {m.description && (
        <p
          className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground line-clamp-3 sm:text-sm drop-shadow-md opacity-80"
          dangerouslySetInnerHTML={{ __html: m.description }}
        />
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {continueWatchingItem ? (
          <Link
            to={type === "anime" ? "/anime/watch/$id" : "/manga/read/$id"}
            params={{ id: encodeId(m.id, type) }}
            hash={String(continueWatchingItem.episodeNum)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:scale-[1.02]"
          >
            {type === "anime" ? (
              <Play className="size-4 fill-current" />
            ) : (
              <BookOpen className="size-4" />
            )}
            {type === "anime"
              ? `Continue Ep ${continueWatchingItem.episodeNum}`
              : `Continue Ch ${continueWatchingItem.episodeNum}`}
          </Link>
        ) : (
          <Link
            to={type === "anime" ? "/anime/watch/$id" : "/manga/read/$id"}
            params={{ id: encodeId(m.id, type) }}
            hash="1"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:scale-[1.02]"
          >
            {type === "anime" ? (
              <Play className="size-4 fill-current" />
            ) : (
              <BookOpen className="size-4" />
            )}
            {type === "anime" ? "Play Now" : "Read Now"}
          </Link>
        )}
        <Link
          to={type === "anime" ? "/anime/$id" : "/manga/$id"}
          params={{ id: encodeId(m.id, type) }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-foreground backdrop-blur-md transition hover:bg-white/10 hover:scale-[1.02]"
        >
          <Info className="size-4" />
          Details
        </Link>
      </div>
    </div>
  );
}

function HeroSliderSkeleton() {
  return (
    <section className="relative h-[65vh] min-h-[460px] md:h-[72vh] md:min-h-[530px] w-full overflow-hidden bg-card/40 border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-16 sm:px-6 md:pb-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 md:h-12 w-3/4 skeleton-text" />
            <div className="flex gap-2">
              <div className="h-6 w-20 skeleton-text" />
              <div className="h-6 w-14 skeleton-text" />
              <div className="h-6 w-16 skeleton-text" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full skeleton-text" />
              <div className="h-4 w-5/6 skeleton-text" />
              <div className="h-4 w-2/3 skeleton-text opacity-70" />
            </div>
            <div className="flex gap-3 pt-3">
              <div className="h-11 w-32 rounded-full skeleton-box" />
              <div className="h-11 w-28 rounded-full skeleton-box" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
