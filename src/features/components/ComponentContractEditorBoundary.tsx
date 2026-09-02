import type {
  ComponentContract,
  ComponentContractV2,
} from '@/domain/design-system';
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
  contractV2?: ComponentContractV2;
  labels: ComponentContractEditorLabels;
  tokenOptions: ComponentTokenOption[];
};

export function ComponentContractEditorBoundary({
  componentId,
  componentKey,
  locale,
  projectSlug,
  contract,
  contractV2,
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
      contractV2={contractV2}
      labels={labels}
      tokenOptions={tokenOptions}
    />
  );
}
