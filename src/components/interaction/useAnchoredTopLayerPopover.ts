'use client';

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

type AnchoredPopoverPlacement = 'left' | 'right' | 'top' | 'bottom';

type AnchoredPopoverCoordinates = {
  left: number;
  placement: AnchoredPopoverPlacement;
  top: number;
};

type CalculateAnchoredPopoverPositionOptions = {
  gap?: number;
  popoverHeight: number;
  popoverWidth: number;
  triggerRect: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>;
  viewportHeight: number;
  viewportPadding?: number;
  viewportWidth: number;
};

type UseAnchoredTopLayerPopoverOptions = {
  contentKey: string;
  isOpen: boolean;
  popoverRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const DEFAULT_GAP = 8;
const DEFAULT_POPOVER_HEIGHT = 360;
const DEFAULT_POPOVER_WIDTH = 288;
const DEFAULT_VIEWPORT_PADDING = 16;

const initialCoordinates: AnchoredPopoverCoordinates = {
  left: 0,
  placement: 'left',
  top: 0,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function calculateAnchoredPopoverPosition({
  gap = DEFAULT_GAP,
  popoverHeight,
  popoverWidth,
  triggerRect,
  viewportHeight,
  viewportPadding = DEFAULT_VIEWPORT_PADDING,
  viewportWidth,
}: CalculateAnchoredPopoverPositionOptions): AnchoredPopoverCoordinates {
  const maximumLeft = Math.max(
    viewportPadding,
    viewportWidth - viewportPadding - popoverWidth,
  );
  const maximumTop = Math.max(
    viewportPadding,
    viewportHeight - viewportPadding - popoverHeight,
  );
  const verticallyAlignedTop = clamp(
    triggerRect.top,
    viewportPadding,
    maximumTop,
  );
  const availableLeft = triggerRect.left - viewportPadding;
  const availableRight = viewportWidth - viewportPadding - triggerRect.right;
  const availableBelow = viewportHeight - viewportPadding - triggerRect.bottom;
  const availableAbove = triggerRect.top - viewportPadding;

  if (availableLeft >= popoverWidth + gap) {
    return {
      left: triggerRect.left - gap - popoverWidth,
      placement: 'left',
      top: verticallyAlignedTop,
    };
  }

  if (availableRight >= popoverWidth + gap) {
    return {
      left: triggerRect.right + gap,
      placement: 'right',
      top: verticallyAlignedTop,
    };
  }

  const horizontallyAlignedLeft = clamp(
    triggerRect.left,
    viewportPadding,
    maximumLeft,
  );

  if (
    availableBelow >= popoverHeight + gap ||
    availableBelow >= availableAbove
  ) {
    return {
      left: horizontallyAlignedLeft,
      placement: 'bottom',
      top: clamp(triggerRect.bottom + gap, viewportPadding, maximumTop),
    };
  }

  return {
    left: horizontallyAlignedLeft,
    placement: 'top',
    top: clamp(
      triggerRect.top - gap - popoverHeight,
      viewportPadding,
      maximumTop,
    ),
  };
}

function isPopoverOpen(popover: HTMLElement): boolean {
  try {
    return popover.matches(':popover-open');
  } catch {
    return false;
  }
}

export function useAnchoredTopLayerPopover({
  contentKey,
  isOpen,
  popoverRef,
  triggerRef,
}: UseAnchoredTopLayerPopoverOptions) {
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [isPositioned, setIsPositioned] = useState(false);

  const updatePosition = useCallback(() => {
    const popover = popoverRef.current;
    const trigger = triggerRef.current;

    if (!popover || !trigger) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportWidth =
      document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const nextCoordinates = calculateAnchoredPopoverPosition({
      popoverHeight: popoverRect.height || DEFAULT_POPOVER_HEIGHT,
      popoverWidth: popoverRect.width || DEFAULT_POPOVER_WIDTH,
      triggerRect,
      viewportHeight,
      viewportWidth,
    });

    setCoordinates((current) =>
      current.left === nextCoordinates.left &&
      current.placement === nextCoordinates.placement &&
      current.top === nextCoordinates.top
        ? current
        : nextCoordinates,
    );
    setIsPositioned(true);
  }, [popoverRef, triggerRef]);

  useEffect(() => {
    const popover = popoverRef.current;

    if (!isOpen || !popover) {
      setIsPositioned(false);
      return;
    }

    if (typeof popover.showPopover === 'function' && !isPopoverOpen(popover)) {
      popover.showPopover();
    }

    const animationFrame = window.requestAnimationFrame(updatePosition);
    const resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(updatePosition)
        : null;

    resizeObserver?.observe(popover);
    if (triggerRef.current) {
      resizeObserver?.observe(triggerRef.current);
    }

    window.addEventListener('resize', updatePosition);
    document.addEventListener('scroll', updatePosition, true);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', updatePosition, true);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);

      if (typeof popover.hidePopover === 'function' && isPopoverOpen(popover)) {
        popover.hidePopover();
      }
    };
  }, [isOpen, popoverRef, triggerRef, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(updatePosition);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [contentKey, isOpen, updatePosition]);

  const popoverStyle: CSSProperties = {
    inset: 'auto',
    left: coordinates.left,
    margin: 0,
    maxHeight: 'calc(100dvh - 2rem)',
    position: 'fixed',
    top: coordinates.top,
    visibility: isPositioned ? 'visible' : 'hidden',
  };

  return {
    placement: coordinates.placement,
    popoverStyle,
  };
}
