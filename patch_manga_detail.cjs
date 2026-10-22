const fs = require("fs");
const file = "src/routes/manga.$id.tsx";
let content = fs.readFileSync("src/routes/anime.$id.tsx", "utf8");

content = content.replace(/\/anime\/\$id/g, "/manga/$id");
content = content.replace(/AnimeDetails/g, "MangaDetails");
content = content.replace(/fetchAnimeById/g, "fetchMangaById");
content = content.replace(/type="anime"/g, 'type="manga"');
content = content.replace(/type: "anime"/g, 'type: "manga"');
content = content.replace(/\/anime\/watch/g, "/manga/read");
content = content.replace(/Watch Now/g, "Read Now");
content = content.replace(/EP /g, "CH ");
content = content.replace(/Episode/g, "Chapter");
content = content.replace(/episode/g, "chapter");
content = content.replace(/Episodes/g, "Chapters");
content = content.replace(/episodes/g, "chapters");
content = content.replace(/ANIME/g, "MANGA");
content = content.replace(/Anime/g, "Manga");
content = content.replace(/anime/g, "manga");
content = content.replace(/Tv/g, "BookOpen");
content = content.replace(/Play/g, "BookOpen");
content = content.replace(/fetchMangaById\(\)/g, "fetchMangaById(id)"); // fix any breakage

fs.writeFileSync(file, content);
console.log("Updated manga.$id.tsx");
