const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

const toReplace1 = `function IntroOutroMarkers({
  intro,
  outro,
}: {
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
}) {
  const duration = useMediaState("duration");
  if (!duration || duration <= 0) return null;

  return (
    <style>{\`
      .vds-slider-thumb { box-shadow: none !important; }
      .vds-slider-track { background-color: rgba(255, 255, 255, 0.3) !important; }
      .vds-slider-track-fill { background: white !important; }
    \`}</style>
  );
}`;

const replacement1 = `function IntroOutroMarkers({
  intro,
  outro,
}: {
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
}) {
  const duration = useMediaState("duration");
  if (!duration || duration <= 0) return null;

  return (
    <style>{\`
      .vds-time-slider::before {
        content: "";
        position: absolute;
        top: 50%;
        left: \${intro ? (intro.start / Math.max(duration, 1)) * 100 + "%" : "0%"};
        width: \${intro ? ((intro.end - intro.start) / Math.max(duration, 1)) * 100 + "%" : "0%"};
        height: var(--track-height, 5px);
        transform: translateY(-50%);
        background-color: #f97316;
        z-index: 1;
        pointer-events: none;
        border-radius: var(--media-slider-track-border-radius, 1px);
        display: \${intro ? "block" : "none"};
      }
      .vds-time-slider::after {
        content: "";
        position: absolute;
        top: 50%;
        left: \${outro ? (outro.start / Math.max(duration, 1)) * 100 + "%" : "0%"};
        width: \${outro ? ((outro.end - outro.start) / Math.max(duration, 1)) * 100 + "%" : "0%"};
        height: var(--track-height, 5px);
        transform: translateY(-50%);
        background-color: #f97316;
        z-index: 1;
        pointer-events: none;
        border-radius: var(--media-slider-track-border-radius, 1px);
        display: \${outro ? "block" : "none"};
      }
      @media (hover: hover) and (pointer: fine) {
        .vds-time-slider:hover::before, .vds-time-slider:hover::after {
          height: calc(var(--track-height, 5px) * 2);
          transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1), height 0.1s cubic-bezier(0.4, 0, 1, 1);
        }
      }
    \`}</style>
  );
}`;

code = code.replace(toReplace1, replacement1);

const toReplace2 = `        style={{ "--media-brand": "white", "--video-brand": "white" } as React.CSSProperties & { [key: string]: string }}`;
const replacement2 = `        style={{ 
          "--media-brand": "white", 
          "--video-brand": "white",
          "--media-slider-track-bg": "rgba(255, 255, 255, 0.3)",
          "--media-slider-track-fill-bg": "white",
          "--media-slider-thumb-bg": "white",
          "--media-slider-focused-thumb-shadow": "none"
        } as React.CSSProperties & { [key: string]: string }}`;

code = code.replace(toReplace2, replacement2);

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
