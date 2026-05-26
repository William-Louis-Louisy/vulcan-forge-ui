import {
  evaluateContrast,
  type ContrastEvaluation,
  type ContrastStatus,
  type ContrastTextSize,
} from './contrast';

export type KeyContrastPairId =
  | 'contentPrimaryOnAppBackground'
  | 'contentSecondaryOnAppBackground'
  | 'contentPrimaryOnPrimarySurface'
  | 'contentSecondaryOnPrimarySurface'
  | 'contentInverseOnPrimaryAction'
  | 'dangerTextOnPrimarySurface';

export type KeyContrastIssueCode =
  | 'missingForegroundColor'
  | 'missingBackgroundColor'
  | 'contrastWarning'
  | 'contrastFail';

export type KeyContrastIssueSeverity = 'warning' | 'critical';

export type KeyContrastPairDefinition = {
  id: KeyContrastPairId;
  foregroundTokenPath: string;
  backgroundTokenPath: string;
  textSize: ContrastTextSize;
  optional?: boolean;
};

export type KeyContrastIssue = {
  code: KeyContrastIssueCode;
  severity: KeyContrastIssueSeverity;
  pairId: KeyContrastPairId;
  foregroundTokenPath: string;
  backgroundTokenPath: string;
};

export type KeyContrastPairStatus = ContrastStatus | 'missing' | 'skipped';

export type KeyContrastPairEvaluation = {
  pair: KeyContrastPairDefinition;
  foreground: string | null;
  background: string | null;
  status: KeyContrastPairStatus;
  contrast: ContrastEvaluation | null;
  issues: KeyContrastIssue[];
};

export type KeyContrastReport = {
  pairs: KeyContrastPairEvaluation[];
  issues: KeyContrastIssue[];
};

export type TokenColorValueLookup = (tokenPath: string) => string | null;

export const keyContrastPairDefinitions = [
  {
    id: 'contentPrimaryOnAppBackground',
    foregroundTokenPath: 'color.semantic.content.primary',
    backgroundTokenPath: 'color.semantic.background.app',
    textSize: 'normal',
  },
  {
    id: 'contentSecondaryOnAppBackground',
    foregroundTokenPath: 'color.semantic.content.secondary',
    backgroundTokenPath: 'color.semantic.background.app',
    textSize: 'normal',
  },
  {
    id: 'contentPrimaryOnPrimarySurface',
    foregroundTokenPath: 'color.semantic.content.primary',
    backgroundTokenPath: 'color.semantic.surface.primary',
    textSize: 'normal',
  },
  {
    id: 'contentSecondaryOnPrimarySurface',
    foregroundTokenPath: 'color.semantic.content.secondary',
    backgroundTokenPath: 'color.semantic.surface.primary',
    textSize: 'normal',
  },
  {
    id: 'contentInverseOnPrimaryAction',
    foregroundTokenPath: 'color.semantic.content.inverse',
    backgroundTokenPath: 'color.semantic.action.primary',
    textSize: 'normal',
  },
  {
    id: 'dangerTextOnPrimarySurface',
    foregroundTokenPath: 'color.semantic.danger.text',
    backgroundTokenPath: 'color.semantic.surface.primary',
    textSize: 'normal',
    optional: true,
  },
] as const satisfies readonly KeyContrastPairDefinition[];

function createIssue({
  code,
  severity,
  pair,
}: {
  code: KeyContrastIssueCode;
  severity: KeyContrastIssueSeverity;
  pair: KeyContrastPairDefinition;
}): KeyContrastIssue {
  return {
    code,
    severity,
    pairId: pair.id,
    foregroundTokenPath: pair.foregroundTokenPath,
    backgroundTokenPath: pair.backgroundTokenPath,
  };
}

function evaluateMissingColorPair({
  pair,
  foreground,
  background,
}: {
  pair: KeyContrastPairDefinition;
  foreground: string | null;
  background: string | null;
}): KeyContrastPairEvaluation {
  if (pair.optional && !foreground) {
    return {
      pair,
      foreground,
      background,
      status: 'skipped',
      contrast: null,
      issues: [],
    };
  }

  const issues: KeyContrastIssue[] = [];

  if (!foreground) {
    issues.push(
      createIssue({
        code: 'missingForegroundColor',
        severity: 'warning',
        pair,
      }),
    );
  }

  if (!background) {
    issues.push(
      createIssue({
        code: 'missingBackgroundColor',
        severity: 'warning',
        pair,
      }),
    );
  }

  return {
    pair,
    foreground,
    background,
    status: 'missing',
    contrast: null,
    issues,
  };
}

export function evaluateKeyContrastPair({
  pair,
  getColorValue,
}: {
  pair: KeyContrastPairDefinition;
  getColorValue: TokenColorValueLookup;
}): KeyContrastPairEvaluation {
  const foreground = getColorValue(pair.foregroundTokenPath);
  const background = getColorValue(pair.backgroundTokenPath);

  if (!foreground || !background) {
    return evaluateMissingColorPair({
      pair,
      foreground,
      background,
    });
  }

  const contrast = evaluateContrast({
    foreground,
    background,
    textSize: pair.textSize,
  });

  if (contrast.status === 'pass') {
    return {
      pair,
      foreground,
      background,
      status: 'pass',
      contrast,
      issues: [],
    };
  }

  const issue = createIssue({
    code: contrast.status === 'warning' ? 'contrastWarning' : 'contrastFail',
    severity: contrast.status === 'warning' ? 'warning' : 'critical',
    pair,
  });

  return {
    pair,
    foreground,
    background,
    status: contrast.status,
    contrast,
    issues: [issue],
  };
}

export function evaluateKeyContrastPairs({
  pairs = keyContrastPairDefinitions,
  getColorValue,
}: {
  pairs?: readonly KeyContrastPairDefinition[];
  getColorValue: TokenColorValueLookup;
}): KeyContrastReport {
  const evaluatedPairs = pairs.map((pair) =>
    evaluateKeyContrastPair({
      pair,
      getColorValue,
    }),
  );

  return {
    pairs: evaluatedPairs,
    issues: evaluatedPairs.flatMap((pair) => pair.issues),
  };
}

export function createTokenColorValueLookup(
  values: Readonly<Record<string, string | null | undefined>>,
): TokenColorValueLookup {
  return (tokenPath) => values[tokenPath] ?? null;
}
