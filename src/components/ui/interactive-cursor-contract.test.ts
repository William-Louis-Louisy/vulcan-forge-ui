import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync(
  resolve(process.cwd(), 'src/app/globals.css'),
  'utf8',
);

describe('interactive cursor contract', () => {
  it('uses a pointer cursor for enabled native controls', () => {
    expect(globalStyles).toContain('button:not(:disabled)');
    expect(globalStyles).toContain('select:not(:disabled)');
    expect(globalStyles).toContain("input[type='checkbox']:not(:disabled)");
    expect(globalStyles).toContain("input[type='radio']:not(:disabled)");
    expect(globalStyles).toContain("input[type='color']:not(:disabled)");
    expect(globalStyles).toContain('cursor: pointer;');
  });

  it('uses a not-allowed cursor for disabled native controls', () => {
    expect(globalStyles).toContain('button:disabled');
    expect(globalStyles).toContain('select:disabled');
    expect(globalStyles).toContain("input[type='checkbox']:disabled");
    expect(globalStyles).toContain("input[type='radio']:disabled");
    expect(globalStyles).toContain("input[type='color']:disabled");
    expect(globalStyles).toContain('cursor: not-allowed;');
  });

  it('extends the same affordance to checkbox and radio labels', () => {
    expect(globalStyles).toContain(
      "label:has(input[type='checkbox']:not(:disabled))",
    );
    expect(globalStyles).toContain(
      "label:has(input[type='radio']:not(:disabled))",
    );
  });
});
