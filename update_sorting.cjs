const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

// I need to find the DesktopRelatedList
const targetStart = 'function DesktopRelatedList({';
const targetIndex = content.indexOf(targetStart);
if (targetIndex === -1) {
    console.log("DesktopRelatedList not found");
} else {
    console.log("Found DesktopRelatedList");
}
