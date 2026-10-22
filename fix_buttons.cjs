const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// 1. Textarea sizing for New Comment
code = code.replace(
`              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value.slice(0, 2000))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (newCommentText.trim() && !isSubmitting) {
                      handlePostComment();
                    }
                  }
                }}
                placeholder="Write a comment..."
                rows={2}
                className="w-full bg-transparent p-3 sm:p-4 text-[15px] text-white focus:outline-none resize-none placeholder:text-white/40"
              />`,
`              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value.slice(0, 2000))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (newCommentText.trim() && !isSubmitting) {
                      handlePostComment();
                    }
                  }
                }}
                placeholder="Write a comment..."
                rows={1}
                className="w-full bg-transparent px-3 py-3 sm:px-4 sm:py-3.5 text-[15px] text-white focus:outline-none resize-none placeholder:text-white/40 min-h-[48px]"
              />`
);

// 2. Textarea sizing for Main Edit Box
code = code.replace(
`                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (!isSubmittingEdit && editText.trim()) handleSaveEdit(comment.id);
                            }
                          }}
                          rows={2}
                          className="w-full bg-transparent text-sm text-white focus:outline-none resize-none"
                        />`,
`                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (!isSubmittingEdit && editText.trim()) handleSaveEdit(comment.id);
                            }
                          }}
                          rows={1}
                          className="w-full bg-transparent text-[15px] text-white focus:outline-none resize-none min-h-[40px]"
                        />`
);

// 3. Textarea sizing for Reply Edit Box
code = code.replace(
`                                        <textarea
                                          value={editText}
                                          onChange={(e) => setEditText(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                              e.preventDefault();
                                              if (!isSubmittingEdit && editText.trim())
                                                handleSaveEdit(comment.id, reply.id);
                                            }
                                          }}
                                          rows={2}
                                          className="w-full bg-transparent text-sm text-white focus:outline-none resize-none"
                                        />`,
`                                        <textarea
                                          value={editText}
                                          onChange={(e) => setEditText(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                              e.preventDefault();
                                              if (!isSubmittingEdit && editText.trim())
                                                handleSaveEdit(comment.id, reply.id);
                                            }
                                          }}
                                          rows={1}
                                          className="w-full bg-transparent text-[15px] text-white focus:outline-none resize-none min-h-[40px]"
                                        />`
);


// 4. Textarea sizing for Reply Input Box
code = code.replace(
`                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value.slice(0, 2000))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      if (replyText.trim() && !isSubmittingReply) {
                                        handlePostReply(
                                          comment.id,
                                          replyingToId === comment.id
                                            ? comment.author?.username || "user"
                                            : comment.replies.find((r) => r.id === replyingToId)
                                                ?.author?.username || "user",
                                          replyingToId === comment.id ? undefined : replyingToId,
                                        );
                                      }
                                    }
                                  }}
                                  placeholder={\`Reply to \${
                                    replyingToId === comment.id
                                      ? comment.author?.username
                                      : comment.replies.find((r) => r.id === replyingToId)?.author
                                          ?.username || "user"
                                  }...\`}
                                  rows={2}
                                  className="w-full bg-transparent p-3 text-sm text-white focus:outline-none resize-none placeholder:text-white/40"
                                />`,
`                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value.slice(0, 2000))}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      if (replyText.trim() && !isSubmittingReply) {
                                        handlePostReply(
                                          comment.id,
                                          replyingToId === comment.id
                                            ? comment.author?.username || "user"
                                            : comment.replies.find((r) => r.id === replyingToId)
                                                ?.author?.username || "user",
                                          replyingToId === comment.id ? undefined : replyingToId,
                                        );
                                      }
                                    }
                                  }}
                                  placeholder={\`Reply to \${
                                    replyingToId === comment.id
                                      ? comment.author?.username
                                      : comment.replies.find((r) => r.id === replyingToId)?.author
                                          ?.username || "user"
                                  }...\`}
                                  rows={1}
                                  className="w-full bg-transparent p-3 pb-2 text-[15px] text-white focus:outline-none resize-none placeholder:text-white/40 min-h-[44px]"
                                />`
);


// 5. Replace "Cancel" button with just an 'X' or remove it entirely in the Reply box. 
// Let's replace the whole bottom bar for the Reply input to match the main comment input.
const replyInputButtonsTarget = `                                <div className="flex items-center justify-between px-2 pb-2">
                                  <button
                                    type="button"
                                    onClick={() => setReplyIsSpoiler(!replyIsSpoiler)}
                                    className={cn(
                                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition cursor-pointer select-none",
                                      replyIsSpoiler
                                        ? "border-white/20 text-white"
                                        : "border-white/10 text-white/50 hover:bg-white/5 hover:text-white",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "size-3 rounded-sm border flex items-center justify-center transition-colors",
                                        replyIsSpoiler
                                          ? "bg-white border-white"
                                          : "border-white/30",
                                      )}
                                    >
                                      {replyIsSpoiler && <Check className="size-2 text-black" />}
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                                      Spoiler
                                    </span>
                                  </button>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-white/40 mr-1 font-mono">
                                      {replyText.length}/2000
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setReplyingToId(null)}
                                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onPointerDown={(e) => {
                                        e.preventDefault();
                                        if (replyText.trim() && !isSubmittingReply) {
                                          handlePostReply(
                                            comment.id,
                                            replyingToId === comment.id
                                              ? comment.author?.username || "user"
                                              : comment.replies.find((r) => r.id === replyingToId)
                                                  ?.author?.username || "user",
                                            replyingToId === comment.id ? undefined : replyingToId,
                                          );
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (replyText.trim() && !isSubmittingReply) {
                                          handlePostReply(
                                            comment.id,
                                            replyingToId === comment.id
                                              ? comment.author?.username || "user"
                                              : comment.replies.find((r) => r.id === replyingToId)
                                                  ?.author?.username || "user",
                                            replyingToId === comment.id ? undefined : replyingToId,
                                          );
                                        }
                                      }}
                                      disabled={!replyText.trim() || isSubmittingReply}
                                      className={cn(
                                        "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",
                                        replyText.trim()
                                          ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                                          : "bg-white/10 text-white/40",
                                      )}
                                    >
                                      <ArrowUp className="size-4" />
                                    </button>
                                  </div>
                                </div>`;

const replyInputButtonsReplacement = `                                <div className="flex items-center justify-between px-2 pb-2">
                                  <button
                                    type="button"
                                    onClick={() => setReplyIsSpoiler(!replyIsSpoiler)}
                                    className={cn(
                                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition cursor-pointer select-none",
                                      replyIsSpoiler
                                        ? "border-white/20 text-white"
                                        : "border-white/10 text-white/50 hover:bg-white/5 hover:text-white",
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "size-3 rounded-sm border flex items-center justify-center transition-colors",
                                        replyIsSpoiler
                                          ? "bg-white border-white"
                                          : "border-white/30",
                                      )}
                                    >
                                      {replyIsSpoiler && <Check className="size-2 text-black" />}
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                                      Spoiler
                                    </span>
                                  </button>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-white/40 font-mono">
                                      {replyText.length}/2000
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setReplyingToId(null)}
                                        className="h-8 px-3 rounded-full text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition flex items-center justify-center"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onPointerDown={(e) => {
                                          e.preventDefault();
                                          if (replyText.trim() && !isSubmittingReply) {
                                            handlePostReply(
                                              comment.id,
                                              replyingToId === comment.id
                                                ? comment.author?.username || "user"
                                                : comment.replies.find((r) => r.id === replyingToId)
                                                    ?.author?.username || "user",
                                              replyingToId === comment.id ? undefined : replyingToId,
                                            );
                                          }
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          if (replyText.trim() && !isSubmittingReply) {
                                            handlePostReply(
                                              comment.id,
                                              replyingToId === comment.id
                                                ? comment.author?.username || "user"
                                                : comment.replies.find((r) => r.id === replyingToId)
                                                    ?.author?.username || "user",
                                              replyingToId === comment.id ? undefined : replyingToId,
                                            );
                                          }
                                        }}
                                        disabled={!replyText.trim() || isSubmittingReply}
                                        className={cn(
                                          "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0",
                                          replyText.trim()
                                            ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                                            : "bg-white/10 text-white/40",
                                        )}
                                      >
                                        <ArrowUp className="size-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>`;

code = code.replace(replyInputButtonsTarget, replyInputButtonsReplacement);


// 6. Change Toggle Replies Pill to Orange
const pillTarget = `                          className={cn(
                            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none",
                            isCollapsed
                              ? "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
                              : "bg-white/10 text-white hover:bg-white/20",
                          )}`;

const pillReplacement = `                          className={cn(
                            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none",
                            isCollapsed
                              ? "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25"
                              : "bg-white/10 text-white hover:bg-white/20",
                          )}`;

code = code.replace(pillTarget, pillReplacement);

// Just in case, the shrink-0 class on the arrow up button fixes the button disappearing when squeezed
// Let's do the same for the other instances of ArrowUp
code = code.replace(
`                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",`,
`                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0",`
);
code = code.replace(
`                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",`,
`                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0",`
);


fs.writeFileSync('src/components/CommentsSection.tsx', code);
console.log("Buttons and colors fixed");
