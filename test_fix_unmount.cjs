const fs = require('fs');
let content = fs.readFileSync('src/routes/anime.watch.$id.tsx', 'utf8');
content = content.replace(/<VidstackPlayer\s+key=\{activeSource\.url\}/, '<VidstackPlayer');
content = content.replace(/<MediaPlayer\s+key=\{source\.url\}/, '<MediaPlayer');
const effectRegex = /(const hasRestoredPrefs = useRef\(false\);)/;
content = content.replace(effectRegex, '$1\n  useEffect(() => {\n    hasRestoredTime.current = false;\n    lastSavedTime.current = 0;\n  }, [source.url, episodeNum]);');
fs.writeFileSync('src/routes/anime.watch.$id.tsx', content);
