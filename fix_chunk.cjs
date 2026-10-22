const fs = require("fs");
const file = "src/routes/manga.$id.tsx";
let content = fs.readFileSync(file, "utf-8");

const oldLogic = `    if (uniqueNumsAsc.length > 0) {
      const maxChapter = uniqueNumsAsc[uniqueNumsAsc.length - 1];
      let chunkIdx = 0;
      for (let start = 0; start <= maxChapter; start += 100) {
        const chunkStart = start === 0 ? 0 : start + 1;
        const chunkEnd = start + 100;
        const chunkNums = uniqueNumsAsc.filter((n) => n >= chunkStart && n <= chunkEnd);

        if (chunkNums.length > 0) {
          chunks.push(new Set(chunkNums));

          const isLast = chunkEnd >= maxChapter;
          const startLabel = chunkIdx === 0 ? chunkNums[0] : chunkStart;
          const endLabel = isLast ? chunkNums[chunkNums.length - 1] : chunkEnd;

          rangesArr.push({
            displayTrigger: sortOrder === "desc" ? \`\${endLabel} - \${startLabel}\` : \`\${startLabel} - \${endLabel}\`,
            displayOption: sortOrder === "desc" ? \`\${endLabel} - \${startLabel}\` : \`\${startLabel} - \${endLabel}\`,
            value: String(chunkIdx),
            rawIdx: chunkIdx,
          });
          chunkIdx++;
        }
      }
    } else {
      for (let s = 1; s <= count; s += 100) {
        const e = Math.min(s + 99, count);
        chunks.push(new Set());
        rangesArr.push({
          displayTrigger: sortOrder === "desc" ? \`\${e} - \${s}\` : \`\${s} - \${e}\`,
          displayOption: sortOrder === "desc" ? \`\${e} - \${s}\` : \`\${s} - \${e}\`,
          value: String((s - 1) / 100),
          rawIdx: (s - 1) / 100,
        });
      }
    }`;

const newLogic = `    if (uniqueNumsAsc.length > 0) {
      let chunkIdx = 0;
      for (let i = 0; i < uniqueNumsAsc.length; i += 100) {
        const chunkNums = uniqueNumsAsc.slice(i, i + 100);
        chunks.push(new Set(chunkNums));

        const startLabel = chunkNums[0];
        const endLabel = chunkNums[chunkNums.length - 1];

        rangesArr.push({
          displayTrigger: sortOrder === "desc" ? \`\${endLabel} - \${startLabel}\` : \`\${startLabel} - \${endLabel}\`,
          displayOption: sortOrder === "desc" ? \`\${endLabel} - \${startLabel}\` : \`\${startLabel} - \${endLabel}\`,
          value: String(chunkIdx),
          rawIdx: chunkIdx,
        });
        chunkIdx++;
      }
    } else {
      for (let s = 1; s <= count; s += 100) {
        const e = Math.min(s + 99, count);
        chunks.push(new Set());
        rangesArr.push({
          displayTrigger: sortOrder === "desc" ? \`\${e} - \${s}\` : \`\${s} - \${e}\`,
          displayOption: sortOrder === "desc" ? \`\${e} - \${s}\` : \`\${s} - \${e}\`,
          value: String((s - 1) / 100),
          rawIdx: (s - 1) / 100,
        });
      }
    }`;

if (content.includes(oldLogic)) {
  content = content.replace(oldLogic, newLogic);
  fs.writeFileSync(file, content);
  console.log("Successfully fixed chapter chunking in manga.$id.tsx");
} else {
  console.log("Failed to find old logic");
}
