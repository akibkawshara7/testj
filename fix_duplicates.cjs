const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('  PlayCircle,\n  SkipBack,\n  SkipForward,', '  PlayCircle,');

fs.writeFileSync(file, content);
console.log("Fixed.");
