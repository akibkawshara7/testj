const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

code = code.replace(
  '{/* The connecting vertical line */}\n                    <div className="absolute left-[19px] top-[-36px] bottom-[24px] w-6 border-l-2 border-b-2 border-white/10 rounded-bl-xl pointer-events-none z-0" />',
  '{/* Main vertical trunk */}\n                    <div className="absolute left-[19px] top-[-36px] bottom-0 border-l-2 border-white/10 pointer-events-none z-0" />'
);

// We also need to add the curved horizontal line for each reply
code = code.replace(
  /<div\n\s*key=\{reply\.id\}\n\s*className="bg-\[#111111\] rounded-2xl p-3 flex gap-3"\n\s*>/g,
  '<div\n                                    key={reply.id}\n                                    className="bg-[#111111] rounded-2xl p-3 flex gap-3 relative"\n                                  >\n                                    {/* Line connecting vertical trunk to reply avatar */}\n                                    <div className="absolute left-[-23px] sm:left-[-29px] top-[24px] w-[23px] sm:w-[29px] border-t-2 border-white/10 pointer-events-none z-0" />'
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
