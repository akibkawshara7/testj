const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `      try {
        const captionsPref = localStorage.getItem("global_pref_captions");
        if (playerRef.current.textTracks) {
          const tracks = Array.from(playerRef.current.textTracks);
          for (const track of tracks) {
            if (track.kind === "subtitles" || track.kind === "captions") {
              track.mode = captionsPref === "false" ? "disabled" : "showing";
            }
          }
        }
      } catch {}`;

const newCode = `      try {
        const captionsPref = localStorage.getItem("global_pref_captions");
        // default to true unless explicitly disabled
        const shouldShow = captionsPref !== "false"; 
        if (playerRef.current.textTracks) {
          const tracks = Array.from(playerRef.current.textTracks);
          for (const track of tracks) {
            if (track.kind === "subtitles" || track.kind === "captions") {
              track.mode = shouldShow ? "showing" : "disabled";
            }
          }
        }
      } catch {}`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log("Updated captions logic.");
