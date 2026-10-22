import re

with open('src/components/CommentsSection.tsx', 'r') as f:
    content = f.read()

# 1. Remove the orange line connecting to the reply avatar
orange_line = """                                  {/* Line connecting vertical trunk to reply avatar */}
                                  <div className="absolute left-[-23px] sm:left-[-29px] top-[29px] w-[35px] sm:w-[41px] border-t-2 border-orange-500/30 pointer-events-none z-0 rounded-bl-xl" />"""
content = content.replace(orange_line, "")

# 2. Remove the Reply button from inside the reply
nested_reply_btn = """                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (!isAuthenticated) {
                                                openAuthModal("signin");
                                                return;
                                              }
                                              setReplyingToId(
                                                replyingToId === reply.id ? null : reply.id,
                                              );
                                              setReplyText("");
                                            }}
                                            className={cn(
                                              "flex items-center gap-1.5 text-xs font-medium transition cursor-pointer",
                                              replyingToId === reply.id
                                                ? "text-white"
                                                : "text-white/40 hover:text-white/80",
                                            )}
                                          >
                                            <Reply className="size-3.5" />
                                            <span>Reply</span>
                                          </button>"""
content = content.replace(nested_reply_btn, "")

# 3. Revert "Send" buttons to the circular ArrowUp button.
# Replace the class
content = content.replace(
    '"h-8 px-4 rounded-full flex items-center justify-center text-xs font-semibold transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"',
    '"size-8 sm:size-9 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"'
)

# Replace the text "Send" inside those buttons with ArrowUp.
# The Send text in the button is usually around 611 and 1275, etc.
# Actually let's use regex to replace Send\s*</button> where there is a preceding button.
# To be safe, just replace the exact matches.
content = re.sub(
    r'>\s*Send\s*</button>',
    r'>\n                    <ArrowUp className="size-4" />\n                  </button>',
    content
)

# Fix indentation roughly (it's fine if Prettier runs after)
with open('src/components/CommentsSection.tsx', 'w') as f:
    f.write(content)
