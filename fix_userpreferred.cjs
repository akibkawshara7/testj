const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(/m\?\.title\?\.userPreferred \|\|/g, "");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
