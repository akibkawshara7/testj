import re

with open('src/components/CommentsSection.tsx', 'r') as f:
    content = f.read()

# 1. Spoiler Button
content = content.replace(
    '"flex items-center gap-2 px-3 py-1.5 rounded-full border transition cursor-pointer select-none"',
    '"flex items-center gap-1 px-2 py-1 rounded-full border transition cursor-pointer select-none"'
)
content = content.replace(
    '"flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition cursor-pointer select-none"',
    '"flex items-center gap-1 px-2 py-1 rounded-full border transition cursor-pointer select-none"'
)
content = content.replace(
    '<span className="text-[11px] font-semibold">Spoiler</span>',
    '<span className="text-[10px] font-semibold">Spoiler</span>'
)
content = content.replace(
    'size-4 rounded-[4px] flex items-center justify-center border transition-colors',
    'size-3 rounded-[4px] flex items-center justify-center border transition-colors'
)

# 2. Character Count
content = content.replace(
    '<span className="text-[11px] text-white/40 mr-1 font-mono">',
    '<span className="text-[10px] text-white/40 font-mono">'
)
content = content.replace(
    '<span className="text-xs text-white/40 mr-2 font-mono">',
    '<span className="text-[10px] text-white/40 mr-1 font-mono">'
)

# 3. Cancel Button (X)
content = content.replace(
    '"size-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition shrink-0"',
    '"size-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition shrink-0"'
)
# Inside cancel button
content = content.replace(
    '<X className="size-4" />',
    '<X className="size-3.5" />'
)

# 4. Send Button
content = content.replace(
    '"size-8 sm:size-9 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"',
    '"size-7 sm:size-8 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"'
)

with open('src/components/CommentsSection.tsx', 'w') as f:
    f.write(content)
