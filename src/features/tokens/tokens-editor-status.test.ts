import { describe, expect, it } from 'vitest';
import { createTokenRows } from './tokens-editor.utils';

describe('token editor status rows', () => {
  it('exposes the persisted status for a valid design token', () => {
    const result = createTokenRows([
      {
        path: 'color.primitive.accent.inkBlue',
        type: 'color',
        value: '#010021',
        status: 'draft',
      },
    ]);

    expect(result.rows[0]).toMatchObject({
      path: 'color.primitive.accent.inkBlue',
      status: 'draft',
      validationStatus: 'valid',
    });
  });
});
