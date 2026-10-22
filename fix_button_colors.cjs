const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original class name substring:
const origClass = 'className="grid size-[30px] place-items-center rounded-full border border-white/5 bg-card/60 ring-1 ring-white/10 text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground disabled:opacity-30 disabled:hover:bg-card/60 disabled:hover:text-muted-foreground"';

// New class name substring:
const newClass = 'className="grid size-[30px] place-items-center rounded-full border border-white/5 bg-card/60 ring-1 ring-white/10 text-white transition-all duration-300 hover:bg-white/20 disabled:text-muted-foreground disabled:opacity-50 disabled:hover:bg-card/60 disabled:hover:text-muted-foreground"';

content = content.replace(origClass, newClass);
content = content.replace(origClass, newClass); // Do it twice for both buttons

fs.writeFileSync(file, content);
console.log("Updated button classes for pure white.");
