const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add SkipBack and SkipForward to lucide-react imports
if (!content.includes('SkipBack')) {
  content = content.replace('PlayCircle,', 'PlayCircle,\n  SkipBack,\n  SkipForward,');
}

// 2. Remove the extra bottom bar completely
const bottomBarStart = `            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">`;

if (content.includes(bottomBarStart)) {
  const startIndex = content.indexOf(bottomBarStart);
  // We want to remove this block. Let's find the end of this block.
  // It ends right before `          <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">`
  
  const endSearchString = `          <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">`;
  const endIndex = content.indexOf(endSearchString, startIndex);
  
  if (endIndex !== -1) {
    const stringToRemove = content.substring(startIndex, endIndex);
    content = content.replace(stringToRemove, '');
    console.log("Removed extra bottom bar.");
  }
}

// 3. Change ChevronLeft and ChevronRight in the *top* bar to SkipBack and SkipForward
// We have: <ChevronLeft className="size-4" strokeWidth={3} />
// We replace with: <SkipBack className="size-4" fill="currentColor" strokeWidth={0} /> (or similar, SkipBack usually doesn't need fill, but let's just use SkipBack instead of ChevronLeft)
// Actually, `SkipBack` is a stroke icon by default. Let's just swap the component names.
content = content.replace(/<ChevronLeft className="size-4" strokeWidth=\{3\} \/>/g, '<SkipBack className="size-4" strokeWidth={2} />');
content = content.replace(/<ChevronRight className="size-4" strokeWidth=\{3\} \/>/g, '<SkipForward className="size-4" strokeWidth={2} />');

fs.writeFileSync(file, content);
console.log("Updated.");
