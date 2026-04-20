import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Reveal from 'reveal.js';
import type { RevealApi, RevealConfig } from 'reveal.js';
import 'reveal.js/reveal.css';
import { type SlideGroupConfig } from '../../types/slide_groups';
import SlideGroup from './SlideGroup';

export interface SlideDeckHandle {
  goToSlide(groupIndex: number, slideIndex: number): void;
  setAutoSlide(enabled: boolean): void;
  getCurrentIndices(): { h: number; v: number };
}

interface SlideDeckProps {
  slideGroups: SlideGroupConfig[];
  autoSlideMs: number;
  paused: boolean;
  onIndicesChange: (groupIndex: number, slideIndex: number) => void;
}

/**
 * SlideDeck owns the reveal.js instance that drives slide navigation,
 * auto-advance, and transitions.
 *
 * Reveal's two-axis layout maps onto Goal Finch slide groups:
 * - Horizontal (left/right) moves between slide groups
 * - Vertical (up/down) moves between slides within a group
 *
 * React still owns the slide content (children of each <section>); reveal
 * owns navigation state and animation.
 *
 * Lifecycle note: reveal.initialize() is asynchronous. Calling sync(),
 * configure(), or destroy() before it resolves throws (e.g. "Cannot read
 * properties of undefined (reading 'forEach')" from the controller's
 * unbind()). All post-init operations are gated on initializedRef; cleanup
 * that happens pre-init is deferred to the initialize() promise.
 */
const SlideDeck = forwardRef<SlideDeckHandle, SlideDeckProps>(function SlideDeck(
  { slideGroups, autoSlideMs, paused, onIndicesChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<RevealApi | null>(null);
  const initializedRef = useRef(false);
  const onIndicesChangeRef = useRef(onIndicesChange);
  const pausedRef = useRef(paused);
  const autoSlideMsRef = useRef(autoSlideMs);

  useEffect(() => {
    onIndicesChangeRef.current = onIndicesChange;
  }, [onIndicesChange]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    autoSlideMsRef.current = autoSlideMs;
  }, [autoSlideMs]);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: RevealConfig = {
      controls: false,
      progress: false,
      center: false,
      hash: false,
      keyboard: true,
      overview: false,
      help: false,
      fragments: false,
      loop: true,
      transition: 'slide',
      embedded: true,
      autoSlide: paused ? 0 : autoSlideMs,
      width: '100%',
      height: '100%',
      margin: 0,
      minScale: 1,
      maxScale: 1,
    };

    const deck = new Reveal(containerRef.current, config);
    deckRef.current = deck;

    let disposed = false;

    const handleSlideChanged = () => {
      const { h, v } = deck.getIndices();
      onIndicesChangeRef.current(h, v);
    };

    deck.initialize().then(() => {
      if (disposed) {
        // Unmounted before init finished; tear down the now-initialized deck.
        try {
          deck.destroy();
        } catch {
          // Ignore: best-effort cleanup.
        }
        return;
      }
      initializedRef.current = true;
      deck.on('slidechanged', handleSlideChanged);
      // Override space (32) with a no-op so Dashboard's document-level
      // keydown handler owns the pause toggle.
      const noop = () => {};
      deck.configure({ keyboard: { 32: noop } });
      // Re-apply props that may have changed during init.
      deck.configure({
        autoSlide: pausedRef.current ? 0 : autoSlideMsRef.current,
      });
      deck.sync();
      deck.layout();
    });

    return () => {
      disposed = true;
      if (initializedRef.current) {
        try {
          deck.off('slidechanged', handleSlideChanged);
          deck.destroy();
        } catch {
          // Ignore: best-effort cleanup.
        }
      }
      initializedRef.current = false;
      deckRef.current = null;
    };
    // Intentionally run once on mount; slide content changes, pause, and
    // autoSlide are handled via their own effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initializedRef.current) return;
    const deck = deckRef.current;
    if (!deck) return;
    deck.sync();
    deck.layout();
  }, [slideGroups]);

  useEffect(() => {
    if (!initializedRef.current) return;
    const deck = deckRef.current;
    if (!deck) return;
    deck.configure({ autoSlide: paused ? 0 : autoSlideMs });
  }, [paused, autoSlideMs]);

  const goToSlide = useCallback((groupIndex: number, slideIndex: number) => {
    if (!initializedRef.current) return;
    deckRef.current?.slide(groupIndex, slideIndex);
  }, []);

  const setAutoSlide = useCallback(
    (enabled: boolean) => {
      if (!initializedRef.current) return;
      deckRef.current?.configure({ autoSlide: enabled ? autoSlideMs : 0 });
    },
    [autoSlideMs],
  );

  const getCurrentIndices = useCallback(() => {
    if (!initializedRef.current) return { h: 0, v: 0 };
    const indices = deckRef.current?.getIndices();
    return { h: indices?.h ?? 0, v: indices?.v ?? 0 };
  }, []);

  useImperativeHandle(
    ref,
    () => ({ goToSlide, setAutoSlide, getCurrentIndices }),
    [goToSlide, setAutoSlide, getCurrentIndices],
  );

  return (
    <div
      ref={containerRef}
      className="reveal"
      style={{ width: '100%', height: '100%' }}
    >
      <div className="slides">
        {slideGroups.map((group, groupIndex) => (
          <SlideGroup key={groupIndex} config={group} slideGroupIndex={groupIndex} />
        ))}
      </div>
    </div>
  );
});

export default SlideDeck;
