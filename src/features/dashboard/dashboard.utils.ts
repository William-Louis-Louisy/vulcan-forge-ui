export function getDisplayNameFromEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const [localPart] = email.split('@');

  if (!localPart) {
    return null;
  }

  return localPart;
}
