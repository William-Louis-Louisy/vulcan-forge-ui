import enMessages from './en.json';
import frMessages from './fr.json';
import { describe, expect, it } from 'vitest';
import { mergeMessages, type MessageObject } from './merge-messages';
import { componentGuidelineMessages } from './component-guidelines';

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

const localizedMessages = {
  en: mergeMessages(
    enMessages as MessageObject,
    componentGuidelineMessages.en,
  ) as unknown as JsonObject,
  fr: mergeMessages(
    frMessages as MessageObject,
    componentGuidelineMessages.fr,
  ) as unknown as JsonObject,
};

describe('localized messages', () => {
  it('uses English as the reference message structure', () => {
    const enKeys = getKeyPaths(localizedMessages.en).sort();
    const frKeys = getKeyPaths(localizedMessages.fr).sort();

    const missingInFrench = enKeys.filter((key) => !frKeys.includes(key));
    const extraInFrench = frKeys.filter((key) => !enKeys.includes(key));

    expect(missingInFrench).toEqual([]);
    expect(extraInFrench).toEqual([]);
  });

  it('does not contain empty English messages', () => {
    expect(getEmptyStringPaths(localizedMessages.en)).toEqual([]);
  });

  it('does not contain empty French messages', () => {
    expect(getEmptyStringPaths(localizedMessages.fr)).toEqual([]);
  });

  it('does not contain obsolete DS-090 contrast placeholders', () => {
    const serializedEnglishMessages = JSON.stringify(localizedMessages.en);
    const serializedFrenchMessages = JSON.stringify(localizedMessages.fr);

    expect(serializedEnglishMessages).not.toContain('DS-090');
    expect(serializedFrenchMessages).not.toContain('DS-090');
  });

  it('does not expose obsolete Components rollout copy', () => {
    const serializedEnglishMessages = JSON.stringify(localizedMessages.en);
    const serializedFrenchMessages = JSON.stringify(localizedMessages.fr);

    expect(serializedEnglishMessages).not.toContain(
      'Persistence will be added',
    );
    expect(serializedEnglishMessages).not.toContain(
      'not persisted in the model yet',
    );
    expect(serializedEnglishMessages).not.toContain('DS-150-09-04');
    expect(serializedEnglishMessages).not.toContain('coming next');
    expect(serializedEnglishMessages).not.toContain('not modeled yet');

    expect(serializedFrenchMessages).not.toContain(
      'La persistance sera ajoutée',
    );
    expect(serializedFrenchMessages).not.toContain(
      'ne sont pas encore persistés',
    );
    expect(serializedFrenchMessages).not.toContain('DS-150-09-04');
    expect(serializedFrenchMessages).not.toContain('à venir');
    expect(serializedFrenchMessages).not.toContain('non encore modélisées');
  });
});
