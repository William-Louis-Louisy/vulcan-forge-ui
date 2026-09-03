from pathlib import Path


def replace_once(path_str: str, old: str, new: str) -> None:
    path = Path(path_str)
    source = path.read_text()
    if old not in source:
        raise SystemExit(
            f"Expected anchor not found in {path_str}: {old[:120]!r}"
        )
    path.write_text(source.replace(old, new, 1))


sections = "src/features/components/ComponentContractEditorSections.tsx"
replace_once(
    sections,
    '<div className="grid min-w-0 gap-6">',
    """<div
      className={
        draft.type === 'button'
          ? 'grid min-w-0 gap-0'
          : 'grid min-w-0 gap-6'
      }
    >""",
)
replace_once(
    sections,
    '      className="border-border-subtle grid min-w-0 gap-3 border-b pb-5 sm:grid-cols-[minmax(0,1fr)_11rem]"',
    """      className={[
        'grid min-w-0 gap-3 pb-5 sm:grid-cols-[minmax(0,1fr)_11rem]',
        draft.type === 'button' ? '' : 'border-border-subtle border-b',
      ].join(' ')}""",
)
replace_once(
    sections,
    "    <EditorSection title={labels.collections.title}>",
    """    <EditorSection
      title={labels.collections.title}
      collapsible={draft.type === 'button'}
    >""",
)

source = Path(sections).read_text()
function_start = source.index("function EditorSection({")
collapsible_start = source.index("  if (collapsible) {", function_start)
noncollapsible_start = source.index(
    "\n\n  return (\n    <section", collapsible_start
)
new_collapsible = """  if (collapsible) {
    return (
      <details className="border-border-subtle group min-w-0 border-t py-4">
        <summary className="focus-visible:outline-border-focus flex cursor-pointer list-none flex-col gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className={titleClassName}>{title}</h3>
            {description ? (
              <p className="text-content-secondary mt-1 max-w-2xl text-xs leading-5">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-start justify-between gap-2 sm:justify-end">
            {action ? (
              <span
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                {action}
              </span>
            ) : null}
            <span
              aria-hidden="true"
              className="text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90"
            >
              ›
            </span>
          </div>
        </summary>
        <div className="mt-3 min-w-0">{children}</div>
      </details>
    );
  }"""
Path(sections).write_text(
    source[:collapsible_start] + new_collapsible + source[noncollapsible_start:]
)

anatomy = "src/features/components/ComponentAnatomyEditor.tsx"
source = Path(anatomy).read_text()
function_start = source.index("export function ComponentAnatomyEditor({")
collapsible_start = source.index("  if (collapsible) {", function_start)
noncollapsible_start = source.index(
    "\n\n  return (\n    <section", collapsible_start
)
new_anatomy_collapsible = """  if (collapsible) {
    return (
      <details className="border-border-subtle group min-w-0 border-t py-4">
        <summary className="focus-visible:outline-border-focus flex cursor-pointer list-none flex-col gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight">
              {labels.title}
            </h3>
            <p className="text-content-secondary mt-1 text-xs leading-5">
              {labels.description}
            </p>
          </div>
          <div className="flex shrink-0 items-start justify-between gap-2 sm:justify-end">
            <span
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setDraft({
                    ...draft,
                    anatomy: [
                      ...draft.anatomy,
                      createEmptyAnatomyPartDraft(),
                    ],
                  })
                }
              >
                + {labels.add}
              </Button>
            </span>
            <span
              aria-hidden="true"
              className="text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90"
            >
              ›
            </span>
          </div>
        </summary>

        <AnatomyTable
          labels={labels}
          activeLocale={activeLocale}
          draft={draft}
          setDraft={setDraft}
        />
      </details>
    );
  }"""
Path(anatomy).write_text(
    source[:collapsible_start]
    + new_anatomy_collapsible
    + source[noncollapsible_start:]
)

editor = "src/features/components/ButtonVisualCustomizationEditor.tsx"
source = Path(editor).read_text()
return_marker = """  return (
    <section className="border-border-subtle bg-surface-primary relative mb-6 rounded-lg border">"""
return_start = source.index(return_marker)
scope_marker = '      <div className="border-border-subtle bg-background-subtle flex flex-col gap-2 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">'
scope_start = source.index(scope_marker, return_start)
new_visual_header = """  return (
    <details className="border-border-subtle group min-w-0 border-t py-4">
      <summary className="focus-visible:outline-border-focus flex cursor-pointer list-none flex-col gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-content-primary text-base font-semibold tracking-tight">
            {t('title')}
          </h2>
          <p className="text-content-secondary mt-1 max-w-2xl text-xs leading-5">
            {t('description')}
          </p>
        </div>

        <div className="flex shrink-0 items-start justify-between gap-2 sm:justify-end">
          <div
            className="relative"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t('addProperty')}
              aria-expanded={isAddMenuOpen}
              onClick={() => setIsAddMenuOpen((open) => !open)}
              className="border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default hover:text-content-primary focus-visible:outline-border-focus flex size-8 items-center justify-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <PlusIcon aria-hidden="true" size={14} weight="bold" />
            </button>

            {isAddMenuOpen ? (
              <div className="border-border-subtle bg-surface-primary shadow-soft absolute top-full right-0 z-30 mt-1 w-48 rounded-md border p-1">
                {availableOptionalGroups.length > 0 ? (
                  availableOptionalGroups.map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => addOptionalGroup(group)}
                      className="text-content-secondary hover:bg-background-subtle hover:text-content-primary flex w-full items-center rounded-sm px-2.5 py-2 text-left text-xs font-semibold transition"
                    >
                      {t(`groups.${group}`)}
                    </button>
                  ))
                ) : (
                  <p className="text-content-tertiary px-2.5 py-2 text-xs">
                    {t('noPropertiesToAdd')}
                  </p>
                )}
              </div>
            ) : null}
          </div>
          <span
            aria-hidden="true"
            className="text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90"
          >
            ›
          </span>
        </div>
      </summary>

      <div className="border-border-subtle bg-surface-primary mt-3 rounded-lg border">
        <div className="bg-background-subtle flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">"""
source = (
    source[:return_start]
    + new_visual_header
    + source[scope_start + len(scope_marker) :]
)
tail_marker = """      </form>
    </section>
  );
}

function InspectorGroup"""
tail_start = source.index(tail_marker)
new_tail = """      </form>
      </div>
    </details>
  );
}

function InspectorGroup"""
source = source[:tail_start] + new_tail + source[tail_start + len(tail_marker) :]
source = source.replace(
    '              className="size-4"',
    '              className="size-4 accent-[var(--vf-action-accent)]"',
    1,
)
Path(editor).write_text(source)

messages = "src/messages/component-v2-customization-messages.ts"
msg = Path(messages).read_text()
for old, new in [
    (
        "        title: 'Visual tokens',\n        description:\n          'Modifiez",
        "        title: 'Tokens visuels',\n        description:\n          'Modifiez",
    ),
    (
        "          action: 'Enregistrer les Visual tokens',",
        "          action: 'Enregistrer les tokens visuels',",
    ),
    (
        "          saved: 'Visual tokens enregistrés',",
        "          saved: 'Tokens visuels enregistrés',",
    ),
    (
        "          invalid: 'Les Visual tokens sont invalides',",
        "          invalid: 'Les tokens visuels sont invalides',",
    ),
    (
        "              'Impossible d’enregistrer les Visual tokens. Veuillez réessayer.',",
        "              'Impossible d’enregistrer les tokens visuels. Veuillez réessayer.',",
    ),
]:
    if old not in msg:
        raise SystemExit(f"Message anchor not found: {old}")
    msg = msg.replace(old, new, 1)
Path(messages).write_text(msg)

token_utils = "src/features/components/component-token-bindings.utils.ts"
source = Path(token_utils).read_text()
start = source.index("export function createComponentTokenOptions(")
end = source.index("\n\nfunction createPreviewTokenDictionary", start)
replacement = """function getComponentTokenLayerRank(path: string): number {
  if (path.includes('.semantic.')) {
    return 0;
  }

  if (path.includes('.primitive.')) {
    return 1;
  }

  return 2;
}

export function sortComponentTokenOptions(
  tokenOptions: readonly ComponentTokenOption[],
): ComponentTokenOption[] {
  return [...tokenOptions].sort((left, right) => {
    const layerDifference =
      getComponentTokenLayerRank(left.path) -
      getComponentTokenLayerRank(right.path);

    return layerDifference || left.path.localeCompare(right.path);
  });
}

export function createComponentTokenOptions(
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>,
): ComponentTokenOption[] {
  const parsedTokenSets = parseComponentTokenSets(rawTokenSets);
  const tokenOptions = parsedTokenSets.tokenSets.flatMap((tokenSet) =>
    tokenSet.tokens.map((token) => ({
      type: token.type,
      path: token.path,
      label: token.path,
    })),
  );

  return sortComponentTokenOptions(tokenOptions);
}"""
Path(token_utils).write_text(source[:start] + replacement + source[end:])

# Sort again at each authoring boundary so manually supplied token options cannot
# reintroduce mixed semantic/primitive ordering.
replace_once(
    editor,
    "import type { ComponentTokenOption } from './component-token-bindings.utils';",
    """import {
  sortComponentTokenOptions,
  type ComponentTokenOption,
} from './component-token-bindings.utils';""",
)
replace_once(
    editor,
    """  const availableTokens = tokenOptions.filter(
    (token) => token.type === descriptor.tokenType,
  );""",
    """  const availableTokens = sortComponentTokenOptions(
    tokenOptions.filter((token) => token.type === descriptor.tokenType),
  );""",
)
replace_once(
    sections,
    """  componentPreviewTokenRoles,
  normalizeComponentPreviewTokenRole,""",
    """  componentPreviewTokenRoles,
  normalizeComponentPreviewTokenRole,
  sortComponentTokenOptions,""",
)
replace_once(
    sections,
    """  const tokenOptionsForType = tokenOptions.filter(
    (tokenOption) => tokenOption.type === binding.tokenType,
  );""",
    """  const tokenOptionsForType = sortComponentTokenOptions(
    tokenOptions.filter((tokenOption) => tokenOption.type === binding.tokenType),
  );""",
)

token_test = "src/features/components/component-token-bindings.utils.test.ts"
source = Path(token_test).read_text()
old_expected = """    ).toEqual(
      colorTokenSet.tokens.map((token) => ({
        type: token.type,
        path: token.path,
        label: token.path,
      })),
    );"""
new_expected = """    ).toEqual([
      {
        type: 'color',
        path: 'color.semantic.action.primary',
        label: 'color.semantic.action.primary',
      },
      {
        type: 'color',
        path: 'color.semantic.status.success',
        label: 'color.semantic.status.success',
      },
      {
        type: 'color',
        path: 'color.primitive.blue.500',
        label: 'color.primitive.blue.500',
      },
      {
        type: 'color',
        path: 'color.primitive.green.500',
        label: 'color.primitive.green.500',
      },
      {
        type: 'color',
        path: 'color.background.default',
        label: 'color.background.default',
      },
    ]);"""
if old_expected not in source:
    raise SystemExit("Token option expectation anchor not found")
Path(token_test).write_text(source.replace(old_expected, new_expected, 1))

message_test = "src/messages/component-v2-customization-messages.test.ts"
replace_once(
    message_test,
    "    expect(french.unset).toBe('Default');\n  });",
    """    expect(french.unset).toBe('Default');
    expect(english.title).toBe('Visual tokens');
    expect(french.title).toBe('Tokens visuels');
  });""",
)

button_test = "src/features/components/ButtonVisualCustomizationEditor.test.tsx"
replace_once(
    button_test,
    "    expect(independentCorners).not.toBeChecked();",
    """    expect(independentCorners).not.toBeChecked();
    expect(independentCorners).toHaveClass(
      'accent-[var(--vf-action-accent)]',
    );
    expect(
      screen.getByRole('heading', { name: 'Visual tokens' }).closest('details'),
    ).not.toBeNull();""",
)

contract_test = "src/features/components/ComponentContractEditor.test.tsx"
marker = "  it('hides the legacy Visual Tokens editor entirely for Button', () => {"
addition = """  it('keeps every Button section except naming collapsible and aligns section actions in their headers', () => {
    const buttonContract: ComponentContract = {
      ...contract,
      type: 'button',
    };

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={buttonContract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    expect(screen.getByLabelText('Name').closest('details')).toBeNull();
    expect(screen.getByText('Variants & states').closest('details')).not.toBeNull();

    for (const title of [
      'Localized content',
      'Anatomy',
      'Accessibility contract',
      'Forbidden patterns',
    ]) {
      expect(screen.getByText(title).closest('details')).not.toBeNull();
    }

    const anatomySummary = screen.getByText('Anatomy').closest('summary');
    expect(
      screen.getByRole('button', { name: /Add anatomy item/ }).closest('summary'),
    ).toBe(anatomySummary);

    const accessibilitySummary = screen
      .getByText('Accessibility contract')
      .closest('summary');
    expect(
      screen
        .getByRole('button', { name: /Add accessibility rule/ })
        .closest('summary'),
    ).toBe(accessibilitySummary);
  });

"""
replace_once(contract_test, marker, addition + marker)
