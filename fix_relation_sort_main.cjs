const fs = require('fs');
const file = 'src/routes/anime.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const sortHelper = `
function sortRelations(relations: { relationType: string; node: AnilistMedia }[]) {
  return [...relations].sort((a, b) => {
    const typeA = a.relationType?.toUpperCase() || "";
    const typeB = b.relationType?.toUpperCase() || "";
    
    const priority = (type: string) => {
      if (type === "PREQUEL") return 1;
      if (type === "SEQUEL") return 2;
      return 3;
    };
    
    const pA = priority(typeA);
    const pB = priority(typeB);
    
    if (pA !== pB) return pA - pB;
    
    const scoreA = (a.node.averageScore || a.node.meanScore || 0);
    const scoreB = (b.node.averageScore || b.node.meanScore || 0);
    if (scoreA !== scoreB) return scoreB - scoreA;
    
    return (b.node.popularity || 0) - (a.node.popularity || 0);
  });
}
`;

if (!content.includes('function sortRelations')) {
  // Insert at the top near imports
  content = content.replace('import { Footer } from "@/components/Footer";', 'import { Footer } from "@/components/Footer";' + sortHelper);
}

// In AnimeDetails, relations are passed to SeasonsTab or similar, but the RelatedRow uses AnilistMedia[] directly? Let's check where relations are mapped in the main Details page.
// The relations are in data?.media?.relations?.edges
content = content.replace(
  'const relations = data?.media?.relations?.edges || [];',
  'const relations = sortRelations(data?.media?.relations?.edges || []);'
);

fs.writeFileSync(file, content);
console.log("Updated Details Page relation sorting.");
