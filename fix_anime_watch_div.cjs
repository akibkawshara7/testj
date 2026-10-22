const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// The missing div is before the <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">
// Let's find that line
let index = lines.findIndex(line => line.includes('className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4"'));

if (index !== -1) {
  lines.splice(index, 0, '          </div>');
  fs.writeFileSync(file, lines.join('\n'));
  console.log("Added missing </div> at line " + (index + 1));
} else {
  console.log("Could not find the target line");
}
