const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(/setMuted\(\(prev\) =>/g, "setMuted((prev: boolean) =>");
code = code.replace(/setVolume\(\(prev\) =>/g, "setVolume((prev: number) =>");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
