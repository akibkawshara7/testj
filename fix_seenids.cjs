const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(/new Set<number>\(\)/g, "new Set<string | number>()");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
