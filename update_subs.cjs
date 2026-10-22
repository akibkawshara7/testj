const fs = require('fs');
const file = 'src/routes/anime.watch.$id.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `      try {
        const captionsPref = localStorage.getItem("global_pref_captions");
        if (captionsPref === "false" && playerRef.current.textTracks) {
          const tracks = playerRef.current.textTracks;
          for (const track of tracks) {
            track.mode = "disabled";
          }
        }
      } catch {}`;

const newCode = `      try {
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

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log("Updated subtitles default.");
