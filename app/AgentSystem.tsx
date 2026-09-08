import { ArrowDown, ArrowRight, Bot, ChartNoAxesCombined, Cpu, Database, GitBranch, Layers, MessageSquare, Network, ShieldCheck, Users, Workflow } from "lucide-react";
import { type Project } from "./portfolio-content";
import "./agent-system.css";

export default function AgentSystem({ project, platform, service }: { project: Project; platform: Project; service: Project }) {
  return <div className="agent-system">
    <header className="agent-system-heading work-card-copy"><span className="agent-system-scope"><Layers size={14} aria-hidden="true" />两个独立项目 · 架构抽象与业务落地</span><h3 id={`project-${project.index}`}>{project.title}</h3><p>{project.desc}</p></header>
    <div className="agent-system-panels">
      <div className="agent-system-panel agent-system-platform" role="group" aria-labelledby={`project-${platform.index}`} data-independent-project={platform.index}>
        <div className="agent-system-panel-heading"><span className="agent-system-icon"><Network aria-hidden="true" /></span><div><span>独立项目 A · 通用基座</span><h4 id={`project-${platform.index}`}>{platform.title}</h4></div></div>
        <p className="agent-system-purpose">让新 Agent 的扩展，建立在可复用的运行与治理能力之上。</p>
        <figure className="agent-platform-diagram" aria-label="通用 Agent 基座能力架构示意">
          <figcaption>可扩展运行基座 <span>ARCHITECTURE</span></figcaption>
          <div className="agent-runtime"><span className="agent-runtime-icon"><Cpu aria-hidden="true" /></span><div><strong>Agent Runtime</strong><span>有向图编排 · 状态机</span></div><GitBranch aria-hidden="true" /></div>
          <div className="agent-foundation-bus" aria-hidden="true"><i /></div>
          <div className="agent-foundation-modules"><span><Workflow aria-hidden="true" />工具注册<small>Tool Registry</small></span><span><Layers aria-hidden="true" />模型路由<small>Model Routing</small></span><span><Database aria-hidden="true" />知识检索<small>RAG</small></span></div>
          <div className="agent-foundation-governance"><ShieldCheck aria-hidden="true" /><span>Checkpoint · 重试 · 人工审批</span></div>
        </figure>
        <ul className="agent-system-highlights"><li><GitBranch aria-hidden="true" /><div><strong>可复用的执行能力</strong><p>统一编排、工具与模型接口，支持条件分支、重试和状态恢复。</p></div></li><li><ChartNoAxesCombined aria-hidden="true" /><div><strong>可观测的质量治理</strong><p>串联 OpenTelemetry Trace、成本分析与离线评测，以 CI 门禁约束发布。</p></div></li></ul>
        <div className="agent-system-tags" aria-label="通用基座技术栈">{platform.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>

      <div className="agent-system-panel agent-system-service" role="group" aria-labelledby={`project-${service.index}`} data-independent-project={service.index}>
        <div className="agent-system-panel-heading"><span className="agent-system-icon"><MessageSquare aria-hidden="true" /></span><div><span>独立项目 B · 业务实践</span><h4 id={`project-${service.index}`}>{service.title}</h4></div></div>
        <p className="agent-system-purpose">覆盖知识问答、业务查询与人工协同，打通客服处理闭环。</p>
        <figure className="agent-service-diagram" aria-label="智能客服独立项目的业务流程示意">
          <figcaption>智能客服业务闭环 <span>BUSINESS FLOW</span></figcaption>
          <ol className="agent-service-route"><li><MessageSquare aria-hidden="true" /><span>用户咨询<small>企业微信客服</small></span><ArrowRight className="agent-route-arrow" aria-hidden="true" /></li><li><Bot aria-hidden="true" /><span>意图路由<small>Qwen3 + QLoRA</small></span><ArrowRight className="agent-route-arrow" aria-hidden="true" /></li><li><Workflow aria-hidden="true" /><span>任务处理<small>RAG / Tools</small></span></li></ol>
          <ArrowDown className="agent-service-down" aria-hidden="true" />
          <div className="agent-service-outcomes"><span><Database aria-hidden="true" />知识问答 / 业务查询<small>账号 · 订单 · 充值</small></span><span><Users aria-hidden="true" />人工接管<small>保留会话上下文</small></span></div>
          <div className="agent-service-memory"><Database aria-hidden="true" /><span>Redis + PostgreSQL · 会话与上下文管理</span></div>
        </figure>
        <ul className="agent-system-highlights"><li><Bot aria-hidden="true" /><div><strong>模型与业务知识协同</strong><p>以 Qwen3 + QLoRA 固化客服风格与流程，用 RAG 承载动态业务知识。</p></div></li><li><Users aria-hidden="true" /><div><strong>工具调用与人工协同</strong><p>连接账号、订单和充值工具，保留人工接管上下文，建立评测与数据回流。</p></div></li></ul>
        <div className="agent-system-tags" aria-label="智能客服技术栈">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
    </div>
    <p className="agent-system-boundary"><Layers size={15} aria-hidden="true" />两项独立实践，分别呈现通用基座能力与客服场景落地；组合展示不代表已完成系统接入。</p>
  </div>;
}
