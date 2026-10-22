const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

// Main Post Button
content = content.replace(
  /bg-\[var\(--brand,#df7426\)\] px-4 py-2 text-sm font-bold text-white/,
  'bg-white px-4 py-2 text-sm font-bold text-black'
);

// Reply Button
content = content.replace(
  /text-white bg-\[var\(--brand,#df7426\)\] hover:brightness-110/g,
  'text-black bg-white hover:bg-zinc-200'
);

fs.writeFileSync('src/components/CommentsSection.tsx', content);
