const fs = require("fs");
const file = "src/routes/anime.$id.tsx";
let content = fs.readFileSync(file, "utf-8");

content = content.replace(
  /<p className="mt-0.5 line-clamp-2 text-\[11px\] text-muted-foreground sm:text-xs">\s*Upcoming episode\s*<\/p>/,
  '<p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground sm:text-xs">{new Date(nextEp.airingAt * 1000).toLocaleString()}</p>',
);

fs.writeFileSync(file, content);
