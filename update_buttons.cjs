const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// Replace Main Edit Box Buttons
code = code.replace(
`                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded-full text-xs font-semibold text-white/60 hover:text-white bg-white/5 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                if (!isSubmittingEdit) handleSaveEdit(comment.id);
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isSubmittingEdit) handleSaveEdit(comment.id);
                              }}
                              disabled={isSubmittingEdit}
                              className="px-3.5 py-1 rounded-full text-xs font-bold text-black bg-white cursor-pointer"
                            >
                              Save
                            </button>`,
`                            <span className="text-[11px] text-white/40 mr-1 font-mono">
                              {editText.length}/2000
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                if (!isSubmittingEdit && editText.trim()) handleSaveEdit(comment.id);
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isSubmittingEdit && editText.trim()) handleSaveEdit(comment.id);
                              }}
                              disabled={isSubmittingEdit || !editText.trim()}
                              className={cn(
                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",
                                editText.trim()
                                  ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                                  : "bg-white/10 text-white/40"
                              )}
                            >
                              <ArrowUp className="size-4" />
                            </button>`
);

// Replace Reply Edit Box Buttons
code = code.replace(
`                                            <button
                                              type="button"
                                              onClick={() => setEditingId(null)}
                                              className="px-2.5 py-1 rounded-full text-xs font-semibold text-white/60 hover:text-white bg-white/5 cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="button"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                if (!isSubmittingEdit)
                                                  handleSaveEdit(comment.id, reply.id);
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                if (!isSubmittingEdit)
                                                  handleSaveEdit(comment.id, reply.id);
                                              }}
                                              disabled={isSubmittingEdit}
                                              className="px-3 py-1 rounded-full text-xs font-bold text-black bg-white cursor-pointer"
                                            >
                                              Save
                                            </button>`,
`                                            <span className="text-[11px] text-white/40 mr-1 font-mono">
                                              {editText.length}/2000
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => setEditingId(null)}
                                              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="button"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                if (!isSubmittingEdit && editText.trim())
                                                  handleSaveEdit(comment.id, reply.id);
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                if (!isSubmittingEdit && editText.trim())
                                                  handleSaveEdit(comment.id, reply.id);
                                              }}
                                              disabled={isSubmittingEdit || !editText.trim()}
                                              className={cn(
                                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",
                                                editText.trim()
                                                  ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                                                  : "bg-white/10 text-white/40"
                                              )}
                                            >
                                              <ArrowUp className="size-4" />
                                            </button>`
);

// Replace Reply Box Buttons
// We must find the reply input box and change the buttons.
// The code looks like this:
//                                   <button
//                                     type="button"
//                                     onClick={() => setReplyingToId(null)}
//                                     className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition"
//                                   >
//                                     Cancel
//                                   </button>
//                                   <button
//                                     type="button"
//                                     onPointerDown={(e) => {
//                                       e.preventDefault(); // Prevents textarea blur
//                                       if (replyText.trim() && !isSubmittingReply) { ... }
//                                     }}
//                                     onClick={(e) => { ... }}
//                                     disabled={!replyText.trim() || isSubmittingReply}
//                                     className="px-4 py-1.5 rounded-full text-xs font-bold text-black bg-white hover:bg-zinc-200 disabled:opacity-40 transition cursor-pointer"
//                                   >
//                                     {isSubmittingReply ? "Posting..." : "Reply"}
//                                   </button>

code = code.replace(
`                                    disabled={!replyText.trim() || isSubmittingReply}
                                    className="px-4 py-1.5 rounded-full text-xs font-bold text-black bg-white hover:bg-zinc-200 disabled:opacity-40 transition cursor-pointer"
                                  >
                                    {isSubmittingReply ? "Posting..." : "Reply"}
                                  </button>`,
`                                    disabled={!replyText.trim() || isSubmittingReply}
                                    className={cn(
                                      "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",
                                      replyText.trim()
                                        ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                                        : "bg-white/10 text-white/40"
                                    )}
                                  >
                                    <ArrowUp className="size-4" />
                                  </button>`
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
console.log("Updated buttons");
