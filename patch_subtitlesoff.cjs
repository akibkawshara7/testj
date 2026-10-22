const fs = require("fs");
const file = "src/lib/vidstack-icons.tsx";
let content = fs.readFileSync(file, "utf8");

const subtitlesOffLucide = `
const SubtitlesOff = (props: any) => (
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
    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
    <line x1="7" y1="8" x2="11" y2="8" />
    <line x1="13" y1="8" x2="17" y2="8" />
    <line x1="7" y1="13" x2="17" y2="13" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);
`;

content = content.replace(
  "export const customVidstackIcons: PlayerIconLibrary = {",
  subtitlesOffLucide + "\nexport const customVidstackIcons: PlayerIconLibrary = {",
);
content = content.replace(
  "CaptionsOff: createLucide(CaptionsOff)",
  "CaptionsOff: createLucide(SubtitlesOff)",
);

fs.writeFileSync(file, content);
console.log("Updated subtitles off");
