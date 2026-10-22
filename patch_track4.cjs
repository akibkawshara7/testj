const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// I will just completely replace the intro/outro component since it's only returning the <style> right now.
// wait, the first component is `function IntroOutroMarkers(...)`
code = code.replace(
  /function IntroOutroMarkers\(\{[\s\S]*?\}\) \{[\s\S]*?return \([\s\S]*?<\/style>\n\s*\);\n\}/,
  "function IntroOutroMarkers() { return null; }",
);

// And remove the <IntroOutroMarkers ... /> from rendering
code = code.replace(/<IntroOutroMarkers\s+intro=\{intro\}[\s\S]*?\/>/, "");

// For the second part, I will find `.vds-menu-item[data-value="accessibility"] { display: none !important; }` and replace the following CSS.
code = code.replace(/\.vds-time-slider \.vds-slider-track \{[\s\S]*?\} !important;\n\s*\}/, "");

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
