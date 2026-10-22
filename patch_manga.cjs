const fs = require("fs");
const file = "src/routes/manga.$id.tsx";
let content = fs.readFileSync(file, "utf-8");

// Add import
if (!content.includes("formatRelativeTime")) {
  content = content.replace(
    'import { getScoreColor, formatScore, formatStatus, getStatusColor } from "@/lib/utils";',
    'import { getScoreColor, formatScore, formatStatus, getStatusColor, formatRelativeTime } from "@/lib/utils";',
  );
}

// Replace BookOpen icon with formatted time
const oldBlock = `              <span className="text-sm font-bold text-white group-hover:text-[var(--brand,#df7426)] transition-colors">
                Chapter {ch.chapter}
              </span>
              <BookOpen className="size-4 text-white/70 group-hover:text-white transition-colors" />
            </Link>`;
const newBlock = `              <span className="text-sm font-bold text-white group-hover:text-[var(--brand,#df7426)] transition-colors">
                Chapter {ch.chapter}
              </span>
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">
                {formatRelativeTime(ch.date) || <BookOpen className="size-4" />}
              </span>
            </Link>`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(file, content);
