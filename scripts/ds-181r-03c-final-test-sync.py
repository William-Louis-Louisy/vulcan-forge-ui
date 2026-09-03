from pathlib import Path


def replace_once(path_str: str, old: str, new: str) -> None:
    path = Path(path_str)
    source = path.read_text()
    if old not in source:
        raise SystemExit(f"Expected anchor not found in {path_str}: {old!r}")
    path.write_text(source.replace(old, new, 1))


editor = "src/features/components/ButtonVisualCustomizationEditor.tsx"
replace_once(
    editor,
    "import { CaretRightIcon, PlusIcon } from '@phosphor-icons/react';",
    "import { CaretRightIcon } from '@phosphor-icons/react';",
)
replace_once(
    editor,
    '''            <Button\n              variant="secondary"\n              size="sm"\n              onClick={() => setIsAddMenuOpen((open) => !open)}\n            >''',
    '''            <Button\n              variant="secondary"\n              size="sm"\n              aria-label={t('addProperty')}\n              aria-expanded={isAddMenuOpen}\n              onClick={() => setIsAddMenuOpen((open) => !open)}\n            >''',
)

editor_test = "src/features/components/ButtonVisualCustomizationEditor.test.tsx"
replace_once(
    editor_test,
    "expect(independentCorners).toHaveClass('accent-[var(--vf-action-accent)]');",
    "expect(independentCorners).toHaveClass('accent-action-accent');",
)
