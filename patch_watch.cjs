const fs = require("fs");
let code = fs.readFileSync("src/routes/anime.watch.$id.tsx", "utf8");

// 1. Remove `--media-brand: "#f97316"` and its related color
code = code.replace(/"--media-brand": "#f97316",/g, "");
code = code.replace(/"--media-focus-ring": "rgba\(249, 115, 22, 0.5\)",/g, "");

// 2. Hide accessibility menu
const styleInjection = `
        {/* Overrides for timeline and menu */}
        <style>{\`
          .vds-menu-item[data-value="accessibility"] { display: none !important; }
          .vds-slider-track {
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
            .vds-controls-group .vds-google-cast-button {
              display: none !important;
            }
          }
        \`}</style>
`;
code = code.replace(/<MediaPlayer/, styleInjection + "<MediaPlayer");

// 3. Remove chaptersVtt logic
code = code.replace(
  /const chaptersVtt = useMemo\(\(\) => \{[\s\S]*?\}, \[source\.intro, source\.outro, episodeTitle, episodeNum, m\]\);/,
  "",
);
code = code.replace(
  /\{chaptersVtt && \([\s\S]*?<Track src=\{chaptersVtt\} kind="chapters" label="Chapters" lang="en" default \/>[\s\S]*?\)\}/,
  "",
);

// 4. Add CSS vars to MediaPlayer for the custom timeline
code = code.replace(
  /<MediaPlayer/g,
  `<MediaPlayer style={{ "--intro-start-pct": source.intro && duration ? (source.intro.start / Math.max(duration, 1)) * 100 + "%" : "0%", "--intro-end-pct": source.intro && duration ? (source.intro.end / Math.max(duration, 1)) * 100 + "%" : "0%", "--outro-start-pct": source.outro && duration ? (source.outro.start / Math.max(duration, 1)) * 100 + "%" : "100%", "--outro-end-pct": source.outro && duration ? (source.outro.end / Math.max(duration, 1)) * 100 + "%" : "100%" } as any}`,
);

// 5. Add custom Google Cast Button to top left
const castButtonInjection = `
                {/* Custom top-left Cast button for PC */}
                <div className="absolute left-16 top-4 z-50 hidden sm:block">
                  <GoogleCastButton className="vds-button rounded-full bg-black/40 p-2 text-white/80 backdrop-blur-md transition hover:bg-black/60 hover:text-white" />
                </div>
`;
code = code.replace(
  /<ArrowLeft className="size-5" \/>\s*<\/Link>/,
  `<ArrowLeft className="size-5" /></Link>${castButtonInjection}`,
);

// 6. Ensure GoogleCastButton is imported
if (!code.includes("GoogleCastButton")) {
  code = code.replace(/import \{/, "import { GoogleCastButton,");
}

fs.writeFileSync("src/routes/anime.watch.$id.tsx", code);
