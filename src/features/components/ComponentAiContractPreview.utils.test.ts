import { describe, expect, it } from 'vitest';

import { getComponentAiContractModelGaps } from './ComponentAiContractPreview.utils';

describe('getComponentAiContractModelGaps', () => {
  it('does not report localized guidelines as model gaps once they are supported', () => {
    expect(getComponentAiContractModelGaps()).toEqual(['tokenBindings']);
  });
});
