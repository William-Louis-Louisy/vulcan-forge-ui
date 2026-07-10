import {
  designTokenSetSchema,
  type ComponentContract,
  type DesignToken,
  type DesignTokenSet,
} from '@/domain/design-system';

export type ComponentResolvedTokenBinding = {
  key: string;
  tokenType: DesignToken['type'];
  tokenPath: string;
  value: DesignToken['value'];
  resolvedValue: DesignToken['value'];
  status: DesignToken['status'];
  isResolved: boolean;
};

export type ComponentTokenBindingResolution = {
  bindings: Record<string, ComponentResolvedTokenBinding>;
  missingBindings: ComponentContract['tokenBindings'];
  invalidTokenSetsCount: number;
};

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
  action: Partial<
    Record<'primary' | 'secondary' | 'danger', string | undefined>
  >;
  status: Partial<Record<ComponentPreviewStatusTone, string | undefined>>;
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

export function parseComponentTokenSets(
  tokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>,
): {
  tokenSets: DesignTokenSet[];
  invalidTokenSetsCount: number;
} {
  const parsedTokenSets: DesignTokenSet[] = [];
  let invalidTokenSetsCount = 0;

  for (const tokenSet of tokenSets) {
    const parsedTokenSet = designTokenSetSchema.safeParse({
      type: tokenSet.type,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
    });

    if (!parsedTokenSet.success) {
      invalidTokenSetsCount += 1;
      continue;
    }

    parsedTokenSets.push(parsedTokenSet.data);
  }

  return {
    tokenSets: parsedTokenSets,
    invalidTokenSetsCount,
  };
}

function getTokenReferencePath(value: DesignToken['value']): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const referenceMatch = value.match(/^\{([a-zA-Z0-9._-]+)\}$/);

  return referenceMatch?.[1] ?? null;
}

function findTokenByPath({
  tokenSets,
  tokenPath,
}: {
  tokenSets: DesignTokenSet[];
  tokenPath: string;
}): DesignToken | null {
  for (const tokenSet of tokenSets) {
    const token = tokenSet.tokens.find(
      (candidate) => candidate.path === tokenPath,
    );

    if (token) {
      return token;
    }
  }

  return null;
}

function resolveTokenValue({
  tokenSets,
  token,
  visitedPaths = new Set<string>(),
}: {
  tokenSets: DesignTokenSet[];
  token: DesignToken;
  visitedPaths?: Set<string>;
}): DesignToken['value'] {
  const referencePath = getTokenReferencePath(token.reference ?? token.value);

  if (!referencePath || visitedPaths.has(referencePath)) {
    return token.value;
  }

  visitedPaths.add(referencePath);

  const referencedToken = findTokenByPath({
    tokenSets,
    tokenPath: referencePath,
  });

  if (!referencedToken) {
    return token.value;
  }

  return resolveTokenValue({
    tokenSets,
    token: referencedToken,
    visitedPaths,
  });
}

export function resolveComponentTokenBindings({
  bindings,
  tokenSets,
}: {
  bindings: ComponentContract['tokenBindings'];
  tokenSets: DesignTokenSet[];
}): Omit<ComponentTokenBindingResolution, 'invalidTokenSetsCount'> {
  const resolvedBindings: Record<string, ComponentResolvedTokenBinding> = {};
  const missingBindings: ComponentContract['tokenBindings'] = [];

  for (const binding of bindings) {
    const token = findTokenByPath({
      tokenSets,
      tokenPath: binding.tokenPath,
    });

    if (!token || token.type !== binding.tokenType) {
      missingBindings.push(binding);
      continue;
    }

    resolvedBindings[binding.key] = {
      key: binding.key,
      tokenType: token.type,
      tokenPath: binding.tokenPath,
      value: token.value,
      resolvedValue: resolveTokenValue({
        tokenSets,
        token,
      }),
      status: token.status,
      isResolved: true,
    };
  }

  return {
    bindings: resolvedBindings,
    missingBindings,
  };
}

export function createComponentTokenBindingResolution({
  bindings,
  rawTokenSets,
}: {
  bindings: ComponentContract['tokenBindings'];
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>;
}): ComponentTokenBindingResolution {
  const parsedTokenSets = parseComponentTokenSets(rawTokenSets);
  const resolvedBindings = resolveComponentTokenBindings({
    bindings,
    tokenSets: parsedTokenSets.tokenSets,
  });

  return {
    ...resolvedBindings,
    invalidTokenSetsCount: parsedTokenSets.invalidTokenSetsCount,
  };
}

export function normalizeComponentPreviewTokenRole(
  key: string,
): ComponentPreviewTokenRole | null {
  const normalizedKey = key.trim().replace(/[\s._-]+/g, '').toLowerCase();

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
  const colors = tokenSets.flatMap((tokenSet) =>
    tokenSet.tokens.flatMap((token) => {
      if (token.type !== 'color') {
        return [];
      }

      const resolvedValue = resolveTokenValue({ tokenSets, token });

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

  const status = Object.fromEntries(
    componentPreviewStatusTones.flatMap((tone) => {
      const value = findSemanticStatusColor(colors, tone);

      return value ? [[tone, value]] : [];
    }),
  ) as Partial<Record<ComponentPreviewStatusTone, string | undefined>>;

  return {
    action: {
      primary: findSemanticActionColor(colors, 'primary'),
      secondary: findSemanticActionColor(colors, 'secondary'),
      danger:
        findSemanticActionColor(colors, 'danger') ?? status.danger,
    },
    status,
    missingStatusTones: componentPreviewStatusTones.filter(
      (tone) => !status[tone],
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
