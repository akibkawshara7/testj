const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  '<div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-5">',
  '<div className="relative z-20 rounded-2xl border border-white/5 bg-card/40 p-3 sm:p-4">',
);
content = content.replace(
  '<Subtitles className="size-5 text-white" />',
  '<Subtitles className="size-4 text-white" />',
);
content = content.replace(
  '<span className="text-white font-semibold text-[15px]">Servers</span>',
  '<span className="text-white font-semibold text-sm">Servers</span>',
);
content = content.replace(
  '<div className="flex items-center justify-end w-full max-w-[250px]">',
  '<div className="flex items-center justify-end w-full max-w-[200px]">',
);
content = content.replace(
  '<div className="relative flex w-full rounded-xl bg-white/5 p-1 backdrop-blur-md">',
  '<div className="relative flex w-full rounded-full bg-card/60 p-1 ring-1 ring-white/10 backdrop-blur-md">',
);
content = content.replace(
  'className="absolute bottom-1 top-1 left-1 rounded-lg bg-white transition-transform duration-300 ease-out shadow-md"',
  'className="absolute bottom-1 top-1 left-1 rounded-full bg-white transition-transform duration-300 ease-out shadow-sm"',
);

// We need to match the button class for the language selector
content = content.replace(
  /className=\{`relative z-10 flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-\[13px\] font-bold uppercase transition-colors duration-300 \$\{([\s\S]*?)\}`\}/g,
  (match, p1) => {
    return (
      "className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold uppercase transition-colors duration-300 ${" +
      p1.replace(
        '"text-white/60 hover:text-white/80"',
        '"text-muted-foreground hover:text-foreground"',
      ) +
      "}`}"
    );
  },
);
content = content.replace(
  /<Icon className="size-3.5" strokeWidth=\{2.5\} \/>/g,
  '<Icon className="size-3" strokeWidth={2.5} />',
);

content = content.replace(
  '<div className="flex justify-center items-center h-12">',
  '<div className="flex justify-center items-center h-10">',
);
content = content.replace(
  '<div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand)] shadow-[0_0_10px_var(--brand)]" />',
  '<div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand)] shadow-[0_0_10px_var(--brand)]" />',
);

content = content.replace(
  '<div className="flex flex-wrap items-center gap-2.5">',
  '<div className="flex flex-wrap items-center gap-2">',
);

content = content.replace(
  /className=\{`px-4 py-2 rounded-xl text-\[13px\] font-bold transition-all \$\{([\s\S]*?)\}`\}/g,
  (match, p1) => {
    return (
      "className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${" +
      p1
        .replace(
          '"bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.15)]"',
          '"bg-white text-black shadow-sm"',
        )
        .replace(
          '"bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"',
          '"bg-card/60 text-muted-foreground ring-1 ring-white/10 hover:text-foreground hover:bg-white/5"',
        ) +
      "}`}"
    );
  },
);

fs.writeFileSync(file, content);
console.log("Updated servers UI using targeted replace.");
