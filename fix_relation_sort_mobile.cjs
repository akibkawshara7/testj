const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

// For mobile RelatedRow:
content = content.replace(
  'for (const r of relations) {',
  'for (const r of sortRelations(relations)) {'
);

fs.writeFileSync(file, content);
console.log("Updated RelatedRow sorting.");
