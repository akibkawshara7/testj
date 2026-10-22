const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(/\.vds-slider-track \{/g, ".vds-time-slider .vds-slider-track {");
code = code.replace(/\.vds-slider-track-fill \{/g, ".vds-time-slider .vds-slider-track-fill {");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
