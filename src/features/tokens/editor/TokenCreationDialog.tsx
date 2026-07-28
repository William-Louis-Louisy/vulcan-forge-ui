'use client';

import { Dialog } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import {
  CreateColorTokenForm,
  type CreateColorTokenFormLabels,
} from '../CreateColorTokenForm';
import {
  CreateDesignTokenForm,
  type CreateDesignTokenFormLabels,
} from '../CreateDesignTokenForm';
import {
  CreateTypographyTokenForm,
  type CreateTypographyTokenFormLabels,
} from '../CreateTypographyTokenForm';
import type {
  PrimitiveColorTokenAliasOption,
  TokenSetType,
} from '../tokens-editor.utils';

type TokenCreationDialogLabels = {
  toolbar: {
    newToken: string;
  };
  createDesignToken: {
    spacing: CreateDesignTokenFormLabels;
    radius: CreateDesignTokenFormLabels;
    motion: CreateDesignTokenFormLabels;
  };
  createColorToken: CreateColorTokenFormLabels;
  createTypographyToken: CreateTypographyTokenFormLabels;
};

type TokenCreationDialogProps = {
  type: TokenSetType | null;
  locale: Locale;
  projectSlug: string;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
  labels: TokenCreationDialogLabels;
  onClose: () => void;
  onCreated: (result: {
    tokenSetType: TokenSetType;
    tokenPath: string;
  }) => void;
};

function getDialogLabel(
  type: TokenSetType | null,
  labels: TokenCreationDialogLabels,
) {
  switch (type) {
    case 'color':
      return labels.createColorToken.title;
    case 'spacing':
      return labels.createDesignToken.spacing.title;
    case 'radius':
      return labels.createDesignToken.radius.title;
    case 'motion':
      return labels.createDesignToken.motion.title;
    case 'typography':
      return labels.createTypographyToken.title;
    default:
      return labels.toolbar.newToken;
  }
}

export function TokenCreationDialog({
  type,
  locale,
  projectSlug,
  primitiveColorAliasOptions,
  labels,
  onClose,
  onCreated,
}: TokenCreationDialogProps) {
  return (
    <Dialog
      open={type !== null}
      onClose={onClose}
      ariaLabel={getDialogLabel(type, labels)}
      size={type === 'typography' ? 'lg' : 'md'}
    >
      {type === 'color' ? (
        <CreateColorTokenForm
          locale={locale}
          projectSlug={projectSlug}
          primitiveColorAliasOptions={primitiveColorAliasOptions}
          labels={labels.createColorToken}
          onCancel={onClose}
          onCreated={(tokenPath) =>
            onCreated({ tokenSetType: 'color', tokenPath })
          }
        />
      ) : null}

      {type === 'spacing' ? (
        <CreateDesignTokenForm
          locale={locale}
          projectSlug={projectSlug}
          type="spacing"
          labels={labels.createDesignToken.spacing}
          onCancel={onClose}
          onCreated={(tokenPath) =>
            onCreated({ tokenSetType: 'spacing', tokenPath })
          }
        />
      ) : null}

      {type === 'radius' ? (
        <CreateDesignTokenForm
          locale={locale}
          projectSlug={projectSlug}
          type="radius"
          labels={labels.createDesignToken.radius}
          onCancel={onClose}
          onCreated={(tokenPath) =>
            onCreated({ tokenSetType: 'radius', tokenPath })
          }
        />
      ) : null}

      {type === 'motion' ? (
        <CreateDesignTokenForm
          locale={locale}
          projectSlug={projectSlug}
          type="motion"
          labels={labels.createDesignToken.motion}
          onCancel={onClose}
          onCreated={(tokenPath) =>
            onCreated({ tokenSetType: 'motion', tokenPath })
          }
        />
      ) : null}

      {type === 'typography' ? (
        <CreateTypographyTokenForm
          locale={locale}
          projectSlug={projectSlug}
          labels={labels.createTypographyToken}
          onCancel={onClose}
          onCreated={(tokenPath) =>
            onCreated({ tokenSetType: 'typography', tokenPath })
          }
        />
      ) : null}
    </Dialog>
  );
}
