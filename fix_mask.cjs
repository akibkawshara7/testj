const fs = require('fs');
const file = 'src/lib/vidstack-icons.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the random ID with a static one, or useId
content = content.replace(/const maskId = \`cc-slash-\\\$\\{Math\.random\(\)\.toString\(36\)\.substring\(2, 9\)\}\`;/, 'const maskId = "cc-slash-mask";');

fs.writeFileSync(file, content);
console.log("Fixed maskId");
