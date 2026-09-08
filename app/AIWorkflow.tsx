"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, Bot, Brain, Check, Cloud, Code2, FileText, FolderCog, GitBranch, PackageCheck, Route, ShieldCheck, Sparkles, TestTube2 } from "lucide-react";
import { workflowStages, type Project } from "./portfolio-content";
import { workflowEdges, workflowPath, type FlowNodeId } from "./workflow-graph";
import "./ai-workflow.css";

const governance = [
  { id: "router", icon: Route, label: "难度路由", english: "ROUTER", detail: "按任务复杂度分配策略", tags: ["低", "中", "高"] },
  { id: "review", icon: ShieldCheck, label: "代码审查门", english: "CODEX CR", detail: "自审 + 跨模型双轮审查", tags: ["ALLOW", "BLOCK"] },
  { id: "qa", icon: TestTube2, label: "质量评估", english: "RISK-BASED QA", detail: "按风险评分动态触发", tags: ["功能", "回归", "安全"] },
  { id: "memory", icon: Brain, label: "记忆闭环", english: "MEMORY", detail: "沉淀经验，复用于后续任务", tags: ["经验", "规范", "上下文"] },
  { id: "delivery", icon: PackageCheck, label: "交付成果", english: "DELIVERY", detail: "从生成代码，到可交付成果", tags: ["代码", "测试", "文档"] },
] as const;

export default function AIWorkflow({ project }: { project: Project }) {
  const graphRef = useRef<HTMLDivElement>(null);
  const arrowId = `workflow-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const nodes = new Map([...graph.querySelectorAll<HTMLElement>("[data-flow-node]")].map(node => [node.dataset.flowNode as FlowNodeId, node]));
    const paths = [...graph.querySelectorAll<SVGPathElement>("[data-flow-edge]")];
    const narrow = matchMedia("(max-width: 1100px)");
    const update = () => {
      const origin = graph.getBoundingClientRect();
      if (!origin.width || !origin.height) return;
      for (const path of paths) {
        const edge = workflowEdges[Number(path.dataset.flowEdge)];
        const from = nodes.get(edge.from), to = nodes.get(edge.to);
        if (!from || !to) continue;
        const rect = (node: HTMLElement) => {
          const box = node.getBoundingClientRect();
          return { x: box.left - origin.left, y: box.top - origin.top, width: box.width, height: box.height };
        };
        path.setAttribute("d", workflowPath(rect(from), rect(to), edge.kind, narrow.matches, origin.width, origin.height));
      }
      graph.dataset.connected = "true";
    };
    const observer = new ResizeObserver(update);
    observer.observe(graph);
    nodes.forEach(node => observer.observe(node));
    narrow.addEventListener("change", update);
    update();
    return () => { observer.disconnect(); narrow.removeEventListener("change", update); };
  }, []);

  return <div className="ai-workflow">
    <header className="ai-workflow-heading">
      <div className="work-card-copy"><p className="ai-workflow-eyebrow"><Sparkles size={14} aria-hidden="true" /> 自研 AI 研发流水线与工程规范体系 · 个人项目 · 2026</p><h3 id={`project-${project.index}`}>{project.title}</h3><p>{project.desc}</p></div>
      <div className="ai-workflow-metrics"><span><strong>13</strong> SKILLS</span><span><strong>8</strong> 编排节点</span></div>
    </header>

    <figure className="ai-workflow-figure" aria-labelledby="ai-workflow-caption">
      <figcaption id="ai-workflow-caption"><span><GitBranch size={15} aria-hidden="true" /> 从初始化到交付，AI 驱动开发闭环</span><small>能力编排示意 · 非实时执行状态</small></figcaption>
      <div className="ai-flow-canvas" ref={graphRef}>
        <svg className="ai-flow-connections" aria-hidden="true">
          <defs>{["forward", "return"].map(kind => <marker id={`${arrowId}-${kind}`} key={kind} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 7 3.5 L 0 7 Z" fill={kind === "return" ? "#e493bf" : "#8ad9ed"} /></marker>)}</defs>
          {workflowEdges.map((edge, i) => <g key={`${edge.from}-${edge.to}`} className={`ai-flow-edge${edge.kind === "return" ? " is-return" : ""}`}>
            <path className="ai-flow-track" data-flow-edge={i} data-from={edge.from} data-to={edge.to} markerEnd={`url(#${arrowId}-${edge.kind === "return" ? "return" : "forward"})`} />
            <path className="ai-flow-signal" data-flow-edge={i} style={{ animationDelay: `${i * -.6}s` }} />
          </g>)}
        </svg>

        <ol className="ai-flow-entry">
          <li className="ai-flow-node ai-flow-init" data-flow-node="init">
            <div className="ai-flow-node-top"><span className="ai-flow-icon"><FolderCog aria-hidden="true" /></span><span className="ai-flow-step">01 / INITIALIZE</span></div>
            <code>/ith5:init</code><h4>项目初始化</h4><p>建立项目上下文与工程规范</p>
            <div className="ai-flow-checks"><span><Check aria-hidden="true" />项目检查</span><span><Check aria-hidden="true" />环境就绪</span></div>
            <div className="ai-flow-artifacts"><span>.claude/</span><span>.rules/</span><span>CLAUDE.md</span></div>
            <ArrowRight className="ai-flow-fallback" aria-hidden="true" />
          </li>
          <li className="ai-flow-node ai-flow-prd" data-flow-node="prd">
            <div className="ai-flow-node-top"><span className="ai-flow-icon"><FileText aria-hidden="true" /></span><span className="ai-flow-step">02 / SPECIFY</span></div>
            <code>/ith5:prd</code><h4>需求生成</h4><p>把想法转为可执行的开发规格</p>
            <div className="ai-flow-documents">{["PRD", "SPEC", "TASKS"].map(doc => <span key={doc}><FileText aria-hidden="true" /><b>{doc}</b><i /><i /></span>)}</div>
            <ArrowRight className="ai-flow-fallback" aria-hidden="true" />
          </li>
          <li className="ai-flow-node ai-flow-auto" data-flow-node="auto">
            <div className="ai-flow-node-top"><span className="ai-flow-icon"><Bot aria-hidden="true" /></span><span className="ai-flow-step">03 / ORCHESTRATE</span></div>
            <code>/ith5:ai</code><h4>多 Agent 自动开发</h4><p>前端 · 后端 · 数据库 · 契约并行协作</p>
            <ol className="ai-flow-engine" aria-label="N1—N8 内部编排节点">{workflowStages.map((stage, i) => <li key={stage.id} title={`${stage.label} · ${stage.detail}`} aria-label={`${stage.id} ${stage.label} · ${stage.detail}`} style={{ "--engine-delay": `${i * .45}s` } as CSSProperties}><Code2 aria-hidden="true" /><span>{stage.id}</span></li>)}</ol>
            <ArrowDown className="ai-flow-fallback" aria-hidden="true" />
          </li>
        </ol>

        <div className="ai-flow-lane-label"><ArrowDown size={13} aria-hidden="true" /> 执行内核展开 · 路由 / 审查 / 质量 / 记忆</div>
        <ol className="ai-flow-governance" aria-label="执行与质量治理关系">
          {governance.map(({ id, icon: Icon, label, english, detail, tags }) => <li key={id} className={`ai-flow-node ai-flow-${id}`} data-flow-node={id}>
            <span className="ai-flow-icon"><Icon aria-hidden="true" /></span><div className="ai-flow-governance-copy"><span className="ai-flow-step">{english}</span><h4>{label}</h4><p>{detail}</p><div className="ai-flow-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            {id !== "delivery" && <ArrowRight className="ai-flow-fallback" aria-hidden="true" />}
          </li>)}
        </ol>
        <div className="ai-flow-return-label"><GitBranch size={13} aria-hidden="true" /><span>BLOCK → 返回自动开发，修复后重新审查</span></div>
      </div>
      <div className="ai-workflow-capabilities"><span><Bot aria-hidden="true" />多 Agent 编排</span><span><ShieldCheck aria-hidden="true" />质量门禁与修复闭环</span><span><Brain aria-hidden="true" />规范与上下文工程</span></div>
    </figure>

    <aside className="ai-workflow-extension" aria-label="基于工作流的中台分发能力">
      <div className="ai-workflow-extension-icon"><Cloud aria-hidden="true" /><ArrowDown size={14} aria-hidden="true" /></div>
      <div><span className="ai-workflow-extension-label">基于这套工作流，延伸团队分发能力</span><h4>企业 AI 编码配置中台</h4><p>将 Skill / Command 版本化下发，统一权限与零下载回滚；通过 Go CLI + Hook 完成本地同步和执行审计。</p></div>
      <div className="ai-workflow-distribute"><span>自研工作流</span><ArrowRight aria-hidden="true" /><span>中台分发</span><ArrowRight aria-hidden="true" /><span>团队复用</span></div>
    </aside>
    <p className="ai-workflow-evidence">已验证：Go + React 全栈项目规范对齐；新项目种子模式的端到端验证仍在推进。</p>
  </div>;
}
