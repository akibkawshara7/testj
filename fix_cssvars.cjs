const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

code = code.replace(
  /style=\{\{\s*"--media-brand": "white", "--video-brand": "white"\s*\} as React\.CSSProperties\}/g,
  'style={{ "--media-brand": "white", "--video-brand": "white" } as React.CSSProperties & { [key: string]: string }}',
);

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
