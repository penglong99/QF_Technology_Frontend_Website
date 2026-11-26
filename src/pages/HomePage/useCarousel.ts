import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

const DRAG_THRESHOLD = 5;
const SNAP_RESTORE_DELAY = 450;

interface CarouselState {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  /** Share of the content currently visible, 0–1. */
  thumbSize: number;
  /** Where the visible part starts, 0–1. */
  thumbOffset: number;
}

const initialState: CarouselState = {
  canScrollPrev: false,
  canScrollNext: false,
  thumbSize: 1,
  thumbOffset: 0,
};

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

/** Width of one card plus the gap after it. */
function cardStep(track: HTMLElement): number {
  const [first, second] = Array.from(track.children) as HTMLElement[];
  if (!first) return track.clientWidth;
  return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
}

/** Native horizontal scrolling plus previous/next, mouse dragging and progress tracking. */
export function useCarousel<T extends HTMLElement>() {
  const trackRef = useRef<T>(null);
  const dragRef = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const snapTimerRef = useRef<number | undefined>(undefined);
  const [state, setState] = useState(initialState);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;
    setState({
      canScrollPrev: scrollLeft > 1,
      canScrollNext: scrollLeft < maxScroll - 1,
      thumbSize: scrollWidth > 0 ? Math.min(clientWidth / scrollWidth, 1) : 1,
      thumbOffset: scrollWidth > 0 ? scrollLeft / scrollWidth : 0,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      window.clearTimeout(snapTimerRef.current);
    };
  }, [measure]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * cardStep(track), behavior: scrollBehavior() });
  }, []);

  const onPointerDown = useCallback((event: PointerEvent<T>) => {
    const track = trackRef.current;
    if (!track || event.pointerType !== 'mouse' || event.button !== 0) return;
    window.clearTimeout(snapTimerRef.current);
    suppressClickRef.current = false;
    dragRef.current = { startX: event.clientX, startLeft: track.scrollLeft, moved: false };
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag) return;
    const distance = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;
      drag.moved = true;
      // Capture only once it's a real drag, otherwise it would swallow clicks on the card links.
      track.setPointerCapture(event.pointerId);
      track.style.scrollSnapType = 'none';
      track.dataset.dragging = 'true';
    }
    track.scrollLeft = drag.startLeft - distance;
  }, []);

  const endDrag = useCallback(() => {
    const track = trackRef.current;
    const drag = dragRef.current;
    dragRef.current = null;
    if (!track || !drag?.moved) return;
    suppressClickRef.current = true;
    delete track.dataset.dragging;
    const step = cardStep(track);
    track.scrollTo({
      left: Math.round(track.scrollLeft / step) * step,
      behavior: scrollBehavior(),
    });
    snapTimerRef.current = window.setTimeout(() => {
      track.style.scrollSnapType = '';
    }, SNAP_RESTORE_DELAY);
  }, []);

  /** A drag that ends over a card must not also open that card. */
  const onClickCapture = useCallback((event: MouseEvent<T>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    ...state,
    scrollByCard,
    trackRef,
    trackProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
      onDragStart: (event: MouseEvent<T>) => event.preventDefault(),
    },
  };
}
