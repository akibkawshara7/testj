import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { AnilistMedia } from "@/lib/anilist";
import { AnimeCard } from "./AnimeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type Props = {
  title: string;
  queryKey: string;
  fetcher: () => Promise<AnilistMedia[]>;
  viewAllSearch?: Record<string, string | number>;
  type?: "anime" | "manga";
};

export function AnimeRow({ title, queryKey, fetcher, viewAllSearch, type = "anime" }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <AnimeRowShell
      title={title}
      titleHref={{
        to: type === "manga" ? "/manga/browse" : "/anime/browse",
        search: viewAllSearch ?? {},
      }}
    >
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[130px] shrink-0 sm:w-[165px] lg:w-[190px]">
              <div className="w-full rounded-xl skeleton-box" style={{ paddingBottom: "140%" }} />
              <div className="mt-3 h-4 w-3/4 skeleton-text" />
              <div className="mt-1.5 h-3 w-1/2 skeleton-text opacity-70" />
            </div>
          ))
        : data?.map((m) => <AnimeCard key={m.id} media={m} type={type} />)}
    </AnimeRowShell>
  );
}

/**
 * Shared row shell — used by AnimeRow and the related/recommendations rows on
 * the details page so both get identical feather + chevron + slide behavior.
 */
export function AnimeRowShell({
  title,
  titleHref,
  children,
}: {
  title?: string;
  titleHref?: { to: string; search?: Record<string, string | number> };
  children: React.ReactNode;
}) {
  const HeadingTag: React.ElementType = titleHref ? Link : "div";
  const headingProps = titleHref ? { to: titleHref.to, search: titleHref.search ?? {} } : {};

  const [api, setApi] = React.useState<any>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const updateScrollState = () => {
      const progress = api.scrollProgress();
      setCanScrollPrev(progress > 0.001);
      setCanScrollNext(progress < 0.999);
    };
    updateScrollState();
    api.on("select", updateScrollState);
    api.on("scroll", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("scroll", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  return (
    <section className="pt-8 duration-300 animate-in fade-in slide-in-from-bottom-4">
      {title && (
        <div className="mb-3 flex items-center gap-2 px-1">
          <HeadingTag
            {...headingProps}
            className="section-title group inline-flex items-center gap-1 transition hover:text-primary"
            aria-label={`${title} – view all`}
          >
            {title}
            {titleHref && (
              <ChevronRight className="size-5 text-muted-foreground transition group-hover:text-foreground" />
            )}
          </HeadingTag>
        </div>
      )}

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
          slidesToScroll: "auto" as any,
        }}
        className="w-full relative group/row"
      >
        <div
          className={`-my-4 ${
            canScrollPrev && canScrollNext
              ? "row-feather"
              : canScrollPrev
                ? "row-feather-left"
                : canScrollNext
                  ? "row-feather-right"
                  : ""
          }`}
        >
          <CarouselContent className="-ml-3 sm:-ml-4 px-1 py-4">
            {React.Children.map(children, (child, idx) => {
              if (!child) return null;
              return (
                <CarouselItem key={idx} className="basis-auto pl-3 sm:pl-4">
                  {child}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
        <CarouselPrevious className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 size-10 items-center justify-center bg-black/70 text-white opacity-0 group-hover/row:opacity-100 transition-opacity border-none hover:bg-black hover:scale-110 shadow-xl rounded-full" />
        <CarouselNext className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 size-10 items-center justify-center bg-black/70 text-white opacity-0 group-hover/row:opacity-100 transition-opacity border-none hover:bg-black hover:scale-110 shadow-xl rounded-full" />
      </Carousel>
    </section>
  );
}
