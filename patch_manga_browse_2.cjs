const fs = require("fs");
const file = "src/routes/manga.browse.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/import \{ fetchApikumeEndpoint \} from "@\/lib\/anilist";/, "");
content = content.replace(
  /const res = await fetchApikumeEndpoint\(\`\/api\/manga\/browse\?\$\{q\.toString\(\)\}\`\);/g,
  "const res = await browseManga({ search: params.search, genre: params.genre, season: params.season, year: params.year ? Number(params.year) : undefined, format: params.format, status: params.status, sort: params.sort, page: p.page, perPage: 18 }); return { results: res.items, pageInfo: res.pageInfo };",
);
content = content.replace(/return res;/g, "");

fs.writeFileSync(file, content);
console.log("Fixed manga.browse.tsx backend call");
