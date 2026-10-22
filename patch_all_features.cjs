const fs = require('fs');
let content = fs.readFileSync('src/components/CommentsSection.tsx', 'utf8');

// 1. Remove @user tag from reply
content = content.replace(/setReplyText\(\`@\$\{comment\.author\?\.username \|\| "user"\} \`\);/g, 'setReplyText("");');
content = content.replace(/setReplyText\(\`@\$\{reply\.author\?\.username \|\| "user"\} \`\);/g, 'setReplyText("");');

// 2. Extract the "show replies" button
const showRepliesRegex = /\{\s*hasReplies\s*&&\s*\(\s*<button\s*type="button"\s*onClick=\{\(\)\s*=>\s*toggleCollapse\(comment\.id\)\}\s*className="p-1 rounded-md text-white\/40 hover:text-white hover:bg-white\/5 transition text-\[11px\] flex items-center gap-0\.5 cursor-pointer"\s*title=\{isCollapsed\s*\?\s*"Expand replies"\s*:\s*"Collapse replies"\}\s*>\s*\{isCollapsed\s*\?\s*\(\s*<>\s*<ChevronDown\s*className="size-3\.5"\s*\/>\s*<span>\{comment\.replies\.length\}\s*replies<\/span>\s*<\/>\s*\)\s*:\s*\(\s*<ChevronUp\s*className="size-3\.5"\s*\/>\s*\)\}\s*<\/button>\s*\)\s*\}/;

const extractedButtonMatch = content.match(showRepliesRegex);
if (extractedButtonMatch) {
  content = content.replace(showRepliesRegex, '');
} else {
  console.log("Could not find showReplies button!");
}

// 3. Insert "show replies" button next to "Reply" button
const replyButtonRegex = /\{\/\* Reply Button \*\/\}\s*<button\s*type="button"\s*onClick=\{\(\)\s*=>\s*\{[\s\S]*?<span>Reply<\/span>\s*<\/button>/;

const replyMatch = content.match(replyButtonRegex);
if (replyMatch) {
  const replacement = replyMatch[0] + `
                          {/* Show/Hide Replies Toggle */}
                          {hasReplies && (
                            <button
                              type="button"
                              onClick={() => toggleCollapse(comment.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-[var(--brand,#df7426)] hover:brightness-110 transition cursor-pointer select-none ml-2"
                            >
                              {isCollapsed ? (
                                <>
                                  <ChevronDown className="size-3.5" />
                                  <span>{comment.replies.length} replies</span>
                                </>
                              ) : (
                                <>
                                  <ChevronUp className="size-3.5" />
                                  <span>Hide</span>
                                </>
                              )}
                            </button>
                          )}
`;
  content = content.replace(replyButtonRegex, replacement);
} else {
    console.error("Could not find reply button regex!");
}

// 4. Wrap Replies in AnimatePresence and motion.div
// We will replace:
// {hasReplies && !isCollapsed && (
//   <div className="relative pl-5 sm:pl-6 ml-5 sm:ml-5 space-y-3 mt-1">
// with:
// <AnimatePresence initial={false}>
// {hasReplies && !isCollapsed && (
//   <motion.div
//     initial={{ height: 0, opacity: 0 }}
//     animate={{ height: "auto", opacity: 1 }}
//     exit={{ height: 0, opacity: 0 }}
//     transition={{ duration: 0.3, ease: "easeInOut" }}
//     className="relative pl-5 sm:pl-6 ml-5 sm:ml-5 space-y-3 mt-1 overflow-hidden"
//   >

const nestedRepliesStartRegex = /\{\s*hasReplies\s*&&\s*!isCollapsed\s*&&\s*\(\s*<div\s*className="relative pl-5 sm:pl-6 ml-5 sm:ml-5 space-y-3 mt-1"\s*>/;

if (content.match(nestedRepliesStartRegex)) {
  content = content.replace(nestedRepliesStartRegex, `<AnimatePresence initial={false}>
                  {hasReplies && !isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="relative pl-5 sm:pl-6 ml-5 sm:ml-5 space-y-3 mt-1 overflow-hidden"
                    >`);
  
  // Now we need to replace the end part
  // We look for:
  //                     })}
  //                   </div>
  //                 )}
  //               </div>
  //             );
  
  const nestedRepliesEndRegex = /\}\s*\)\}\s*<\/div>\s*\)\}\s*<\/div>\s*\);\s*\}\)\s*\)\}/;
  if (content.match(nestedRepliesEndRegex)) {
    content = content.replace(nestedRepliesEndRegex, `}
                    )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}`);
  } else {
    console.log("Could not find the end of nested replies block");
  }
} else {
  console.log("Could not find start of nested replies block");
}

fs.writeFileSync('src/components/CommentsSection.tsx', content);
