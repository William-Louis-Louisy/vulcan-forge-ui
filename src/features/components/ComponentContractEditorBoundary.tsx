import type { ComponentContract } from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';

import {
  ComponentContractEditor,
  type ComponentContractEditorLabels,
} from './ComponentContractEditor';
import type { ComponentTokenOption } from './component-token-bindings.utils';

type ComponentContractEditorBoundaryProps = {
  componentId: string;
  componentKey: string;
  locale: Locale;
  projectSlug: string;
  contract: ComponentContract;
  labels: ComponentContractEditorLabels;
  tokenOptions: ComponentTokenOption[];
};

export function ComponentContractEditorBoundary({
  componentId,
  componentKey,
  locale,
  projectSlug,
  contract,
  labels,
  tokenOptions,
}: ComponentContractEditorBoundaryProps) {
  return (
    <ComponentContractEditor
      key={`${projectSlug}:${componentId}`}
      componentKey={componentKey}
      locale={locale}
      projectSlug={projectSlug}
      contract={contract}
      labels={labels}
      tokenOptions={tokenOptions}
    />
  );
}
