const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `<span className="shrink-0 font-bold uppercase tracking-wide text-white">
                    {relationName}
                  </span>`;
const newCode = `<span className="shrink-0 uppercase tracking-wide text-muted-foreground">
                    {relationName}
                  </span>`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log("Updated DesktopRelatedList style");
