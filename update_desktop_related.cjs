const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldDesktopRelatedStart = `function DesktopRelatedList({
  relations,
}: {
  relations: { relationType: string; node: AnilistMedia }[];
}) {
  if (!relations || relations.length === 0) return null;

  return (
    <div className="hidden lg:flex flex-col rounded-xl border border-white/5 bg-card/40 no-scrollbar overflow-hidden relative z-10 duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 rounded-t-xl z-20">
        <span className="text-[13px] font-bold tracking-wider text-white">Related Media</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[300px]">
        {relations.map((r) => {
          const m = r.node as AnilistMedia;
          const relationName = r.relationType ? r.relationType.replace(/_/g, " ") : "RELATED";
          const epCount = m.episodes || 0;
          return (
            <Link
              key={m.id}
              to="/anime/$id"
              params={{ id: encodeId(m.id, "anime") }}
              className="flex gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="w-[60px] h-[85px] shrink-0 rounded-md overflow-hidden bg-white/10 relative border border-white/5 shadow-md">
                <img
                  src={m.coverImage?.extraLarge || m.coverImage?.large}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h4 className="font-bold text-white text-[13px] line-clamp-2 leading-snug group-hover:text-[var(--brand)] transition-colors">
                  {titleOf(m)}
                </h4>

                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/90 bg-white/10 px-1.5 py-0.5 rounded border border-white/5">
                    {relationName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1.5">
                  {m.format && (
                    <span className="text-[10px] font-semibold text-white/70 bg-white/5 px-1.5 py-0.5 rounded">
                      {m.format}
                    </span>
                  )}
                  {epCount > 0 && (
                    <span className="text-[10px] font-semibold text-white/70 bg-white/5 px-1.5 py-0.5 rounded">
                      {epCount} EP
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}`;

const newDesktopRelated = `function DesktopRelatedList({
  relations,
}: {
  relations: { relationType: string; node: AnilistMedia }[];
}) {
  if (!relations || relations.length === 0) return null;

  return (
    <div className="hidden lg:flex flex-col rounded-xl border border-white/5 bg-card/40 no-scrollbar overflow-hidden relative z-10 duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 rounded-t-xl z-20">
        <span className="text-[13px] font-bold tracking-wider text-white">Related</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[300px]">
        {relations.map((r) => {
          const m = r.node as AnilistMedia;
          const relationName = r.relationType ? r.relationType.replace(/_/g, " ") : "RELATED";
          const epCount = m.episodes || 0;
          return (
            <Link
              key={m.id}
              to="/anime/$id"
              params={{ id: encodeId(m.id, "anime") }}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent hover:border-white/5 bg-transparent p-2 pr-3 transition hover:-translate-y-0.5 hover:bg-white/5"
            >
              <div className="size-14 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/5 sm:size-16">
                <img
                  src={m.coverImage?.extraLarge || m.coverImage?.large}
                  alt={titleOf(m)}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 pr-1">
                <h3 className="block w-full truncate text-sm font-bold text-foreground transition group-hover:text-primary">
                  {titleOf(m)}
                </h3>
                <div className="mt-1 flex min-w-0 items-center gap-x-2 gap-y-0.5 overflow-hidden text-[11px] font-semibold text-muted-foreground">
                  <span className="shrink-0 font-bold uppercase tracking-wide text-white">
                    {relationName}
                  </span>
                  {m.format && (
                    <>
                      <span aria-hidden className="shrink-0">•</span>
                      <span className="shrink-0 uppercase tracking-wide">
                        {m.format.replace(/_/g, " ")}
                      </span>
                    </>
                  )}
                  {epCount > 0 && (
                    <>
                      <span aria-hidden className="shrink-0">•</span>
                      <span className="shrink-0 uppercase tracking-wide">
                        {epCount} EP
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}`;

content = content.replace(oldDesktopRelatedStart, newDesktopRelated);

fs.writeFileSync(file, content);
console.log("Updated DesktopRelatedList.");
