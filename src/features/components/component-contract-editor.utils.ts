import {
  componentContractSchema,
  type ComponentContract,
  type ComponentContractType,
} from '@/domain/design-system';

export type LocalizedTextDraft = {
  en: string;
  fr: string;
};

export type ComponentVariantDraft = {
  key: string;
  label: LocalizedTextDraft;
  description: LocalizedTextDraft;
};

export type ComponentStateDraft = {
  key: string;
  label: LocalizedTextDraft;
  description: LocalizedTextDraft;
};

export type ComponentAccessibilityRuleDraft = {
  key: string;
  severity: 'info' | 'warning' | 'critical';
  description: LocalizedTextDraft;
};

export type ComponentContractEditorDraft = {
  type: ComponentContractType;
  name: string;
  status: ComponentContract['status'];
  purpose: LocalizedTextDraft;
  anatomy: string[];
  variants: ComponentVariantDraft[];
  states: ComponentStateDraft[];
  accessibility: ComponentAccessibilityRuleDraft[];
  forbiddenPatterns: LocalizedTextDraft[];
};

export type ComponentContractDraftValidationResult =
  | {
      status: 'success';
      contract: ComponentContract;
    }
  | {
      status: 'error';
      errors: string[];
    };

function normalizeLocalizedText(value: {
  en?: string | undefined;
  fr?: string | undefined;
}): LocalizedTextDraft {
  return {
    en: value.en ?? '',
    fr: value.fr ?? '',
  };
}

function toOptionalLocalizedText(value: LocalizedTextDraft) {
  return {
    en: value.en.trim() || undefined,
    fr: value.fr.trim() || undefined,
  };
}

export function createComponentContractDraft(
  contract: ComponentContract,
): ComponentContractEditorDraft {
  return {
    type: contract.type,
    name: contract.name,
    status: contract.status,
    purpose: normalizeLocalizedText(contract.purpose),
    anatomy: contract.anatomy,
    variants: contract.variants.map((variant) => ({
      key: variant.key,
      label: normalizeLocalizedText(variant.label),
      description: normalizeLocalizedText(variant.description ?? {}),
    })),
    states: contract.states.map((state) => ({
      key: state.key,
      label: normalizeLocalizedText(state.label),
      description: normalizeLocalizedText(state.description ?? {}),
    })),
    accessibility: contract.accessibility.map((rule) => ({
      key: rule.key,
      severity: rule.severity,
      description: normalizeLocalizedText(rule.description),
    })),
    forbiddenPatterns: contract.forbiddenPatterns.map(normalizeLocalizedText),
  };
}

export function createComponentContractFromDraft(
  draft: ComponentContractEditorDraft,
): ComponentContractDraftValidationResult {
  const parsedContract = componentContractSchema.safeParse({
    type: draft.type,
    name: draft.name.trim(),
    status: draft.status,
    purpose: toOptionalLocalizedText(draft.purpose),
    anatomy: draft.anatomy
      .map((item) => item.trim())
      .filter((item) => item.length > 0),
    variants: draft.variants
      .filter((variant) => variant.key.trim().length > 0)
      .map((variant) => ({
        key: variant.key.trim(),
        label: toOptionalLocalizedText(variant.label),
        description: toOptionalLocalizedTextOrUndefined(variant.description),
      })),
    states: draft.states
      .filter((state) => state.key.trim().length > 0)
      .map((state) => ({
        key: state.key.trim(),
        label: toOptionalLocalizedText(state.label),
        description: toOptionalLocalizedTextOrUndefined(state.description),
      })),
    accessibility: draft.accessibility
      .filter((rule) => rule.key.trim().length > 0)
      .map((rule) => ({
        key: rule.key.trim(),
        severity: rule.severity,
        description: toOptionalLocalizedText(rule.description),
      })),
    forbiddenPatterns: draft.forbiddenPatterns
      .filter((pattern) => pattern.en.trim() || pattern.fr.trim())
      .map(toOptionalLocalizedText),
  });

  if (!parsedContract.success) {
    return {
      status: 'error',
      errors: parsedContract.error.issues.map((issue) => issue.message),
    };
  }

  return {
    status: 'success',
    contract: parsedContract.data,
  };
}

export function createEmptyVariantDraft(): ComponentVariantDraft {
  return {
    key: '',
    label: {
      en: '',
      fr: '',
    },
    description: {
      en: '',
      fr: '',
    },
  };
}

export function createEmptyStateDraft(): ComponentStateDraft {
  return {
    key: '',
    label: {
      en: '',
      fr: '',
    },
    description: {
      en: '',
      fr: '',
    },
  };
}

export function createEmptyAccessibilityRuleDraft(): ComponentAccessibilityRuleDraft {
  return {
    key: '',
    severity: 'warning',
    description: {
      en: '',
      fr: '',
    },
  };
}

export function createEmptyForbiddenPatternDraft(): LocalizedTextDraft {
  return {
    en: '',
    fr: '',
  };
}

function toOptionalLocalizedTextOrUndefined(value: LocalizedTextDraft) {
  const localizedText = toOptionalLocalizedText(value);

  return localizedText.en || localizedText.fr ? localizedText : undefined;
}
