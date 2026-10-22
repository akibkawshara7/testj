const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

content = content.replace(/bg-\[var\(--brand,#df7426\)\](.*?)text-white/g, 'bg-white$1text-black');
// also fix the Sign In button
content = content.replace(/bg-white px-4 py-1.5 text-xs font-bold text-black hover:brightness-110/g, 'bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-zinc-200');
// and the post comment button
content = content.replace(/bg-white px-4 py-2 text-xs font-bold text-black hover:brightness-110/g, 'bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200');

fs.writeFileSync('src/components/CommentsSection.tsx', content);
