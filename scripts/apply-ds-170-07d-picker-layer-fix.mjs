import { readFile, writeFile } from 'node:fs/promises';

const filePath = 'src/features/tokens/ColorPickerField.tsx';
let source = await readFile(filePath, 'utf8');

function replaceRequired(search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Unable to apply ${label}: expected source was not found.`);
  }

  source = source.replace(search, replacement);
}

replaceRequired(
  "import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';\nimport { Input } from '@/components/ui';",
  "import { useAnchoredTopLayerPopover } from '@/components/interaction/useAnchoredTopLayerPopover';\nimport { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';\nimport { Input } from '@/components/ui';",
  'anchored popover import',
);

replaceRequired(
  '  const saturationBrightnessRef = useRef<HTMLDivElement>(null);\n',
  '  const saturationBrightnessRef = useRef<HTMLDivElement>(null);\n  const popoverRef = useRef<HTMLDivElement>(null);\n',
  'popover ref',
);

replaceRequired(
  "  const modeLabels: Record<ColorPickerMode, string> = {\n    picker: labels.picker,\n    hsb: labels.hsb,\n    hsl: labels.hsl,\n    rgb: labels.rgb,\n  };\n",
  "  const modeLabels: Record<ColorPickerMode, string> = {\n    picker: labels.picker,\n    hsb: labels.hsb,\n    hsl: labels.hsl,\n    rgb: labels.rgb,\n  };\n  const { placement, popoverStyle } = useAnchoredTopLayerPopover({\n    contentKey: `${mode}:${isModeMenuOpen}`,\n    isOpen,\n    popoverRef,\n    triggerRef,\n  });\n",
  'anchored popover state',
);

replaceRequired(
  `        {isOpen ? (\n          <div\n            id={popoverId}\n            role="dialog"\n            aria-label={labels.pickerDialog}\n            className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border"\n          >`,
  `        {isOpen ? (\n          <div\n            ref={popoverRef}\n            id={popoverId}\n            role="dialog"\n            popover="manual"\n            aria-label={labels.pickerDialog}\n            data-placement={placement}\n            style={popoverStyle}\n            className="border-border-subtle bg-surface-primary shadow-elevated fixed z-[70] m-0 w-72 max-w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto rounded-xl border p-0"\n          >`,
  'top-layer popover markup',
);

await writeFile(filePath, source);
