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
import { SlideGroupConfig } from '../../types/slide_groups';
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
 */
const SlideDeck = forwardRef<SlideDeckHandle, SlideDeckProps>(function SlideDeck(
  { slideGroups, autoSlideMs, paused, onIndicesChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<RevealApi | null>(null);
  const onIndicesChangeRef = useRef(onIndicesChange);

  useEffect(() => {
    onIndicesChangeRef.current = onIndicesChange;
  }, [onIndicesChange]);

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

    const handleSlideChanged = () => {
      const { h, v } = deck.getIndices();
      onIndicesChangeRef.current(h, v);
    };

    deck.initialize().then(() => {
      deck.on('slidechanged', handleSlideChanged);
      // Override the space (32) key binding with a no-op so Dashboard's
      // document-level keydown handler can own the pause toggle.
      const noop = () => {};
      deck.configure({ keyboard: { 32: noop } });
    });

    deckRef.current = deck;

    return () => {
      deck.off('slidechanged', handleSlideChanged);
      deck.destroy();
      deckRef.current = null;
    };
    // Intentionally run once on mount; slide content changes are handled via
    // deck.sync() in the effect below, and pause/autoSlide via their own effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync reveal when the slide group shape changes (e.g. config edits).
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    deck.sync();
    deck.layout();
  }, [slideGroups]);

  // Toggle autoslide when pause state or interval changes.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    deck.configure({ autoSlide: paused ? 0 : autoSlideMs });
  }, [paused, autoSlideMs]);

  const goToSlide = useCallback((groupIndex: number, slideIndex: number) => {
    deckRef.current?.slide(groupIndex, slideIndex);
  }, []);

  const setAutoSlide = useCallback((enabled: boolean) => {
    deckRef.current?.configure({ autoSlide: enabled ? autoSlideMs : 0 });
  }, [autoSlideMs]);

  const getCurrentIndices = useCallback(() => {
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
