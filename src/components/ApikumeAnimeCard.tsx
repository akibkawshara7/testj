import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { ApikumeAnimeItem } from "@/lib/apikume";
import { apikumeTitle } from "@/lib/apikume";
import { getStatusBgColor } from "@/lib/utils";

export function ApikumeAnimeCard({ item }: { item: ApikumeAnimeItem }) {
  const title = apikumeTitle(item.title);
  const statusColor = getStatusBgColor(item.status);

  return (
    <Link
      to="/anime/$id"
      params={{ id: item.anikume_id }}
      className="group block w-[130px] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1 sm:w-[165px] lg:w-[190px]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-card/60 ring-1 ring-white/5 shadow-lg transition group-hover:ring-primary/60">
        <img
          src={item.poster}
          alt={title}
          referrerPolicy="no-referrer"
          decoding="async"
          loading="lazy"
          className="size-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:blur-sm"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

        {item.is_adult && (
          <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-md bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            18+
          </span>
        )}

        <span className="absolute bottom-2 right-2 grid size-9 translate-y-2 place-items-center rounded-full bg-foreground text-background opacity-0 shadow-[var(--shadow-glow)] transition group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="size-4 fill-current" />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className={`size-2 shrink-0 rounded-full ${statusColor}`} />
        <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-foreground/90 group-hover:text-foreground">
          {title}
        </h3>
      </div>
      <p className="mt-0.5 ml-3.5 line-clamp-1 text-[11px] text-muted-foreground">
        {item.format || "TV Show"}
      </p>
    </Link>
  );
}
