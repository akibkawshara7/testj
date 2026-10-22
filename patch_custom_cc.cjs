const fs = require('fs');
const file = 'src/lib/vidstack-icons.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure ClosedCaption is imported
if (!content.includes('ClosedCaption,')) {
  content = content.replace('CaptionsOff,', 'CaptionsOff, ClosedCaption,');
}

const customCCOff = `
const ClosedCaptionOff = (props: any) => {
  const maskId = \`cc-slash-\${Math.random().toString(36).substring(2, 9)}\`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="black" strokeWidth="4" />
        </mask>
      </defs>
      <g mask={\`url(#\${maskId})\`}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M10 9.17a3 3 0 1 0 0 5.66" />
        <path d="M17 9.17a3 3 0 1 0 0 5.66" />
      </g>
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
};
`;

if (!content.includes('ClosedCaptionOff =')) {
  content = content.replace('export const customVidstackIcons: any = {', customCCOff + '\nexport const customVidstackIcons: any = {');
}

// Replace in CaptionButton
content = content.replace(/On: createLucide\(Subtitles\),/, 'On: createLucide(ClosedCaption),');
content = content.replace(/Off: createLucide\(CaptionsOff\),/, 'Off: createLucide(ClosedCaptionOff),');

// Also update KeyboardDisplay
content = content.replace(/CaptionsOn: createLucide\(Subtitles\),/, 'CaptionsOn: createLucide(ClosedCaption),');
content = content.replace(/CaptionsOff: createLucide\(CaptionsOff\),/, 'CaptionsOff: createLucide(ClosedCaptionOff),');

fs.writeFileSync(file, content);
console.log("Updated vidstack-icons.tsx to use ClosedCaption and ClosedCaptionOff");
