const fs = require("fs");
const file = "src/routes/manga.schedule.tsx";
let content = fs.readFileSync("src/routes/anime.schedule.tsx", "utf8");

content = content.replace(/\/anime\/schedule/g, "/manga/schedule");
content = content.replace(/Anime Schedule/g, "Manga Schedule");
content = content.replace(/fetchAnimeSchedule/g, "fetchMangaSchedule"); // Note: fetchMangaSchedule might not exist
content = content.replace(/type="anime"/g, 'type="manga"');
content = content.replace(/Anime/g, "Manga");
content = content.replace(/anime/g, "manga");
content = content.replace(/ANIME/g, "MANGA");

fs.writeFileSync(file, content);
console.log("Updated manga.schedule.tsx");
