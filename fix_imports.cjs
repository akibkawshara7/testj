const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(', ExternalLink} from "lucide-react";', '');
content = content.replace(/import \{([\s\S]*?)\} from "lucide-react";/, (match, p1) => {
  return \`import {\${p1}, ExternalLink} from "lucide-react";\`;
});

fs.writeFileSync(file, content);
console.log("Fixed imports");
