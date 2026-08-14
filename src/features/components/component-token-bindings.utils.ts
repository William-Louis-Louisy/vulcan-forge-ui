import {
  createTokenDictionary,
  parseComponentTokenSets,
  resolveDesignToken,
  type ComponentResolvedTokenBinding as DomainComponentResolvedTokenBinding,
  type ComponentTokenBindingResolution as DomainComponentTokenBindingResolution,
  type DesignToken,
  type DesignTokenSet,
  type TokenDictionary,
} from '@/domain/design-system';

export {
  parseComponentTokenSets,
  resolveComponentTokenBindings,
  createComponentTokenBindingResolution,
} from '@/domain/design-system';

export type ComponentResolvedTokenBinding = DomainComponentResolvedTokenBinding;
export type ComponentTokenBindingResolution = DomainComponentTokenBindingResolution;

export type ComponentTokenOption = {
  type: DesignToken['type'];
  path: string;
  label: string;
};

export const componentPreviewTokenRoles = [
  'background',
  'foreground',
  'border',
  'radius',
  'padding',
  'paddingX',
  'paddingY',
  'duration',
  'motion',
] as const;

export type ComponentPreviewTokenRole =
  (typeof componentPreviewTokenRoles)[number];

export const componentPreviewStatusTones = [
  'info',
  'success',
  'warning',
  'danger',
] as const;

export type ComponentPreviewStatusTone =
  (typeof componentPreviewStatusTones)[number];

export type ComponentPreviewSemanticPalette = {
  action: Partial<Record<'primary' | 'secondary' | 'danger', string>>;
  status: Record<ComponentPreviewStatusTone, string>;
  missingStatusTones: ComponentPreviewStatusTone[];
};

export function createComponentTokenOptions(
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>,
): ComponentTokenOption[] {
  const parsedTokenSets = parseComponentTokenSets(rawTokenSets);

  return parsedTokenSets.tokenSets.flatMap((tokenSet) =>
    tokenSet.tokens.map((token) => ({
      type: token.type,
      path: token.path,
      label: token.path,
    })),
  );
}

function createPreviewTokenDictionary(
  tokenSets: DesignTokenSet[],
): TokenDictionary {
  return createTokenDictionary(
    tokenSets.flatMap((tokenSet) => tokenSet.tokens),
  );
}

function resolvePreviewTokenValue({
  dictionary,
  token,
}: {
  dictionary: TokenDictionary;
  token: DesignToken;
}): DesignToken['value'] {
  const resolvedToken = resolveDesignToken({
    token,
    dictionary,
  });

  return resolvedToken.isResolved ? resolvedToken.resolvedValue : token.value;
}

export function normalizeComponentPreviewTokenRole(
  key: string,
): ComponentPreviewTokenRole | null {
  const normalizedKey = key
    .trim()
    .replace(/[\s._-]+/g, '')
    .toLowerCase();

  const roleAliases: Record<string, ComponentPreviewTokenRole> = {
    background: 'background',
    backgroundcolor: 'background',
    bgcolor: 'background',
    foreground: 'foreground',
    foregroundcolor: 'foreground',
    color: 'foreground',
    text: 'foreground',
    textcolor: 'foreground',
    border: 'border',
    bordercolor: 'border',
    radius: 'radius',
    borderradius: 'radius',
    padding: 'padding',
    paddingx: 'paddingX',
    paddinginline: 'paddingX',
    horizontalpadding: 'paddingX',
    paddingy: 'paddingY',
    paddingblock: 'paddingY',
    verticalpadding: 'paddingY',
    duration: 'duration',
    transitionduration: 'duration',
    motion: 'motion',
  };

  return roleAliases[normalizedKey] ?? null;
}

export function getComponentPreviewBinding(
  tokenBindingResolution: ComponentTokenBindingResolution,
  role: ComponentPreviewTokenRole,
): ComponentResolvedTokenBinding | undefined {
  return Object.values(tokenBindingResolution.bindings).find(
    (binding) => normalizeComponentPreviewTokenRole(binding.key) === role,
  );
}

export function createComponentPreviewSemanticPalette(
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>,
): ComponentPreviewSemanticPalette {
  const { tokenSets } = parseComponentTokenSets(rawTokenSets);
  const dictionary = createPreviewTokenDictionary(tokenSets);
  const colors = tokenSets.flatMap((tokenSet) =>
    tokenSet.tokens.flatMap((token) => {
      if (token.type !== 'color') {
        return [];
      }

      const resolvedValue = resolvePreviewTokenValue({ dictionary, token });

      if (
        typeof resolvedValue !== 'string' ||
        resolvedValue.trim().length === 0 ||
        resolvedValue.startsWith('{')
      ) {
        return [];
      }

      return [
        {
          path: token.path.toLowerCase(),
          value: resolvedValue,
        },
      ];
    }),
  );
  const semanticStatus = Object.fromEntries(
    componentPreviewStatusTones.flatMap((tone) => {
      const value = findSemanticStatusColor(colors, tone);

      return value ? [[tone, value]] : [];
    }),
  ) as Partial<Record<ComponentPreviewStatusTone, string>>;
  const primaryAction = findSemanticActionColor(colors, 'primary');
  const secondaryAction = findSemanticActionColor(colors, 'secondary');
  const dangerAction =
    findSemanticActionColor(colors, 'danger') ?? semanticStatus.danger;

  return {
    action: {
      ...(primaryAction ? { primary: primaryAction } : {}),
      ...(secondaryAction ? { secondary: secondaryAction } : {}),
      ...(dangerAction ? { danger: dangerAction } : {}),
    },
    status: {
      info: semanticStatus.info ?? 'var(--vf-action-info)',
      success: semanticStatus.success ?? 'var(--vf-action-success)',
      warning: semanticStatus.warning ?? 'var(--vf-action-warning)',
      danger: semanticStatus.danger ?? 'var(--vf-action-danger)',
    },
    missingStatusTones: componentPreviewStatusTones.filter(
      (tone) => !semanticStatus[tone],
    ),
  };
}

type ResolvedColorToken = {
  path: string;
  value: string;
};

function findSemanticActionColor(
  colors: ResolvedColorToken[],
  tone: 'primary' | 'secondary' | 'danger',
): string | undefined {
  const aliases = tone === 'danger' ? ['danger', 'destructive'] : [tone];
  const exactCandidates = aliases.flatMap((alias) => [
    `color.semantic.action.${alias}`,
    `color.semantic.action.${alias}.background`,
  ]);

  if (tone === 'primary') {
    exactCandidates.push('color.semantic.action.background');
  }

  const exactColor = exactCandidates
    .map((path) => colors.find((color) => color.path === path)?.value)
    .find(Boolean);

  if (exactColor) {
    return exactColor;
  }

  return colors.find((color) => {
    const segments = color.path.split('.');

    return (
      color.path.startsWith('color.semantic.') &&
      segments.includes('action') &&
      aliases.some((alias) => segments.includes(alias)) &&
      !isSemanticContentPath(segments)
    );
  })?.value;
}

function findSemanticStatusColor(
  colors: ResolvedColorToken[],
  tone: ComponentPreviewStatusTone,
): string | undefined {
  const aliases =
    tone === 'danger'
      ? ['danger', 'error', 'destructive']
      : tone === 'info'
        ? ['info', 'information']
        : [tone];
  const exactCandidates = aliases.flatMap((alias) => [
    `color.semantic.status.${alias}`,
    `color.semantic.status.${alias}.background`,
    `color.semantic.feedback.${alias}`,
    `color.semantic.feedback.${alias}.background`,
  ]);
  const exactColor = exactCandidates
    .map((path) => colors.find((color) => color.path === path)?.value)
    .find(Boolean);

  if (exactColor) {
    return exactColor;
  }

  return colors.find((color) => {
    const segments = color.path.split('.');

    return (
      color.path.startsWith('color.semantic.') &&
      (segments.includes('status') || segments.includes('feedback')) &&
      aliases.some((alias) => segments.includes(alias)) &&
      !isSemanticContentPath(segments)
    );
  })?.value;
}

function isSemanticContentPath(segments: string[]): boolean {
  return ['content', 'foreground', 'text', 'on'].some((segment) =>
    segments.includes(segment),
  );
}
