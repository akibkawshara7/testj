const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");

const injection = `
/* ========================= Desktop Related List ========================= */
function DesktopRelatedList({ relations }: { relations: { relationType: string; node: AnilistMedia }[] }) {
  if (!relations || relations.length === 0) return null;

  return (
    <div className="hidden lg:flex flex-col rounded-xl border border-white/5 bg-card/40 no-scrollbar overflow-hidden relative z-10 duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 rounded-t-xl z-20">
        <span className="text-[13px] font-bold tracking-wider text-white">Related Media</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[300px]">
        {relations.map((r) => {
          const m = r.node as AnilistMedia;
          const relationName = r.relationType ? r.relationType.replace(/_/g, ' ') : 'RELATED';
          const epCount = m.episodes || 0;
          return (
            <Link
              key={m.id}
              to="/anime/$id"
              params={{ id: encodeId(m.id, "anime") }}
              className="flex gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="w-[60px] h-[85px] shrink-0 rounded-md overflow-hidden bg-white/10 relative border border-white/5 shadow-md">
                <img src={m.coverImage?.extraLarge || m.coverImage?.large} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
              </div>
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h4 className="font-bold text-white text-[13px] line-clamp-2 leading-snug group-hover:text-[var(--brand)] transition-colors">{titleOf(m)}</h4>
                
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
}
`;

// Insert the component definition before the WatchBody function.
const beforeWatchBody = "function WatchBody({";
if (content.includes(beforeWatchBody)) {
  content = content.replace(beforeWatchBody, injection + "\n" + beforeWatchBody);

  // Replace the placeholder comment
  content = content.replace(
    "{/* Desktop Episode list column */}",
    "<DesktopRelatedList relations={relations} />",
  );
  fs.writeFileSync(file, content);
  console.log("Injected DesktopRelatedList");
} else {
  console.log("WatchBody not found");
}
