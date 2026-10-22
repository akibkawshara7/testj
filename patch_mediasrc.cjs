const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(/src=\{mediaSrc\}/g, "src={mediaSrc as any}");
fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
