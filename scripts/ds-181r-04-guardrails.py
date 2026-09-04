from pathlib import Path


def replace(path: str, old: str, new: str, expected: int = 1):
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != expected:
        raise SystemExit(
            f"{path}: expected {expected} occurrences, found {count}: {old[:80]!r}"
        )
    p.write_text(text.replace(old, new))


# A V2-owned component no longer depends on legacy token bindings for its preview,
# so an empty legacy binding list must not be presented as a missing setup.
preview_path = "src/features/components/ComponentFoundationsPreviewClient.tsx"
replace(
    preview_path,
    """  const isTextFieldTemplate =
    templateDefinition?.rendererKey === 'textField';
  const previewLabels = {""",
    """  const isTextFieldTemplate =
    templateDefinition?.rendererKey === 'textField';
  const usesV2VisualPreview = isButtonTemplate || isTextFieldTemplate;
  const previewLabels = {""",
)
replace(
    preview_path,
    "      {contract.tokenBindings.length === 0 ? (",
    "      {contract.tokenBindings.length === 0 && !usesV2VisualPreview ? (",
)
replace(
    preview_path,
    "        {isButtonTemplate || isTextFieldTemplate ? (",
    "        {usesV2VisualPreview ? (",
)

# Lock the semantic editor boundary: TextField uses the V2 inspector and no longer
# renders the generic legacy Visual Tokens editor.
editor_test_path = Path("src/features/components/ComponentContractEditor.test.tsx")
editor_test = editor_test_path.read_text()
old_import = "import type { ComponentContract } from '@/domain/design-system';"
new_import = """import {
  migrateLegacyComponentContract,
  type ComponentContract,
} from '@/domain/design-system';"""
if old_import not in editor_test:
    raise SystemExit("ComponentContractEditor.test: domain import marker missing")
editor_test = editor_test.replace(old_import, new_import, 1)
editor_case = r'''

  it('uses the V2 visual inspector as the sole TextField visual authoring surface', () => {
    const textFieldContract: ComponentContract = {
      ...contract,
      type: 'textField',
      name: 'TextField',
      variants: [
        {
          key: 'default',
          label: { en: 'Default', fr: 'Défaut' },
        },
      ],
      sizes: [
        {
          key: 'md',
          label: { en: 'Medium', fr: 'Moyen' },
        },
      ],
      states: [
        {
          key: 'invalid',
          label: { en: 'Invalid', fr: 'Invalide' },
        },
      ],
      tokenBindings: [],
    };
    const textFieldContractV2 = migrateLegacyComponentContract(
      textFieldContract,
      {
        key: 'textField',
        name: 'TextField',
        templateKey: 'textField',
        category: 'input',
      },
    );

    render(
      <ComponentContractEditor
        componentKey="textField"
        locale="en"
        projectSlug="demo"
        contract={textFieldContract}
        contractV2={textFieldContractV2}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    expect(
      screen.getByTestId('button-visual-customization-editor'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Add visual token/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Variants & states').closest('details')).not.toBeNull();
    expect(screen.getByText('Localized content').closest('details')).not.toBeNull();
  });
'''
closing = "\n});\n"
if not editor_test.endswith(closing):
    raise SystemExit("ComponentContractEditor.test: describe closing marker missing")
editor_test = editor_test[: -len(closing)] + editor_case + closing
editor_test_path.write_text(editor_test)

# Lock the real TextField V2 preview path, state resolution, and the absence of the
# now-irrelevant legacy binding notice.
preview_test_path = Path(
    "src/features/components/ComponentFoundationsPreviewClient.test.tsx"
)
preview_test = preview_test_path.read_text()
preview_case = r'''

  it('renders TextField through the V2 resolver without a legacy binding notice', async () => {
    const user = userEvent.setup();
    const textFieldContract: ComponentContract = {
      ...contract,
      type: 'textField',
      name: 'TextField',
      variants: [
        {
          key: 'default',
          label: { en: 'Default' },
        },
      ],
      sizes: [
        {
          key: 'md',
          label: { en: 'Medium' },
        },
      ],
      states: [
        {
          key: 'focus',
          label: { en: 'Focus' },
        },
        {
          key: 'invalid',
          label: { en: 'Invalid' },
        },
        {
          key: 'disabled',
          label: { en: 'Disabled' },
        },
      ],
      tokenBindings: [],
    };
    const migratedTextFieldContract = migrateLegacyComponentContract(
      textFieldContract,
      {
        key: 'textField',
        name: 'TextField',
        templateKey: 'textField',
        category: 'input',
      },
    );
    const textFieldContractV2 = componentContractV2Schema.parse({
      ...migratedTextFieldContract,
      visual: {
        ...migratedTextFieldContract.visual,
        surface: {
          background: { source: 'value', value: '#fefefe' },
        },
      },
      overrides: {
        ...migratedTextFieldContract.overrides,
        states: {
          ...migratedTextFieldContract.overrides.states,
          invalid: {
            border: {
              color: { source: 'value', value: '#cc0000' },
            },
          },
        },
      },
    });
    const textFieldComponent: ComponentRegistryItem = {
      ...component,
      id: 'text-field',
      key: 'textField',
      templateKey: 'textField',
      type: 'textField',
      name: 'TextField',
      category: 'input',
      contract: textFieldContract,
      contractV2: textFieldContractV2,
    };

    render(
      <ComponentContractPreviewProvider
        initialContract={textFieldContract}
        initialContractV2={textFieldContractV2}
      >
        <ComponentFoundationsPreviewClient
          locale="en"
          component={textFieldComponent}
          rawTokenSets={rawTokenSets}
        />
      </ComponentContractPreviewProvider>,
    );

    expect(
      screen.queryByText('foundationsPreview.noTokenBindingsNotice'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-component-v2-preview="textField"]'),
    ).not.toBeNull();

    const input = screen.getByRole('textbox', { name: 'TextField' });
    expect(input).toHaveAttribute('data-preview-v2', 'true');
    expect(input).toHaveStyle({ backgroundColor: '#fefefe' });

    const stateSelect = screen.getByRole('combobox', {
      name: 'foundationsPreview.state',
    });
    await user.click(stateSelect);
    await user.click(screen.getByRole('option', { name: 'Invalid' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveStyle({ borderColor: '#cc0000' });

    await user.click(stateSelect);
    await user.click(screen.getByRole('option', { name: 'Disabled' }));
    expect(input).toBeDisabled();
  });
'''
if not preview_test.endswith(closing):
    raise SystemExit("ComponentFoundationsPreviewClient.test: describe closing marker missing")
preview_test = preview_test[: -len(closing)] + preview_case + closing
preview_test_path.write_text(preview_test)
