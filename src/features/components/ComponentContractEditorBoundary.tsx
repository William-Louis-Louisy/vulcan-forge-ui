import type { ComponentContract } from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';

import {
  ComponentContractEditor,
  type ComponentContractEditorLabels,
} from './ComponentContractEditor';
import type { ComponentTokenOption } from './component-token-bindings.utils';

type ComponentContractEditorBoundaryProps = {
  componentId: string;
  locale: Locale;
  projectSlug: string;
  contract: ComponentContract;
  labels: ComponentContractEditorLabels;
  tokenOptions: ComponentTokenOption[];
};

export function ComponentContractEditorBoundary({
  componentId,
  locale,
  projectSlug,
  contract,
  labels,
  tokenOptions,
}: ComponentContractEditorBoundaryProps) {
  return (
    <ComponentContractEditor
      key={`${projectSlug}:${componentId}`}
      locale={locale}
      projectSlug={projectSlug}
      contract={contract}
      labels={labels}
      tokenOptions={tokenOptions}
    />
  );
}
