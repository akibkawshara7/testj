const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// 1. Add --media-brand: white to MediaPlayer
if (!code.includes("--media-brand")) {
  code = code.replace(
    /<MediaPlayer\s+className="w-full h-full rounded-\[12px\] overflow-hidden bg-black"/,
    `<MediaPlayer\n        style={{ "--media-brand": "white", "--video-brand": "white" } as React.CSSProperties}\n        className="w-full h-full rounded-[12px] overflow-hidden bg-black"`,
  );
}

// 2. Hide GoogleCastButton in bottom controls, but show top controls one
// I already added a rule `.vds-controls-group .vds-google-cast-button { display: none !important; }`
// I need to change that so it only hides the one in the bottom group.
// The top group usually has class .vds-controls-group and maybe it's not the last child.
// Wait, I can just apply a custom class to the one I inject: `<GoogleCastButton className="my-top-cast-btn vds-button" />`
// And I can hide the default one completely using CSS: `vds-google-cast-button:not(.my-top-cast-btn) { display: none !important; }`
code = code.replace(
  /\.vds-controls-group \.vds-google-cast-button\s*\{\s*display:\s*none\s*!important;\s*\}/g,
  `.vds-google-cast-button:not(.my-top-cast-btn) { display: none !important; }`,
);

// 3. Inject GoogleCastButton into largeLayout
if (!code.includes("topControlsGroupStart")) {
  code = code.replace(
    /largeLayout:\s*\{/,
    `largeLayout: {\n              topControlsGroupStart: (\n                <GoogleCastButton className="my-top-cast-btn vds-button" />\n              ),`,
  );
}

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
