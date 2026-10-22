const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

content = content.replace(/border-b border-white\/10 pb-4/g, 'pb-2');

fs.writeFileSync('src/components/CommentsSection.tsx', content);
