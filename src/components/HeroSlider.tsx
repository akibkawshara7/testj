import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Star,
  Radio,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { ApikumeHeroItem } from "@/lib/apikume";
import { apikumeTitle } from "@/lib/apikume";
import { getScoreColor } from "@/lib/utils";

function statusLabel(s?: string | null) {
  const upper = s?.toUpperCase();
  switch (upper) {
    case "RELEASING":
      return {
        label: "Releasing",
        icon: Radio,
        tone: "text-[#22c55e]",
        bgDot: "bg-[#22c55e]",
      };
    case "FINISHED":
    case "COMPLETED":
      return {
        label: "Finished",
        icon: CheckCircle2,
        tone: "text-[#3b82f6]",
        bgDot: "bg-[#3b82f6]",
      };
    case "UPCOMING":
    case "NOT_YET_RELEASED":
      return {
        label: "Upcoming",
        icon: Calendar,
        tone: "text-[#ef4444]",
        bgDot: "bg-[#ef4444]",
      };
    default:
      return {
        label: s || "Anime",
        icon: Info,
        tone: "text-muted-foreground",
        bgDot: "bg-muted-foreground",
      };
  }
}

export function HeroSlider({
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
    const id = setInterval(() => {
      setI((p) => (p + 1) % count);
    }, 6000);
    return () => clearInterval(id);
  }, [count]);

  useEffect(() => {
    if (i >= count && count > 0) {
      setI(0);
    }
  }, [count, i]);

  if (isLoading || count === 0) {
    return null;
  }

  const m = slides[i] || slides[0];
  const numRating = m.rating ? parseFloat(String(m.rating)) : null;
  const ratingScore = numRating != null ? numRating * 10 : 85;
  const scoreColor = getScoreColor(ratingScore);
  const st = statusLabel(m.status);
  const StatusIcon = st.icon;
  const title = apikumeTitle(m.title);

  return (
    <section className="relative mx-auto max-w-[1500px] px-2 pt-1 sm:px-4 sm:pt-2">
      {/* Curved Frame Container: increased length/height by 10% */}
      <div className="relative h-[475px] sm:h-[510px] md:h-[565px] lg:h-[590px] w-full overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/10 shadow-2xl bg-black">
        {slides.map((s, idx) => {
          const bannerSrc = s.banner || s.poster || "";
          const mobileSrc = s.poster || s.banner || "";
          const isCurrent = idx === i;

          return (
            <div
              key={`slide_${s.anikume_id || "hero"}_${idx}`}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 size-full transition-opacity duration-500 ease-out ${
                isCurrent ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* PC Backdrop using API banner */}
              <img
                src={bannerSrc}
                alt=""
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                onError={(e) => {
                  if (s.poster && e.currentTarget.src !== s.poster) {
                    e.currentTarget.src = s.poster;
                  }
                }}
                className="hidden md:block size-full object-cover object-center select-none"
              />

              {/* Mobile Art using poster */}
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
                className="block md:hidden size-full object-cover object-top select-none"
              />
            </div>
          );
        })}

        {/* Bottom subtle gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] max-h-[110px] bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />

        {/* MOBILE VIEW */}
        <div className="md:hidden absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end px-4 pb-9 text-center pointer-events-none">
          <div className="max-w-xl mx-auto flex flex-col items-center duration-300 animate-in fade-in slide-in-from-bottom-2 pointer-events-auto">
            {/* Title */}
            <h1 className="text-sm sm:text-base font-bold leading-snug tracking-tight text-white drop-shadow-md max-w-[90%] mx-auto line-clamp-2">
              {title}
            </h1>

            {/* Single Unified Capsule Pill */}
            <div className="mt-2.5 inline-flex items-center justify-center gap-2 rounded-full bg-black/65 border border-white/15 px-3.5 py-1 backdrop-blur-md text-[11px] font-semibold text-white/90 shadow-md">
              <div className="flex items-center gap-1.5">
                <StatusIcon className={`size-3.5 ${st.tone}`} />
                <span className={st.tone}>{st.label}</span>
              </div>

              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-white/80">{m.year || m.format || "TV"}</span>
              <span className="h-3 w-[1px] bg-white/20" />

              <div className="flex items-center gap-1 font-bold" style={{ color: scoreColor }}>
                <Star
                  className="size-3 fill-current"
                  style={{ color: scoreColor, fill: scoreColor }}
                />
                <span style={{ color: scoreColor }}>
                  {numRating != null ? numRating.toFixed(1) : "8.5"}
                </span>
              </div>

              {m.is_adult && (
                <>
                  <span className="h-3 w-[1px] bg-white/20" />
                  <span className="text-red-400 font-bold">18+</span>
                </>
              )}
            </div>

            {/* Action Buttons with active scale tap animation */}
            <div className="mt-3 flex items-center justify-center gap-2.5">
              <Link
                to="/anime/$id"
                params={{ id: m.anikume_id }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-zinc-950 font-bold text-xs px-5 py-2 shadow-lg hover:bg-zinc-200 transition active:scale-95 cursor-pointer"
              >
                <Play className="size-3.5 fill-current ml-0.5" />
                Watch
              </Link>

              <Link
                to="/anime/$id"
                params={{ id: m.anikume_id }}
                aria-label="Details"
                className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md transition active:scale-95 cursor-pointer"
              >
                <Info className="size-4" />
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Left Prev (<) */}
          <button
            aria-label="Previous slide"
            onClick={() => setI((p) => (p - 1 + count) % count)}
            className="pointer-events-auto absolute left-2.5 bottom-2.5 z-20 grid size-7 place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Mobile Bottom Right Next (>) */}
          <button
            aria-label="Next slide"
            onClick={() => setI((p) => (p + 1) % count)}
            className="pointer-events-auto absolute right-2.5 bottom-2.5 z-20 grid size-7 place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition active:scale-90 cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Mobile Minimal Slide Dots */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={`mobdot_${s.anikume_id || "hero"}_${idx}`}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={
                  "h-1 rounded-full transition-all duration-300 " +
                  (idx === i ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60")
                }
              />
            ))}
          </div>
        </div>

        {/* PC VIEW */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 z-10 items-end justify-between px-8 lg:px-12 pb-7 pt-4">
          {/* Left Info Stack */}
          <div className="max-w-xl flex flex-col items-start text-left duration-300 animate-in fade-in">
            <h1 className="text-xl lg:text-2xl font-black leading-tight tracking-tight text-white drop-shadow-lg max-w-lg line-clamp-2">
              {title}
            </h1>

            <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-full bg-black/65 border border-white/15 px-3.5 py-1 backdrop-blur-md text-xs font-semibold text-white/90 shadow-md">
              <div className="flex items-center gap-1.5">
                <StatusIcon className={`size-3.5 ${st.tone}`} />
                <span className={st.tone}>{st.label}</span>
              </div>

              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-white/80">{m.year || m.format || "TV"}</span>
              <span className="h-3 w-[1px] bg-white/20" />

              <div className="flex items-center gap-1 font-bold" style={{ color: scoreColor }}>
                <Star
                  className="size-3 fill-current"
                  style={{ color: scoreColor, fill: scoreColor }}
                />
                <span style={{ color: scoreColor }}>
                  {numRating != null ? numRating.toFixed(1) : "8.5"}
                </span>
              </div>

              {m.is_adult && (
                <>
                  <span className="h-3 w-[1px] bg-white/20" />
                  <span className="text-red-400 font-bold">18+</span>
                </>
              )}
            </div>

            {m.description && (
              <p className="mt-3 text-xs lg:text-sm leading-relaxed text-zinc-300 line-clamp-2 max-w-lg drop-shadow">
                {m.description.replace(/<[^>]*>?/gm, "")}
              </p>
            )}

            {/* PC Action Buttons */}
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/anime/$id"
                params={{ id: m.anikume_id }}
                className="inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 font-bold text-sm px-6 py-2.5 shadow-xl hover:bg-zinc-200 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="size-4 fill-current ml-0.5" />
                Watch
              </Link>

              <Link
                to="/anime/$id"
                params={{ id: m.anikume_id }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Info className="size-4" />
                Details
              </Link>
            </div>
          </div>

          {/* Right Side: Anime Cover Card */}
          <div className="flex flex-col items-center shrink-0 w-36 lg:w-44 duration-300 animate-in fade-in">
            <Link
              to="/anime/$id"
              params={{ id: m.anikume_id }}
              className="group block relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none"
            >
              <div className="size-full">
                <img
                  src={m.poster}
                  alt={title}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  loading="eager"
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="grid size-9 place-items-center rounded-full bg-white text-black shadow-lg">
                  <Play className="size-4 fill-current ml-0.5" />
                </span>
              </div>
            </Link>

            {/* Controls Below Cover */}
            <div className="mt-2.5 flex items-center justify-between w-full px-1 text-white">
              <button
                aria-label="Previous slide"
                onClick={() => setI((p) => (p - 1 + count) % count)}
                className="grid size-7 place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={`pcdot_${s.anikume_id || "hero"}_${idx}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setI(idx)}
                    className={
                      "h-1.5 rounded-full transition-all duration-300 " +
                      (idx === i ? "w-5 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60")
                    }
                  />
                ))}
              </div>

              <button
                aria-label="Next slide"
                onClick={() => setI((p) => (p + 1) % count)}
                className="grid size-7 place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSlider as ApikumeHeroSlider };
