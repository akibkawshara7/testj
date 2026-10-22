const fs = require('fs');
let content = fs.readFileSync('src/routes/anime.watch.$id.tsx', 'utf8');

// Remove {epCount} Episodes in the header bars
content = content.replace(/<span className="text-\[11px\] font-bold uppercase tracking-wider text-white truncate">\s*\{epCount\} Episodes\s*<\/span>/g, '');

// Remove {epCount} Episodes pill from details
content = content.replace(/\{epCount > 0 && \(\s*<span className="rounded-xl bg-white\/5 px-3 py-1\.5 uppercase tracking-wider ring-1 ring-white\/10 text-foreground\/90">\s*\{epCount\} Episodes\s*<\/span>\s*\)\}/g, '');

fs.writeFileSync('src/routes/anime.watch.$id.tsx', content);
