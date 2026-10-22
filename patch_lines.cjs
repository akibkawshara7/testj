const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

// Remove spine line
content = content.replace(/<div className="absolute left-0 top-0 bottom-6 w-\[2px\] bg-white\/15" \/>/g, '');

// Remove branch lines
const branchLineRegex = /<div\s*className=\{cn\(\s*"absolute -left-5 sm:-left-6 top-4 w-4 sm:w-5 h-4 border-b-2 border-l-2 border-white\/15 rounded-bl-xl pointer-events-none"\s*\)\}\s*\/>/g;
content = content.replace(branchLineRegex, '');

fs.writeFileSync('src/components/CommentsSection.tsx', content);
