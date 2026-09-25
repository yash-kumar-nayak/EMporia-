'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

/**
 * Resolve the nearest ancestor that actually generates a box.
 *
 * Astro wraps every client island in `<astro-island>`, which its runtime styles
 * as `display: contents`. Such an element has no box: setting position/overflow
 * on it is a no-op, it never receives mouse events for its subtree layout, and
 * `getBoundingClientRect()` returns a zero rect. So we walk up past any
 * `display: contents` ancestor until we find a real box (in a plain React tree
 * the immediate parent already is one, so the loop exits on the first step).
 */
function resolveBoxAncestor(element: HTMLElement | null): HTMLElement | null {
  if (typeof window === 'undefined' || !element) return null;

  let current: HTMLElement | null = element.parentElement;
  while (current) {
    // getComputedStyle on a detached node can return an empty style object (or
    // throw in older engines); bail out rather than crash.
    if (!current.isConnected) return null;

    let display: string | undefined;
    try {
      display = window.getComputedStyle(current)?.display;
    } catch {
      return null;
    }

    if (display !== 'contents') return current;
    current = current.parentElement;
  }

  return null;
}

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    const parent = resolveBoxAncestor(containerRef.current);
    if (!parent) return;

    parent.style.position = 'relative';
    parent.style.overflow = 'hidden';
    setParentElement(parent);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', handleEnter);
    parentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', handleEnter);
      parentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-zinc-50 via-zinc-100 to-zinc-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}
