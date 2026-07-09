import {
  componentContractSchema,
  type ComponentAnatomyRequirement,
  type ComponentContract,
  type ComponentContractType,
} from '@/domain/design-system';

export type LocalizedTextDraft = {
  en: string;
  fr: string;
};

export type ComponentAnatomyPartDraft = {
  key: string;
  label: LocalizedTextDraft;
  requirement: ComponentAnatomyRequirement;
};

type ComponentCollectionDraft = {
  draftId: string;
  key: string;
  label: LocalizedTextDraft;
  description: LocalizedTextDraft;
};

export type ComponentVariantDraft = ComponentCollectionDraft;
export type ComponentStateDraft = ComponentCollectionDraft;
export type ComponentSizeDraft = ComponentCollectionDraft;

export type ComponentTokenBindingDraft = {
  key: string;
  tokenType: ComponentContract['tokenBindings'][number]['tokenType'];
  tokenPath: string;
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
  usageGuidelines: LocalizedTextDraft;
  contentGuidelines: LocalizedTextDraft;
  anatomy: ComponentAnatomyPartDraft[];
  variants: ComponentVariantDraft[];
  states: ComponentStateDraft[];
  accessibility: ComponentAccessibilityRuleDraft[];
  forbiddenPatterns: LocalizedTextDraft[];
  sizes: ComponentSizeDraft[];
  tokenBindings: ComponentTokenBindingDraft[];
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

let draftItemSequence = 0;

function createDraftItemId(prefix: 'variant' | 'size' | 'state') {
  draftItemSequence += 1;

  return `${prefix}-new-${draftItemSequence}`;
}

function createExistingDraftItemId(
  prefix: 'variant' | 'size' | 'state',
  index: number,
) {
  return `${prefix}-${index}`;
}

function normalizeLocalizedText(value: {
  en?: string | undefined;
  fr?: string | undefined;
}): LocalizedTextDraft {
  return {
    en: value.en ?? '',
    fr: value.fr ?? '',
  };
}

function normalizeAnatomyPart(
  part: ComponentContract['anatomy'][number],
): ComponentAnatomyPartDraft {
  if (typeof part === 'string') {
    return {
      key: part,
      label: {
        en: part,
        fr: '',
      },
      requirement: 'required',
    };
  }

  return {
    key: part.key,
    label: normalizeLocalizedText(part.label),
    requirement: part.requirement,
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
    usageGuidelines: normalizeLocalizedText(contract.usageGuidelines ?? {}),
    contentGuidelines: normalizeLocalizedText(contract.contentGuidelines ?? {}),
    anatomy: contract.anatomy.map(normalizeAnatomyPart),
    variants: contract.variants.map((variant, index) => ({
      draftId: createExistingDraftItemId('variant', index),
      key: variant.key,
      label: normalizeLocalizedText(variant.label),
      description: normalizeLocalizedText(variant.description ?? {}),
    })),
    sizes: contract.sizes.map((size, index) => ({
      draftId: createExistingDraftItemId('size', index),
      key: size.key,
      label: normalizeLocalizedText(size.label),
      description: normalizeLocalizedText(size.description ?? {}),
    })),
    states: contract.states.map((state, index) => ({
      draftId: createExistingDraftItemId('state', index),
      key: state.key,
      label: normalizeLocalizedText(state.label),
      description: normalizeLocalizedText(state.description ?? {}),
    })),
    tokenBindings: contract.tokenBindings.map((binding) => ({
      key: binding.key,
      tokenType: binding.tokenType,
      tokenPath: binding.tokenPath,
      description: normalizeLocalizedText(binding.description ?? {}),
    })),
    accessibility: contract.accessibility.map((rule) => ({
      key: rule.key,
      severity: rule.severity,
      description: normalizeLocalizedText(rule.description),
    })),
    forbiddenPatterns: contract.forbiddenPatterns.map(normalizeLocalizedText),
  };
}

export function createComponentContractDraftFingerprint(
  draft: ComponentContractEditorDraft,
): string {
  return JSON.stringify({
    ...draft,
    variants: draft.variants.map(({ key, label, description }) => ({
      key,
      label,
      description,
    })),
    sizes: draft.sizes.map(({ key, label, description }) => ({
      key,
      label,
      description,
    })),
    states: draft.states.map(({ key, label, description }) => ({
      key,
      label,
      description,
    })),
  });
}

export function createComponentContractFromDraft(
  draft: ComponentContractEditorDraft,
): ComponentContractDraftValidationResult {
  const parsedContract = componentContractSchema.safeParse({
    type: draft.type,
    name: draft.name.trim(),
    status: draft.status,
    purpose: toOptionalLocalizedText(draft.purpose),
    usageGuidelines: toOptionalLocalizedTextOrUndefined(draft.usageGuidelines),
    contentGuidelines: toOptionalLocalizedTextOrUndefined(
      draft.contentGuidelines,
    ),
    anatomy: draft.anatomy
      .filter((part) => part.key.trim().length > 0)
      .map((part) => ({
        key: part.key.trim(),
        label: toOptionalLocalizedText(part.label),
        requirement: part.requirement,
      })),
    variants: draft.variants
      .filter((variant) => variant.key.trim().length > 0)
      .map((variant) => ({
        key: variant.key.trim(),
        label: toOptionalLocalizedText(variant.label),
        description: toOptionalLocalizedTextOrUndefined(variant.description),
      })),
    sizes: draft.sizes
      .filter((size) => size.key.trim().length > 0)
      .map((size) => ({
        key: size.key.trim(),
        label: toOptionalLocalizedText(size.label),
        description: toOptionalLocalizedTextOrUndefined(size.description),
      })),
    states: draft.states
      .filter((state) => state.key.trim().length > 0)
      .map((state) => ({
        key: state.key.trim(),
        label: toOptionalLocalizedText(state.label),
        description: toOptionalLocalizedTextOrUndefined(state.description),
      })),
    tokenBindings: draft.tokenBindings
      .filter(
        (binding) =>
          binding.key.trim().length > 0 || binding.tokenPath.trim().length > 0,
      )
      .map((binding) => ({
        key: binding.key.trim(),
        tokenType: binding.tokenType,
        tokenPath: binding.tokenPath.trim(),
        description: toOptionalLocalizedTextOrUndefined(binding.description),
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

export function createEmptyAnatomyPartDraft(): ComponentAnatomyPartDraft {
  return {
    key: '',
    label: {
      en: '',
      fr: '',
    },
    requirement: 'optional',
  };
}

export function createEmptyVariantDraft(): ComponentVariantDraft {
  return {
    draftId: createDraftItemId('variant'),
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
    draftId: createDraftItemId('state'),
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

export function createEmptySizeDraft(): ComponentSizeDraft {
  return {
    draftId: createDraftItemId('size'),
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

export function createEmptyTokenBindingDraft(): ComponentTokenBindingDraft {
  return {
    key: '',
    tokenType: 'color',
    tokenPath: '',
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
