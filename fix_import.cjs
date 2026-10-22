const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// Fix GoogleCastButton import
code = code.replace(/import\s*\{\s*GoogleCastButton\s*,\s*Link/g, "import { Link");
if (!code.includes("GoogleCastButton")) {
  // Already removed from top, let's inject in vidstack import
}
code = code.replace(/import\s*\{\s*MediaPlayer\s*,/, "import { MediaPlayer, GoogleCastButton,");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
