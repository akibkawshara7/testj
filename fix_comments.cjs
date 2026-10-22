const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// 1. Thread Line Revert
code = code.replace(
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
                  <div className="flex-1 min-w-0">`,
`                <div className="flex gap-3 relative z-10">
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
                  <div className="flex-1 min-w-0">`
);

// 2. Replies structure revert
const targetReplies = `                      {/* Replies Section */}
                      {(hasReplies ||
                        replyingToId === comment.id ||
                        (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                        <div className="mt-4 space-y-3">
                          {/* Existing Replies */}`;

const replaceReplies = `                    </div>
                  </div>

                  {/* Replies Section */}
                  {(hasReplies ||
                    replyingToId === comment.id ||
                    (replyingToId && comment.replies?.find((r) => r.id === replyingToId))) && (
                    <div className="relative mt-3 pl-[42px] sm:pl-12">
                      {/* The connecting vertical line */}
                      <div className="absolute left-[19px] top-[-40px] bottom-[24px] w-6 border-l-2 border-b-2 border-white/10 rounded-bl-xl pointer-events-none z-0" />

                      <div className="relative z-10 space-y-3">
                        {/* Existing Replies */}`;
code = code.replace(targetReplies, replaceReplies);

// 3. Close the extra divs we added in our replacement
const targetEnd = `                        </button>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        );`;

const replaceEnd = `                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
        );`;
code = code.replace(targetEnd, replaceEnd);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
console.log("Thread line layout restored");
