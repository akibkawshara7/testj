import type { ApikumeAnimeItem } from "@/lib/apikume";
import { ApikumeAnimeCard } from "./ApikumeAnimeCard";
import { AnimeRowShell } from "./AnimeRow";

interface Props {
  title: string;
  items?: ApikumeAnimeItem[];
  isLoading?: boolean;
  viewAllSearch?: Record<string, string | number>;
}

export function ApikumeAnimeRow({ title, items, isLoading, viewAllSearch }: Props) {
  return (
    <AnimeRowShell
      title={title}
      titleHref={{
        to: "/anime/browse",
        search: viewAllSearch ?? {},
      }}
    >
      {isLoading || !items
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[130px] shrink-0 sm:w-[165px] lg:w-[190px]">
              <div className="w-full rounded-xl skeleton-box" style={{ paddingBottom: "140%" }} />
              <div className="mt-3 h-4 w-3/4 skeleton-text" />
              <div className="mt-1.5 h-3 w-1/2 skeleton-text opacity-70" />
            </div>
          ))
        : items.map((m) => <ApikumeAnimeCard key={m.anikume_id} item={m} />)}
    </AnimeRowShell>
  );
}
