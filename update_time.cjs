const fs = require("fs");
const file = "src/lib/utils.ts";
let content = fs.readFileSync(file, "utf-8");

content = content.replace(
  /export function formatRelativeTime[\s\S]*?y ago\`;\n}/,
  `export function formatRelativeTime(dateString: string | undefined): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const targetTime = date.getTime();
  if (isNaN(targetTime)) return null;

  const now = new Date();
  const diffMs = now.getTime() - targetTime;
  
  if (diffMs < 0) return "soon";

  // Check if it's the exact same calendar day in local timezone
  const isToday = 
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "today";

  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // If not today but less than 24h, or 1 day difference
  if (diffDays < 1 && !isToday) return "1d ago";
  if (diffDays >= 1 && diffDays < 7) return \`\${diffDays}d ago\`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return \`\${diffWeeks}w ago\`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return \`\${Math.max(1, diffMonths)}m ago\`;

  const diffYears = Math.floor(diffDays / 365);
  return \`\${Math.max(1, diffYears)}y ago\`;
}`,
);

fs.writeFileSync(file, content);
