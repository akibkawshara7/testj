const fs = require("fs");

function patchFile(file) {
  let content = fs.readFileSync(file, "utf8");

  const regex =
    /function FilterSelect\(\{[\s\S]*?\}\s*\{\s*const items = useMemo\(\(\) => \{[\s\S]*?return list;\s*\}, \[options, allowAny, renderLabel\]\);\s*const mappedValue = value === "" \? "ANY" : value;[\s\S]*?\}\n/m;

  const replacement = `function FilterSelect({
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
}
`;

  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log(`Patched ${file}`);
  } else {
    console.log(`Could not find FilterSelect in ${file}`);
  }
}

patchFile("src/routes/anime.browse.tsx");
patchFile("src/routes/manga.browse.tsx");
