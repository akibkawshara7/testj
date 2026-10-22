const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

// Remove Episode/Chapter text under the comments title
content = content.replace(/\{epOrChNum && \(\s*<p className="text-\[11px\] text-white\/50">\s*\{mediaType === "manga" \? `Chapter \$\{epOrChNum\}` : `Episode \$\{epOrChNum\}`\}\s*<\/p>\s*\)\}/g, '');

fs.writeFileSync('src/components/CommentsSection.tsx', content);
