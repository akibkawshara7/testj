const fs = require("fs");
const file = "src/lib/anilist.ts";
let content = fs.readFileSync(file, "utf8");

if (!content.includes("fetchMangaSchedule")) {
  content += `\nexport async function fetchMangaSchedule(start: number, end: number, page: number = 1): Promise<{ results: AnilistMedia[]; hasNextPage: boolean }> {
  // Manga doesn't have an airing schedule in the same way, so we fallback to upcoming
  const q = \`query ($page: Int) { Page(page: $page, perPage: 50) { pageInfo { hasNextPage } media(type: MANGA, status: RELEASING, sort: UPDATED_AT_DESC, isAdult: false) { \${MEDIA_FIELDS} } } }\`;
  try {
    const data = await queryAnilist(q, { page });
    return {
      results: (data.Page.media || []).map((m: any) => mapAnilistMedia(m, "MANGA")),
      hasNextPage: !!data.Page.pageInfo?.hasNextPage,
    };
  } catch (e) {
    console.error("fetchMangaSchedule failed:", e);
    return { results: [], hasNextPage: false };
  }
}\n`;
  fs.writeFileSync(file, content);
  console.log("Added fetchMangaSchedule");
}
