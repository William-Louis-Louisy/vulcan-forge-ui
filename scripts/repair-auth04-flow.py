from pathlib import Path

route_path = Path("src/app/api/auth/password-recovery/reset/route.ts")
route = route_path.read_text(encoding="utf-8")
before = """    return createResponse({
      fieldErrors: {
        password: fieldErrors.password as
          | ResetPasswordValidationMessageKey[]
          | undefined,
        passwordConfirmation: fieldErrors.passwordConfirmation as
          | ResetPasswordValidationMessageKey[]
          | undefined,
      },
      status: 'error',
    });"""
after = """    const normalizedFieldErrors: NonNullable<
      ResetResponse['fieldErrors']
    > = {};

    if (fieldErrors.password?.length) {
      normalizedFieldErrors.password =
        fieldErrors.password as ResetPasswordValidationMessageKey[];
    }

    if (fieldErrors.passwordConfirmation?.length) {
      normalizedFieldErrors.passwordConfirmation =
        fieldErrors.passwordConfirmation as ResetPasswordValidationMessageKey[];
    }

    return createResponse({
      fieldErrors: normalizedFieldErrors,
      status: 'error',
    });"""
if before not in route:
    raise SystemExit("Reset route validation block not found")
route_path.write_text(route.replace(before, after), encoding="utf-8")

email_test_path = Path(
    "src/server/auth/password-recovery/password-recovery-email.test.ts"
)
email_test = email_test_path.read_text(encoding="utf-8")
before_mock = "const fetchImpl = vi.fn(async () => new Response('{}', { status: 200 }));"
after_mock = """const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response('{}', { status: 200 }),
    );"""
if email_test.count(before_mock) != 2:
    raise SystemExit("Expected two email delivery mocks")
email_test_path.write_text(
    email_test.replace(before_mock, after_mock), encoding="utf-8"
)
