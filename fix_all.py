import re

with open('src/components/CommentsSection.tsx', 'r') as f:
    content = f.read()

# 1. Restore the Replies layout to be below the main comment
# We need to find the main comment structure.
main_comment_target = """                <div className="flex gap-3">
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
                  <div className="flex-1 min-w-0">"""

main_comment_replacement = """                <div className="flex gap-3 relative z-10">
                  {/* Avatar */}
                  <div className="shrink-0 flex flex-col items-center z-10">
                    <UserAvatar
                      avatarUrl={comment.author?.avatarUrl}
                      frameUrl={comment.author?.frameUrl}
                      username={comment.author?.username}
                      size="md"
                    />
                  </div>

                  {/* Comment Body */}
                  <div className="flex-1 min-w-0">"""
content = content.replace(main_comment_target, main_comment_replacement)

# 2. Extract Replies from right column
replies_target = """                    {/* Replies Section */}
                    {(hasReplies ||
                      replyingToId === comment.id ||
                      (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                      <div className="mt-4 space-y-3">
                        {/* Existing Replies */}"""

replies_replacement = """                  </div>
                </div>

                {/* Replies Section */}
                {(hasReplies ||
                  replyingToId === comment.id ||
                  (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                  <div className="relative mt-3 pl-[42px] sm:pl-12">
                    {/* The connecting vertical line */}
                    <div className="absolute left-[19px] top-[-36px] bottom-[24px] w-6 border-l-2 border-b-2 border-white/10 rounded-bl-xl pointer-events-none z-0" />

                    <div className="relative z-10 space-y-3">
                      {/* Existing Replies */}"""

content = content.replace(replies_target, replies_replacement)

# 3. Close the divs
end_target = """                        </button>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        );"""

end_replacement = """                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
        );"""

content = content.replace(end_target, end_replacement)


# 4. Reply Input Box Buttons (fixing cancel and shrink-0)
reply_box_target = """                                    <button
                                      type="button"
                                      onClick={() => setReplyingToId(null)}
                                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onPointerDown={(e) => {
                                        e.preventDefault(); // Prevents textarea blur
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
                                    </button>"""

reply_box_replacement = """                                    <div className="flex items-center gap-1.5">
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
                                          e.preventDefault(); // Prevents textarea blur
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
                                    </div>"""
content = content.replace(reply_box_target, reply_box_replacement)

# 5. Fix pill color
pill_target = """                          className={cn(
                            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none",
                            isCollapsed
                              ? "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
                              : "bg-white/10 text-white hover:bg-white/20",
                          )}"""

pill_replacement = """                          className={cn(
                            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none",
                            isCollapsed
                              ? "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25"
                              : "bg-white/10 text-white hover:bg-white/20",
                          )}"""
content = content.replace(pill_target, pill_replacement)

# Ensure shrink-0 on the other ArrowUp buttons too
# Target 1: main comment edit save button
content = re.sub(r'className={cn\(\n\s*"size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed",\n\s*editText\.trim\(\)',
                 r'className={cn(\n                                "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0",\n                                editText.trim()', content)


# Save
with open('src/components/CommentsSection.tsx', 'w') as f:
    f.write(content)

print("Updates applied via python.")
