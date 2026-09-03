from pathlib import Path


def replace_once(path_str: str, old: str, new: str) -> None:
    path = Path(path_str)
    source = path.read_text()
    if old not in source:
        raise SystemExit(f"Expected anchor not found in {path_str}: {old[:100]!r}")
    path.write_text(source.replace(old, new, 1))


sections = "src/features/components/ComponentContractEditorSections.tsx"
replace_once(
    sections,
    "import { Button, Input, Select, Textarea } from '@/components/ui';\n",
    "import { Button, Input, Select, Textarea } from '@/components/ui';\nimport { CaretRightIcon } from '@phosphor-icons/react';\n",
)
replace_once(
    sections,
    '''            {action ? (\n              <span\n                onClick={(event) => event.stopPropagation()}\n                onKeyDown={(event) => event.stopPropagation()}\n              >\n                {action}\n              </span>\n            ) : null}\n            <span\n              aria-hidden="true"\n              className="text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90"\n            >\n              ›\n            </span>''',
    '''            {action ? (\n              <span\n                className="hidden group-open:block"\n                onClick={(event) => event.stopPropagation()}\n                onKeyDown={(event) => event.stopPropagation()}\n              >\n                {action}\n              </span>\n            ) : null}\n            <CaretRightIcon\n              aria-hidden="true"\n              size={14}\n              weight="bold"\n              className="text-content-tertiary mt-0.5 shrink-0 transition-transform group-open:rotate-90"\n            />''',
)

anatomy = "src/features/components/ComponentAnatomyEditor.tsx"
replace_once(
    anatomy,
    "import { Button, Input, Select } from '@/components/ui';\n",
    "import { Button, Input, Select } from '@/components/ui';\nimport { CaretRightIcon } from '@phosphor-icons/react';\n",
)
replace_once(
    anatomy,
    '''            <span\n              onClick={(event) => event.stopPropagation()}\n              onKeyDown={(event) => event.stopPropagation()}\n            >\n              <Button''',
    '''            <span\n              className="hidden group-open:block"\n              onClick={(event) => event.stopPropagation()}\n              onKeyDown={(event) => event.stopPropagation()}\n            >\n              <Button''',
)
replace_once(
    anatomy,
    '''            <span\n              aria-hidden="true"\n              className="text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90"\n            >\n              ›\n            </span>''',
    '''            <CaretRightIcon\n              aria-hidden="true"\n              size={14}\n              weight="bold"\n              className="text-content-tertiary mt-0.5 shrink-0 transition-transform group-open:rotate-90"\n            />''',
)

visual = "src/features/components/ButtonVisualCustomizationEditor.tsx"
replace_once(
    visual,
    "import { PlusIcon } from '@phosphor-icons/react';\n",
    "import { CaretRightIcon, PlusIcon } from '@phosphor-icons/react';\n",
)
replace_once(
    visual,
    '''          <div\n            className="relative"\n            onClick={(event) => event.stopPropagation()}''',
    '''          <div\n            className="relative hidden group-open:block"\n            onClick={(event) => event.stopPropagation()}''',
)
replace_once(
    visual,
    '''          <span\n            aria-hidden="true"\n            className="text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90"\n          >\n            ›\n          </span>''',
    '''          <CaretRightIcon\n            aria-hidden="true"\n            size={14}\n            weight="bold"\n            className="text-content-tertiary mt-0.5 shrink-0 transition-transform group-open:rotate-90"\n          />''',
)

contract_test = "src/features/components/ComponentContractEditor.test.tsx"
replace_once(
    contract_test,
    '''    expect(\n      screen\n        .getByRole('button', { name: /Add anatomy item/ })\n        .closest('summary'),\n    ).toBe(anatomySummary);''',
    '''    const anatomyAction = screen.getByRole('button', {\n      name: /Add anatomy item/,\n    });\n    expect(anatomyAction.closest('summary')).toBe(anatomySummary);\n    expect(anatomyAction.parentElement).toHaveClass(\n      'hidden',\n      'group-open:block',\n    );\n    expect(anatomySummary?.querySelector('svg')).not.toBeNull();''',
)
replace_once(
    contract_test,
    '''    expect(\n      screen\n        .getByRole('button', { name: /Add accessibility rule/ })\n        .closest('summary'),\n    ).toBe(accessibilitySummary);''',
    '''    const accessibilityAction = screen.getByRole('button', {\n      name: /Add accessibility rule/,\n    });\n    expect(accessibilityAction.closest('summary')).toBe(accessibilitySummary);\n    expect(accessibilityAction.parentElement).toHaveClass(\n      'hidden',\n      'group-open:block',\n    );\n    expect(accessibilitySummary?.querySelector('svg')).not.toBeNull();''',
)

visual_test = "src/features/components/ButtonVisualCustomizationEditor.test.tsx"
replace_once(
    visual_test,
    '''    expect(\n      screen.getByRole('heading', { name: 'Visual tokens' }).closest('details'),\n    ).not.toBeNull();''',
    '''    const visualHeading = screen.getByRole('heading', {\n      name: 'Visual tokens',\n    });\n    const visualDetails = visualHeading.closest('details');\n    const visualSummary = visualHeading.closest('summary');\n    const addPropertyAction = screen.getByRole('button', {\n      name: 'Add visual property',\n    });\n\n    expect(visualDetails).not.toBeNull();\n    expect(addPropertyAction.parentElement).toHaveClass(\n      'hidden',\n      'group-open:block',\n    );\n    expect(visualSummary?.querySelector('svg')).not.toBeNull();''',
)
