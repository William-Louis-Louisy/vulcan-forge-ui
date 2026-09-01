from pathlib import Path
import re


preview = Path('src/features/components/component-visual-preview.utils.ts')
text = preview.read_text()
pattern = re.compile(
    r"function createRadiusCssProperties\([\s\S]*?\n}\n\nfunction resolveTypographyDesignValue\(",
    re.MULTILINE,
)
replacement = """function createRadiusCssProperties(
  radius: ComponentVisualProperties['radius'],
  resolveToken: TokenResolver,
): Pick<CSSProperties, 'borderRadius'> {
  const uniform = resolvePrimitiveDesignValue(radius?.radius, resolveToken);
  const hasCornerValue = Boolean(
    radius &&
      (radius.topLeft !== undefined ||
        radius.topRight !== undefined ||
        radius.bottomRight !== undefined ||
        radius.bottomLeft !== undefined),
  );

  if (!hasCornerValue) {
    return { borderRadius: uniform };
  }

  const resolveCorner = (value: unknown) =>
    resolvePrimitiveDesignValue(value, resolveToken) ?? uniform ?? 0;
  const corners = [
    resolveCorner(radius?.topLeft),
    resolveCorner(radius?.topRight),
    resolveCorner(radius?.bottomRight),
    resolveCorner(radius?.bottomLeft),
  ];

  return { borderRadius: corners.map(String).join(' ') };
}

function resolveTypographyDesignValue("""
text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f'Expected one radius CSS helper, replaced {count}')
preview.write_text(text)

sections = Path('src/features/components/ComponentContractEditorSections.tsx')
text = sections.read_text()
old_import = """import {
  normalizeComponentPreviewTokenRole,
  type ComponentTokenOption,
} from './component-token-bindings.utils';"""
new_import = """import {
  componentPreviewTokenRoles,
  normalizeComponentPreviewTokenRole,
  type ComponentPreviewTokenRole,
  type ComponentTokenOption,
} from './component-token-bindings.utils';"""
if old_import not in text:
    raise SystemExit('component token binding import marker not found')
text = text.replace(old_import, new_import, 1)
old_role_import = """import {
  getComponentPreviewTokenRoleType,
  getFirstAvailableComponentPreviewTokenRole,
} from './component-preview-role-bindings';"""
new_role_import = """import { getComponentPreviewTokenRoleType } from './component-preview-role-bindings';"""
if old_role_import not in text:
    raise SystemExit('preview role binding import marker not found')
text = text.replace(old_role_import, new_role_import, 1)

editor_props_marker = """type EditorProps = {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
  activeLocale: 'en' | 'fr';
  setActiveLocale: (locale: 'en' | 'fr') => void;
  tokenOptions: ComponentTokenOption[];
};
"""
ownership_helper = """type EditorProps = {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
  activeLocale: 'en' | 'fr';
  setActiveLocale: (locale: 'en' | 'fr') => void;
  tokenOptions: ComponentTokenOption[];
};

const v2OwnedLegacyPreviewRolesByComponentType: Partial<
  Record<
    ComponentContractEditorDraft['type'],
    readonly ComponentPreviewTokenRole[]
  >
> = {
  button: ['radius'],
};

function getV2OwnedLegacyPreviewRoles(
  componentType: ComponentContractEditorDraft['type'],
): readonly ComponentPreviewTokenRole[] {
  return v2OwnedLegacyPreviewRolesByComponentType[componentType] ?? [];
}
"""
if editor_props_marker not in text:
    raise SystemExit('EditorProps marker not found')
text = text.replace(editor_props_marker, ownership_helper, 1)

start = text.index('function VisualTokensSection({')
end = text.index('\nfunction TokenBindingRow({', start)
new_section = """function VisualTokensSection({
  labels,
  draft,
  activeLocale,
  setDraft,
  tokenOptions,
}: Omit<EditorProps, 'setActiveLocale'>) {
  const excludedRoles = getV2OwnedLegacyPreviewRoles(draft.type);
  const excludedRoleSet = new Set(excludedRoles);
  const visibleBindings = draft.tokenBindings
    .map((binding, index) => ({ binding, index }))
    .filter(({ binding }) => {
      const role = normalizeComponentPreviewTokenRole(binding.key);
      return role === null || !excludedRoleSet.has(role);
    });

  function addTokenBinding() {
    const emptyBinding = createEmptyTokenBindingDraft();
    const role =
      componentPreviewTokenRoles.find(
        (candidate) =>
          !excludedRoleSet.has(candidate) &&
          !draft.tokenBindings.some(
            (binding) =>
              normalizeComponentPreviewTokenRole(binding.key) === candidate,
          ),
      ) ?? null;
    const nextBinding = role
      ? {
          ...emptyBinding,
          key: role,
          tokenType: getComponentPreviewTokenRoleType(role),
        }
      : emptyBinding;

    setDraft({
      ...draft,
      tokenBindings: [...draft.tokenBindings, nextBinding],
    });
  }

  return (
    <EditorSection
      title={labels.visualTokens.title}
      description={labels.visualTokens.description}
      action={
        <Button variant="secondary" size="sm" onClick={addTokenBinding}>
          + {labels.visualTokens.add}
        </Button>
      }
    >
      <div className="border-border-subtle min-w-0 rounded-md border">
        {visibleBindings.map(({ binding, index }) => (
          <TokenBindingRow
            key={binding.draftId}
            labels={labels}
            activeLocale={activeLocale}
            binding={binding}
            bindings={draft.tokenBindings}
            tokenOptions={tokenOptions}
            excludedRoles={excludedRoles}
            onChange={(nextBinding) => {
              const nextRole = normalizeComponentPreviewTokenRole(
                nextBinding.key,
              );

              if (nextRole && excludedRoleSet.has(nextRole)) {
                return;
              }

              const nextBindings = [...draft.tokenBindings];
              nextBindings[index] = nextBinding;
              setDraft({ ...draft, tokenBindings: nextBindings });
            }}
            onRemove={() =>
              setDraft({
                ...draft,
                tokenBindings: draft.tokenBindings.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          />
        ))}

        {visibleBindings.length === 0 ? (
          <p className="text-content-tertiary px-3 py-4 text-xs">
            {labels.visualTokens.description}
          </p>
        ) : null}
      </div>
    </EditorSection>
  );
}
"""
text = text[:start] + new_section + text[end:]

old_signature = """  tokenOptions,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  activeLocale: 'en' | 'fr';
  binding: ComponentTokenBindingDraft;
  bindings: ComponentTokenBindingDraft[];
  tokenOptions: ComponentTokenOption[];
  onChange: (binding: ComponentTokenBindingDraft) => void;
  onRemove: () => void;
}) {"""
new_signature = """  tokenOptions,
  excludedRoles,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  activeLocale: 'en' | 'fr';
  binding: ComponentTokenBindingDraft;
  bindings: ComponentTokenBindingDraft[];
  tokenOptions: ComponentTokenOption[];
  excludedRoles: readonly ComponentPreviewTokenRole[];
  onChange: (binding: ComponentTokenBindingDraft) => void;
  onRemove: () => void;
}) {"""
if old_signature not in text:
    raise SystemExit('TokenBindingRow signature marker not found')
text = text.replace(old_signature, new_signature, 1)
old_role_field = """        <ComponentPreviewRoleField
          labels={labels.visualTokens}
          binding={binding}
          bindings={bindings}
          onChange={onChange}
        />"""
new_role_field = """        <ComponentPreviewRoleField
          labels={labels.visualTokens}
          binding={binding}
          bindings={bindings}
          excludedRoles={excludedRoles}
          onChange={onChange}
        />"""
if old_role_field not in text:
    raise SystemExit('ComponentPreviewRoleField marker not found')
text = text.replace(old_role_field, new_role_field, 1)
sections.write_text(text)

preview_tests = Path('src/features/components/component-visual-preview.utils.test.ts')
text = preview_tests.read_text()
old_explicit = """      borderTopLeftRadius: '18px',
      borderTopRightRadius: '4px',"""
if old_explicit not in text:
    raise SystemExit('explicit corner expectation marker not found')
text = text.replace(old_explicit, """      borderRadius: '18px 4px 0 0',""", 1)
old_mixed = """  it('projects mixed uniform and per-corner radius through corner longhands only', () => {
    const styles = createComponentVisualCssProperties({
      visual: {
        radius: {
          radius: { source: 'value', value: '8px' },
          topLeft: { source: 'value', value: '18px' },
          bottomRight: { source: 'value', value: '32px' },
        },
      },
      rawTokenSets: [],
    });

    expect(styles.borderRadius).toBeUndefined();
    expect(styles).toMatchObject({
      borderTopLeftRadius: '18px',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '32px',
      borderBottomLeftRadius: '8px',
    });
  });"""
new_mixed = """  it('projects mixed uniform and per-corner radius through one four-value shorthand', () => {
    const styles = createComponentVisualCssProperties({
      visual: {
        radius: {
          radius: { source: 'value', value: '8px' },
          topLeft: { source: 'value', value: '18px' },
          bottomRight: { source: 'value', value: '32px' },
        },
      },
      rawTokenSets: [],
    });

    expect(styles.borderRadius).toBe('18px 8px 32px 8px');
    expect(styles.borderTopLeftRadius).toBeUndefined();
    expect(styles.borderTopRightRadius).toBeUndefined();
    expect(styles.borderBottomRightRadius).toBeUndefined();
    expect(styles.borderBottomLeftRadius).toBeUndefined();
  });"""
if old_mixed not in text:
    raise SystemExit('mixed radius test marker not found')
text = text.replace(old_mixed, new_mixed, 1)
preview_tests.write_text(text)

editor_test = Path('src/features/components/ComponentContractEditor.test.tsx')
text = editor_test.read_text()
new_test = """

  it('keeps the Button V2 radius role out of the legacy Visual Tokens editor', async () => {
    const user = userEvent.setup();
    const contractWithLegacyRadius: ComponentContract = {
      ...contract,
      tokenBindings: [
        {
          key: 'radius',
          tokenType: 'radius',
          tokenPath: 'radius.md',
        },
      ],
    };

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={contractWithLegacyRadius}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    expect(
      screen.queryByRole('combobox', { name: 'Preview role' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Add visual token/ }));

    const roleSelect = screen.getByRole('combobox', {
      name: 'Preview role',
    });
    expect(roleSelect).toHaveTextContent('Background');

    await user.click(roleSelect);

    expect(
      screen.queryByRole('option', { name: /Radius radius · Radius/ }),
    ).not.toBeInTheDocument();
  });
"""
if 'keeps the Button V2 radius role out of the legacy Visual Tokens editor' not in text:
    head, tail = text.rsplit('\n});', 1)
    text = head + new_test + '\n});' + tail
editor_test.write_text(text)

context_test = Path('src/features/components/ComponentContractPreviewContext.test.tsx')
context_test.write_text("""import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  migrateLegacyComponentContract,
  type ComponentContract,
} from '@/domain/design-system';
import {
  ComponentContractPreviewProvider,
  useComponentContractPreview,
} from './ComponentContractPreviewContext';

const legacyButtonContract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: { en: 'Triggers an action.' },
  status: 'ready',
  anatomy: [],
  variants: [],
  sizes: [],
  states: [],
  tokenBindings: [
    {
      key: 'radius',
      tokenType: 'radius',
      tokenPath: 'radius.md',
    },
  ],
  accessibility: [],
  forbiddenPatterns: [],
};

function Harness() {
  const preview = useComponentContractPreview();

  if (!preview) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          preview.setContractV2({
            ...preview.contractV2,
            visual: {
              ...preview.contractV2.visual,
              radius: {
                radius: { source: 'value', value: '8px' },
                topLeft: { source: 'value', value: '18px' },
                bottomRight: { source: 'value', value: '32px' },
              },
            },
          })
        }
      >
        Author V2 radius
      </button>
      <button
        type="button"
        onClick={() =>
          preview.setContract({
            ...preview.contract,
            tokenBindings: [
              {
                key: 'radius',
                tokenType: 'radius',
                tokenPath: 'radius.xl',
              },
            ],
          })
        }
      >
        Change legacy radius
      </button>
      <output data-testid="radius-state">
        {JSON.stringify(preview.contractV2.visual.radius)}
      </output>
    </>
  );
}

describe('ComponentContractPreviewProvider Button V2 ownership', () => {
  it('keeps the migrated initial radius but ignores later legacy radius rewrites', async () => {
    const user = userEvent.setup();
    const initialContractV2 = migrateLegacyComponentContract(
      legacyButtonContract,
    );

    render(
      <ComponentContractPreviewProvider
        initialContract={legacyButtonContract}
        initialContractV2={initialContractV2}
      >
        <Harness />
      </ComponentContractPreviewProvider>,
    );

    expect(screen.getByTestId('radius-state')).toHaveTextContent('radius.md');

    await user.click(screen.getByRole('button', { name: 'Author V2 radius' }));
    await user.click(screen.getByRole('button', { name: 'Change legacy radius' }));

    const radiusState = screen.getByTestId('radius-state');
    expect(radiusState).toHaveTextContent('"8px"');
    expect(radiusState).toHaveTextContent('"18px"');
    expect(radiusState).toHaveTextContent('"32px"');
    expect(radiusState).not.toHaveTextContent('radius.xl');
  });
});
""")
