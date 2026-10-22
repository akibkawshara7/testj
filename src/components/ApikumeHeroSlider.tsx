import { useEffect, useState } from "react";
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
} from "lucide-react";
import type { ApikumeHeroItem } from "@/lib/apikume";
import { apikumeTitle } from "@/lib/apikume";
import { getScoreColor } from "@/lib/utils";

function statusLabel(s?: string | null) {
  const upper = s?.toUpperCase();
  switch (upper) {
    case "RELEASING":
      return { label: "Releasing", icon: Radio, tone: "text-[#df7426]" };
    case "FINISHED":
      return { label: "Finished", icon: CheckCircle2, tone: "text-green-500" };
    case "UPCOMING":
    case "NOT_YET_RELEASED":
      return { label: "Upcoming", icon: Calendar, tone: "text-red-500" };
    default:
      return { label: s || "Anime", icon: Info, tone: "text-muted-foreground" };
  }
}

export function ApikumeHeroSlider({
  slides = [],
  isLoading = false,
}: {
  slides?: ApikumeHeroItem[];
  isLoading?: boolean;
}) {
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

  const m = slides[i] || slides[0];
  const numRating = m.rating ? parseFloat(String(m.rating)) : null;
  const st = statusLabel(m.status);
  const StatusIcon = st.icon;
  const title = apikumeTitle(m.title);

  return (
    <section className="relative h-[65vh] min-h-[460px] md:h-[72vh] md:min-h-[530px] w-full overflow-hidden bg-background">
      {slides.map((s, idx) => {
        const desktopSrc = s.banner || s.poster;
        const mobileSrc = s.poster || s.banner || "";
        const isCurrent = idx === i;

        return (
          <div
            key={s.anikume_id}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 size-full transition-all duration-700 ease-out ${
              isCurrent ? "scale-100 opacity-100 z-0" : "scale-105 opacity-0 pointer-events-none"
            }`}
          >
            {/* Desktop Banner Backdrop */}
            <div className="hidden md:block size-full relative">
              {/* Subtle ambient backdrop to fill widescreen without aggressive crop */}
              <img
                src={desktopSrc}
                alt=""
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                className="absolute inset-0 size-full object-cover blur-2xl opacity-30 scale-105 pointer-events-none"
              />
              {/* Crisp main banner art aligned nicely to avoid extreme zoom */}
              <img
                src={desktopSrc}
                alt=""
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                onError={(e) => {
                  if (s.poster && e.currentTarget.src !== s.poster) {
                    e.currentTarget.src = s.poster;
                  }
                }}
                className="relative size-full object-cover object-[center_20%] lg:object-[80%_center]"
              />
            </div>

            {/* Mobile Poster Art */}
            <div className="block md:hidden size-full">
              <img
                src={mobileSrc}
                alt=""
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                onError={(e) => {
                  if (s.banner && e.currentTarget.src !== s.banner) {
                    e.currentTarget.src = s.banner;
                  }
                }}
                className="size-full object-cover object-top"
              />
            </div>
          </div>
        );
      })}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent pointer-events-none" />

      {/* Slide Content */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-16 sm:px-6 md:pb-20 z-10">
        <div className="mx-auto max-w-[1500px] flex items-end justify-between gap-8">
          <div className="max-w-2xl duration-300 animate-in fade-in slide-in-from-bottom-6">
            <div className="relative mb-2">
              <h1
                className="relative z-10 w-fit text-xl font-black leading-tight tracking-tight sm:text-2xl md:text-3xl animate-in fade-in max-w-[95%] line-clamp-3 drop-shadow-xl"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--brand, #df7426) 0%, #ffffff 65%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {title}
              </h1>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 ${st.tone}`}
              >
                <StatusIcon className="size-3.5" />
                {st.label}
              </span>
              {numRating != null && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
                  <Star
                    className="size-3"
                    style={{
                      fill: getScoreColor(numRating * 10),
                      color: getScoreColor(numRating * 10),
                    }}
                  />
                  <span style={{ color: getScoreColor(numRating * 10) }}>
                    {numRating.toFixed(1)}
                  </span>
                </span>
              )}
              {m.year && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-muted-foreground">
                  <Calendar className="size-3" />
                  {m.year}
                </span>
              )}
              {m.is_adult && (
                <span className="rounded-md bg-red-600/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  18+
                </span>
              )}
            </div>

            {m.description && (
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground line-clamp-3 drop-shadow-md opacity-80">
                {m.description.replace(/<[^>]*>?/gm, "")}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/anime/$id"
                params={{ id: m.anikume_id }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:scale-[1.02]"
              >
                <Play className="size-4 fill-current" />
                Play Now
              </Link>
              <Link
                to="/anime/$id"
                params={{ id: m.anikume_id }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-foreground backdrop-blur-md transition hover:bg-white/10 hover:scale-[1.02]"
              >
                <Info className="size-4" />
                Details
              </Link>
            </div>
          </div>

          {/* PC Poster Card Showcase (Right Side) */}
          <div className="hidden lg:block shrink-0 mb-4 duration-500 animate-in fade-in">
            <Link
              to="/anime/$id"
              params={{ id: m.anikume_id }}
              className="group block relative w-44 xl:w-52 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={m.poster}
                alt={title}
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="grid size-10 place-items-center rounded-full bg-foreground text-background shadow-lg">
                  <Play className="size-5 fill-current" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Controls / Dots */}
      <div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 flex items-center gap-3 sm:inset-x-6 sm:bottom-5">
        <div className="pointer-events-auto flex min-w-0 flex-1 items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.anikume_id}
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

function HeroSliderSkeleton() {
  return (
    <section className="relative h-[65vh] min-h-[460px] md:h-[72vh] md:min-h-[530px] w-full overflow-hidden bg-card/40 border-b border-white/10">
      <div className="absolute inset-0 skeleton-box" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-16 sm:px-6 md:pb-20 z-10">
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
