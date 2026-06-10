'use client';

import {
  createSaveContextSnapshot,
  isSaveContextSnapshotFresh,
  parseSaveContextSnapshot,
  saveContextStorageKey,
} from './save-context.utils';

const appScrollContainerSelector = '[data-save-context-scroll-container="app"]';
const scrollContainerSelector = '[data-save-context-scroll-container]';

function isScrollableElement(element: HTMLElement) {
  return element.scrollHeight > element.clientHeight;
}

function getContextScrollableElement(contextId: string): HTMLElement | null {
  const scrollContainers = Array.from(
    document.querySelectorAll<HTMLElement>(scrollContainerSelector),
  );

  const contextScrollContainer = scrollContainers.find(
    (element) => element.dataset.saveContextScrollContainer === contextId,
  );

  if (contextScrollContainer && isScrollableElement(contextScrollContainer)) {
    return contextScrollContainer;
  }

  return null;
}

function getScrollableElement(contextId?: string): HTMLElement | null {
  if (contextId) {
    const contextScrollableElement = getContextScrollableElement(contextId);

    if (contextScrollableElement) {
      return contextScrollableElement;
    }
  }

  const appScrollContainer = document.querySelector<HTMLElement>(
    appScrollContainerSelector,
  );

  if (appScrollContainer && isScrollableElement(appScrollContainer)) {
    return appScrollContainer;
  }

  return document.scrollingElement instanceof HTMLElement
    ? document.scrollingElement
    : document.documentElement;
}

export function captureSaveContextSnapshot({
  pathname,
  contextId,
}: {
  pathname: string;
  contextId: string;
}) {
  const scrollableElement = getScrollableElement(contextId);

  if (!scrollableElement) {
    return;
  }

  const snapshot = createSaveContextSnapshot({
    pathname,
    contextId,
    scrollTop: scrollableElement.scrollTop,
    scrollLeft: scrollableElement.scrollLeft,
  });

  sessionStorage.setItem(saveContextStorageKey, JSON.stringify(snapshot));
}

function restoreSnapshotWithRetry({
  snapshot,
  attempt = 0,
}: {
  snapshot: ReturnType<typeof parseSaveContextSnapshot> extends infer Snapshot
    ? NonNullable<Snapshot>
    : never;
  attempt?: number;
}) {
  const maxAttempts = 20;

  requestAnimationFrame(() => {
    const scrollableElement = getScrollableElement(snapshot.contextId);

    if (!scrollableElement) {
      return;
    }

    const maxScrollTop = Math.max(
      0,
      scrollableElement.scrollHeight - scrollableElement.clientHeight,
    );

    const targetScrollTop = Math.min(snapshot.scrollTop, maxScrollTop);

    scrollableElement.scrollTo({
      top: targetScrollTop,
      left: snapshot.scrollLeft,
      behavior: 'auto',
    });

    const isRestored =
      Math.abs(scrollableElement.scrollTop - targetScrollTop) <= 2;

    const canReachOriginalPosition =
      snapshot.scrollTop === 0 || maxScrollTop >= snapshot.scrollTop;

    if ((isRestored && canReachOriginalPosition) || attempt >= maxAttempts) {
      sessionStorage.removeItem(saveContextStorageKey);
      return;
    }

    window.setTimeout(() => {
      restoreSnapshotWithRetry({
        snapshot,
        attempt: attempt + 1,
      });
    }, 25);
  });
}

export function restorePendingSaveContext(pathname: string) {
  const snapshot = parseSaveContextSnapshot(
    sessionStorage.getItem(saveContextStorageKey),
  );

  if (!snapshot) {
    return;
  }

  if (!isSaveContextSnapshotFresh({ snapshot })) {
    sessionStorage.removeItem(saveContextStorageKey);
    return;
  }

  if (snapshot.pathname !== pathname) {
    return;
  }

  restoreSnapshotWithRetry({
    snapshot,
  });
}
