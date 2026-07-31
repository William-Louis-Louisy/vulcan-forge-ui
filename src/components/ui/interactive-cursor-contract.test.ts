// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

const cursorStyles = readFileSync(
  resolve(process.cwd(), 'src/app/interactive-cursor.css'),
  'utf8',
);
const globalStyles = readFileSync(
  resolve(process.cwd(), 'src/app/globals.css'),
  'utf8',
);

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = cursorStyles;
  document.head.append(style);
});

afterEach(() => {
  document.body.replaceChildren();
});

function getRenderedCursor(element: HTMLElement) {
  document.body.append(element);
  return window.getComputedStyle(element).cursor;
}

describe('interactive cursor contract', () => {
  it('is imported as an unlayered application stylesheet', () => {
    expect(globalStyles).toContain("@import './interactive-cursor.css';");
    expect(cursorStyles).not.toContain('@layer');
  });

  it('renders a pointer cursor for enabled native and ARIA controls', () => {
    expect(getRenderedCursor(document.createElement('button'))).toBe('pointer');
    expect(getRenderedCursor(document.createElement('select'))).toBe('pointer');
    expect(getRenderedCursor(document.createElement('summary'))).toBe('pointer');

    const ariaButton = document.createElement('div');
    ariaButton.setAttribute('role', 'button');
    expect(getRenderedCursor(ariaButton)).toBe('pointer');
  });

  it('renders a not-allowed cursor for disabled controls', () => {
    const button = document.createElement('button');
    button.disabled = true;

    expect(getRenderedCursor(button)).toBe('not-allowed');
  });

  it('keeps the active disabled locale informational', () => {
    const activeLocale = document.createElement('button');
    activeLocale.disabled = true;
    activeLocale.setAttribute('aria-current', 'true');

    expect(getRenderedCursor(activeLocale)).toBe('default');
  });

  it('extends the same affordance to checkbox and radio labels', () => {
    expect(cursorStyles).toContain(
      "label:has(input[type='checkbox']:not(:disabled))",
    );
    expect(cursorStyles).toContain(
      "label:has(input[type='radio']:not(:disabled))",
    );
  });
});
