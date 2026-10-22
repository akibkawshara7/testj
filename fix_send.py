import re

with open('src/components/CommentsSection.tsx', 'r') as f:
    content = f.read()

# Replace the button classes for the Send buttons
content = content.replace(
    '"size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"',
    '"h-8 px-4 rounded-full flex items-center justify-center text-xs font-semibold transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"'
)
# For the main comment input box (which wasn't a size-8 initially maybe?)
content = content.replace(
    '"size-9 sm:size-10 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed"',
    '"h-9 sm:h-10 px-5 rounded-full flex items-center justify-center text-sm font-semibold transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"'
)

with open('src/components/CommentsSection.tsx', 'w') as f:
    f.write(content)
