const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// The <style> block is in IntroOutroMarkers and WatchPage. Let's just find the exact text and replace it.

const toReplace1 = `    <style>{\`
          .vds-slider-thumb { box-shadow: none !important; }
          .vds-slider-track { background-color: rgba(255, 255, 255, 0.3) !important; }

      .vds-time-slider .vds-slider-track {
        background: linear-gradient(to right, 
          rgba(255,255,255,0.3) 0%, 
          rgba(255,255,255,0.3) \${intro ? (intro.start / Math.max(duration, 1)) * 100 + "%" : "0%"}, 
          #f97316 \${intro ? (intro.start / Math.max(duration, 1)) * 100 + "%" : "0%"}, 
          #f97316 \${intro ? (intro.end / Math.max(duration, 1)) * 100 + "%" : "0%"}, 
          rgba(255,255,255,0.3) \${intro ? (intro.end / Math.max(duration, 1)) * 100 + "%" : "0%"}, 
          rgba(255,255,255,0.3) \${outro ? (outro.start / Math.max(duration, 1)) * 100 + "%" : "100%"}, 
          #f97316 \${outro ? (outro.start / Math.max(duration, 1)) * 100 + "%" : "100%"}, 
          #f97316 \${outro ? (outro.end / Math.max(duration, 1)) * 100 + "%" : "100%"}, 
          rgba(255,255,255,0.3) \${outro ? (outro.end / Math.max(duration, 1)) * 100 + "%" : "100%"}, 
          rgba(255,255,255,0.3) 100%
        ) !important;
      }
      .vds-slider-track-fill {
        background: white !important;
      }
    \`}</style>`;

code = code.replace(
  toReplace1,
  `    <style>{\`
      .vds-slider-thumb { box-shadow: none !important; }
      .vds-slider-track { background-color: rgba(255, 255, 255, 0.3) !important; }
      .vds-slider-track-fill { background: white !important; }
    \`}</style>`,
);

const toReplace2 = `      <style>{\`
          .vds-menu-item[data-value="accessibility"] { display: none !important; }
          .vds-time-slider .vds-slider-track {
            background: linear-gradient(to right, 
              rgba(255,255,255,0.3) 0%, 
              rgba(255,255,255,0.3) var(--intro-start-pct, 0%), 
              #f97316 var(--intro-start-pct, 0%), 
              #f97316 var(--intro-end-pct, 0%), 
              rgba(255,255,255,0.3) var(--intro-end-pct, 0%), 
              rgba(255,255,255,0.3) var(--outro-start-pct, 100%), 
              #f97316 var(--outro-start-pct, 100%), 
              #f97316 var(--outro-end-pct, 100%), 
              rgba(255,255,255,0.3) var(--outro-end-pct, 100%), 
              rgba(255,255,255,0.3) 100%
            ) !important;
          }
          /* Hide Google Cast button from default positions on PC */
          @media (min-width: 576px) {
            .vds-google-cast-button:not(.my-top-cast-btn) { display: none !important; }
          }
        \`}</style>`;

code = code.replace(
  toReplace2,
  `      <style>{\`
          .vds-menu-item[data-value="accessibility"] { display: none !important; }
          /* Hide Google Cast button from default positions on PC */
          @media (min-width: 576px) {
            .vds-google-cast-button:not(.my-top-cast-btn) { display: none !important; }
          }
        \`}</style>`,
);

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
