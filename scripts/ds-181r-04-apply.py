from pathlib import Path


def replace(path: str, old: str, new: str, expected: int | None = 1):
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if expected is not None and count != expected:
        raise SystemExit(
            f"{path}: expected {expected} occurrences, found {count}: {old[:80]!r}"
        )
    if count == 0:
        raise SystemExit(f"{path}: pattern not found: {old[:80]!r}")
    p.write_text(text.replace(old, new))


replace(
    "src/features/components/update-button-visual-customization.action.ts",
    "    if (template.key !== 'button') {",
    "    if (template.key !== 'button' && template.key !== 'textField') {",
)

replace(
    "src/features/components/ComponentContractEditor.tsx",
    "          contractV2?.templateKey === 'button' ? (",
    "          contractV2?.templateKey === 'button' ||\n"
    "          contractV2?.templateKey === 'textField' ? (",
)

sections_path = Path("src/features/components/ComponentContractEditorSections.tsx")
sections = sections_path.read_text()
marker = """function getV2OwnedLegacyPreviewRoles(
  componentType: ComponentContractEditorDraft['type'],
): readonly ComponentPreviewTokenRole[] {
  return v2OwnedLegacyPreviewRolesByComponentType[componentType] ?? [];
}
"""
if marker not in sections:
    raise SystemExit("ComponentContractEditorSections: helper insertion marker missing")
helper = marker + """
function usesV2VisualInspector(
  componentType: ComponentContractEditorDraft['type'],
): boolean {
  return componentType === 'button' || componentType === 'textField';
}
"""
sections = sections.replace(marker, helper, 1)
button_checks = sections.count("draft.type === 'button'")
if button_checks < 4:
    raise SystemExit(f"Expected multiple Button section gates, found {button_checks}")
sections = sections.replace(
    "draft.type === 'button'", "usesV2VisualInspector(draft.type)"
)
sections_path.write_text(sections)

replace(
    "src/features/components/ComponentFoundationsPreviewClient.tsx",
    "  const isButtonTemplate = templateDefinition?.rendererKey === 'button';",
    "  const isButtonTemplate = templateDefinition?.rendererKey === 'button';\n"
    "  const isTextFieldTemplate =\n"
    "    templateDefinition?.rendererKey === 'textField';",
)
replace(
    "src/features/components/ComponentFoundationsPreviewClient.tsx",
    "        {isButtonTemplate ? (",
    "        {isButtonTemplate || isTextFieldTemplate ? (",
)

matrix_path = Path("src/features/components/ButtonVisualPreviewMatrix.tsx")
text = matrix_path.read_text()
old = '<div className="min-w-0" data-button-v2-preview="true">'
new = """<div
      className="min-w-0"
      data-button-v2-preview={component.type === 'button' ? 'true' : undefined}
      data-component-v2-preview={component.type}
    >"""
if old not in text:
    raise SystemExit("ButtonVisualPreviewMatrix: root marker missing")
text = text.replace(old, new, 1)

old = """                        <ButtonVisualPreview
                          name={component.name}"""
new = """                        <ButtonVisualPreview
                          type={component.type}
                          name={component.name}"""
if old not in text:
    raise SystemExit("ButtonVisualPreviewMatrix: preview call marker missing")
text = text.replace(old, new, 1)

old = """function ButtonVisualPreview({
  name,
  variantKey,"""
new = """function ButtonVisualPreview({
  type,
  name,
  variantKey,"""
if old not in text:
    raise SystemExit("ButtonVisualPreviewMatrix: signature marker missing")
text = text.replace(old, new, 1)

old = """}: {
  name: string;
  variantKey: string;
  sizeKey: string;
  stateKey: string;
  styles: CSSProperties;"""
new = """}: {
  type: ComponentRegistryItem['type'];
  name: string;
  variantKey: string;
  sizeKey: string;
  stateKey: string;
  styles: CSSProperties;"""
if old not in text:
    raise SystemExit("ButtonVisualPreviewMatrix: props type marker missing")
text = text.replace(old, new, 1)

old = """  const isDisabled = normalizedStateKey.includes('disabled');
  const isFocus = normalizedStateKey.includes('focus');
  const isLoading = normalizedStateKey.includes('loading');"""
new = """  const isDisabled = normalizedStateKey.includes('disabled');
  const isFocus = normalizedStateKey.includes('focus');
  const isError =
    normalizedStateKey.includes('invalid') ||
    normalizedStateKey.includes('error');
  const isLoading = normalizedStateKey.includes('loading');"""
if old not in text:
    raise SystemExit("ButtonVisualPreviewMatrix: state marker missing")
text = text.replace(old, new, 1)

old = """  const size = getPreviewSizeCategory(sizeKey);
  const variantTone = getButtonVariantTone(variantKey);"""
new = """  const size = getPreviewSizeCategory(sizeKey);

  if (type === 'textField') {
    return (
      <input
        aria-label={name}
        aria-invalid={isError || undefined}
        disabled={isDisabled}
        readOnly
        tabIndex={-1}
        value={variantKey}
        data-preview-component="textField"
        data-preview-v2="true"
        style={styles}
        className={[
          'w-full transition',
          styles.borderStyle === 'none' ? '' : 'border',
          hasRadius(styles) ? '' : 'rounded-md',
          hasHorizontalPadding(styles) ? '' : 'px-2',
          hasExplicitHeight(styles)
            ? ''
            : size === 'small'
              ? 'min-h-8'
              : size === 'large'
                ? 'min-h-11'
                : 'min-h-9',
          hasDefinedStyle(styles.fontSize)
            ? ''
            : size === 'small'
              ? 'text-[0.6875rem]'
              : size === 'large'
                ? 'text-sm'
                : 'text-xs',
          hasDefinedStyle(styles.backgroundColor)
            ? ''
            : isDisabled
              ? 'bg-background-subtle'
              : 'bg-surface-primary',
          hasDefinedStyle(styles.color)
            ? ''
            : isError
              ? 'text-action-danger'
              : isDisabled
                ? 'text-content-tertiary'
                : 'text-content-primary',
          hasDefinedStyle(styles.borderColor)
            ? ''
            : isError
              ? 'border-action-danger'
              : isFocus
                ? 'border-action-primary'
                : 'border-border-subtle',
          isFocus ? 'ring-action-primary/25 ring-2' : '',
          isDisabled ? 'cursor-not-allowed opacity-60' : '',
        ].join(' ')}
      />
    );
  }

  const variantTone = getButtonVariantTone(variantKey);"""
if old not in text:
    raise SystemExit("ButtonVisualPreviewMatrix: renderer insertion marker missing")
text = text.replace(old, new, 1)
matrix_path.write_text(text)

messages_path = Path("src/messages/component-v2-customization-messages.ts")
text = messages_path.read_text()
replacements = {
    "Edit the Button appearance from one compact property inspector. Add optional property groups only when you need them.":
        "Edit the component appearance from one compact property inspector. Add optional property groups only when you need them.",
    "This visual editor only supports Button templates.":
        "This visual editor only supports Button and TextField templates.",
    "Modifiez l’apparence du Button depuis un seul inspecteur compact. Ajoutez les groupes de propriétés optionnels uniquement lorsque vous en avez besoin.":
        "Modifiez l’apparence du composant depuis un seul inspecteur compact. Ajoutez les groupes de propriétés optionnels uniquement lorsque vous en avez besoin.",
    "Cet éditeur visuel prend uniquement en charge les templates Button.":
        "Cet éditeur visuel prend uniquement en charge les templates Button et TextField.",
}
for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f"Message marker missing: {old}")
    text = text.replace(old, new, 1)
messages_path.write_text(text)

Path("docs/product/ds-181r-04-textfield-customization.md").write_text(
    """# DS-181R-04 — TextField customization

## Goal

Use TextField as the first generalization check for the Button V2 property-inspector pattern accepted in DS-181R-03. R04 must reuse the existing visual contract, sparse override semantics, save boundary, compact controls and preview resolver rather than create a parallel authoring system.

## TextField contract already present

The registered TextField seed exposes one `default` variant, `sm` / `md` / `lg` sizes and the states `focus`, `focusVisible`, `invalid` and `disabled`. Its template capabilities allow dimensions, spacing, border, radius, surface and typography; layout remains constrained and overflow unsupported.

## Reused inspector contract

TextField uses the same live V2 inspector as Button:

- Naming remains first and non-collapsible;
- Variants & states precedes visual authoring;
- Tokens visuels is the sole live visual-authoring surface;
- Base / Variant / Size / State use sparse overrides;
- Fill, Dimensions, Spacing and Radius are core groups;
- Stroke / Border and Typography stay progressive optional groups;
- uniform radius and independent corners share the accepted R03 semantics;
- token options keep semantic → primitive → remaining deterministic ordering;
- compact `xs` source, token and explicit-value controls stay aligned;
- reset means delete the current-layer override and inherit.

The existing Button-named implementation file remains temporarily as the compatibility boundary for this slice; R04 proves reuse with a second template before any file/API rename that would create broad mechanical churn.

## Preview

TextField is promoted from the legacy token-binding preview to the normalized V2 resolver. Template defaults are resolved first, then Base → Variant → Size → State. The TextField renderer preserves familiar fallback visuals only when the resolved V2 contract does not author that property. `invalid`, focus and disabled remain visible as fallback state affordances, while authored V2 values win for background, foreground and border color.

## Persistence

The visual save payload remains exactly `{ visual, overrides }`. The existing authenticated persistence boundary now accepts both `button` and `textField` registered template keys and rejects the remaining templates until their own Wave A slices are product-qualified.

## Ownership

For TextField, the generic legacy Visual Tokens editor is hidden once the V2 inspector is active. Existing stored legacy bindings remain data for compatibility/migration, but they do not compete with the live TextField V2 preview.

## Out of scope

- effects / elevation / shadow authoring;
- slot-specific styling for label / hint / error subparts;
- Card, Alert or Dialog customization;
- freeform CSS or arbitrary children;
- broad renaming of Button-era compatibility files before the second-template product gate passes.

## Acceptance gate

R04 is accepted only if the real Components page confirms that TextField feels like the same authoring system as Button, while its `default` variant, three sizes and focus / focusVisible / invalid / disabled states preview and persist correctly. Button behavior must remain unchanged.
"""
)
