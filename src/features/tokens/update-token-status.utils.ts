// Visual design-system status only. This module does not handle authentication tokens or credentials.
import type { DesignToken, DesignTokenStatus } from '@/domain/design-system';

export type UpdateTokenStatusResult =
  | {
      status: 'success';
      tokens: DesignToken[];
    }
  | {
      status: 'error';
      error: 'tokenNotFound';
    };

export function updateTokenStatus({
  tokens,
  tokenPath,
  nextStatus,
}: {
  tokens: DesignToken[];
  tokenPath: string;
  nextStatus: DesignTokenStatus;
}): UpdateTokenStatusResult {
  if (!tokens.some((token) => token.path === tokenPath)) {
    return {
      status: 'error',
      error: 'tokenNotFound',
    };
  }

  return {
    status: 'success',
    tokens: tokens.map((token) =>
      token.path === tokenPath
        ? {
            ...token,
            status: nextStatus,
          }
        : token,
    ),
  };
}
