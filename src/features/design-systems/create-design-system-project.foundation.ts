import type { Prisma } from '@/generated/prisma/client';
import type {
  AccessibilityTarget,
  AppLocale,
  DesignSystemPlatform,
} from '@/generated/prisma/client';

export type CreateDesignSystemProjectFoundationInput = {
  name: string;
  description: string | null;
  platforms: DesignSystemPlatform[];
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
  visualDirection: string;
  accessibilityTarget: AccessibilityTarget;
};

export function buildDesignSystemProjectFoundation(
  input: CreateDesignSystemProjectFoundationInput,
) {
  return {
    localeSettings: {
      create: {
        defaultLocale: input.defaultLocale,
        supportedLocales: input.supportedLocales,
      },
    },
    brandProfile: {
      create: {
        name: input.name,
        description: input.description,
        visualDirection: input.visualDirection,
      },
    },
    tokenSets: {
      create: [
        createColorTokenSet(),
        createSpacingTokenSet(),
        createRadiusTokenSet(),
        createTypographyTokenSet(),
        createMotionTokenSet(),
      ],
    },
    themes: {
      create: [createLightTheme(), createDarkTheme()],
    },
    componentContracts: {
      create: [
        createButtonContract(),
        createTextFieldContract(),
        createCardContract(),
        createAlertContract(),
        createDialogContract(),
      ],
    },
    documentationProfile: {
      create: {
        format: 'markdown',
        content: createDocumentationProfileContent(input),
      },
    },
    aiInstructionProfile: {
      create: {
        content: createAiInstructionProfileContent(input),
      },
    },
  };
}

function createColorTokenSet() {
  return {
    type: 'color' as const,
    name: 'Color',
    tokens: {
      primitive: {
        neutral: {
          0: '#ffffff',
          950: '#070707',
        },
        accent: {
          primary: '#FF8731',
          secondary: '#586644',
        },
      },
      semantic: {
        background: {
          app: '{color.primitive.neutral.950}',
          surface: '#1E1E1E',
        },
        content: {
          primary: '#E2E7EF',
          secondary: '#A0B1CA',
        },
        action: {
          primary: '{color.primitive.accent.primary}',
          secondary: '{color.primitive.accent.secondary}',
        },
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createSpacingTokenSet() {
  return {
    type: 'spacing' as const,
    name: 'Spacing',
    tokens: {
      scale: {
        0: '0rem',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createRadiusTokenSet() {
  return {
    type: 'radius' as const,
    name: 'Radius',
    tokens: {
      scale: {
        none: '0rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createTypographyTokenSet() {
  return {
    type: 'typography' as const,
    name: 'Typography',
    tokens: {
      fontFamilies: {
        sans: 'Inter, system-ui, sans-serif',
        mono: 'Geist Mono, ui-monospace, monospace',
      },
      fontSizes: {
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '4xl': '2.25rem',
      },
      fontWeights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createMotionTokenSet() {
  return {
    type: 'motion' as const,
    name: 'Motion',
    tokens: {
      duration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
      easing: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createLightTheme() {
  return {
    mode: 'light' as const,
    name: 'Light',
    tokens: {
      color: {
        background: '#F7F3EB',
        surface: '#ffffff',
        content: '#111827',
        muted: '#3A4454',
        accent: '#FF8731',
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createDarkTheme() {
  return {
    mode: 'dark' as const,
    name: 'Dark',
    tokens: {
      color: {
        background: '#070707',
        surface: '#1E1E1E',
        content: '#E2E7EF',
        muted: '#A0B1CA',
        accent: '#FF8731',
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createButtonContract() {
  return {
    type: 'button' as const,
    name: 'Button',
    contract: {
      description: 'Interactive control used to trigger an action.',
      variants: ['primary', 'secondary', 'ghost', 'danger'],
      sizes: ['sm', 'md', 'lg'],
      accessibility: {
        requiresAccessibleName: true,
        keyboard: ['Enter', 'Space'],
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createTextFieldContract() {
  return {
    type: 'textField' as const,
    name: 'TextField',
    contract: {
      description: 'Form input used to collect short text values.',
      states: ['default', 'focus', 'disabled', 'invalid'],
      accessibility: {
        requiresLabel: true,
        supportsErrorMessage: true,
        usesAriaInvalid: true,
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createCardContract() {
  return {
    type: 'card' as const,
    name: 'Card',
    contract: {
      description: 'Container used to group related content and actions.',
      parts: ['root', 'header', 'content', 'footer'],
      accessibility: {
        semanticRole: 'group when useful',
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createAlertContract() {
  return {
    type: 'alert' as const,
    name: 'Alert',
    contract: {
      description: 'Feedback pattern used to communicate status or warnings.',
      variants: ['info', 'success', 'warning', 'danger'],
      accessibility: {
        roles: ['status', 'alert'],
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createDialogContract() {
  return {
    type: 'dialog' as const,
    name: 'Dialog',
    contract: {
      description: 'Overlay pattern used for focused user decisions.',
      accessibility: {
        role: 'dialog',
        requiresLabel: true,
        trapsFocus: true,
        closesWithEscape: true,
      },
    } satisfies Prisma.InputJsonValue,
  };
}

function createDocumentationProfileContent(
  input: CreateDesignSystemProjectFoundationInput,
) {
  return {
    title: input.name,
    description: input.description,
    sections: [
      'Overview',
      'Foundations',
      'Tokens',
      'Themes',
      'Components',
      'Accessibility',
      'Exports',
    ],
  } satisfies Prisma.InputJsonValue;
}

function createAiInstructionProfileContent(
  input: CreateDesignSystemProjectFoundationInput,
) {
  return {
    projectName: input.name,
    rules: [
      'Always use semantic tokens before primitive values.',
      'Respect the selected accessibility target.',
      'Do not invent component variants that are not documented in ComponentContract records.',
      'When generating UI, preserve supported locales and avoid hardcoded visible text.',
    ],
  } satisfies Prisma.InputJsonValue;
}
