const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const sortHelper = `
function sortRelations(relations: { relationType: string; node: AnilistMedia }[]) {
  // Sort priority: PREQUEL -> SEQUEL -> everything else based on averageScore or popularity
  return [...relations].sort((a, b) => {
    const typeA = a.relationType?.toUpperCase() || "";
    const typeB = b.relationType?.toUpperCase() || "";
    
    // Explicit priority
    const priority = (type: string) => {
      if (type === "PREQUEL") return 1;
      if (type === "SEQUEL") return 2;
      return 3;
    };
    
    const pA = priority(typeA);
    const pB = priority(typeB);
    
    if (pA !== pB) return pA - pB;
    
    // Fallback to popularity or score
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

// Update DesktopRelatedList
content = content.replace(
  'relations.map((r) => {',
  'sortRelations(relations).map((r) => {'
);

fs.writeFileSync(file, content);
console.log("Updated DesktopRelatedList sorting.");
