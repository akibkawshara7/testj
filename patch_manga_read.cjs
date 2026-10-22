const fs = require("fs");
const file = "src/routes/manga.read.$id.tsx";
let content = `import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { fetchMangaById } from "@/lib/anilist";
import { useQuery } from "@tanstack/react-query";
import {
  FloatingNavigator,
  SettingsBox,
  ShortcutsBox,
  ZoomControl,
} from "@/components/ReaderControls";

export const Route = createFileRoute("/manga/read/$id")({
  head: ({ loaderData }: any) => ({
    meta: [
      { title: loaderData?.title?.english || "Read Manga - AniKume" },
    ],
  }),
  component: MangaReaderPage,
});

function MangaReaderPage() {
  const { id } = Route.useParams();
  const searchParams = Route.useSearch();
  const chapterStr = (searchParams as any).chapter || "1";

  const { data: media } = useQuery({
    queryKey: ["manga", id],
    queryFn: () => fetchMangaById(id),
  });

  const [uiVisible, setUiVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [readStyle, setReadStyle] = useState<"vertical" | "horizontal">("vertical");
  const [imageFit, setImageFit] = useState<"width" | "height">("width");
  const [imageSize, setImageSize] = useState("100%");
  
  // Dummy chapters for now, as we don't have full mangaball reader backend logic hooked up in the rewritten file
  const chapterList = Array.from({ length: media?.num_chapters || 10 }).map((_, i) => String(i + 1));
  const chapter = chapterList.includes(chapterStr) ? chapterStr : chapterList[0];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Reader area */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <h1 className="text-2xl font-bold mb-4">{media?.title?.english || media?.title?.romaji}</h1>
        <p className="text-muted-foreground mb-8">Chapter {chapter}</p>
        <div className="flex flex-col gap-4 max-w-4xl w-full px-4" style={{ width: imageSize }}>
            <div className="w-full h-96 bg-card flex items-center justify-center rounded-xl border border-white/10 text-muted-foreground animate-pulse">
                <span>Loading pages...</span>
            </div>
        </div>
      </div>

      {uiVisible && (
        <FloatingNavigator
          chapters={chapterList.map(c => ({ number: c, id: c }))}
          currentChapterId={chapter}
          title={media?.title?.english || media?.title?.romaji || "Manga"}
          mediaId={String(id)}
          onNext={() => {}}
          onPrev={() => {}}
          onSettings={() => setSettingsOpen(!settingsOpen)}
          onComments={() => {}}
          onShortcuts={() => setShortcutsOpen(!shortcutsOpen)}
          isAtBottom={false}
          imageFit={imageFit}
          setImageFit={setImageFit}
        />
      )}

      {uiVisible && (
        <ZoomControl 
          imageSize={imageSize}
          setImageSize={setImageSize}
        />
      )}

      {settingsOpen && (
        <SettingsBox 
          readStyle={readStyle}
          setReadStyle={setReadStyle}
          imageFit={imageFit}
          setImageFit={setImageFit}
          imageSize={imageSize}
          setImageSize={setImageSize}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {shortcutsOpen && (
        <ShortcutsBox 
          readStyle={readStyle}
          onClose={() => setShortcutsOpen(false)}
        />
      )}
    </div>
  );
}
`;
fs.writeFileSync(file, content);
console.log("Updated manga.read.$id.tsx");
