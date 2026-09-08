"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { Brain, Cloud } from "lucide-react";
import "./tech-stack.css";

const technologies = [
  { name: "React", label: "前端交互", icon: "/tech-react.svg", position: "react" },
  { name: "Go", label: "后端架构", icon: "/tech-go.svg", position: "go" },
  { name: "Python", label: "智能应用", icon: "/tech-python.svg", position: "python" },
  { name: "Cloud", label: "云端交付", position: "cloud" },
];

export default function TechStack() {
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let visible = false;
    const update = () => scene.classList.toggle("engine-running", visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(scene);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--engine-x", `${(event.clientX - rect.left) / rect.width * 8 - 4}deg`);
    event.currentTarget.style.setProperty("--engine-y", `${4 - (event.clientY - rect.top) / rect.height * 8}deg`);
  };
  const reset = () => {
    sceneRef.current?.style.setProperty("--engine-x", "0deg");
    sceneRef.current?.style.setProperty("--engine-y", "0deg");
  };

  return <div className="tech-scene" ref={sceneRef} onPointerMove={follow} onPointerLeave={reset}>
    <div className="engine-caption" aria-hidden="true"><span /> AI × FULL STACK</div>
    <div className="engine-space" role="list" aria-label="核心技术栈">
      <svg className="engine-orbits" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <defs><linearGradient id="engine-orbit-light" x1="80" y1="100" x2="520" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor="#71e4ff" stopOpacity=".8" /><stop offset=".45" stopColor="#9890ff" stopOpacity=".12" /><stop offset="1" stopColor="#c09aff" stopOpacity=".75" />
        </linearGradient></defs>
        <circle cx="300" cy="300" r="230" stroke="#a7b7ff" strokeOpacity=".09" strokeDasharray="2 12" />
        <g transform="rotate(-32 300 300)">
          <ellipse cx="300" cy="300" rx="258" ry="128" stroke="url(#engine-orbit-light)" />
          <g transform="translate(300 300) scale(1 .496)"><g className="engine-particle particle-one"><circle cx="258" r="4" fill="#a9f1ff" /><circle cx="258" r="10" fill="#72cfff" fillOpacity=".12" /></g></g>
        </g>
        <g transform="rotate(37 300 300)">
          <ellipse cx="300" cy="300" rx="250" ry="139" stroke="url(#engine-orbit-light)" />
          <g transform="translate(300 300) scale(1 .556)"><g className="engine-particle particle-two"><circle cx="250" r="4" fill="#d8b9ff" /><circle cx="250" r="10" fill="#be8dff" fillOpacity=".15" /></g></g>
        </g>
        <path d="M135 156 300 300 477 180 M120 420 300 300 486 450" stroke="#a6b5ff" strokeOpacity=".16" strokeDasharray="3 8" />
        <circle className="engine-inner-ring" cx="300" cy="300" r="112" stroke="url(#engine-orbit-light)" strokeWidth="2" strokeDasharray="82 35 2 22" />
      </svg>
      <div className="engine-core" role="listitem">
        <div className="engine-core-light" aria-hidden="true" />
        <Brain size={46} strokeWidth={1.25} aria-hidden="true" />
        <strong>AI</strong><span>AGENT ENGINEERING</span>
      </div>
      {technologies.map(technology => <div className={`engine-node node-${technology.position}`} role="listitem" key={technology.name}>
        <div className="engine-node-icon" aria-hidden="true">
          {technology.icon ? <img src={technology.icon} width="54" height="54" alt="" /> : <Cloud size={54} strokeWidth={1.5} />}
        </div>
        <strong>{technology.name}</strong><span>{technology.label}</span>
      </div>)}
    </div>
    <div className="engine-signature"><span>从智能编排，到全栈交付</span><small>IDEAS → SYSTEMS → IMPACT</small></div>
  </div>;
}
