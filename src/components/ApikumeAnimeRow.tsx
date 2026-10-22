import type { ApikumeAnimeItem } from "@/lib/apikume";
import { AnimeCard } from "./ApikumeAnimeCard";
import { AnimeRowShell } from "./AnimeRow";

interface Props {
  title: string;
  items?: ApikumeAnimeItem[];
  isLoading?: boolean;
  viewAllSearch?: Record<string, string | number>;
}

export function AnimeRow({ title, items, isLoading, viewAllSearch }: Props) {
  // Remove skeleton loader completely
  if (isLoading || !items || items.length === 0) {
    return null;
  }

  return (
    <AnimeRowShell
      title={title}
      titleHref={{
        to: "/anime/browse",
        search: viewAllSearch ?? {},
      }}
    >
      {items.map((m, idx) => (
        <AnimeCard key={`ap_row_${m.anikume_id || "item"}_${idx}`} item={m} />
      ))}
    </AnimeRowShell>
  );
}

export { AnimeRow as ApikumeAnimeRow };
