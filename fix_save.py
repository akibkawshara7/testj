import re

with open('src/components/CommentsSection.tsx', 'r') as f:
    content = f.read()

# Replace Send with Save in the context of handleSaveEdit
def replace_send(match):
    return match.group(0).replace('Send', 'Save')

content = re.sub(
    r'handleSaveEdit.*?</button>',
    replace_send,
    content,
    flags=re.DOTALL
)

with open('src/components/CommentsSection.tsx', 'w') as f:
    f.write(content)
