const fs = require("fs");
const path = require("path");

const targetFiles = [
  "node_modules/@vidstack/react/prod/player/vidstack-default-components.js",
  "node_modules/@vidstack/react/dev/player/vidstack-default-components.js",
  "node_modules/@vidstack/react/server/player/vidstack-default-components.js",
];

const audioRegionNew = `//#region src/components/layouts/default/ui/menus/audio-menu.tsx
function DefaultAudioBoostMenu({ slots }) {
	const { icons: Icons, noAudioGain } = useDefaultLayoutContext(), $canSetAudioGain = useMediaState("canSetAudioGain"), $audioGain = useMediaState("audioGain"), label = "Audio Boost", value = Math.round((($audioGain ?? 1) - 1) * 100) + "%", $disabled = !$canSetAudioGain || noAudioGain;
	if (noAudioGain) return null;
	return /* @__PURE__ */ React.createElement(Root$7, { className: "vds-audio-boost-menu vds-menu" }, /* @__PURE__ */ React.createElement(DefaultMenuButton, {
		label,
		hint: value,
		disabled: $disabled,
		Icon: Icons.Menu.AudioBoostUp || Icons.Menu.Audio
	}), /* @__PURE__ */ React.createElement(Items, { className: "vds-menu-items" }, slot(slots, "audioBoostMenuItemsStart", null), /* @__PURE__ */ React.createElement(DefaultAudioBoostMenuSection, null), slot(slots, "audioBoostMenuItemsEnd", null)));
}
DefaultAudioBoostMenu.displayName = "DefaultAudioBoostMenu";
function DefaultAudioMenu({ slots }) {
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DefaultAudioTracksMenu, null), /* @__PURE__ */ React.createElement(DefaultAudioBoostMenu, { slots }));
}
DefaultAudioMenu.displayName = "DefaultAudioMenu";
function DefaultAudioBoostMenuSection() {
	const $audioGain = useMediaState("audioGain"), label = "Audio Boost", value = Math.round((($audioGain ?? 1) - 1) * 100) + "%", $canSetAudioGain = useMediaState("canSetAudioGain"), { noAudioGain, icons: Icons } = useDefaultLayoutContext(), min = useGainMin(), max = useGainMax();
	if (noAudioGain) return null;
	return /* @__PURE__ */ React.createElement(DefaultMenuSection, {
		label,
		value
	}, /* @__PURE__ */ React.createElement(DefaultMenuSliderItem, {
		UpIcon: Icons.Menu.AudioBoostUp,
		DownIcon: Icons.Menu.AudioBoostDown,
		isMin: (($audioGain ?? 1) - 1) * 100 <= min,
		isMax: (($audioGain ?? 1) - 1) * 100 === max
	}, /* @__PURE__ */ React.createElement(DefaultAudioGainSlider, null)));
}
DefaultAudioBoostMenuSection.displayName = "DefaultAudioBoostMenuSection";
function useGainMin() {
	const { audioGains } = useDefaultLayoutContext();
	return (isArray(audioGains) ? audioGains[0] : audioGains?.min) ?? 0;
}
function useGainMax() {
	const { audioGains } = useDefaultLayoutContext();
	return (isArray(audioGains) ? audioGains[audioGains.length - 1] : audioGains?.max) ?? 300;
}
function useGainStep() {
	const { audioGains } = useDefaultLayoutContext();
	return (isArray(audioGains) ? audioGains[1] - audioGains[0] : audioGains?.step) || 25;
}
function DefaultAudioGainSlider() {
	const label = "Audio Boost", min = useGainMin(), max = useGainMax(), step = useGainStep();
	return /* @__PURE__ */ React.createElement(Root$1, {
		className: "vds-audio-gain-slider vds-slider",
		"aria-label": label,
		min,
		max,
		step,
		keyStep: step
	}, /* @__PURE__ */ React.createElement(DefaultSliderParts, null), /* @__PURE__ */ React.createElement(DefaultSliderSteps, null));
}
DefaultAudioGainSlider.displayName = "DefaultAudioGainSlider";
function DefaultAudioTracksMenu() {
	const { icons: Icons } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Audio"), defaultText = useDefaultLayoutWord("Default"), $track = useMediaState("audioTrack"), options = useAudioOptions();
	if (options.disabled) return null;
	return /* @__PURE__ */ React.createElement(Root$7, { className: "vds-audio-track-menu vds-menu" }, /* @__PURE__ */ React.createElement(DefaultMenuButton, {
		label,
		hint: $track?.label ?? defaultText,
		disabled: options.disabled,
		Icon: Icons.Menu.Audio
	}), /* @__PURE__ */ React.createElement(Items, { className: "vds-menu-items" }, /* @__PURE__ */ React.createElement(Root$5, {
		className: "vds-audio-radio-group vds-radio-group",
		value: options.selectedValue
	}, options.map(({ label, value, select }) => /* @__PURE__ */ React.createElement(Item, {
		className: "vds-audio-radio vds-radio",
		value,
		onSelect: select,
		key: value
	}, /* @__PURE__ */ React.createElement(Icons.Menu.RadioCheck, { className: "vds-icon" }), /* @__PURE__ */ React.createElement("span", { className: "vds-radio-label" }, label))))));
}
DefaultAudioTracksMenu.displayName = "DefaultAudioTracksMenu";
`;

const fontNew = `function DefaultFontMenu() {
	const { icons: Icons } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Caption Styles"), $hasCaptions = useMediaState("hasCaptions"), fontSectionLabel = useDefaultLayoutWord("Font"), textSectionLabel = useDefaultLayoutWord("Text"), textBgSectionLabel = useDefaultLayoutWord("Text Background"), displayBgSectionLabel = useDefaultLayoutWord("Display Background");
	if (!$hasCaptions) return null;
	return /* @__PURE__ */ React.createElement(Root$7, { className: "vds-font-menu vds-menu" }, /* @__PURE__ */ React.createElement(DefaultMenuButton, {
		label,
		Icon: Icons.Menu.Captions
	}), /* @__PURE__ */ React.createElement(Items, { className: "vds-font-style-items vds-menu-items" }, /* @__PURE__ */ React.createElement(DefaultMenuSection, { label: fontSectionLabel }, /* @__PURE__ */ React.createElement(DefaultFontFamilyMenu, null), /* @__PURE__ */ React.createElement(DefaultFontSizeSlider, null)), /* @__PURE__ */ React.createElement(DefaultMenuSection, { label: textSectionLabel }, /* @__PURE__ */ React.createElement(DefaultTextColorInput, null), /* @__PURE__ */ React.createElement(DefaultTextShadowMenu, null), /* @__PURE__ */ React.createElement(DefaultTextOpacitySlider, null)), /* @__PURE__ */ React.createElement(DefaultMenuSection, { label: textBgSectionLabel }, /* @__PURE__ */ React.createElement(DefaultTextBgInput, null), /* @__PURE__ */ React.createElement(DefaultTextBgOpacitySlider, null)), /* @__PURE__ */ React.createElement(DefaultMenuSection, { label: displayBgSectionLabel }, /* @__PURE__ */ React.createElement(DefaultDisplayBgInput, null), /* @__PURE__ */ React.createElement(DefaultDisplayBgOpacitySlider, null)), /* @__PURE__ */ React.createElement(DefaultMenuSection, null, /* @__PURE__ */ React.createElement(DefaultResetMenuItem, null))));
}
DefaultFontMenu.displayName = "DefaultFontMenu";`;

const qualityNew = `function DefaultQualityMenu({ slots }) {
	const { hideQualityBitrate, icons: Icons } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Quality"), autoText = useDefaultLayoutWord("Auto"), $canSetQuality = useMediaState("canSetQuality"), $qualities = useMediaState("qualities"), $quality = useMediaState("quality"), $autoQuality = useMediaState("autoQuality"), options = useVideoQualityOptions({ auto: autoText });
	if (!$canSetQuality || $qualities.length <= 1 || options.disabled) return null;
	const hint = $quality ? ($autoQuality ? autoText : $quality.height + "p") : autoText;
	return /* @__PURE__ */ React.createElement(Root$7, { className: "vds-quality-menu vds-menu" }, /* @__PURE__ */ React.createElement(DefaultMenuButton, {
		label,
		hint,
		Icon: Icons.Menu.QualityUp
	}), /* @__PURE__ */ React.createElement(Items, { className: "vds-menu-items" }, slot(slots, "qualityMenuItemsStart", null), /* @__PURE__ */ React.createElement(Root$5, {
		className: "vds-quality-radio-group vds-radio-group",
		value: options.selectedValue
	}, options.map(({ label, value, bitrateText, select }) => /* @__PURE__ */ React.createElement(Item, {
		className: "vds-quality-radio vds-radio",
		value,
		onSelect: select,
		key: value
	}, /* @__PURE__ */ React.createElement(Icons.Menu.RadioCheck, { className: "vds-icon" }), /* @__PURE__ */ React.createElement("span", { className: "vds-radio-label" }, label), !hideQualityBitrate && bitrateText ? /* @__PURE__ */ React.createElement("span", { className: "vds-radio-hint" }, bitrateText) : null))), slot(slots, "qualityMenuItemsEnd", null)));
}`;

for (const relPath of targetFiles) {
  const filePath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Check if audio region is already patched
  const startAudio = content.indexOf(
    "//#region src/components/layouts/default/ui/menus/audio-menu.tsx",
  );
  const endAudio = content.indexOf(
    "//#region src/components/layouts/default/ui/menus/captions-menu.tsx",
  );

  if (startAudio !== -1 && endAudio !== -1) {
    content = content.substring(0, startAudio) + audioRegionNew + content.substring(endAudio);
  }

  // Quality menu replacement
  const startQuality = content.indexOf("function DefaultQualityMenu({ slots }) {");
  const endQuality = content.indexOf('DefaultQualityMenu.displayName = "DefaultQualityMenu";');
  if (startQuality !== -1 && endQuality !== -1) {
    content =
      content.substring(0, startQuality) + qualityNew + "\n" + content.substring(endQuality);
  }

  // Font menu (Caption styles) replacement - add Icon: Icons.Menu.Captions
  const startFont = content.indexOf("function DefaultFontMenu() {");
  const endFont = content.indexOf('DefaultFontMenu.displayName = "DefaultFontMenu";');
  if (startFont !== -1 && endFont !== -1) {
    content =
      content.substring(0, startFont) + fontNew + "\n" + content.substring(endFont + 'DefaultFontMenu.displayName = "DefaultFontMenu";'.length);
  }

  // Caption menu replacement - ensure Caption styles submenu is included
  const startCaption = content.indexOf("function DefaultCaptionMenu({ slots }) {");
  const endCaption = content.indexOf('DefaultCaptionMenu.displayName = "DefaultCaptionMenu";');
  if (startCaption !== -1 && endCaption !== -1) {
    let captionBlock = content.substring(startCaption, endCaption);
    if (!captionBlock.includes("DefaultFontMenu")) {
      captionBlock = captionBlock.replace(
        'slot(slots, "captionsMenuItemsEnd", null)',
        '/* @__PURE__ */ React.createElement(DefaultFontMenu, null), slot(slots, "captionsMenuItemsEnd", null)',
      );
      content = content.substring(0, startCaption) + captionBlock + content.substring(endCaption);
    }
  }

  // Settings menu: Hide accessibility, ensure DefaultAudioBoostMenu is included
  // First, if DefaultAccessibilityMenu is present, replace it with DefaultAudioBoostMenu
  content = content.replace(
    /\/\* @__PURE__ \*\/ React\.createElement\(DefaultAccessibilityMenu, \{ slots \}\),?/g,
    '/* @__PURE__ */ React.createElement(DefaultAudioBoostMenu, { slots }),'
  );

  // If DefaultAudioBoostMenu isn't in settings menu yet, add it before DefaultCaptionMenu
  if (!content.includes('/* @__PURE__ */ React.createElement(DefaultAudioBoostMenu, { slots })')) {
    content = content.replace(
      '/* @__PURE__ */ React.createElement(DefaultCaptionMenu, { slots })',
      '/* @__PURE__ */ React.createElement(DefaultAudioBoostMenu, { slots }), /* @__PURE__ */ React.createElement(DefaultCaptionMenu, { slots })'
    );
  }

  // Disable double tap to fullscreen
  content = content.replace(/\/\* @__PURE__ \*\/ React\.createElement\(Gesture, \{\s*className: "vds-gesture",\s*event: "dblpointerup",\s*action: "toggle:fullscreen"\s*\}\),?/g, "");

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Successfully patched", relPath);
}
