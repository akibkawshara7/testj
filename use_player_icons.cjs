const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<SkipBack className="size-4" strokeWidth=\{2\} \/>/g, '<PreviousIcon className="size-5" />');
content = content.replace(/<SkipForward className="size-4" strokeWidth=\{2\} \/>/g, '<NextIcon className="size-5" />');

fs.writeFileSync(file, content);
console.log("Updated icons");
