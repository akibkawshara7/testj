import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Header } from "@/components/Header";
import { ApikumeHeroSlider } from "@/components/ApikumeHeroSlider";
import { ApikumeAnimeRow } from "@/components/ApikumeAnimeRow";
import { ApikumeTopListSection } from "@/components/ApikumeTopListSection";
import { ContinueWatchingRow } from "@/components/ContinueWatchingRow";
import { Footer } from "@/components/Footer";
import { fetchApikumeHome } from "@/lib/apikume";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AniKume – Free Anime Online" },
      {
        name: "description",
        content:
          "Watch anime online for free in HD on AniKume. Stream trending, seasonal and top-rated anime with English subs and dubs.",
      },
      { property: "og:title", content: "AniKume – Free Anime Online" },
      {
        property: "og:description",
        content:
          "Watch anime online for free in HD. Stream trending, seasonal and top-rated anime.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["apikume-anime-home"],
    queryFn: fetchApikumeHome,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-x-hidden pb-4 pt-[60px]">
        <ApikumeHeroSlider slides={data?.hero_slider} isLoading={isLoading} />

        <div
          className="mx-auto mt-2 max-w-[1500px]"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="grid gap-8 lg:grid-cols-10">
            {/* Left 60% */}
            <div className="min-w-0 space-y-2 lg:col-span-6">
              <ContinueWatchingRow type="anime" />

              <ApikumeAnimeRow
                title="Trending Now"
                items={data?.trending_now}
                isLoading={isLoading}
                viewAllSearch={{ sort: "TRENDING_DESC" }}
              />
              <ApikumeAnimeRow
                title="Popular This Season"
                items={data?.popular_this_season}
                isLoading={isLoading}
                viewAllSearch={{ sort: "POPULARITY_DESC" }}
              />
              <ApikumeAnimeRow
                title="All Time Popular"
                items={data?.all_time_popular}
                isLoading={isLoading}
                viewAllSearch={{ sort: "FAVOURITES_DESC" }}
              />
              <ApikumeAnimeRow
                title="Coming Soon"
                items={data?.upcoming}
                isLoading={isLoading}
                viewAllSearch={{ status: "NOT_YET_RELEASED" }}
              />
            </div>

            {/* Right 40% */}
            <aside className="min-w-0 lg:col-span-4 lg:pt-10">
              <ApikumeTopListSection
                stacked
                top10={data?.top_10}
                top10Movies={data?.top_10_movies}
                isLoading={isLoading}
              />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
