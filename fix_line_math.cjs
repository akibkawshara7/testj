const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

// The connection to the reply avatar
code = code.replace(
  'top-[24px] w-[23px] sm:w-[29px] border-t-2',
  'top-[29px] w-[35px] sm:w-[41px] border-t-2'
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
