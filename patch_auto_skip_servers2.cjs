const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const bottomBarStart = `            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">`;
const bottomBarEnd = `            </div>
          </div>`;

if (content.includes(bottomBarStart)) {
  const bottomBarChunk = content.substring(
    content.indexOf(bottomBarStart),
    content.indexOf(bottomBarEnd) + 18 // up to </div>
  );

  // We remove the bottom bar from the bottom:
  let newContent = content.replace(bottomBarChunk + '\n          </div>', '          </div>');

  // Then we reconstruct the top bar
  const topBarHtml = `            <div className="mb-4 pb-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleSetAutoSkip(!autoSkip)}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground/90 transition hover:text-foreground"
                >
                  <span
                    className={
                      "grid size-4 shrink-0 place-items-center rounded border-2 transition " +
                      (autoSkip
                        ? "border-white bg-white text-black"
                        : "border-white/40 bg-transparent")
                    }
                  >
                    {autoSkip && <Check className="size-2.5" strokeWidth={4} />}
                  </span>
                  Auto Skip
                </button>

                <button
                  onClick={() => handleSetAutoNext(!autoNext)}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground/90 transition hover:text-foreground"
                >
                  <span
                    className={
                      "grid size-4 shrink-0 place-items-center rounded border-2 transition " +
                      (autoNext
                        ? "border-white bg-white text-black"
                        : "border-white/40 bg-transparent")
                    }
                  >
                    {autoNext && <Check className="size-2.5" strokeWidth={4} />}
                  </span>
                  Auto Next
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentEp <= 1}
                  onClick={() => goToEp(currentEp - 1)}
                  className="grid size-[30px] place-items-center rounded-full border border-white/5 bg-card/60 ring-1 ring-white/10 text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground disabled:opacity-30 disabled:hover:bg-card/60 disabled:hover:text-muted-foreground"
                  title="Previous Episode"
                >
                  <ChevronLeft className="size-4" strokeWidth={3} />
                </button>
                <button
                  disabled={currentEp >= total}
                  onClick={() => goToEp(currentEp + 1)}
                  className="grid size-[30px] place-items-center rounded-full border border-white/5 bg-card/60 ring-1 ring-white/10 text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground disabled:opacity-30 disabled:hover:bg-card/60 disabled:hover:text-muted-foreground"
                  title="Next Episode"
                >
                  <ChevronRight className="size-4" strokeWidth={3} />
                </button>
              </div>
            </div>

`;

  // We insert this at the top of the server container
  const serverBoxStart = `<div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 shrink-0">
                <Subtitles className="size-4 text-white" />
                <span className="text-white font-semibold text-sm">Servers</span>
              </div>`;

  newContent = newContent.replace(
    serverBoxStart,
    `<div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4 flex flex-col">\n` +
    topBarHtml +
    `            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 shrink-0">
                <Subtitles className="size-4 text-white" />
                <span className="text-white font-semibold text-sm">Servers</span>
              </div>`
  );

  fs.writeFileSync(file, newContent);
  console.log("Moved Auto Skip / Next Ep controls above the server list and converted to icons-only");
} else {
  console.log("Could not find bottom bar chunk");
}

