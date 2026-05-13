import enMessages from './en.json';
import frMessages from './fr.json';
import { describe, expect, it } from 'vitest';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue;
};

function isPlainObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getKeyPaths(value: JsonObject, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(child)) {
      return getKeyPaths(child, path);
    }

    return [path];
  });
}

function getEmptyStringPaths(value: JsonObject, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(child)) {
      return getEmptyStringPaths(child, path);
    }

    if (typeof child === 'string' && child.trim().length === 0) {
      return [path];
    }

    return [];
  });
}

describe('localized messages', () => {
  it('uses English as the reference message structure', () => {
    const enKeys = getKeyPaths(enMessages).sort();
    const frKeys = getKeyPaths(frMessages).sort();

    const missingInFrench = enKeys.filter((key) => !frKeys.includes(key));
    const extraInFrench = frKeys.filter((key) => !enKeys.includes(key));

    expect(missingInFrench).toEqual([]);
    expect(extraInFrench).toEqual([]);
  });

  it('does not contain empty English messages', () => {
    expect(getEmptyStringPaths(enMessages)).toEqual([]);
  });

  it('does not contain empty French messages', () => {
    expect(getEmptyStringPaths(frMessages)).toEqual([]);
  });
});
