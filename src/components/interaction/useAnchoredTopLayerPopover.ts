'use client';

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

type AnchoredPopoverPlacement = 'left' | 'right' | 'top' | 'bottom';
type AnchoredPopoverAxis = 'horizontal' | 'vertical';

type AnchoredPopoverCoordinates = {
  left: number;
  placement: AnchoredPopoverPlacement;
  top: number;
};

type CalculateAnchoredPopoverPositionOptions = {
  gap?: number;
  popoverHeight: number;
  popoverWidth: number;
  preferredAxis?: AnchoredPopoverAxis;
  triggerRect: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>;
  viewportHeight: number;
  viewportPadding?: number;
  viewportWidth: number;
};

type UseAnchoredTopLayerPopoverOptions<
  PopoverElement extends HTMLElement,
  TriggerElement extends HTMLElement,
> = {
  contentKey: string;
  isOpen: boolean;
  matchTriggerWidth?: boolean;
  popoverRef: RefObject<PopoverElement | null>;
  preferredAxis?: AnchoredPopoverAxis;
  triggerRef: RefObject<TriggerElement | null>;
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

function calculateVerticalPosition({
  availableAbove,
  availableBelow,
  gap,
  horizontallyAlignedLeft,
  maximumTop,
  popoverHeight,
  triggerRect,
  viewportPadding,
}: {
  availableAbove: number;
  availableBelow: number;
  gap: number;
  horizontallyAlignedLeft: number;
  maximumTop: number;
  popoverHeight: number;
  triggerRect: Pick<DOMRect, 'bottom' | 'top'>;
  viewportPadding: number;
}): AnchoredPopoverCoordinates {
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

export function calculateAnchoredPopoverPosition({
  gap = DEFAULT_GAP,
  popoverHeight,
  popoverWidth,
  preferredAxis = 'horizontal',
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
  const horizontallyAlignedLeft = clamp(
    triggerRect.left,
    viewportPadding,
    maximumLeft,
  );

  if (preferredAxis === 'vertical') {
    return calculateVerticalPosition({
      availableAbove,
      availableBelow,
      gap,
      horizontallyAlignedLeft,
      maximumTop,
      popoverHeight,
      triggerRect,
      viewportPadding,
    });
  }

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

  return calculateVerticalPosition({
    availableAbove,
    availableBelow,
    gap,
    horizontallyAlignedLeft,
    maximumTop,
    popoverHeight,
    triggerRect,
    viewportPadding,
  });
}

function isPopoverOpen(popover: HTMLElement): boolean {
  try {
    return popover.matches(':popover-open');
  } catch {
    return false;
  }
}

export function useAnchoredTopLayerPopover<
  PopoverElement extends HTMLElement,
  TriggerElement extends HTMLElement,
>({
  contentKey,
  isOpen,
  matchTriggerWidth = false,
  popoverRef,
  preferredAxis = 'horizontal',
  triggerRef,
}: UseAnchoredTopLayerPopoverOptions<PopoverElement, TriggerElement>) {
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [isPositioned, setIsPositioned] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);

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
    const maximumMatchedWidth = Math.max(
      0,
      viewportWidth - DEFAULT_VIEWPORT_PADDING * 2,
    );
    const matchedWidth = matchTriggerWidth
      ? Math.min(triggerRect.width, maximumMatchedWidth)
      : null;
    const measuredPopoverWidth =
      matchedWidth && matchedWidth > 0
        ? matchedWidth
        : popoverRect.width || DEFAULT_POPOVER_WIDTH;
    const nextCoordinates = calculateAnchoredPopoverPosition({
      popoverHeight: popoverRect.height || DEFAULT_POPOVER_HEIGHT,
      popoverWidth: measuredPopoverWidth,
      preferredAxis,
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
    setTriggerWidth((current) =>
      current === matchedWidth ? current : matchedWidth,
    );
    setIsPositioned(true);
  }, [matchTriggerWidth, popoverRef, preferredAxis, triggerRef]);

  useEffect(() => {
    const popover = popoverRef.current;

    if (!isOpen || !popover) {
      setIsPositioned(false);
      return;
    }

    const supportsTopLayer = typeof popover.showPopover === 'function';

    if (supportsTopLayer && !isPopoverOpen(popover)) {
      popover.showPopover();
    } else if (!supportsTopLayer) {
      popover.removeAttribute('popover');
    }

    updatePosition();
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

      if (supportsTopLayer && isPopoverOpen(popover)) {
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
    maxWidth: 'calc(100dvw - 2rem)',
    position: 'fixed',
    top: coordinates.top,
    visibility: isPositioned ? 'visible' : 'hidden',
    width:
      matchTriggerWidth && triggerWidth && triggerWidth > 0
        ? triggerWidth
        : undefined,
  };

  return {
    placement: coordinates.placement,
    popoverStyle,
  };
}
