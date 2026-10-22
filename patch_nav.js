const fs = require("fs");
const content = fs.readFileSync("src/components/Header.tsx", "utf8");
const replaced = content.replace(
  /const getNav = \(isManga: boolean\): NavItem\[\] => \[\s*\{ label: "Home", to: "\/", icon: Home, exact: true \},\s*\];/g,
  `const getNav = (isManga: boolean): NavItem[] => [
  { label: "Notifications", to: "/notification", icon: Bell },
  { label: "Schedule", to: isManga ? "/manga/schedule" : "/anime/schedule", icon: Calendar },
  { label: "Home", to: "/", icon: Home, exact: true },
  { label: "Profile", to: "/profile", icon: User, comingSoon: true, disabled: true },
];`,
);
fs.writeFileSync("src/components/Header.tsx", replaced);
