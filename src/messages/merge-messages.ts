export type MessageObject = Record<string, unknown>;

function isMessageObject(value: unknown): value is MessageObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mergeMessages(
  baseMessages: MessageObject,
  extensionMessages: MessageObject,
): MessageObject {
  const mergedMessages: MessageObject = { ...baseMessages };

  for (const [key, extensionValue] of Object.entries(extensionMessages)) {
    const baseValue = mergedMessages[key];

    mergedMessages[key] =
      isMessageObject(baseValue) && isMessageObject(extensionValue)
        ? mergeMessages(baseValue, extensionValue)
        : extensionValue;
  }

  return mergedMessages;
}
