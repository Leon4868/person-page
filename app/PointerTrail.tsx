"use client";

import { useEffect, useRef } from "react";
import { Bot, Cloud, Code2, Cpu, Database, GitBranch, Sparkles, Terminal } from "lucide-react";
import { trailSamples, type TrailPoint } from "./pointer-trail";
import "./pointer-trail.css";

const trailIcons = [Bot, Code2, GitBranch, Cpu, Sparkles, Terminal, Database, Cloud];

export default function PointerTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = Array.from(root.children) as HTMLElement[];
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Array<Animation | null> = nodes.map(() => null);
    let current = 0;
    let lastPoint: TrailPoint | null = null;
    let queuedPoint: TrailPoint | null = null;
    let moveRaf = 0;

    const enabled = () => finePointer.matches && !reducedMotion.matches && window.innerWidth > 820 && !document.hidden;
    const clear = () => {
      cancelAnimationFrame(moveRaf);
      moveRaf = 0;
      queuedPoint = null;
      animations.forEach(animation => animation?.cancel());
      lastPoint = null;
    };

    const spawn = (point: TrailPoint, direction: TrailPoint) => {
      const index = current % nodes.length;
      const node = nodes[index];
      current += 1;
      animations[index]?.cancel();

      const driftX = Math.max(-14, Math.min(14, -direction.x * 0.06));
      const driftY = Math.max(-16, Math.min(9, -direction.y * 0.05 - 7));
      const turn = ((current % 5) - 2) * 7;
      const x = point.x - 19;
      const y = point.y - 19;
      const animation = node.animate([
        { opacity: 0, transform: `translate3d(${x - driftX}px, ${y - driftY}px, 0) scale(.55) rotate(${turn - 7}deg)` },
        { opacity: .9, transform: `translate3d(${x}px, ${y}px, 0) scale(1) rotate(${turn}deg)`, offset: .16 },
        { opacity: .58, transform: `translate3d(${x + driftX * .55}px, ${y + driftY * .55}px, 0) scale(.82) rotate(${turn + 4}deg)`, offset: .58 },
        { opacity: 0, transform: `translate3d(${x + driftX}px, ${y + driftY}px, 0) scale(.38) rotate(${turn + 10}deg)` },
      ], { duration: 760, easing: "cubic-bezier(.18,.76,.28,1)", fill: "forwards" });
      animations[index] = animation;
    };

    const flushMove = () => {
      moveRaf = 0;
      const nextPoint = queuedPoint;
      queuedPoint = null;
      if (!nextPoint || !enabled()) return;
      if (!lastPoint) { lastPoint = nextPoint; return; }
      const direction = { x: nextPoint.x - lastPoint.x, y: nextPoint.y - lastPoint.y };
      const samples = trailSamples(lastPoint, nextPoint);
      samples.forEach(point => spawn(point, direction));
      if (samples.length) lastPoint = nextPoint;
    };
    const move = (event: PointerEvent) => {
      if (!enabled() || (event.pointerType && event.pointerType !== "mouse")) return;
      queuedPoint = { x: event.clientX, y: event.clientY };
      if (!moveRaf) moveRaf = requestAnimationFrame(flushMove);
    };

    const sync = () => { if (!enabled()) clear(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", clear);
    window.addEventListener("resize", sync);
    document.addEventListener("visibilitychange", sync);
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    root.dataset.ready = "true";

    return () => {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", sync);
      document.removeEventListener("visibilitychange", sync);
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return <div className="pointer-trail" aria-hidden="true" ref={rootRef}>
    {Array.from({ length: 8 }, (_, index) => {
      const Icon = trailIcons[index % trailIcons.length];
      return <span className="pointer-trail-icon" key={index}><Icon /></span>;
    })}
  </div>;
}
