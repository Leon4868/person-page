"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Cpu, Database, MessageSquare, Workflow, Cloud, Terminal, Code2, Wallet, FileBadge, Layers, Webhook, ShieldCheck, ArrowRight, Server, Route, Network, CircleCheck, Video, Upload, ChartNoAxesCombined, GitBranch } from "lucide-react";
import { groupProjectShowcases, type Project } from "./portfolio-content";
import AIWorkflow from "./AIWorkflow";
import AgentSystem from "./AgentSystem";
import "./selected-work.css";

const tones = ["163, 130, 255", "87, 211, 242", "108, 157, 255", "211, 132, 247", "107, 220, 191"];

function Node({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return <div className={`blueprint-node ${className}`}>{icon}<span>{children}</span></div>;
}

function Wire({ vertical = false }: { vertical?: boolean }) {
  return <span className={`blueprint-wire${vertical ? " is-vertical" : ""}`}><i /></span>;
}

function Blueprint({ index }: { index: string }) {
  if (index === "01") return <div className="blueprint agent-blueprint">
    <Node icon={<MessageSquare />}>PROMPT</Node><Wire />
    <Node className="runtime-node" icon={<Cpu />}><b>AGENT</b>RUNTIME</Node><Wire />
    <div className="agent-branches"><Node icon={<Workflow />}>TOOLS</Node><Node icon={<Database />}>RAG</Node><Node icon={<Layers />}>MODELS</Node></div>
    <div className="blueprint-rail"><span>TRACE</span><i /><span>EVALUATION</span><i /><span>CI GATE</span></div>
  </div>;

  if (index === "02") return <div className="blueprint rag-blueprint">
    <div className="rag-sources"><Node icon={<Database />}>知识库 / RAG</Node><Node icon={<Cpu />}>QWEN3</Node></div>
    <Wire vertical />
    <div className="rag-router"><MessageSquare /><span>意图路由</span><i /><span>Tool Calling</span></div>
    <div className="rag-outcomes"><span><Workflow />业务工具</span><span><ShieldCheck />人工接管</span></div>
  </div>;

  if (index === "03") return <div className="blueprint config-blueprint">
    <div className="config-header"><span /><span /><span /><b>CONFIG CONTROL PLANE</b></div>
    <div className="config-flow"><Node icon={<Cloud />}>云端配置</Node><Wire /><Node icon={<Terminal />}>Go CLI</Node><Wire /><Node icon={<Code2 />}>Hook</Node></div>
    <div className="config-lines"><span><i>01</i>配置同步<b>SYNC</b></span><span><i>02</i>零下载回滚<b>ROLLBACK</b></span><span><i>03</i>分级审计<b>AUDIT</b></span></div>
  </div>;

  if (index === "04") return <div className="blueprint credential-blueprint">
    <div className="credential-route"><Wallet /><span>DAPP</span><Wire /><Server /><span>GO API</span></div>
    <div className="credential-pass"><div><span>NEXORA</span><FileBadge /></div><strong>链上学习凭证</strong><small>学习完成 · NFT 证书</small><div className="credential-footer"><span>SOLIDITY</span><ShieldCheck /></div></div>
    <div className="credential-chain"><Layers /><span>事件同步</span><i /><span>区块确认</span></div>
  </div>;

  if (index === "06") return <div className="blueprint delivery-blueprint"><div className="delivery-flow"><Node icon={<Upload />}>照片上传</Node><Wire /><Node icon={<Video />}>AI 视频</Node><Wire /><Node icon={<CircleCheck />}>下载 / 回传</Node></div><div className="delivery-rows"><span><Cloud />S3 / CloudFront</span><span><Workflow />Lambda / API Gateway</span><span><ShieldCheck />OAuth · 灰度回滚</span></div></div>;
  if (index === "07") return <div className="blueprint delivery-blueprint"><div className="delivery-flow"><Node icon={<Network />}>多端接入</Node><Wire /><Node icon={<ShieldCheck />}>签名 / 鉴权</Node><Wire /><Node icon={<Server />}>Go API</Node></div><div className="delivery-rows"><span><Database />幂等 · 唯一索引</span><span><Workflow />队列 · 重试 · 补偿</span><span><Route />Trace ID 全链路追踪</span></div></div>;
  if (index === "08") return <div className="blueprint delivery-blueprint"><div className="delivery-flow"><Node icon={<GitBranch />}>代码提交</Node><Wire /><Node icon={<Cloud />}>PR 预览</Node><Wire /><Node icon={<Server />}>灰度发布</Node></div><div className="delivery-rows"><span><Layers />ECS Fargate / Lambda</span><span><ShieldCheck />OIDC · SAM 回滚</span><span><ChartNoAxesCombined />CloudWatch · 巡检告警</span></div></div>;
  if (index === "09") return <div className="blueprint delivery-blueprint"><div className="delivery-flow"><Node icon={<Database />}>业务数据</Node><Wire /><Node icon={<Workflow />}>比对 / 聚合</Node><Wire /><Node icon={<ChartNoAxesCombined />}>报表 / 差异</Node></div><div className="delivery-rows"><span><ShieldCheck />RBAC 权限</span><span><CircleCheck />自动财务对账</span><span><Layers />广告创意批量生成</span></div></div>;

  return <div className="blueprint payment-blueprint">
    <div className="payment-flow"><Node className="payment-token" icon={<Wallet />}>USDC</Node><Wire /><Node icon={<ShieldCheck />}>FINALIZED</Node><Wire /><Node icon={<Webhook />}>WEBHOOK</Node></div>
    <div className="payment-ledger"><div><span>支付单</span><b>状态机</b></div><div><span>可靠交付</span><b>OUTBOX</b></div><div><span>资金一致性</span><b>幂等 · 对账</b></div></div>
  </div>;
}

export default function SelectedWork({ projects }: { projects: Project[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const showcases = groupProjectShowcases(projects);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = [...grid.querySelectorAll<HTMLElement>(".work-card")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => cards.forEach(card => {
      card.style.setProperty("--work-play", card.dataset.inview === "true" && !document.hidden && !reduced.matches ? "running" : "paused");
      if (reduced.matches) card.dataset.visible = "true";
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const card = entry.target as HTMLElement;
        card.dataset.inview = String(entry.isIntersecting);
        if (entry.isIntersecting) card.dataset.visible = "true";
      });
      sync();
    }, { threshold: .08 });
    if (!reduced.matches) grid.dataset.enhanced = "true";
    cards.forEach(card => observer.observe(card));
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = event.currentTarget, rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--light-x", `${x * 100}%`);
    card.style.setProperty("--light-y", `${y * 100}%`);
    card.style.setProperty("--tilt-x", `${(.5 - y) * 3}deg`);
    card.style.setProperty("--tilt-y", `${(x - .5) * 4}deg`);
  };
  const leave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--light-x", "50%");
    event.currentTarget.style.setProperty("--light-y", "15%");
  };

  return <section className="section work-section showcase-section" id="work" aria-labelledby="work-heading">
    <div className="section-label"><span>01</span> SELECTED WORK / 代表作品</div>
    <div className="section-heading"><h2 id="work-heading">让 AI 参与研发，<br />让工程约束<span>真正落地。</span></h2><p>从自研开发工作流与企业编码治理，到 Agent 生产化、全栈业务系统和云原生交付。</p></div>
    <div className={`work-grid${showcases.some(entry => entry.members) ? " has-agent-system" : ""}`} ref={gridRef}>
      {showcases.map(({ project, members }, i) => <article className={`work-card${project.featured ? " work-featured workflow-featured" : ""}${members ? " agent-system-featured" : ""}`} key={project.index}
        aria-labelledby={`project-${project.index}`} onPointerMove={move} onPointerLeave={leave}
        style={{ "--accent": tones[projects.indexOf(members?.platform ?? project) % tones.length], "--enter-delay": `${Math.min(i, 2) * 85}ms` } as CSSProperties}>
        <div className="project-surface">
          <div className="work-card-header"><div><span className="work-number">{String(i + 1).padStart(2, "0")}</span><span className="work-category">{project.type}</span></div><Layers aria-hidden="true" /></div>
          {members ? <AgentSystem project={project} platform={members.platform} service={members.service} /> : project.featured ? <AIWorkflow project={project} /> : <><div className="work-visual" aria-hidden="true"><span className="blueprint-caption">ARCHITECTURE <i /> 架构示意</span><Blueprint index={project.index} /></div><div className="work-card-copy"><h3 id={`project-${project.index}`}>{project.title}</h3><p>{project.desc}</p></div></>}
          {!members && <div className="work-card-footer"><div className="work-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><ArrowRight aria-hidden="true" /></div>}
        </div>
      </article>)}
    </div>
  </section>;
}
