// Visual design-system values only: colors, spacing, radius, typography and motion.
import { describe, expect, it } from 'vitest';
import type { DesignToken } from './design-token.schema';
import {
  getResolvedTokenByPath,
  resolveDesignTokens,
} from './token-resolution';

describe('design value characterization', () => {
  it('preserves composite values that are not top-level aliases', () => {
    const compositeValue = {
      fontFamily: 'Inter Tight, sans-serif',
      fontSize: '1rem',
    };
    const values: DesignToken[] = [
      {
        path: 'typography.body.brand',
        type: 'typography',
        value: compositeValue,
        status: 'ready',
      },
    ];

    const result = resolveDesignTokens(values);
    const resolvedValue = getResolvedTokenByPath({
      path: 'typography.body.brand',
      result,
    });

    expect(resolvedValue).toMatchObject({
      rawValue: compositeValue,
      resolvedValue: compositeValue,
      resolvedReferencePath: null,
      isResolved: true,
      errors: [],
    });
  });
});
