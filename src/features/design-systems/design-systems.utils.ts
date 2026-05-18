export function formatRelativeUpdatedDate(updatedAt: Date): string {
  return updatedAt.toISOString().slice(0, 10);
}
