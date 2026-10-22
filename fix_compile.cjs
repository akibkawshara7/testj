const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

const styleBlockStart = code.indexOf("<MediaPlayer");
if (styleBlockStart !== -1) {
  const asAnyIndex = code.indexOf("} as any", styleBlockStart);
  if (asAnyIndex !== -1) {
    const endOfStyle = code.indexOf("}", asAnyIndex + 7);
    code = code.substring(0, styleBlockStart + 12) + code.substring(endOfStyle + 1);
  }
}

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
