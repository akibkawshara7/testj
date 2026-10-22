const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");

// The Servers section
const oldServersHtml = `          <div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-5">
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
                        transform: \`translateX(calc(\${languages.indexOf(selectedLang)} * 100%))\`,
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
                    {src.server}
                  </button>
                ))}
              </div>
            ) : (`;

const newServersHtml = `          <div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 shrink-0">
                <Subtitles className="size-4 text-white" />
                <span className="text-white font-semibold text-sm">Servers</span>
              </div>

              <div className="flex items-center justify-end w-full max-w-[200px]">
                {languages.length > 0 && (
                  <div className="relative flex w-full rounded-full bg-card/60 p-1 ring-1 ring-white/10 backdrop-blur-md">
                    <div
                      className="absolute bottom-1 top-1 left-1 rounded-full bg-white transition-transform duration-300 ease-out shadow-sm"
                      style={{
                        width: \`calc((100% - 8px) / \${languages.length})\`,
                        transform: \`translateX(calc(\${languages.indexOf(selectedLang)} * 100%))\`,
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
                          className={\`relative z-10 flex flex-1 items-center justify-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold uppercase transition-colors duration-300 \${
                            selectedLang === lang
                              ? "text-black"
                              : "text-muted-foreground hover:text-foreground"
                          }\`}
                        >
                          <Icon className="size-3" strokeWidth={2.5} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {streamsFetching ? (
              <div className="flex justify-center items-center h-10">
                <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand)] shadow-[0_0_10px_var(--brand)]" />
              </div>
            ) : sources.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {sources.map((src) => (
                  <button
                    key={src.server}
                    onClick={() => setSelectedServer(src.server)}
                    className={\`px-3 py-1.5 rounded-full text-xs font-bold transition-all \${
                      selectedServer === src.server
                        ? "bg-white text-black shadow-sm"
                        : "bg-card/60 text-muted-foreground ring-1 ring-white/10 hover:text-foreground hover:bg-white/5"
                    }\`}
                  >
                    {src.server}
                  </button>
                ))}
              </div>
            ) : (`;

if (content.includes("bg-card/40 p-4 sm:p-5")) {
  content = content.replace(oldServersHtml, newServersHtml);
  fs.writeFileSync(file, content);
  console.log("Servers design updated successfully");
} else {
  console.log("Could not find exact block, let's try a regex replace");
}
