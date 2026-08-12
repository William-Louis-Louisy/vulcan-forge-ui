import { describe, expect, it } from 'vitest';
import { calculateAnchoredPopoverPosition } from './useAnchoredTopLayerPopover';

const triggerRect = {
  bottom: 460,
  left: 600,
  right: 640,
  top: 420,
};

describe('calculateAnchoredPopoverPosition', () => {
  it('prefers the left side when enough viewport space is available', () => {
    expect(
      calculateAnchoredPopoverPosition({
        popoverHeight: 340,
        popoverWidth: 288,
        triggerRect,
        viewportHeight: 1080,
        viewportWidth: 1920,
      }),
    ).toEqual({
      left: 304,
      placement: 'left',
      top: 420,
    });
  });

  it('uses the right side when the left side is constrained', () => {
    expect(
      calculateAnchoredPopoverPosition({
        popoverHeight: 340,
        popoverWidth: 288,
        triggerRect: {
          bottom: 460,
          left: 120,
          right: 160,
          top: 420,
        },
        viewportHeight: 1080,
        viewportWidth: 1920,
      }),
    ).toEqual({
      left: 168,
      placement: 'right',
      top: 420,
    });
  });

  it('falls back below the trigger in narrow viewports', () => {
    expect(
      calculateAnchoredPopoverPosition({
        popoverHeight: 300,
        popoverWidth: 288,
        triggerRect: {
          bottom: 160,
          left: 150,
          right: 190,
          top: 120,
        },
        viewportHeight: 800,
        viewportWidth: 390,
      }),
    ).toEqual({
      left: 86,
      placement: 'bottom',
      top: 168,
    });
  });

  it('keeps vertical popovers below the trigger even when side space exists', () => {
    expect(
      calculateAnchoredPopoverPosition({
        popoverHeight: 240,
        popoverWidth: 320,
        preferredAxis: 'vertical',
        triggerRect,
        viewportHeight: 1080,
        viewportWidth: 1920,
      }),
    ).toEqual({
      left: 600,
      placement: 'bottom',
      top: 468,
    });
  });

  it('places vertical popovers above when there is more room above', () => {
    expect(
      calculateAnchoredPopoverPosition({
        popoverHeight: 280,
        popoverWidth: 320,
        preferredAxis: 'vertical',
        triggerRect: {
          bottom: 760,
          left: 500,
          right: 820,
          top: 720,
        },
        viewportHeight: 800,
        viewportWidth: 1280,
      }),
    ).toEqual({
      left: 500,
      placement: 'top',
      top: 432,
    });
  });
});
