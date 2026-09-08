"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Bot, Building2, Cloud, Code2, Layers, Server, Sparkles } from "lucide-react";
import { careerChapters } from "./portfolio-content";
import { careerFrame } from "./profile-motion";
import "./career-timeline.css";

const stageIcons = { code: Code2, layers: Layers, server: Server, cloud: Cloud, bot: Bot };
const tones = ["114, 194, 234", "138, 163, 246", "155, 145, 245", "176, 141, 245", "196, 143, 237"];

export default function CareerTimeline() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const chapter = careerChapters[active];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const rows = [...root.querySelectorAll<HTMLElement>("[data-career-row]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 900px)");
    let visible = false, raf = 0;
    const update = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      const centers = rows.map(row => { const box = row.getBoundingClientRect(); return box.top + box.height / 2; });
      const frame = careerFrame(centers, window.innerHeight * .48, window.innerHeight * .9);
      const animate = !reduced.matches && !compact.matches;
      root.dataset.depth = String(animate);
      root.style.setProperty("--career-progress", String(frame.progress));
      frame.cards.forEach((pose, i) => {
        const row = rows[i];
        row.style.setProperty("--chapter-scale", animate ? String(pose.scale) : "1");
        row.style.setProperty("--chapter-angle", animate ? `${pose.rotate}deg` : "0deg");
        row.style.setProperty("--chapter-depth", animate ? `${pose.depth}px` : "0px");
        row.style.setProperty("--chapter-opacity", animate ? String(pose.opacity) : "1");
      });
      setActive(previous => previous === frame.active ? previous : frame.active);
    };
    const schedule = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(update); };
    const sync = () => {
      root.style.setProperty("--career-play", visible && !document.hidden && !reduced.matches ? "running" : "paused");
      cancelAnimationFrame(raf); raf = 0;
      schedule();
    };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const resize = new ResizeObserver(schedule);
    intersection.observe(root); rows.forEach(row => resize.observe(row));
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    reduced.addEventListener("change", sync); compact.addEventListener("change", sync); document.addEventListener("visibilitychange", sync);
    return () => { cancelAnimationFrame(raf); intersection.disconnect(); resize.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", sync); compact.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return <section className="section career-section" id="experience" aria-labelledby="career-heading" ref={rootRef} style={{ "--career-tone": tones[active] } as CSSProperties}>
    <div className="section-label"><span>03</span> EXPERIENCE / 职业履历</div>
    <div className="career-layout">
      <div className="career-console"><p className="kicker">EXPERIENCE / EVOLUTION</p><h2 id="career-heading">从界面到智能体，<br />十年持续<span>进阶。</span></h2><p className="career-intro">前端工程 → 全栈系统 → AI Agent / 研发工程</p>
        <div className="career-year-display" aria-hidden="true"><span>CHAPTER {String(active + 1).padStart(2, "0")} / 05</span><strong key={chapter.year}>{chapter.year}<i /></strong><p>{chapter.stage}</p></div>
        <div className="career-progress" aria-hidden="true"><i /></div>
        <nav className="career-chapter-nav" aria-label="按年份浏览职业经历">{careerChapters.map((entry, i) => <a key={entry.id} href={`#${entry.id}`} aria-current={active === i ? "step" : undefined}><span>{entry.year}</span><i aria-hidden="true" /><span>{entry.stage}</span><ArrowUpRight aria-hidden="true" /></a>)}</nav>
        <span className="career-scroll-hint"><ArrowDown aria-hidden="true" />向下浏览，沿时间回看成长</span>
      </div>
      <ol className="career-track" aria-label="从 2016 年至今的职业履历">{careerChapters.map((entry, i) => { const Icon = stageIcons[entry.icon as keyof typeof stageIcons]; return <li className="career-chapter" key={entry.id} id={entry.id} data-career-row={i} data-active={active === i} style={{ "--chapter-tone": tones[i] } as CSSProperties}>
        <span className="career-waypoint" aria-hidden="true"><i /></span>
        <article className="career-card" aria-labelledby={`${entry.id}-company`}><div className="career-card-top"><span className="career-chapter-icon"><Icon aria-hidden="true" /></span><div><span className="career-chapter-label">{entry.stage}</span><time dateTime={entry.period.slice(0, 7).replace(".", "-")}>{entry.period}</time></div><span className="career-chapter-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span></div>
          <div className="career-company"><Building2 aria-hidden="true" /><h3 id={`${entry.id}-company`}>{entry.company}</h3></div><p className="career-role">{entry.role}{i === careerChapters.length - 1 && <span>当前任职</span>}</p>
          <div className="career-contribution"><Sparkles aria-hidden="true" /><p>{entry.contribution}</p></div><p className="career-detail">{entry.detail}</p><ul className="career-skills">{entry.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </article>
      </li>; })}</ol>
    </div>
  </section>;
}
