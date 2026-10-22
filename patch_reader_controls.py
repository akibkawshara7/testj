import re

def patch(file):
    with open(file, 'r') as f:
        content = f.read()

    # Import SharedSelect
    if 'import { SharedSelect }' not in content:
        content = content.replace('import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";', 'import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";\nimport { SharedSelect } from "@/components/SharedSelect";')

    # Replace CustomDropdown
    custom_dropdown_regex = r"export function CustomDropdown\(\{.*?return \(\s*<div className=\"relative w-full text-sm font-semibold z-20\" ref=\{ref\}>.*?</button>\s*\{isOpen && \([\s\S]*?</div>\s*\)\}\s*</div>\s*\);\s*\}"
    custom_dropdown_replacement = """export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: React.ReactNode; value: string; desc?: string }[];
  placeholder?: string;
}) {
  return (
    <SharedSelect
      value={value}
      onChange={onChange}
      options={options.map(o => ({
        value: o.value,
        display: typeof o.label === 'string' ? o.label : String(o.label),
        sub: o.desc
      }))}
      className="w-full"
    />
  );
}"""
    content = re.sub(custom_dropdown_regex, custom_dropdown_replacement, content, flags=re.DOTALL)

    # Replace ChapterPill
    chapter_pill_regex = r"export function ChapterPill\(\{.*?return \(\s*<div\s*className=\{.*?\}\s*ref=\{ref\}\s*>.*?<div className=\"w-\[100px\] md:w-\[130px\] shrink-0 relative\">.*?</div>\s*\{nextCh && \(.*?</button>\s*\)\}\s*</div>\s*\);\s*\}"
    chapter_pill_replacement = """export function ChapterPill({
  chapters,
  currentChapter,
  onChapterChange,
  activePanel,
  setActivePanel,
  className,
}: {
  chapters: any[];
  currentChapter: number;
  onChapterChange: (ch: number) => void;
  activePanel?: "settings" | "comments" | "shortcuts" | null;
  setActivePanel?: (panel: "settings" | "comments" | "shortcuts" | null) => void;
  className?: string;
}) {
  const currentChIndex = chapters.findIndex((c) => Number(c.chapter) === currentChapter);
  const prevCh = currentChIndex > 0 ? chapters[currentChIndex - 1] : null;
  const nextCh =
    currentChIndex < chapters.length - 1 && currentChIndex >= 0
      ? chapters[currentChIndex + 1]
      : null;

  return (
    <div
      className={
        className ||
        "fixed top-2 right-2 md:top-3.5 md:right-4 z-[60] flex items-center bg-black/80 ring-1 ring-white/10 backdrop-blur-md rounded-full shadow-2xl p-1 animate-in fade-in slide-in-from-top-4"
      }
    >
      {prevCh && (
        <button
          onClick={() => onChapterChange(prevCh.chapter)}
          className="grid place-items-center size-8 md:size-10 rounded-full hover:bg-white/10 text-white transition shrink-0"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </button>
      )}
      <div className="shrink-0 relative">
        <SharedSelect
          value={String(currentChapter)}
          onChange={(v) => onChapterChange(Number(v))}
          options={chapters.map((c) => ({
            value: String(c.chapter),
            display: `Ch. ${c.chapter}`
          }))}
          className="!bg-transparent !ring-0 !shadow-none"
        />
      </div>
      {nextCh && (
        <button
          onClick={() => onChapterChange(nextCh.chapter)}
          className="grid place-items-center size-8 md:size-10 rounded-full hover:bg-white/10 text-white transition shrink-0"
        >
          <ChevronRight className="size-4 md:size-5" />
        </button>
      )}
    </div>
  );
}"""
    content = re.sub(chapter_pill_regex, chapter_pill_replacement, content, flags=re.DOTALL)

    with open(file, 'w') as f:
        f.write(content)
    print("Patched " + file)

patch("src/components/ReaderControls.tsx")
