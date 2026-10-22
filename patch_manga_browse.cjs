const fs = require("fs");
const file = "src/routes/manga.browse.tsx";
let content = fs.readFileSync("src/routes/anime.browse.tsx", "utf8");

content = content.replace(/\/anime\/browse/g, "/manga/browse");
content = content.replace(/Anime Catalog/g, "Manga Catalog");
content = content.replace(/Browse Anime/g, "Browse Manga");
content = content.replace(/Anime/g, "Manga");
content = content.replace(/anime/g, "manga");
content = content.replace(/ANIME/g, "MANGA");
content = content.replace(/fetchApikumeSearch/g, "browseManga");
content = content.replace(/@\/lib\/apikume/g, "@/lib/anilist");
content = content.replace(/\/anime\/\$id/g, "/manga/$id");

fs.writeFileSync(file, content);
console.log("Updated manga.browse.tsx based on anime.browse.tsx");
