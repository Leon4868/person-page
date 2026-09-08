"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const role = "AI FULL-STACK DEVELOPER  ×  AGENT ENGINEER";
const glyphs = "01<>/{}_*+";
const finished = { role, years: 10, projects: 20 };

export default function HeroCopy() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Complete copy is server-rendered; animation is only a visual enhancement.
  const [frame, setFrame] = useState(finished);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, played = false, raf = 0, started = 0, lastTick = -1;

    const animate = (now: number) => {
      const elapsed = now - started;
      const progress = Math.min(1, elapsed / 1450);
      const tick = Math.floor(elapsed / 42);
      if (tick !== lastTick) {
        lastTick = tick;
        const locked = Math.floor(Math.min(1, elapsed / 1100) * role.length);
        const eased = 1 - Math.pow(1 - progress, 3);
        setFrame({
          role: [...role].map((char, i) => i < locked || /\s|×|-/.test(char) ? char : glyphs[(i * 7 + tick) % glyphs.length]).join(""),
          years: Math.round(eased * 10),
          projects: Math.round(eased * 20),
        });
      }
      if (progress < 1) raf = requestAnimationFrame(animate);
      else { raf = 0; setFrame(finished); }
    };

    const sync = () => {
      const active = visible && !document.hidden && !reduced.matches;
      root.style.setProperty("--copy-play", active ? "running" : "paused");
      if (!active) {
        cancelAnimationFrame(raf);
        raf = 0;
        if (played || reduced.matches) setFrame(finished);
      } else if (!played) {
        played = true;
        started = performance.now();
        raf = requestAnimationFrame(animate);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .1 });
    observer.observe(root);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const followLight = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--copy-x", `${x}px`);
    event.currentTarget.style.setProperty("--copy-y", `${y}px`);
    event.currentTarget.style.setProperty("--copy-dx", String(x / rect.width - .5));
    event.currentTarget.style.setProperty("--copy-dy", String(y / rect.height - .5));
  };
  const resetLight = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--copy-dx", "0");
    event.currentTarget.style.setProperty("--copy-dy", "0");
    event.currentTarget.style.setProperty("--copy-x", "50%");
    event.currentTarget.style.setProperty("--copy-y", "35%");
  };

  return <div className="hero-copy ai-copy" ref={rootRef} onPointerMove={followLight} onPointerLeave={resetLight}>
    <p className="eyebrow reveal r2">
      <span className="copy-sr-only">{role}</span>
      <span className="decode-label" aria-hidden="true">
        <span className="decode-source">{role}</span>
        <span className="decode-output">{frame.role}</span>
      </span>
    </p>
    <h1 className="hero-title reveal r3" aria-label="I BUILD DIGITAL EXPERIENCES.">
      <span className="headline-line" data-text="I BUILD DIGITAL" aria-hidden="true">I BUILD DIGITAL</span>
      <em className="headline-line" data-text="EXPERIENCES." aria-hidden="true">EXPERIENCES.</em>
    </h1>
    <p className="roles reveal r4"><span className="role-word">程序员</span> <i>·</i> <span className="role-word">问题解决者</span> <i>·</i> <span className="role-word">产品构建者</span></p>
    <p className="hero-intro reveal r4">10 年软件研发经验，构建 <span className="intro-accent">AI Agent</span>、全栈产品与云原生系统。自研 <span className="intro-accent">AI 开发工作流</span>，把需求、规范、编码与质量治理连接成可复用的工程闭环。</p>
    <div className="hero-actions reveal r5"><a className="primary-btn" href="#work">查看代表作品 <span>→</span></a><a className="ghost-btn" href="mailto:ith5cn@163.com">和我聊聊 <span>⌁</span></a></div>
    <div className="hero-stats reveal r6">
      <div><strong><span className="copy-sr-only">10+</span><span aria-hidden="true">{frame.years}<sup>+</sup></span></strong><small>年研发经验</small></div><span />
      <div><strong><span className="copy-sr-only">20+</span><span aria-hidden="true">{frame.projects}<sup>+</sup></span></strong><small>项目完整交付</small></div><span />
      <div><strong className="learning-infinity">∞</strong><small>持续学习进化</small></div>
    </div>
  </div>;
}
