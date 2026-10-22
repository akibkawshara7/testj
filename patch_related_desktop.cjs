const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");

const strToRemove = `{/* Desktop & Full-Width Related Anime Row */}
      <div className="mt-8 hidden lg:block space-y-8">
        <div className="duration-300 animate-in fade-in slide-in-from-bottom-4">
          <AnimeDetails m={m} />
        </div>
        <RelatedRow relations={relations} recommendations={m.recommendations?.nodes ?? []} />
      </div>`;

content = content.replace(strToRemove, "");
fs.writeFileSync(file, content);
console.log("Removed old desktop details/related");
