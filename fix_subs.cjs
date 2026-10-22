const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `<Track
              src={source.caption}
              kind="subtitles"
              label="English"
              lang="en"
              type="vtt"
              default
            />`;

const newCode = `<Track
              src={source.caption}
              kind="subtitles"
              label="English"
              lang="en"
              type="vtt"
              default
            />`;

// ensure it's there
if(!content.includes('default\n            />')) {
  console.log("Adding default property to Track...");
}

fs.writeFileSync(file, content);
console.log("Done");
