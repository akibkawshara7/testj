const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

const timelineMarkersCode = `
export function TimelineMarkers({ intro, outro }: { intro?: {start: number, end: number}, outro?: {start: number, end: number} }) {
  const duration = useMediaState("duration");
  if (!duration || duration <= 0) return null;
  
  return (
    <style>{\`
      .vds-slider-track {
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
    \`}</style>
  );
}
`;

if (!code.includes("function TimelineMarkers")) {
  code = code.replace("function WatchPage()", timelineMarkersCode + "\nfunction WatchPage()");
}

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
