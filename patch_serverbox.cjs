const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");

const startStr = '<div className="relative z-20 rounded-2xl border border-white/5 bg-card/40">';
const endStr = "{/* Comments section for desktop layout, aligns with video player */}";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `<div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 shrink-0">
                <Subtitles className="size-5 text-white" />
                <span className="text-white font-semibold text-[15px]">Servers</span>
              </div>

              <div className="flex items-center justify-end w-full max-w-[250px]">
                {languages.length > 0 && (
                  <div className="relative flex w-full rounded-xl bg-white/5 p-1 backdrop-blur-md">
                    <div
                      className="absolute bottom-1 top-1 left-1 rounded-lg bg-white transition-transform duration-300 ease-out shadow-md"
                      style={{
                        width: \`calc((100% - 8px) / \${languages.length})\`,
                        transform: \`translateX(calc(\${languages.indexOf(selectedLang)} * 100%))\`
                      }}
                    />
                    {languages.map((lang) => {
                      const isSub = lang === "SUB" || lang === "JAPANESE";
                      const isDub = lang === "DUB" || lang === "ENGLISH";
                      const isHindi = lang === "HINDI";
                      
                      let Icon = isSub ? Subtitles : Mic;
                      let label = lang;
                      if (isSub) label = "SUB";
                      else if (isDub) label = "DUB";
                      else if (isHindi) label = "HINDI";

                      return (
                        <button
                          key={lang}
                          onClick={() => setSelectedLang(lang)}
                          className={\`relative z-10 flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold uppercase transition-colors duration-300 \${
                            selectedLang === lang
                              ? "text-black"
                              : "text-white/60 hover:text-white/80"
                          }\`}
                        >
                          <Icon className="size-3.5" strokeWidth={2.5} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {streamsFetching ? (
              <div className="flex justify-center items-center h-12">
                <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand)] shadow-[0_0_10px_var(--brand)]" />
              </div>
            ) : sources.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {sources.map((src) => (
                  <button
                    key={src.server}
                    onClick={() => setSelectedServer(src.server)}
                    className={\`px-4 py-2 rounded-xl text-[13px] font-bold transition-all \${
                      selectedServer === src.server
                        ? "bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }\`}
                  >
                    {serverLabel(src, selectedLang)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/50 py-2">No servers available</div>
            )}
          </div>

          `;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log("Updated Server box");
} else {
  console.log("Could not find start or end index");
}
