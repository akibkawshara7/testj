const fs = require('fs');
const content = fs.readFileSync('src/routes/anime.watch.$id.tsx', 'utf8');

const match = content.match(/function WatchBody([\s\S]*?)function/);
if (match) {
  const code = match[1];
  console.log(code.substring(code.indexOf('return ('), code.indexOf('return (') + 2000));
}
