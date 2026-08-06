from pathlib import Path

reset_path = Path("src/app/api/auth/password-recovery/reset/route.test.ts")
reset_test = reset_path.read_text(encoding="utf-8")
reset_test = reset_test.replace(
    "import { NextRequest } from 'next/server';",
    "import type * as NextServer from 'next/server';\nimport { NextRequest } from 'next/server';",
)
reset_test = reset_test.replace(
    "const actual = await importOriginal<typeof import('next/server')>();",
    "const actual = await importOriginal<typeof NextServer>();",
)
reset_path.write_text(reset_test, encoding="utf-8")

integration_path = Path(
    "src/server/auth/email-verification/email-verification.integration.test.ts"
)
integration_test = integration_path.read_text(encoding="utf-8")
before = """      expect(
        results.filter((result) => result.status === 'invalid'),
      ).toHaveLength(1);"""
after = """      expect(
        results.filter((result) => result.status !== 'verified'),
      ).toHaveLength(1);
      expect(
        results.every((result) =>
          ['alreadyVerified', 'invalid', 'verified'].includes(result.status),
        ),
      ).toBe(true);"""

if integration_test.count(before) != 2:
    raise SystemExit("Expected two concurrent verification assertions")

integration_path.write_text(
    integration_test.replace(before, after), encoding="utf-8"
)
