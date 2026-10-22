const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// Replace the linear-gradient hack with a standard track color
code = code.replace(
  /\.vds-time-slider \.vds-slider-track \{[\s\S]*?\} !important;\n\s*\}/,
  ".vds-slider-track { background-color: rgba(255, 255, 255, 0.3) !important; }",
);
code = code.replace(/\.vds-time-slider \.vds-slider-track-fill \{/g, ".vds-slider-track-fill {");

// Add the box-shadow none to the thumb
if (!code.includes(".vds-slider-thumb { box-shadow: none !important; }")) {
  code = code.replace(
    /<style>\{`/,
    "<style>{`\n          .vds-slider-thumb { box-shadow: none !important; }\n          .vds-slider-track { background-color: rgba(255, 255, 255, 0.3) !important; }\n",
  );
}

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
