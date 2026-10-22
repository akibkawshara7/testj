const fs = require("fs");

function patchFile(file) {
  let content = fs.readFileSync(file, "utf8");

  // We want to replace the whole ChapterPill function with one that uses SharedSelect
  // We can just construct it.
}
