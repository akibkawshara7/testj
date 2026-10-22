const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRelatedRow = `  return (
    <AnimeRowShell title="Related & Recommendations">
      {all.map((item) => (
        <div key={item.media.id} className="relative shrink-0 snap-start">
          <AnimeCard media={item.media} />
          <span className="pointer-events-none absolute left-1 top-1 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {item.label}
          </span>
        </div>
      ))}
    </AnimeRowShell>
  );`;

const newRelatedRow = `  return (
    <AnimeRowShell title="Related & Recommendations">
      {all.map((item) => (
        <div key={item.media.id} className="group/badge relative shrink-0 snap-start w-[130px] sm:w-[165px] lg:w-[190px]">
          <AnimeCard media={item.media} badge={null} />
          <span className="pointer-events-none absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur transition-transform duration-300 group-hover/badge:-translate-y-1">
            {item.label}
          </span>
        </div>
      ))}
    </AnimeRowShell>
  );`;

content = content.replace(oldRelatedRow, newRelatedRow);
fs.writeFileSync(file, content);
console.log("Updated RelatedRow");
