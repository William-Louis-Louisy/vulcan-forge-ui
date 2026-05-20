import { describe, expect, it } from 'vitest';
import { getCreateDesignSystemFormError } from './create-design-system.errors';

describe('getCreateDesignSystemFormError', () => {
  it('maps Prisma unique constraint errors to slugAlreadyUsed', () => {
    expect(getCreateDesignSystemFormError({ code: 'P2002' })).toBe(
      'slugAlreadyUsed',
    );
  });

  it('maps unknown errors to unexpected', () => {
    expect(getCreateDesignSystemFormError(new Error('Database down'))).toBe(
      'unexpected',
    );
  });
});
