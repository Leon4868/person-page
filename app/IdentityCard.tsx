"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowUpRight, Bot, BriefcaseBusiness, Code2, Mail, MapPin, Phone, Sparkles, Workflow } from "lucide-react";
import { identityRoles, showWeb3 } from "./portfolio-content";
import { identityPose } from "./profile-motion";
import "./identity-card.css";

const icons = { bot: Bot, code: Code2, workflow: Workflow };

export default function IdentityCard() {
  const [selected, setSelected] = useState(identityRoles[0].id);
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const role = identityRoles.find(item => item.id === selected) ?? identityRoles[0];
  const Icon = icons[role.icon as keyof typeof icons];

  useEffect(() => {
    const root = rootRef.current, card = cardRef.current;
    if (!root || !card) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 900px)");
    let visible = false;
    const sync = () => {
      const active = visible && !document.hidden && !reduced.matches;
      root.style.setProperty("--identity-play", active ? "running" : "paused");
      if (!active || small.matches) { card.style.setProperty("--identity-rx", "0deg"); card.style.setProperty("--identity-ry", "0deg"); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(root);
    reduced.addEventListener("change", sync); small.addEventListener("change", sync); document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); reduced.removeEventListener("change", sync); small.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce), (max-width: 900px)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const box = event.currentTarget.getBoundingClientRect();
    const pose = identityPose(event.clientX - box.left, event.clientY - box.top, box.width, box.height);
    card.style.setProperty("--identity-rx", `${pose.rx}deg`); card.style.setProperty("--identity-ry", `${pose.ry}deg`);
    card.style.setProperty("--identity-x", `${pose.lightX}%`); card.style.setProperty("--identity-y", `${pose.lightY}%`);
  };
  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--identity-rx", "0deg"); card.style.setProperty("--identity-ry", "0deg");
    card.style.setProperty("--identity-x", "50%"); card.style.setProperty("--identity-y", "35%");
  };

  return <section className="section identity-section" id="about" aria-labelledby="identity-heading" ref={rootRef} style={{ "--identity-tone": role.tone } as CSSProperties}>
    <div className="section-label"><span>01</span> ABOUT / 基础信息</div>
    <div className="identity-layout">
      <div className="identity-intro"><p className="kicker">{showWeb3 ? "AI × FULL STACK × WEB3" : "AI AGENT × AI WORKFLOW × FULL STACK"}</p><h2 id="identity-heading">交付智能应用，<br />也构建 AI 研发的<span>工作流。</span></h2><p className="identity-bio">徐小龙，AI 全栈 / Agent 工程师。覆盖 React / Next.js、Go / Gin、数据与云原生交付，实践模型微调、RAG 和 Agent 生产化。</p>
        <div className="identity-role-picker" role="group" aria-label="选择能力视角">{identityRoles.map(item => { const RoleIcon = icons[item.icon as keyof typeof icons]; return <button type="button" key={item.id} aria-pressed={selected === item.id} aria-controls={`identity-role-${item.id}`} onClick={() => setSelected(item.id)}><RoleIcon aria-hidden="true" />{item.label}</button>; })}</div>
        <div className="identity-role-summary" aria-live="polite" aria-atomic="true">{identityRoles.map(item => <div id={`identity-role-${item.id}`} key={item.id} hidden={selected !== item.id}><h3>{item.title}</h3><p>{item.summary}</p><ul>{item.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>)}</div>
      </div>
      <div className="identity-stage" onPointerMove={move} onPointerLeave={reset}>
        <div className="identity-card" ref={cardRef}>
          <div className="identity-foil" aria-hidden="true" /><div className="identity-card-top"><span><Sparkles size={15} aria-hidden="true" /> XXL / DIGITAL IDENTITY</span><span>广州 / 深圳 · CHINA</span></div>
          <div className="identity-nameplate"><span className="identity-monogram" aria-hidden="true">XXL</span><span className="identity-role-icon"><Icon aria-hidden="true" /></span><h3>徐小龙</h3><p>{role.title}</p><span className="identity-name-en">XU XIAOLONG</span></div>
          <div className="identity-status"><i aria-hidden="true" /><BriefcaseBusiness size={15} aria-hidden="true" /><span>在职，寻找新机会</span></div>
          <dl className="identity-facts"><div><dt><MapPin aria-hidden="true" />所在地</dt><dd>广州 / 深圳 · 均可</dd></div><div><dt><Code2 aria-hidden="true" />研发经验</dt><dd>10+ 年 · 持续进阶</dd></div><div><dt><Mail aria-hidden="true" />邮箱</dt><dd><a href="mailto:ith5cn@163.com">ith5cn@163.com<ArrowUpRight aria-hidden="true" /></a></dd></div><div><dt><Phone aria-hidden="true" />电话</dt><dd><a href="tel:15975492315">159 7549 2315<ArrowUpRight aria-hidden="true" /></a></dd></div></dl>
          <div className="identity-card-bottom"><span>BUILD · SOLVE · CREATE</span><span>2016 — NOW</span></div>
        </div>
      </div>
    </div>
  </section>;
}
