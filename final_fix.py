import re

with open('src/components/CommentsSection.tsx', 'r') as f:
    content = f.read()

# Replace any button class for the Send button to be a pill shape.
# Actually, I can just do a regex replace for the ones wrapping `Send` or `Save`.
# We have `Send` and `Save`.
# Let's replace:
# "size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
# with
# "h-8 px-4 rounded-full flex items-center justify-center text-xs font-semibold transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"

content = content.replace(
    '"size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed"',
    '"h-8 px-4 rounded-full flex items-center justify-center text-xs font-semibold transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"'
)

with open('src/components/CommentsSection.tsx', 'w') as f:
    f.write(content)
