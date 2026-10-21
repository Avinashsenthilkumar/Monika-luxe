"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createEngine, type Engine } from "./three/engine";

export interface SceneBridge {
  progress: number;
  invalidate?: () => void;
}

interface Props {
  bridge: RefObject<SceneBridge>;
  quality: "high" | "low";
  onReady?: () => void;
  onError?: () => void;
}

/** Thin React wrapper around the framework-agnostic three.js engine. */
export default function HouseConstructionScene({ bridge, quality, onReady, onError }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onError });
  callbacks.current = { onReady, onError };

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let engine: Engine | null = null;
    try {
      engine = createEngine(el, quality, () => callbacks.current.onError?.());
    } catch (error) {
      console.error("[ArchitecturalJourney] 3D scene failed, using fallback.", error);
      callbacks.current.onError?.();
      return;
    }
    if (!engine) return;
    const e = engine;
    const b = bridge.current;
    b.invalidate = () => e.request(b.progress);
    e.request(b.progress);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => callbacks.current.onReady?.()));
    const ro = new ResizeObserver(() => e.resize());
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      b.invalidate = undefined;
      e.dispose();
    };
  }, [bridge, quality]);

  return <div ref={host} aria-hidden className="absolute inset-0" />;
}
