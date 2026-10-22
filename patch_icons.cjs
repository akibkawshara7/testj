const fs = require('fs');
const file = 'src/lib/vidstack-icons.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace CaptionButton.Off: createLucide(Subtitles) with createLucide(CaptionsOff)
content = content.replace(/Off: createLucide\(Subtitles\),/, 'Off: createLucide(CaptionsOff),');

// Replace CaptionsOff: createLucide(SubtitlesOff) with createLucide(CaptionsOff)
content = content.replace(/CaptionsOff: createLucide\(SubtitlesOff\),/, 'CaptionsOff: createLucide(CaptionsOff),');

// Delete the custom SubtitlesOff component to clean up (optional, but good)
const startIdx = content.indexOf('const SubtitlesOff = ');
if (startIdx !== -1) {
  const endIdx = content.indexOf(');', startIdx) + 2;
  content = content.slice(0, startIdx) + content.slice(endIdx);
}

fs.writeFileSync(file, content);
console.log("Updated vidstack-icons.tsx to use CaptionsOff");
