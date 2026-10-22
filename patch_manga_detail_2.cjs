const fs = require("fs");
const file = "src/routes/manga.$id.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/MangaCard/g, "AnimeCard");
content = content.replace(/MangaRow/g, "AnimeRow");
content = content.replace(/MangaRowShell/g, "AnimeRowShell");
// It might have imported MangaCard from "@/components/MangaCard" => AnimeCard from "@/components/AnimeCard"

fs.writeFileSync(file, content);
console.log("Fixed manga.$id.tsx imports");
