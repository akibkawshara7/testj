const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// The main vertical trunk
code = code.replace(
  'border-l-2 border-white/10 pointer-events-none z-0',
  'border-l-2 border-orange-500/30 pointer-events-none z-0'
);

// The connection to the reply avatar
code = code.replace(
  /border-t-2 border-white\/10 pointer-events-none z-0/g,
  'border-t-2 border-orange-500/30 pointer-events-none z-0 rounded-bl-xl'
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
