const fs = require('fs');
let content = fs.readFileSync('node_modules/@vidstack/react/dev/player/vidstack-default-components.js', 'utf8');
const before = content.length;
content = content.replace(/\/\* @__PURE__ \*\/ React\.createElement\(Gesture, \{\s*className: "vds-gesture",\s*event: "dblpointerup",\s*action: "toggle:fullscreen"\s*\}\),?/g, "");
console.log("Before:", before, "After:", content.length);
