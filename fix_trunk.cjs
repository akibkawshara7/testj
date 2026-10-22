const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// 1. Remove the trunk from the replies container
code = code.replace(
  '{/* Main vertical trunk */}\n                    <div className="absolute left-[19px] top-[-36px] bottom-0 border-l-2 border-orange-500/30 pointer-events-none z-0" />',
  ''
);

// 2. Add the trunk to the parent container
// Search for the comment root div
code = code.replace(
  /<div\n\s*key=\{comment\.id\}\n\s*className="border border-white\/10 rounded-\[20px\] p-3 sm:p-4 relative"\n\s*>/g,
  `<div
            key={comment.id}
            className="border border-white/10 rounded-[20px] p-3 sm:p-4 relative"
          >
            {(hasReplies ||
              replyingToId === comment.id ||
              (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
              <div className="absolute left-[31px] sm:left-[35px] top-[52px] sm:top-[56px] bottom-[24px] border-l-2 border-orange-500/30 pointer-events-none z-0" />
            )}`
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
