const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// 1. Main Comment Structure
// Find:
//               <div className="flex gap-3 relative">
//                 {/* Avatar */}
//                 <div className="shrink-0 relative z-10">
//                   <UserAvatar
//                     avatarUrl={comment.author?.avatarUrl}
//                     frameUrl={comment.author?.frameUrl}
//                     username={comment.author?.username}
//                     size="md"
//                   />
//                 </div>
//                 {/* Comment Body */}
//                 <div className="flex-1 min-w-0">

// Replace with:
//               <div className="flex gap-3">
//                 {/* Avatar + Thread Line */}
//                 <div className="shrink-0 flex flex-col items-center">
//                   <UserAvatar
//                     avatarUrl={comment.author?.avatarUrl}
//                     frameUrl={comment.author?.frameUrl}
//                     username={comment.author?.username}
//                     size="md"
//                   />
//                   {(hasReplies ||
//                     replyingToId === comment.id ||
//                     (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
//                     <div className="w-[2px] bg-white/10 grow mt-3 mb-1 rounded-full pointer-events-none" />
//                   )}
//                 </div>
//                 {/* Comment Body */}
//                 <div className="flex-1 min-w-0">

code = code.replace(
`                <div className="flex gap-3 relative">
                  {/* Avatar */}
                  <div className="shrink-0 relative z-10">
                    <UserAvatar
                      avatarUrl={comment.author?.avatarUrl}
                      frameUrl={comment.author?.frameUrl}
                      username={comment.author?.username}
                      size="md"
                    />
                  </div>

                  {/* Comment Body */}
                  <div className="flex-1 min-w-0">`,
`                <div className="flex gap-3">
                  {/* Avatar + Thread Line */}
                  <div className="shrink-0 flex flex-col items-center">
                    <UserAvatar
                      avatarUrl={comment.author?.avatarUrl}
                      frameUrl={comment.author?.frameUrl}
                      username={comment.author?.username}
                      size="md"
                    />
                    {(hasReplies ||
                      replyingToId === comment.id ||
                      (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                      <div className="w-[2px] bg-white/10 grow mt-3 mb-1 rounded-full pointer-events-none" />
                    )}
                  </div>

                  {/* Comment Body */}
                  <div className="flex-1 min-w-0">`
);

// 2. Move Replies inside Comment Body Column
// Find:
//                     )}
//                   </div>
//                 </div>
//
//                 {/* Replies Section */}
//                 {(hasReplies ||
//                   replyingToId === comment.id ||
//                   (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
//                   <div className="relative mt-4 pl-[42px] sm:pl-12">
//                     {/* The connecting vertical line */}
//                     <div className="absolute left-[19px] top-[-30px] bottom-5 w-6 border-l-2 border-b-2 border-white/10 rounded-bl-2xl z-0 pointer-events-none" />
//
//                     <div className="relative z-10 space-y-3">
//                       {/* Existing Replies */}

// Replace with:
//                     )}
//
//                     {/* Replies Section */}
//                     {(hasReplies ||
//                       replyingToId === comment.id ||
//                       (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
//                       <div className="mt-4 space-y-3">
//                         {/* Existing Replies */}

code = code.replace(
`                    )}
                  </div>
                </div>

                {/* Replies Section */}
                {(hasReplies ||
                  replyingToId === comment.id ||
                  (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                  <div className="relative mt-4 pl-[42px] sm:pl-12">
                    {/* The connecting vertical line */}
                    <div className="absolute left-[19px] top-[-30px] bottom-5 w-6 border-l-2 border-b-2 border-white/10 rounded-bl-2xl z-0 pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                      {/* Existing Replies */}`,
`                    )}

                    {/* Replies Section */}
                    {(hasReplies ||
                      replyingToId === comment.id ||
                      (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                      <div className="mt-4 space-y-3">
                        {/* Existing Replies */}`
);

// Also fix the closing tags at the bottom of the comment block
// It used to be:
//                         )}
//                       </AnimatePresence>
// 
//                       {/* Reply Input Box */}
//                       {replyingToId && ... }
// 
//                       {/* Toggle Replies Pill */}
//                       {hasReplies && ( ... )}
//                     </div>
//                   </div>
//                 )}
//               </div>
// 
// With our change we removed one nesting div ("relative z-10 space-y-3"), 
// so we need to remove one closing div. Let's just find the closing section.

code = code.replace(
`                        {hasReplies && (
                          <button
                            type="button"
                            onClick={() => toggleCollapse(comment.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/60 hover:text-white transition cursor-pointer"
                          >
                            {isCollapsed ? (
                              <>
                                <ChevronDown className="size-3.5" />
                                Show {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                              </>
                            ) : (
                              <>
                                <ChevronUp className="size-3.5" />
                                Hide replies
                              </>
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );`,
`                        {hasReplies && (
                          <button
                            type="button"
                            onClick={() => toggleCollapse(comment.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/60 hover:text-white transition cursor-pointer"
                          >
                            {isCollapsed ? (
                              <>
                                <ChevronDown className="size-3.5" />
                                Show {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                              </>
                            ) : (
                              <>
                                <ChevronUp className="size-3.5" />
                                Hide replies
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );`
);

// We need to fix the edit boxes and reply input box styling.
// We will do it in a cleaner way.

fs.writeFileSync('src/components/CommentsSection.tsx', code);
console.log("Updated structure");
