import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodErrorToLocalizedIssues } from './zod-error-mapper';

describe('zodErrorToLocalizedIssues', () => {
  it('converts Zod issues to localized issue descriptors', () => {
    const schema = z.object({
      name: z.string().min(2, { message: 'nameMinLength' }),
    });

    const result = schema.safeParse({
      name: 'A',
    });

    if (result.success) {
      throw new Error('Expected schema parsing to fail.');
    }

    expect(zodErrorToLocalizedIssues(result.error)).toEqual([
      {
        path: 'name',
        messageKey: 'nameMinLength',
      },
    ]);
  });
});
