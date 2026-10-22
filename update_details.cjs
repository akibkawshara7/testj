const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldDetails = `function AnimeDetails({ m }: { m: AnilistMedia }) {
  const [expanded, setExpanded] = useState(false);

  const poster = m.coverImage.extraLarge || m.coverImage.large;
  const score = m.averageScore ?? m.meanScore;
  const epCount = m.episodes || totalEpisodeCount(m);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card/40">
      <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Poster */}
        <div className="relative shrink-0 h-[180px] w-[120px] sm:h-[220px] sm:w-[150px] overflow-hidden rounded-xl shadow-2xl shadow-black/50 border border-white/5">
          <img src={poster} alt="" className="h-full w-full object-cover" />
          {m.status && (
            <div className="absolute left-1.5 top-1.5 flex items-center gap-1.5 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md ring-1 ring-white/10 shadow-sm">
              <span
                className={\`size-1.5 rounded-full \${
                  m.status === "RELEASING"
                    ? "bg-[#df7426]"
                    : m.status === "FINISHED" || m.status === "COMPLETED"
                      ? "bg-green-500"
                      : "bg-white/90"
                }\`}
              />
              <span className={getStatusColor(m.status)}>
                {formatStatus(m.status).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col w-full min-w-0">
          {/* Title & Show Info button */}
          <div className="flex w-full items-start justify-between gap-4 mb-2">
            <h2 className="text-[17px] sm:text-[19px] font-bold text-white line-clamp-2 leading-tight">
              {titleOf(m)}
            </h2>
            <Link
              to="/anime/$id"
              params={{ id: encodeId(m.id, "anime") }}
              className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              title="Show details"
            >
              <ExternalLink className="size-4 shrink-0 text-white/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex w-full flex-wrap items-center gap-2 text-[11px] font-bold text-white/80 mb-3">
            {score != null && (
              <div
                className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 ring-1 ring-white/10"
                style={{ color: getScoreColor(score) }}
              >
                <Star className="size-3 fill-current" />
                {score.toFixed(1)}
              </div>
            )}
            {m.format && (
              <div className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-white/90 ring-1 ring-white/10">
                <Tv className="size-3 text-white/60" />
                {m.format}
              </div>
            )}
            {epCount > 0 && (
              <div className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-white/90 ring-1 ring-white/10">
                <PlayCircle className="size-3 text-white/60" />
                {epCount} Ep
              </div>
            )}
            {m.duration && (
              <div className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-white/90 ring-1 ring-white/10">
                <Clock className="size-3 text-white/60" />
                {m.duration}m
              </div>
            )}
          </div>

          {/* Genres */}
          {m.genres && m.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {m.genres.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {m.description && (
            <div className="relative">
              <div
                className={
                  "text-[12px] leading-relaxed text-white/60 " + (expanded ? "" : "line-clamp-3")
                }
                dangerouslySetInnerHTML={{ __html: m.description }}
              />
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-white/80 hover:text-white transition-colors"
              >
                {expanded ? "SHOW LESS" : "READ MORE"}
                <ChevronDown
                  className={\`size-3 transition-transform \${expanded ? "rotate-180" : ""}\`}
                  strokeWidth={3}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

const newDetails = `function AnimeDetails({ m }: { m: AnilistMedia }) {
  const [expanded, setExpanded] = useState(false);

  const poster = m.coverImage.extraLarge || m.coverImage.large;
  const score = m.averageScore ?? m.meanScore;
  const epCount = m.episodes || totalEpisodeCount(m);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card/40">
      <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Poster */}
        <div className="relative shrink-0 h-[180px] w-[120px] sm:h-[220px] sm:w-[150px] overflow-hidden rounded-xl shadow-2xl shadow-black/50 border border-white/5">
          <img src={poster} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col w-full min-w-0">
          {/* Title & Show Info button */}
          <div className="flex w-full items-start justify-between gap-4 mb-2">
            <h2 className="text-[17px] sm:text-[22px] font-bold text-white line-clamp-2 leading-tight">
              {titleOf(m)}
            </h2>
            <Link
              to="/anime/$id"
              params={{ id: encodeId(m.id, "anime") }}
              className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              title="Show details"
            >
              <ExternalLink className="size-4 shrink-0 text-white/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
            </Link>
          </div>

          {/* Stats - using exactly the original styles from anime.$id.tsx */}
          <div className="flex w-full flex-wrap items-center gap-2 text-xs font-semibold text-white mb-4">
            {score != null && (
              <span
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10"
                style={{ color: getScoreColor(score) }}
              >
                <Star className="size-3.5 fill-current" />
                {formatScore(score)}
              </span>
            )}
            {m.status && (
              <span
                className={\`rounded-xl bg-white/5 px-3 py-1.5 uppercase tracking-wider ring-1 ring-white/10 \${getStatusColor(m.status)}\`}
              >
                {formatStatus(m.status)}
              </span>
            )}
            {epCount > 0 && (
              <span className="rounded-xl bg-white/5 px-3 py-1.5 uppercase tracking-wider ring-1 ring-white/10 text-foreground/90">
                {epCount} Episodes
              </span>
            )}
            {m.format && (
              <span className="rounded-xl bg-white/5 px-3 py-1.5 uppercase tracking-wider ring-1 ring-white/10 text-foreground/90">
                {m.format.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Genres - using the exact green styling from original */}
          {m.genres && m.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {m.genres.slice(0, 4).map((g) => (
                <Link
                  key={g}
                  to="/anime/browse"
                  search={{ genre: g }}
                  className="rounded-full border border-[var(--success,#14b8a6)]/40 bg-transparent px-3 py-1 text-[11px] font-semibold text-[var(--success,#14b8a6)] transition hover:bg-[var(--success,#14b8a6)]/10"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* Description */}
          {m.description && (
            <div className="relative">
              <motion.div
                layout="position"
                className={
                  "text-[13px] leading-relaxed text-white/70 overflow-hidden " + (expanded ? "" : "line-clamp-3")
                }
                dangerouslySetInnerHTML={{ __html: m.description }}
              />
              <motion.button
                layout="position"
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center gap-1 text-[11px] font-bold text-white/80 hover:text-white transition-colors"
              >
                {expanded ? "SHOW LESS" : "READ MORE"}
                <ChevronDown
                  className={\`size-3 transition-transform \${expanded ? "rotate-180" : ""}\`}
                  strokeWidth={3}
                />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(oldDetails, newDetails);

fs.writeFileSync(file, content);
console.log("Updated AnimeDetails component.");
