const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/  SkipBack,\n  SkipForward,\n/g, '');
// Re-insert just SkipBack if it's not there, but wait, SkipBack might already be there now if I just removed the one I added?
// Let's just remove the one after PlayCircle,.
content = content.replace('  PlayCircle,\n  SkipBack,\n  SkipForward,', '  PlayCircle,');

// Also, let's fix the missing `</div>` at the end of the server box
// Let's check where `          <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">` is.
// If it's preceded by `            )}`, we need a `          </div>` between them.
const missingDivString = `            )}
          <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">`;
if (content.includes(missingDivString)) {
  content = content.replace(missingDivString, `            )}
          </div>
          <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">`);
  console.log("Fixed missing div.");
}

fs.writeFileSync(file, content);
console.log("Fixed.");
