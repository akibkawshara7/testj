const fs = require("fs");
const file = "src/lib/anilist.ts";
let content = fs.readFileSync(file, "utf8");

if (!content.includes("fetchChapters")) {
  content += `\nexport async function fetchChapters(id: any, media: AnilistMedia, _dub?: boolean): Promise<{ chapter: string; date: string; id: string }[]> {
  const count = media.num_chapters || 10;
  return Array.from({ length: count }).map((_, i) => ({
    chapter: String(i + 1),
    date: new Date().toISOString(),
    id: String(i + 1),
  }));
}\n`;
}

if (!content.includes("totalChapterCount")) {
  content += `\nexport function totalChapterCount(media: AnilistMedia): number {
  return media.num_chapters || 10;
}\n`;
}

fs.writeFileSync(file, content);
console.log("Added fetchChapters and totalChapterCount to anilist.ts");
