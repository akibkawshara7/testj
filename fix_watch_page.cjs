const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const skeletonCode = `function WatchPageSkeleton() {
  return (
    <main className="pb-0 pt-[68px]">
      <div className="mx-auto max-w-[1500px] px-2 sm:px-3 lg:px-5 pb-16">
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-3">
          <div className="min-w-0">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <div className="relative size-full overflow-hidden flex items-center justify-center bg-black">
                 <div className="relative z-10 flex flex-col items-center gap-3">
                   <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand)] shadow-[0_0_15px_var(--brand)]" />
                   <p className="text-xs font-bold text-white/80 animate-pulse tracking-wide">LOADING STREAM</p>
                 </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative h-full z-10">
            <div className="absolute inset-0 flex flex-col rounded-xl border border-white/5 bg-card/40 no-scrollbar">
               <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-2 py-2.5 rounded-t-xl z-20 gap-2">
                  <div className="h-4 w-24 skeleton-text" />
                  <div className="h-6 w-16 skeleton-text" />
               </div>
               <div className="flex-1 overflow-y-hidden p-2 space-y-1">
                   {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-xl border border-white/5 bg-card/40 p-1.5">
                         <div className="aspect-video w-20 shrink-0 rounded-lg skeleton-box" />
                         <div className="flex-1 space-y-1.5">
                           <div className="h-3 w-3/4 skeleton-text" />
                           <div className="h-2.5 w-1/2 skeleton-text opacity-70" />
                         </div>
                      </div>
                   ))}
               </div>
            </div>
          </div>
        </div>

        <div className="mt-3 lg:grid lg:grid-cols-[1fr_400px] lg:gap-3 lg:items-start">
          <div className="min-w-0">
             <div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4 flex flex-col">
                <div className="mb-4 pb-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                   <div className="flex items-center gap-5">
                     <div className="h-4 w-20 skeleton-text" />
                     <div className="h-4 w-20 skeleton-text" />
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="size-[30px] rounded-full skeleton-box" />
                     <div className="size-[30px] rounded-full skeleton-box" />
                   </div>
                </div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="h-4 w-16 skeleton-text" />
                  <div className="h-8 w-32 rounded-full skeleton-box" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="h-4 w-20 skeleton-text" />
                  <div className="flex gap-2">
                    <div className="h-8 w-24 rounded-full skeleton-box" />
                    <div className="h-8 w-24 rounded-full skeleton-box" />
                  </div>
                </div>
             </div>

             {/* Mobile Tabs Skeleton */}
             <div className="lg:hidden mt-3 rounded-2xl border border-white/5 bg-card/40 p-1.5 flex items-center justify-between relative">
                <div className="h-8 flex-1 skeleton-box rounded-xl mx-1" />
                <div className="h-8 flex-1 skeleton-box rounded-xl mx-1" />
                <div className="h-8 flex-1 skeleton-box rounded-xl mx-1" />
             </div>
             
             <div className="mt-4">
               <div className="flex gap-3">
                  <div className="hidden sm:block w-[140px] shrink-0">
                    <div className="aspect-[2/3] w-full rounded-xl skeleton-box" />
                  </div>
                  <div className="flex-1 space-y-3">
                     <div className="h-6 w-3/4 skeleton-text" />
                     <div className="h-4 w-1/3 skeleton-text" />
                     <div className="flex gap-2 mt-2">
                       <div className="h-6 w-16 rounded-full skeleton-box" />
                       <div className="h-6 w-16 rounded-full skeleton-box" />
                     </div>
                     <div className="h-20 w-full skeleton-text mt-4" />
                  </div>
               </div>
             </div>
          </div>
          <div className="hidden lg:flex flex-col gap-3">
             <div className="flex flex-col rounded-xl border border-white/5 bg-card/40 no-scrollbar overflow-hidden relative z-10">
                <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 rounded-t-xl z-20">
                   <div className="h-4 w-16 skeleton-text" />
                </div>
                <div className="flex-1 p-2 space-y-1.5 min-h-[300px]">
                   {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex min-w-0 items-center gap-3 rounded-xl border border-transparent p-2 pr-3">
                         <div className="size-14 shrink-0 rounded-lg skeleton-box sm:size-16" />
                         <div className="min-w-0 flex-1 pr-1 space-y-2">
                            <div className="h-3.5 w-full skeleton-text" />
                            <div className="h-2.5 w-2/3 skeleton-text opacity-70" />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}`;

content = content.replace(/function WatchPageSkeleton\(\) \{[\s\S]*?    <\/main>\n  \);\n\}/, skeletonCode);

const watchPageScrollEffect = `  const isPageReady = !isLoading && !!m;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [resolvedId, numEp]);

  return (`;

content = content.replace(`  const isPageReady = !isLoading && !!m;\n\n  return (`, watchPageScrollEffect);

fs.writeFileSync(file, content);
console.log("Updated Skeleton and auto-scroll");
