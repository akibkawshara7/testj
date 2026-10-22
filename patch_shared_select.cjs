const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

// Replace sort controls with SharedSelect
const sortControlRegex = /\{\/\* Sort Controls \*\/\}\s*<div className="relative flex items-center bg-\[#0a0a0a\] rounded-xl border border-white\/5 overflow-hidden">[\s\S]*?<\/div>/;

const newSortControls = `{/* Sort Controls */}
        <div className="w-[130px]">
          <SharedSelect
            value={sortBy}
            onChange={(v) => setSortBy(v)}
            options={[
              { value: "top", display: "Top" },
              { value: "newest", display: "Newest" },
              { value: "oldest", display: "Oldest" },
            ]}
          />
        </div>`;

content = content.replace(sortControlRegex, newSortControls);

// Make sure SharedSelect is imported
if (!content.includes('import { SharedSelect }')) {
  content = content.replace('import { UserAvatar } from "./UserAvatar";', 'import { UserAvatar } from "./UserAvatar";\nimport { SharedSelect } from "@/components/SharedSelect";');
}

fs.writeFileSync('src/components/CommentsSection.tsx', content);
