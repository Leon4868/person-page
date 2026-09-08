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
    let current = 0;
    let lastPoint: TrailPoint | null = null;
    let spawnCount = 0;

    const enabled = () => finePointer.matches && !reducedMotion.matches && window.innerWidth > 820 && !document.hidden;
    const clear = () => {
      nodes.forEach(node => {
        node.getAnimations().forEach(animation => animation.cancel());
        node.removeAttribute("data-active");
      });
      lastPoint = null;
    };

    const spawn = (point: TrailPoint, direction: TrailPoint) => {
      const node = nodes[current % nodes.length];
      current += 1;
      spawnCount += 1;
      root.dataset.spawnCount = String(spawnCount);
      node.getAnimations().forEach(animation => animation.cancel());
      node.dataset.active = "true";

      const driftX = Math.max(-18, Math.min(18, -direction.x * 0.08));
      const driftY = Math.max(-20, Math.min(12, -direction.y * 0.06 - 9));
      const turn = ((current % 5) - 2) * 7;
      const x = point.x - 22;
      const y = point.y - 22;
      const animation = node.animate([
        { opacity: 0, filter: "blur(4px)", transform: `translate3d(${x - driftX}px, ${y - driftY}px, 0) scale(.45) rotate(${turn - 9}deg)` },
        { opacity: .95, filter: "blur(0)", transform: `translate3d(${x}px, ${y}px, 0) scale(1.04) rotate(${turn}deg)`, offset: .14 },
        { opacity: .72, filter: "blur(0)", transform: `translate3d(${x + driftX * .55}px, ${y + driftY * .55}px, 0) scale(.86) rotate(${turn + 5}deg)`, offset: .58 },
        { opacity: 0, filter: "blur(5px)", transform: `translate3d(${x + driftX}px, ${y + driftY}px, 0) scale(.28) rotate(${turn + 14}deg)` },
      ], { duration: 920, easing: "cubic-bezier(.18,.76,.28,1)", fill: "forwards" });
      animation.onfinish = () => node.removeAttribute("data-active");
      animation.oncancel = () => node.removeAttribute("data-active");
    };

    const move = (event: PointerEvent) => {
      if (!enabled() || (event.pointerType && event.pointerType !== "mouse")) return;
      const nextPoint = { x: event.clientX, y: event.clientY };
      if (!lastPoint) { lastPoint = nextPoint; return; }
      const direction = { x: nextPoint.x - lastPoint.x, y: nextPoint.y - lastPoint.y };
      const samples = trailSamples(lastPoint, nextPoint);
      samples.forEach(point => spawn(point, direction));
      if (samples.length) lastPoint = nextPoint;
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
    {Array.from({ length: 12 }, (_, index) => {
      const Icon = trailIcons[index % trailIcons.length];
      return <span className="pointer-trail-icon" key={index}><Icon /></span>;
    })}
  </div>;
}
