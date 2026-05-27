import { describe, expect, it } from 'vitest';
import { createAccessibilityCenterReport } from './accessibility-center.utils';

describe('createAccessibilityCenterReport', () => {
  it('returns a critical report when the token set is malformed', () => {
    expect(createAccessibilityCenterReport({ invalid: true })).toMatchObject({
      score: 75,
      status: 'critical',
      isReadable: false,
      issues: [
        {
          code: 'invalidColorTokenSet',
          severity: 'critical',
        },
      ],
    });
  });

  it('evaluates key contrast pairs from resolved tokens', () => {
    const report = createAccessibilityCenterReport([
      {
        path: 'color.primitive.neutral.0',
        type: 'color',
        value: '#ffffff',
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.950',
        type: 'color',
        value: '#111827',
        status: 'ready',
      },
      {
        path: 'color.semantic.content.primary',
        type: 'color',
        value: '{color.primitive.neutral.950}',
        reference: '{color.primitive.neutral.950}',
        status: 'ready',
      },
      {
        path: 'color.semantic.background.app',
        type: 'color',
        value: '{color.primitive.neutral.0}',
        reference: '{color.primitive.neutral.0}',
        status: 'ready',
      },
    ]);

    expect(report.isReadable).toBe(true);
    expect(report.contrastPairs.length).toBeGreaterThan(0);
    expect(
      report.contrastPairs.find(
        (pair) => pair.pair.id === 'contentPrimaryOnAppBackground',
      ),
    ).toMatchObject({
      status: 'pass',
      foreground: '#111827',
      background: '#ffffff',
    });
  });

  it('adds token resolution issues to the report', () => {
    const report = createAccessibilityCenterReport([
      {
        path: 'color.semantic.content.primary',
        type: 'color',
        value: '{color.semantic.missing}',
        reference: '{color.semantic.missing}',
        status: 'ready',
      },
    ]);

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'tokenResolutionError',
          severity: 'critical',
          tokenPath: 'color.semantic.content.primary',
        }),
      ]),
    );
  });
});
