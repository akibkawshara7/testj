const fs = require('fs');
const content = fs.readFileSync('src/routes/anime.watch.$id.tsx', 'utf8');

const bodyEnd = content.indexOf('function WatchPageSkeleton');
const bodyStart = content.lastIndexOf('return (', bodyEnd);
console.log(content.substring(bodyStart, bodyEnd).substring(0, 3000));
