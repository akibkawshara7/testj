const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add SkipBack and SkipForward to lucide-react imports
if (!content.includes('SkipBack,')) {
  content = content.replace('PlayCircle,', 'PlayCircle,\n  SkipBack,\n  SkipForward,');
}

// Remove NextIcon and PreviousIcon from @vidstack/react imports
content = content.replace(/  NextIcon,\n  PreviousIcon,\n/g, '');

// Replace usage
content = content.replace(/<PreviousIcon className="size-5" \/>/g, '<SkipBack className="size-5" fill="currentColor" />');
content = content.replace(/<NextIcon className="size-5" \/>/g, '<SkipForward className="size-5" fill="currentColor" />');

fs.writeFileSync(file, content);
console.log("Updated.");
