import type { CreateDesignSystemActionState } from './create-design-system.state';

export type CreateDesignSystemFormError = NonNullable<
  CreateDesignSystemActionState['formError']
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasPrismaErrorCode(error: unknown, code: string) {
  return isRecord(error) && error.code === code;
}

export function getCreateDesignSystemFormError(
  error: unknown,
): CreateDesignSystemFormError {
  if (hasPrismaErrorCode(error, 'P2002')) {
    return 'slugAlreadyUsed';
  }

  return 'unexpected';
}
