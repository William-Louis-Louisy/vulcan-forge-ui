// Visual design-system reference values for colors, spacing, radius, typography and motion.
export type DesignSystemReferenceMigrationResult = {
  value: unknown;
  migratedReferencesCount: number;
};

export function replaceDesignSystemReference({
  value,
  currentReference,
  nextReference,
}: {
  value: unknown;
  currentReference: string;
  nextReference: string;
}): DesignSystemReferenceMigrationResult {
  if (value === currentReference) {
    return { value: nextReference, migratedReferencesCount: 1 };
  }

  if (Array.isArray(value)) {
    let migratedReferencesCount = 0;
    const nextValue = value.map((item) => {
      const result = replaceDesignSystemReference({
        value: item,
        currentReference,
        nextReference,
      });
      migratedReferencesCount += result.migratedReferencesCount;
      return result.value;
    });

    return { value: nextValue, migratedReferencesCount };
  }

  if (typeof value === 'object' && value !== null) {
    let migratedReferencesCount = 0;
    const nextValue = Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        const result = replaceDesignSystemReference({
          value: nestedValue,
          currentReference,
          nextReference,
        });
        migratedReferencesCount += result.migratedReferencesCount;
        return [key, result.value];
      }),
    );

    return { value: nextValue, migratedReferencesCount };
  }

  return { value, migratedReferencesCount: 0 };
}
