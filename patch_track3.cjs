const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// Replace the first block
code = code.replace(/\.vds-time-slider \.vds-slider-track \{[\s\S]*?\} !important;\n\s*\}/, "");

// Replace the second block
code = code.replace(/\.vds-time-slider \.vds-slider-track \{[\s\S]*?\} !important;\n\s*\}/, "");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
