const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

code = code.replace(
  'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25',
  'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25'
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
