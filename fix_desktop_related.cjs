const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStart = 'function DesktopRelatedList({';
const targetEnd = 'function WatchBody({';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

const oldCode = content.substring(startIndex, endIndex);

const newCode = `function DesktopRelatedList({
  relations,
}: {
  relations: { relationType: string; node: AnilistMedia }[];
}) {
  if (!relations || relations.length === 0) return null;

  const sorted = sortRelations(relations);

  return (
    <div className="hidden lg:flex flex-col rounded-xl border border-white/5 bg-card/40 no-scrollbar overflow-hidden relative z-10 duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 rounded-t-xl z-20">
        <span className="text-[13px] font-bold tracking-wider text-white">Related</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[300px]">
        {sorted.map((r, i) => {
          const m = r.node as AnilistMedia;
          const relationName = r.relationType ? r.relationType.replace(/_/g, " ") : "RELATED";
          const epCount = m.episodes || 0;
          const index = i + 1;
          const numberColor =
            index <= 3 ? "text-[var(--hot)]" : "text-muted-foreground/60";

          return (
            <Link
              key={m.id}
              to="/anime/$id"
              params={{ id: encodeId(m.id, "anime") }}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-card/40 p-2 pr-3 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-card relative"
            >
              <span
                className={\`grid w-8 shrink-0 place-items-center text-2xl font-black tabular-nums \${numberColor} sm:text-3xl\`}
              >
                {index}
              </span>
              <div className="size-14 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/5 sm:size-16 relative">
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
                  <span className="shrink-0 uppercase tracking-wide text-muted-foreground">
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
}

`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log("Updated PC related list to EXACT top 10 style.");
