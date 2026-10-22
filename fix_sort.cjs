const fs = require('fs');
for (const file of ['src/routes/anime.watch.$id.tsx', 'src/routes/anime.$id.tsx']) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('if (type === "PREQUEL") return 1;\n      if (type === "SEQUEL") return 2;', 'if (type === "SEQUEL") return 1;\n      if (type === "PREQUEL") return 2;');
  fs.writeFileSync(file, content);
}
console.log("Updated sortRelations in both files");
