import { describe, expect, it } from 'vitest';
import {
  getComponentPreviewTokenRoleSelection,
  getComponentPreviewTokenRoleType,
  getFirstAvailableComponentPreviewTokenRole,
  getUsedComponentPreviewTokenRoles,
} from './component-preview-role-bindings';

describe('component preview role bindings', () => {
  it('maps official preview roles to compatible token types', () => {
    expect(getComponentPreviewTokenRoleType('background')).toBe('color');
    expect(getComponentPreviewTokenRoleType('radius')).toBe('radius');
    expect(getComponentPreviewTokenRoleType('paddingX')).toBe('spacing');
    expect(getComponentPreviewTokenRoleType('duration')).toBe('motion');
  });

  it('distinguishes official, custom and empty role selections', () => {
    expect(getComponentPreviewTokenRoleSelection('background')).toBe(
      'background',
    );
    expect(getComponentPreviewTokenRoleSelection('background-color')).toBe(
      'background',
    );
    expect(getComponentPreviewTokenRoleSelection('fontWeight')).toBe('custom');
    expect(getComponentPreviewTokenRoleSelection('   ')).toBe('');
  });

  it('tracks normalized roles while excluding the edited binding', () => {
    const bindings = [
      { draftId: 'background', key: 'background-color' },
      { draftId: 'radius', key: 'radius' },
      { draftId: 'custom', key: 'fontWeight' },
    ];

    expect([...getUsedComponentPreviewTokenRoles(bindings)]).toEqual([
      'background',
      'radius',
    ]);
    expect([
      ...getUsedComponentPreviewTokenRoles(bindings, 'background'),
    ]).toEqual(['radius']);
  });

  it('returns the first official role that is not already used', () => {
    expect(
      getFirstAvailableComponentPreviewTokenRole([
        { draftId: 'background', key: 'background' },
        { draftId: 'foreground', key: 'foreground' },
      ]),
    ).toBe('border');
  });
});
