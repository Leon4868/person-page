"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Activity, Blocks, Bot, Brain, Cloud, Code2, Container, Database, FileCode2,
  GitBranch, Hammer, Hexagon, Inbox, Layers, PanelsTopLeft, Plug, RefreshCw,
  Rocket, Search, Server, ShieldCheck, SlidersHorizontal, Wallet, Wrench,
  Workflow, Terminal, Network, TestTube2,
  type LucideIcon,
} from "lucide-react";
import { connectionPath, corePoint, knowledgeEdges, knowledgeGroups, knowledgeNodes, projectPoint, type Point3 } from "./knowledge-model";
import "./knowledge-graph.css";

const icons: Record<string, LucideIcon> = {
  activity: Activity, blocks: Blocks, bot: Bot, brain: Brain, cloud: Cloud, code: Code2,
  container: Container, database: Database, filecode: FileCode2, branches: GitBranch,
  hammer: Hammer, hexagon: Hexagon, inbox: Inbox, layers: Layers, panels: PanelsTopLeft,
  plug: Plug, sync: RefreshCw, rocket: Rocket, search: Search, server: Server,
  shield: ShieldCheck, sliders: SlidersHorizontal, wallet: Wallet, wrench: Wrench,
  workflow: Workflow, terminal: Terminal, network: Network, test: TestTube2,
};
type Selection = { group: string; skill?: string } | null;
const initialPositions = new Map(knowledgeNodes.map(node => [node.id, projectPoint(node.point)]));

function nodeStyle(point: Point3): CSSProperties {
  const p = projectPoint(point);
  return { left: `${p.x / 14.4}%`, top: `${p.y / 9}%`, transform: `translate(-50%, -50%) scale(${p.scale})`, zIndex: Math.round(p.depth) + 100 };
}
function KnowledgeIcon({ name, image }: { name: string; image?: string }) {
  // Tiny bundled SVG icons do not need a raster image optimization endpoint.
  // eslint-disable-next-line @next/next/no-img-element
  if (image) return <img src={image} alt="" width="36" height="36" draggable={false} />;
  const Icon = icons[name] ?? Code2;
  return <Icon size={32} strokeWidth={1.55} aria-hidden="true" />;
}

export default function KnowledgeGraph() {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const edgeRefs = useRef(new Map<string, SVGPathElement>());
  const [selected, setSelected] = useState<Selection>(null);
  const [hovered, setHovered] = useState<Selection>(null);
  const active = hovered ?? selected;

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 900px)");
    let visible = false, raf = 0, last = 0;
    let yaw = 0, pitch = 0;
    const pointer = { x: 0, y: 0 };
    const paint = (now: number, moving: boolean) => {
      const t = now / 1000;
      yaw += ((moving ? pointer.x * .065 + Math.sin(t * .22) * .008 : 0) - yaw) * .075;
      pitch += ((moving ? pointer.y * -.045 + Math.cos(t * .18) * .008 : 0) - pitch) * .075;
      const positions = new Map(knowledgeNodes.map((node, index) => {
        const p = projectPoint({ ...node.point, z: node.point.z + (moving ? Math.sin(t * .65 + index * .9) * 5 : 0) }, moving ? yaw : 0, moving ? pitch : 0);
        const element = nodeRefs.current.get(node.id);
        if (element) {
          element.style.left = `${p.x / 14.4}%`;
          element.style.top = `${p.y / 9}%`;
          element.style.transform = `translate(-50%, -50%) scale(${p.scale})`;
          element.style.zIndex = `${Math.round(p.depth) + 100}`;
        }
        return [node.id, p];
      }));
      for (const edge of knowledgeEdges) {
        const d = connectionPath(positions.get(edge.from)!, positions.get(edge.to)!);
        edgeRefs.current.get(edge.id)?.setAttribute("d", d);
        edgeRefs.current.get(`${edge.id}-pulse`)?.setAttribute("d", d);
      }
    };
    const frame = (now: number) => {
      if (now - last >= 1000 / 30) { paint(now, true); last = now; }
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      const running = visible && !document.hidden && !reduced.matches;
      root.style.setProperty("--knowledge-play", running ? "running" : "paused");
      if (running && !compact.matches) raf = requestAnimationFrame(frame);
      else if (reduced.matches || compact.matches) paint(0, false);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = scene.getBoundingClientRect();
      pointer.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      pointer.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    };
    const leave = () => { pointer.x = 0; pointer.y = 0; };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setHovered(null); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .08 });
    observer.observe(root);
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerleave", leave);
    root.addEventListener("keydown", escape);
    reduced.addEventListener("change", sync);
    compact.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf); observer.disconnect();
      scene.removeEventListener("pointermove", move); scene.removeEventListener("pointerleave", leave);
      root.removeEventListener("keydown", escape);
      reduced.removeEventListener("change", sync); compact.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const toggle = (next: NonNullable<Selection>) => {
    setSelected(current => current?.group === next.group && current?.skill === next.skill ? null : next);
  };
  const reset = () => { setSelected(null); setHovered(null); };
  const selectedGroup = knowledgeGroups.find(group => group.id === selected?.group);
  const selectedSkill = selectedGroup?.skills.find(skill => skill.id === selected?.skill);
  const activeGroup = knowledgeGroups.find(group => group.id === active?.group);
  const activeSkill = activeGroup?.skills.find(skill => skill.id === active?.skill);
  const skillCount = knowledgeGroups.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <section className="section skills-section knowledge-section" id="skills" ref={rootRef} aria-labelledby="knowledge-title">
      <div className="section-label"><span>03</span> CAPABILITY MAP / 核心能力图谱</div>
      <div className="knowledge-heading">
        <h2 id="knowledge-title">岗位 <span>×</span> 技能知识图谱</h2>
        <p id="knowledge-help">AI 研发工程 × Agent × 全栈 × 云原生<br />点选图标，查看技能与项目实践。</p>
      </div>
      <div className={`knowledge-scene${active ? " has-active" : ""}`} ref={sceneRef} aria-describedby="knowledge-help">
        <div className="knowledge-floor" aria-hidden="true" />
        <svg className="knowledge-connections" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {knowledgeGroups.map(group => <linearGradient key={group.id} id={`knowledge-gradient-${group.id}`}><stop stopColor={`rgb(${group.color})`} stopOpacity=".3" /><stop offset="1" stopColor={`rgb(${group.color})`} /></linearGradient>)}
          </defs>
          {knowledgeEdges.map((edge, index) => {
            const lit = active?.group === edge.group && (!active.skill || edge.to === active.skill || edge.from === "core");
            const d = connectionPath(initialPositions.get(edge.from)!, initialPositions.get(edge.to)!);
            return <g key={edge.id} className={`knowledge-edge${lit ? " is-lit" : ""}${active && active.group !== edge.group ? " is-dim" : ""}`} data-from={edge.from} data-to={edge.to} style={{ "--edge-delay": `${index * -.37}s` } as CSSProperties}>
              <path d={d} stroke={`url(#knowledge-gradient-${edge.group})`} ref={element => { if (element) edgeRefs.current.set(edge.id, element); else edgeRefs.current.delete(edge.id); }} />
              <path className="knowledge-pulse" d={d} stroke={`url(#knowledge-gradient-${edge.group})`} ref={element => { if (element) edgeRefs.current.set(`${edge.id}-pulse`, element); else edgeRefs.current.delete(`${edge.id}-pulse`); }} />
            </g>;
          })}
        </svg>

        <button className="knowledge-node knowledge-core" type="button" ref={element => { if (element) nodeRefs.current.set("core", element); else nodeRefs.current.delete("core"); }} style={nodeStyle(corePoint)} onClick={reset} aria-label="徐小龙，显示全部岗位和技能">
          <span className="knowledge-core-face"><Brain size={30} strokeWidth={1.2} aria-hidden="true" /><strong>XXL</strong><span>AI 全栈工程师</span></span>
          <small>BUILD · CONNECT · SHIP</small>
        </button>

        {knowledgeGroups.map(group => <article className={`knowledge-cluster${active?.group === group.id ? " is-active" : ""}${active && active.group !== group.id ? " is-dim" : ""}`} key={group.id} style={{ "--node-rgb": group.color } as CSSProperties} aria-labelledby={`knowledge-role-${group.id}`}>
          <button id={`knowledge-role-${group.id}`} className="knowledge-node knowledge-hub" type="button" data-role={group.id} ref={element => { if (element) nodeRefs.current.set(group.id, element); else nodeRefs.current.delete(group.id); }} style={nodeStyle(group.point)} aria-pressed={selected?.group === group.id && !selected.skill} aria-label={`${group.title} · ${group.subtitle}，关联 6 项技能`} onClick={() => toggle({ group: group.id })} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered({ group: group.id }); }} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered({ group: group.id })} onBlur={() => setHovered(null)}>
            <span className="knowledge-hub-icon"><KnowledgeIcon name={group.icon} /></span><strong>{group.title}</strong><span>{group.subtitle}</span>
          </button>
          <div className="knowledge-satellites">
            <svg className="knowledge-mobile-links" viewBox="0 0 300 240" preserveAspectRatio="none" aria-hidden="true"><path d="M150 0V18M50 56V18H250V56M150 18V56M50 56V174M150 56V174M250 56V174" /></svg>
            {group.skills.map(skill => <button className={`knowledge-node knowledge-skill${active?.skill === skill.id ? " is-selected" : ""}`} type="button" key={skill.id} data-skill={skill.id} title={skill.detail} ref={element => { if (element) nodeRefs.current.set(skill.id, element); else nodeRefs.current.delete(skill.id); }} style={nodeStyle(skill.point)} aria-label={`${skill.label} · ${group.subtitle}`} aria-pressed={selected?.skill === skill.id} onClick={() => toggle({ group: group.id, skill: skill.id })} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered({ group: group.id, skill: skill.id }); }} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered({ group: group.id, skill: skill.id })} onBlur={() => setHovered(null)}>
              <span className="knowledge-icon"><KnowledgeIcon name={skill.icon} image={skill.image} /></span><span className="knowledge-skill-label">{skill.label}</span>
            </button>)}
          </div>
        </article>)}
      </div>
      <div className="knowledge-footer">
        <p role="status"><span className="knowledge-status-dot" />{selectedGroup ? `${selectedGroup.title} · ${selectedSkill?.label ?? `${selectedGroup.skills.length} 项关联技能`}${selectedSkill?.detail ? `：${selectedSkill.detail}` : ""}` : `${knowledgeGroups.length} 个岗位方向 · ${skillCount} 项核心技能`}</p>
        <button type="button" onClick={reset} disabled={!selected}>显示全部 <RefreshCw size={14} aria-hidden="true" /></button>
      </div>
      <p className="knowledge-practice">{activeSkill?.detail ?? (activeGroup ? `${activeGroup.subtitle} · ${activeGroup.skills.map(skill => skill.label).join(" / ")}` : "从开发工作流与工程规范，到 Agent 生产化、全栈系统和自动化交付。")}</p>
    </section>
  );
}
