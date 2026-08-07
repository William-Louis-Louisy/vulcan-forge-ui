from pathlib import Path

path = Path('src/features/tokens/rename-token.utils.ts')
content = path.read_text(encoding='utf-8')
old = """    return {
      ...renamedToken,
      value: shouldMigrateValue ? nextReference : renamedToken.value,
      reference: shouldMigrateReference
        ? nextReference
        : renamedToken.reference,
    };"""
new = """    return {
      ...renamedToken,
      value: shouldMigrateValue ? nextReference : renamedToken.value,
      ...(shouldMigrateReference ? { reference: nextReference } : {}),
    };"""

if old not in content:
    raise RuntimeError('Expected rename-token reference fragment not found')

path.write_text(content.replace(old, new, 1), encoding='utf-8')
print('DS-170-08A rename type fix applied.')
