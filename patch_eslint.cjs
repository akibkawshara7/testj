const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// The eslint complains about prettier inside topControlsGroupStart
code = code.replace(
  /topControlsGroupStart: \(\n\s*<GoogleCastButton className="my-top-cast-btn vds-button" \/>\n\s*\),/g,
  'topControlsGroupStart: <GoogleCastButton className="my-top-cast-btn vds-button" />,',
);

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
