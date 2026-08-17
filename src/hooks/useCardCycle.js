import { useState, useEffect, useRef } from 'react';

/**
 * useCardCycle hook
 * Controls independent, organic crossfading of preview frames for each video card.
 *
 * @param {Array<string>} frames - Array of preview image URLs for the card.
 * @param {number} index - Index of the card in the fan (used to stagger initial start).
 * @param {boolean} isHovered - Whether the card is currently hovered/focused.
 * @returns {object} { currentFrame, nextFrame, isCrossfading, activeFrameIndex }
 */
export function useCardCycle(frames = [], index = 0, isHovered = false) {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [nextFrameIndex, setNextFrameIndex] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    }
  }, []);

  useEffect(() => {
    // If reduced motion is preferred, only 1 frame, or card is hovered, don't cycle
    if (prefersReducedMotion || !frames || frames.length <= 1 || isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Stagger cycle interval organically (e.g. 3400ms + (index * 600ms) % 2000ms)
    const baseInterval = 3600;
    const staggerOffset = (index * 680) % 1800;
    const intervalTime = baseInterval + staggerOffset;

    const scheduleNextCycle = () => {
      timerRef.current = setTimeout(() => {
        const nextIdx = (activeFrameIndex + 1) % frames.length;
        setNextFrameIndex(nextIdx);
        setIsCrossfading(true);

        // Soft blur & crossfade transition takes 700ms
        fadeTimeoutRef.current = setTimeout(() => {
          setActiveFrameIndex(nextIdx);
          setNextFrameIndex(null);
          setIsCrossfading(false);
        }, 700);
      }, intervalTime);
    };

    scheduleNextCycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [frames, activeFrameIndex, isHovered, prefersReducedMotion, index]);

  const currentFrame = frames && frames.length > 0 ? frames[activeFrameIndex] : '';
  const nextFrame = nextFrameIndex !== null && frames && frames[nextFrameIndex] ? frames[nextFrameIndex] : null;

  return {
    currentFrame,
    nextFrame,
    isCrossfading,
    activeFrameIndex,
    prefersReducedMotion
  };
}
