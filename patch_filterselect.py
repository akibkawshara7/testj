import re
import sys

def patch(file):
    with open(file, 'r') as f:
        content = f.read()

    regex = r"function FilterSelect\(\{.*?return \(\s*<div className=\"flex flex-col items-center gap-1 w-full relative z-20\">.*?</div>\s*\);\s*\}"
    
    replacement = """function FilterSelect({
  label,
  value,
  onChange,
  options,
  renderLabel,
  allowAny = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  renderLabel?: (v: string) => string;
  allowAny?: boolean;
}) {
  const items = useMemo(() => {
    const list: { value: string; display: string }[] = [];
    if (allowAny) {
      list.push({ value: "ANY", display: "Any" });
    }
    options.forEach((o) => {
      if (typeof o === "string") {
        const displayStr = renderLabel
          ? renderLabel(o)
          : o
              .split("_")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
        list.push({ value: o, display: displayStr });
      } else {
        list.push(o);
      }
    });
    return list;
  }, [options, allowAny, renderLabel]);

  const mappedValue = value === "" ? "ANY" : value;

  return (
    <SharedSelect
      value={mappedValue}
      onChange={(v) => onChange(v === "ANY" ? "" : v)}
      options={items}
      label={label}
      className="w-full"
    />
  );
}"""

    new_content = re.sub(regex, replacement, content, flags=re.DOTALL)
    if new_content == content:
        print(f"Could not patch {file}")
    else:
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Patched {file}")

patch("src/routes/anime.browse.tsx")
patch("src/routes/manga.browse.tsx")
