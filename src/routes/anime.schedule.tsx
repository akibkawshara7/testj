import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Clock, Play } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchSchedule } from "@/lib/anilist";
import { titleOf } from "@/lib/anilist";

import { UniversalClock } from "@/components/UniversalClock";

export const Route = createFileRoute("/anime/schedule")({
  head: () => ({
    meta: [
      { title: "Anime Schedule · AniKume" },
      { name: "description", content: "Check out the anime airing schedule." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { startUnix, endUnix } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return {
      startUnix: Math.floor(start.getTime() / 1000),
      endUnix: Math.floor(end.getTime() / 1000),
    };
  }, [selectedDate]);

  const { data, isLoading } = useQuery({
    queryKey: ["schedule", startUnix, endUnix],
    queryFn: async () => {
      const res = await fetchSchedule(startUnix, endUnix, 1);
      return res.items;
    },
    staleTime: 1000 * 60 * 10,
  });

  const isToday = isSameDay(selectedDate, new Date());
  const dayName = format(selectedDate, "EEEE");
  const dateFormatted = isToday ? "Today" : format(selectedDate, "MMM d");
  const episodeCount = data?.length ?? 0;

  return (
    <>
      <style>{`
        .rdp-root {
          --rdp-accent-color: white !important;
        }
      `}</style>
      <div className="min-h-screen pt-[12vh] pb-32 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Header />
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarIcon className="size-4" />
              Weekly Schedule
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-white drop-shadow-md">
              Anime Schedule
            </h1>
            <p className="text-muted-foreground text-sm">
              New episodes airing this week — pick a day below.
            </p>
            <UniversalClock />
          </div>

          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.target.value) {
                // Parse it as local time to avoid timezone shifts
                const [y, m, d] = e.target.value.split("-").map(Number);
                setSelectedDate(new Date(y, m - 1, d));
              }
            }}
            className="flex items-center gap-4 bg-card hover:bg-white/5 border border-white/5 rounded-xl px-4 py-3 sm:px-5 transition-colors text-left min-w-0 sm:min-w-[200px] shadow-lg text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            {dayName} <span className="text-muted-foreground">•</span> {dateFormatted}
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground shrink-0">
            {isLoading ? "..." : episodeCount} eps
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-full">
                <div className="w-full rounded-xl skeleton-box" style={{ paddingBottom: "140%" }} />
                <div className="mt-2.5 h-3.5 w-3/4 skeleton-text" />
                <div className="mt-1 h-3 w-1/2 skeleton-text opacity-70" />
              </div>
            ))}
          </div>
        ) : episodeCount === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <CalendarIcon className="size-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No episodes scheduled for {dateFormatted}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-5">
            {data
              ?.filter((item) => item.media)
              .map((item) => (
                <div
                  key={item.id}
                  className="group block shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className="relative w-full overflow-hidden rounded-lg bg-card ring-1 ring-white/5 shadow-lg transition group-hover:ring-primary/60"
                    style={{ paddingBottom: "140%" }}
                  >
                    <img
                      src={item.media.coverImage.large}
                      alt={titleOf(item.media)}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 block size-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                    />

                    {/* Badges Overlay */}
                    <div className="absolute inset-x-0 top-0 p-1.5 sm:p-2 flex flex-col items-start gap-1 sm:gap-1.5">
                      <span className="rounded bg-black/80 px-1 py-0.5 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[10px] font-bold text-white shadow backdrop-blur-md leading-none">
                        Ep {item.episode}
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1 rounded bg-black/80 px-1 py-0.5 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[10px] font-bold text-white shadow backdrop-blur-md leading-none">
                        <Clock className="size-2 sm:size-2.5" />
                        {format(new Date(item.airingAt * 1000), "h:mm a")}
                      </span>
                      <span
                        className={`rounded px-1 py-0.5 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[10px] font-bold shadow backdrop-blur-md uppercase tracking-wider leading-none ${
                          item.timeUntilAiring > 0
                            ? "bg-white/10 text-white"
                            : "bg-primary/80 text-white"
                        }`}
                      >
                        {item.timeUntilAiring > 0 ? "Soon" : "Aired"}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <h3 className="mt-2 sm:mt-3 line-clamp-2 text-[11px] sm:text-sm font-semibold leading-snug text-foreground/90 group-hover:text-foreground">
                    {titleOf(item.media)}
                  </h3>
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
