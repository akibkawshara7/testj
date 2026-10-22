const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/import \{([\s\S]*?)\} from "lucide-react";/, (match, p1) => {
  if (!p1.includes("ExternalLink")) {
    return "import {" + p1 + ', ExternalLink} from "lucide-react";';
  }
  return match;
});
fs.writeFileSync(file, content);
console.log("Updated imports");
