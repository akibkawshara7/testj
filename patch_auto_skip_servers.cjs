const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldChunk = `          <div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 mb-3">
            <div className="flex items-center gap-4 px-4 py-2.5">
              <button
                onClick={() => handleSetAutoSkip(!autoSkip)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/90 transition hover:text-foreground"
              >
                <span
                  className={
                    "grid size-3.5 shrink-0 place-items-center rounded border-2 transition " +
                    (autoSkip
                      ? "border-white bg-white text-black"
                      : "border-white/40 bg-transparent")
                  }
                >
                  {autoSkip && <Check className="size-2" strokeWidth={4} />}
                </span>
                Auto Skip
              </button>

              <button
                onClick={() => handleSetAutoNext(!autoNext)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/90 transition hover:text-foreground"
              >
                <span
                  className={
                    "grid size-3.5 shrink-0 place-items-center rounded border-2 transition " +
                    (autoNext
                      ? "border-white bg-white text-black"
                      : "border-white/40 bg-transparent")
                  }
                >
                  {autoNext && <Check className="size-2" strokeWidth={4} />}
                </span>
                Auto Next
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  disabled={currentEp <= 1}
                  onClick={() => goToEp(currentEp - 1)}
                  className="grid size-[32px] place-items-center rounded-full border border-white/5 bg-white/5 text-white transition-all duration-300 hover:bg-white/10 disabled:opacity-30"
                  title="Previous Episode"
                >
                  <ChevronLeft className="size-3 font-bold" strokeWidth={3} />
                </button>
                <button
                  disabled={currentEp >= total}
                  onClick={() => goToEp(currentEp + 1)}
                  className="grid size-[32px] place-items-center rounded-full border border-white/5 bg-white/5 text-white transition-all duration-300 hover:bg-white/10 disabled:opacity-30"
                  title="Next Episode"
                >
                  <ChevronRight className="size-3 font-bold" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4">`;

if (!content.includes(oldChunk)) {
  console.log("Could not find oldChunk directly, attempting regex matching.");
} else {
  // Let's build the new chunk
  // We'll remove the auto skip block from the top and put it inside the servers block at the bottom
  // First, replace oldChunk with just the start of the server box
  let newContent = content.replace(oldChunk, `          <div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4 flex flex-col">`);
  
  // Now find the end of the server box to insert the auto skip/next bar.
  // The end is marked by:
  //             ) : (
  //               <div className="text-sm text-white/50 py-2">No servers available</div>
  //             )}
  //           </div>
  const serverBoxEnd = `            ) : (
              <div className="text-sm text-white/50 py-2">No servers available</div>
            )}
          </div>`;
          
  const insertedBar = `            ) : (
              <div className="text-sm text-white/50 py-2">No servers available</div>
            )}

            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
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
                  className="flex items-center gap-1.5 rounded-full border border-white/5 bg-card/60 ring-1 ring-white/10 px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground disabled:opacity-30 disabled:hover:bg-card/60 disabled:hover:text-muted-foreground"
                  title="Previous Episode"
                >
                  <ChevronLeft className="size-3.5" strokeWidth={3} />
                  Prev Ep
                </button>
                <button
                  disabled={currentEp >= total}
                  onClick={() => goToEp(currentEp + 1)}
                  className="flex items-center gap-1.5 rounded-full border border-white/5 bg-card/60 ring-1 ring-white/10 px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground disabled:opacity-30 disabled:hover:bg-card/60 disabled:hover:text-muted-foreground"
                  title="Next Episode"
                >
                  Next Ep
                  <ChevronRight className="size-3.5" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>`;

  newContent = newContent.replace(serverBoxEnd, insertedBar);
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log("Successfully connected Auto Skip block to Servers box and updated Prev/Next buttons.");
  } else {
    console.log("Something went wrong during replacement.");
  }
}

