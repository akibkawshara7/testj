const fs = require("fs");

const fileContent = fs.readFileSync("src/lib/anilist.ts", "utf-8");

// Remove Jikan comment
let updatedContent = fileContent.replace("// Fallback to official MAL API (no Jikan)", "");

const browseAnimeOld = `  const query = \`query (
    $s: String, $g: String, $sea: MediaSeason, $y: Int,
    $f: MediaFormat, $st: MediaStatus, $sort: [MediaSort], $page: Int
  ) {
    Page(perPage: 30, page: $page) {
      pageInfo { hasNextPage lastPage currentPage total }
      media(type: ANIME,
        search: $s, genre: $g, season: $sea, seasonYear: $y,
        format: $f, status: $st, sort: $sort
      ) { \${MEDIA_FIELDS} }
    }
  }\`;
  const vars = {
    s: p.search || undefined,
    g: p.genre || undefined,
    sea: p.season || undefined,
    y: p.year || undefined,
    f: p.format || undefined,
    st: p.status || undefined,
    sort: [p.sort || "POPULARITY_DESC"],
    page: p.page ?? 1,
  };`;

const browseAnimeNew = `  const coreGenres = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Hentai", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
  const isCoreGenre = p.genre && coreGenres.includes(p.genre);

  const query = \`query (
    $s: String, $genre: String, $tag: String, $sea: MediaSeason, $y: Int,
    $f: MediaFormat, $st: MediaStatus, $sort: [MediaSort], $page: Int
  ) {
    Page(perPage: 30, page: $page) {
      pageInfo { hasNextPage lastPage currentPage total }
      media(type: ANIME,
        search: $s, genre: $genre, tag: $tag, season: $sea, seasonYear: $y,
        format: $f, status: $st, sort: $sort
      ) { \${MEDIA_FIELDS} }
    }
  }\`;
  const vars = {
    s: p.search || undefined,
    genre: isCoreGenre ? p.genre : undefined,
    tag: !isCoreGenre && p.genre ? p.genre : undefined,
    sea: p.season || undefined,
    y: p.year || undefined,
    f: p.format || undefined,
    st: p.status || undefined,
    sort: [p.sort || "POPULARITY_DESC"],
    page: p.page ?? 1,
  };`;

updatedContent = updatedContent.replace(browseAnimeOld, browseAnimeNew);

const browseMangaOld = `  const query = \`query (
    $s: String, $g: String, $sea: MediaSeason, $y: Int,
    $f: MediaFormat, $st: MediaStatus, $sort: [MediaSort], $page: Int,
    $country: CountryCode
  ) {
    Page(perPage: 30, page: $page) {
      pageInfo { hasNextPage lastPage currentPage total }
      media(type: MANGA,
        search: $s, genre: $g, season: $sea, seasonYear: $y,
        format: $f, status: $st, sort: $sort, countryOfOrigin: $country
      ) { \${MEDIA_FIELDS} }
    }
  }\`;

  let f = p.format || undefined;
  let country: string | undefined = undefined;

  if (p.format === "MANHWA") {
    f = "MANGA";
    country = "KR";
  } else if (p.format === "MANHUA") {
    f = "MANGA";
    country = "CN";
  } else if (p.format === "MANGA") {
    f = "MANGA";
    country = "JP";
  }

  const vars = {
    s: p.search || undefined,
    g: p.genre || undefined,
    sea: p.season || undefined,
    y: p.year || undefined,
    f,
    country,
    st: p.status || undefined,
    sort: [p.sort || "POPULARITY_DESC"],
    page: p.page ?? 1,
  };`;

const browseMangaNew = `  const coreGenres = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Hentai", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
  const isCoreGenre = p.genre && coreGenres.includes(p.genre);

  const query = \`query (
    $s: String, $genre: String, $tag: String, $sea: MediaSeason, $y: Int,
    $f: MediaFormat, $st: MediaStatus, $sort: [MediaSort], $page: Int,
    $country: CountryCode
  ) {
    Page(perPage: 30, page: $page) {
      pageInfo { hasNextPage lastPage currentPage total }
      media(type: MANGA,
        search: $s, genre: $genre, tag: $tag, season: $sea, seasonYear: $y,
        format: $f, status: $st, sort: $sort, countryOfOrigin: $country
      ) { \${MEDIA_FIELDS} }
    }
  }\`;

  let f = p.format || undefined;
  let country: string | undefined = undefined;

  if (p.format === "MANHWA") {
    f = "MANGA";
    country = "KR";
  } else if (p.format === "MANHUA") {
    f = "MANGA";
    country = "CN";
  } else if (p.format === "MANGA") {
    f = "MANGA";
    country = "JP";
  }

  const vars = {
    s: p.search || undefined,
    genre: isCoreGenre ? p.genre : undefined,
    tag: !isCoreGenre && p.genre ? p.genre : undefined,
    sea: p.season || undefined,
    y: p.year || undefined,
    f,
    country,
    st: p.status || undefined,
    sort: [p.sort || "POPULARITY_DESC"],
    page: p.page ?? 1,
  };`;

updatedContent = updatedContent.replace(browseMangaOld, browseMangaNew);

fs.writeFileSync("src/lib/anilist.ts", updatedContent, "utf-8");
console.log("Successfully patched src/lib/anilist.ts");
