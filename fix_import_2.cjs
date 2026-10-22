const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(/import\s*\{\s*Link\s*,\s*GoogleCastButton\s*\}/, "import { Link }");
code = code.replace(/import\s*\{\s*GoogleCastButton\s*,\s*Link\s*\}/, "import { Link }");

// Wait, let's just do a clean replace for the @tanstack/react-router import
const tanstackImportIndex = code.indexOf('from "@tanstack/react-router";');
if (tanstackImportIndex !== -1) {
  let start = code.lastIndexOf("import {", tanstackImportIndex);
  let importBlock = code.substring(start, tanstackImportIndex + 30);
  let cleanImportBlock = importBlock
    .replace(/,\s*GoogleCastButton/, "")
    .replace(/GoogleCastButton\s*,/, "");
  code = code.substring(0, start) + cleanImportBlock + code.substring(tanstackImportIndex + 30);
}

// Ensure TimelineMarkers is at top level
code = code.replace(/function TimelineMarkers/, "export function TimelineMarkers"); // Just in case it was injected inside something else

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
