"use client";

import { useEffect, useRef } from "react";
import "./portfolio.css";
import HeroAtmosphere from "./HeroAtmosphere";
import TechStack from "./TechStack";
import HeroCopy from "./HeroCopy";
import SelectedWork from "./SelectedWork";
import KnowledgeGraph from "./KnowledgeGraph";
import CareerTimeline from "./CareerTimeline";
import PointerTrail from "./PointerTrail";
import { visibleProjects } from "./portfolio-content";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let heroRect = hero.getBoundingClientRect();
    let pointerDirty = false;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    const ripples: { x: number; y: number; born: number }[] = [];
    let particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const syncHeroRect = () => { heroRect = hero.getBoundingClientRect(); };
    const resize = () => {
      syncHeroRect();
      width = heroRect.width;
      height = heroRect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 34 : 68;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.82,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.4 + 0.35,
        a: Math.random() * 0.45 + 0.12,
      }));
    };

    const move = (event: PointerEvent) => {
      mouse.tx = event.clientX - heroRect.left;
      mouse.ty = event.clientY - heroRect.top;
      pointerDirty = true;
    };

    const click = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const y = event.clientY - rect.top;
      if (y > height * 0.68) ripples.push({ x: event.clientX - rect.left, y, born: performance.now() });
    };

    const draw = (now: number) => {
      if (pointerDirty) {
        pointerDirty = false;
        hero.style.setProperty("--mx", `${mouse.tx}px`);
        hero.style.setProperty("--my", `${mouse.ty}px`);
        hero.style.setProperty("--px", `${(mouse.tx / width - 0.5).toFixed(3)}`);
        hero.style.setProperty("--py", `${(mouse.ty / height - 0.5).toFixed(3)}`);
      }
      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height * 0.82;
        if (p.y > height * 0.84) p.y = -10;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / Math.max(dist, 1)) * force * 0.8;
          p.y += (dy / Math.max(dist, 1)) * force * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(139, 121, 255, ${force * 0.24})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r > 1.2 ? "183,165,255" : "119,184,255"},${p.a})`;
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const age = (now - ripples[i].born) / 1100;
        if (age >= 1) { ripples.splice(i, 1); continue; }
        const radius = 12 + age * 145;
        ctx.save();
        ctx.translate(ripples[i].x, ripples[i].y);
        ctx.scale(1, 0.27);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168,135,255,${(1 - age) * 0.55})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#866aff";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", syncHeroRect, { passive: true });
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerdown", click);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", syncHeroRect);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerdown", click);
    };
  }, []);

  useEffect(() => {
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    if (!dot || !ring) return;

    const finePointer = matchMedia("(pointer: fine)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const cursorNodes = [dot, ring];
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, lastFrame = 0;
    let visible = false, active = false, initialized = false;

    const isEnabled = () => finePointer.matches && !reducedMotion.matches && window.innerWidth > 1024;
    const setVisible = (nextVisible: boolean) => {
      if (visible === nextVisible) return;
      visible = nextVisible;
      cursorNodes.forEach((node) => node.classList.toggle("is-visible", visible));
    };
    const setActive = (nextActive: boolean) => {
      if (active === nextActive) return;
      active = nextActive;
      cursorNodes.forEach((node) => node.classList.toggle("is-active", active));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    function render(now: number) {
      raf = 0;
      if (!initialized) return;
      const delta = lastFrame ? Math.min(now - lastFrame, 34) : 16;
      lastFrame = now;
      const follow = 1 - Math.exp(-delta / 18);
      rx += (x - rx) * follow;
      ry += (y - ry) * follow;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      if (Math.abs(x - rx) > .12 || Math.abs(y - ry) > .12) schedule();
    }
    const hide = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      initialized = false;
      lastFrame = 0;
      setVisible(false);
      setActive(false);
    };
    const syncCursorMode = () => {
      const enabled = isEnabled();
      document.documentElement.classList.toggle("has-custom-cursor", enabled);
      if (!enabled) hide();
    };
    const move = (event: PointerEvent) => {
      if (!isEnabled()) return;
      x = event.clientX;
      y = event.clientY;
      if (!initialized) {
        initialized = true;
        rx = x;
        ry = y;
      }
      setVisible(true);
      schedule();
    };
    const over = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      setActive(!!target?.closest("a,button,.tech-card,[role='button']"));
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    syncCursorMode();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", syncCursorMode);
    finePointer.addEventListener("change", syncCursorMode);
    reducedMotion.addEventListener("change", syncCursorMode);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", syncCursorMode);
      finePointer.removeEventListener("change", syncCursorMode);
      reducedMotion.removeEventListener("change", syncCursorMode);
    };
  }, []);

  return (
    <main>
      <PointerTrail />
      <div className="cursor-dot" aria-hidden="true" /><div className="cursor-ring" aria-hidden="true" />
      <section className="hero" id="home" ref={heroRef}>
        <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="hero-environment" aria-hidden="true"><HeroAtmosphere /></div>
        <div className="space-haze" aria-hidden="true" />
        <header className="topbar reveal r1">
          <a href="#home" className="brand" aria-label="返回首页">
            <span className="brand-mark"><i>M</i></span>
            <span><strong>徐小龙</strong><small>BUILD · SOLVE · CREATE</small></span>
          </a>
          <nav aria-label="主要导航">
            <a className="active" href="#home">首页</a><a href="#work">作品</a><a href="#skills">能力</a><a href="#experience">履历</a><a href="#contact">联系</a>
          </nav>
          <button className="download" type="button" onClick={() => window.print()} aria-label="将当前个人介绍打印或保存为 PDF">下载简历 <span>↓</span></button>
        </header>

        <HeroCopy />

        <TechStack />
        <div className="right-motto" aria-hidden="true"><span>Better</span><span>Software</span><span>A Brighter</span><span>Tomorrow</span><i /></div>
        <div className="side-note"><span>IDEAS</span><span>CODE</span><span>PEOPLE</span><span>IMPACT</span><i /></div>
        <div className="rock-note" aria-hidden="true"><span>IDEAS</span><span>INTO</span><span>REALITY</span><i /></div>
        <div className="bottom-note" aria-hidden="true"><span>GOOD</span><span>SOFTWARE</span><span>A BRIGHTER</span><span>TOMORROW</span><i /></div>
        <a className="scroll-cue" href="#work"><span /><small>SCROLL TO EXPLORE</small></a>
      </section>

      <SelectedWork projects={visibleProjects} />

      <KnowledgeGraph />

      <CareerTimeline />

      <section className="contact-section" id="contact"><div className="contact-orbit" /><p>LET&apos;S BUILD SOMETHING MEANINGFUL</p><h2>让下一个复杂想法，<br />成为真正运行的<span>系统。</span></h2><a href="mailto:ith5cn@163.com">ith5cn@163.com <span>↗</span></a><footer><span>徐小龙 · AI 全栈 / Agent 工程师</span><span>© 2026 BUILT WITH CURIOSITY</span></footer></section>
    </main>
  );
}
