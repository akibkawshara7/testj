const fs = require("fs");
const file = "src/routes/anime.watch.$id.tsx";
let content = fs.readFileSync(file, "utf8");

const targetStr = "{/* Comments section for desktop layout, aligns with video player */}";
const targetIdx = content.indexOf(targetStr);

if (targetIdx !== -1) {
  const injection = `
          <div className="mt-4 hidden lg:block duration-300 animate-in fade-in slide-in-from-bottom-4">
            <AnimeDetails m={m} />
          </div>
          `;
  content = content.substring(0, targetIdx) + injection + content.substring(targetIdx);
  fs.writeFileSync(file, content);
  console.log("Injected AnimeDetails before Comments");
}
