const fs = require("fs");
const file = "src/lib/utils.ts";
let content = fs.readFileSync(file, "utf-8");

const utilCode = `
export function formatRelativeTime(dateString: string | undefined): string | null {
  if (!dateString) return null;
  const targetTime = new Date(dateString).getTime();
  if (isNaN(targetTime)) return null;

  const now = Date.now();
  const diffMs = now - targetTime;
  
  if (diffMs < 0) return "soon";

  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) return "today";

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return \`\${diffDays}d ago\`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return \`\${diffWeeks}w ago\`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return \`\${diffMonths}m ago\`;

  const diffYears = Math.floor(diffDays / 365);
  return \`\${diffYears}y ago\`;
}
`;

content = content + utilCode;
fs.writeFileSync(file, content);
