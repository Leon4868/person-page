// Presentation-only audience setting. Archived Web3 records remain intact below.
export const showWeb3 = false;
export type Project = {
  index: string; type: string; title: string; desc: string; tags: string[];
  hidden?: boolean; featured?: boolean; subtitle?: string;
};

export const allProjects: Project[] = [
  { index: "03", type: "AI ENGINEERING / WORKFLOW", title: "ith5 · AI 自动开发工作流", subtitle: "AI 研发流水线与工程规范体系", featured: true,
    desc: "自研 13 个 Skill，串联需求拆解、多 Agent 并行开发、双轮审查与动态 QA，让 AI 开发有规范、有门禁、有记忆。", tags: ["Claude Code", "Skill / Subagent", "Go", "React", "TypeScript"] },
  { index: "01", type: "AGENT PLATFORM", title: "企业 AI Agent 中台", desc: "构建有向图与状态机驱动的 Agent Runtime，支持条件分支、重试、人工审批与 Checkpoint。统一 Tool Registry、模型路由、RAG、OpenTelemetry Trace、成本分析和离线评测，以 CI 发布门禁治理生产变更。", tags: ["Mastra", "LangChain", "MCP", "OpenTelemetry"] },
  { index: "02", type: "AI CUSTOMER SERVICE", title: "游戏行业智能客服 Agent", desc: "以 Qwen3 + QLoRA 固化客服风格与流程，用 RAG 承载动态业务知识。接入账号、订单、充值等 Tool 与企业微信客服，使用 Redis + PostgreSQL 管理会话和人工接管上下文，建立评测与数据回流闭环。", tags: ["Qwen3 / QLoRA", "RAG", "Python / FastAPI", "Redis"] },
  { index: "06", type: "AI VIDEO / FULL STACK", title: "AI 寺庙祈福视频生成平台", desc: "独立完成从照片上传、AI 视频生成到转化、下载和数据回传的全栈闭环，接入 Google OAuth。MVP 已上线用于客户演示；以 S3 + CloudFront、Lambda + API Gateway 部署，支持 PR 预览、Canary 灰度及失败回滚。", tags: ["React / Next.js", "TypeScript", "Node.js", "AWS"] },
  { index: "07", type: "OPEN API / RELIABILITY", title: "多端 SDK 与开放接口服务", desc: "基于 Go / Gin 重构原 PHP 服务，统一 App、H5、小程序和渠道接入。建设 OAuth2、HMAC/RSA 签名、防重放与支付回调验签，通过幂等、指数退避、死信队列及定时补偿保证异步业务可靠性。", tags: ["Go / Gin", "Redis / Kafka", "OAuth2", "HMAC / RSA"] },
  { index: "08", type: "AWS / DELIVERY", title: "AWS 云原生部署与自动化交付", desc: "以 ECR + ECS Fargate 运行 Go 服务，通过 API Gateway + Lambda 接入 VPC 内网。使用 GitHub Actions、CodeBuild 与 OIDC 构建交付链，覆盖 PR 独立预览、SAM 灰度回滚、CloudWatch 日志、巡检和告警。", tags: ["ECS / Fargate", "Lambda", "CI/CD", "CloudWatch"] },
  { index: "09", type: "BI / BUSINESS SYSTEMS", title: "BI 数据系统", desc: "面向游戏发行与广告投放构建内部后台，覆盖数据报表、RBAC 权限、财务对账和广告投放。以自动比对生成差异明细，替代逐笔人工对账；对接快手广告 API，实现批量创意生成。", tags: ["Vue / Vite", "PHP", "MySQL", "RBAC"] },
  { index: "04", type: "WEB3 / EDUCATION", title: "Nexora 链上学习凭证", desc: "连接 DApp、Go API、事件 Worker 与 Solidity 合约，以区块确认和状态机保证课程购买、学习解锁与 NFT 证书的一致性。", tags: ["Solidity", "wagmi", "go-ethereum", "AWS"], hidden: !showWeb3 },
  { index: "05", type: "SOLANA PAYMENTS", title: "USDC 收款与订阅网关", desc: "将链上转账封装为支付单、状态机、Webhook、幂等与对账能力，支持 finalized 入账、异常恢复及订阅式周期扣款。", tags: ["Solana Kit", "USDC", "Outbox", "Cloudflare"], hidden: !showWeb3 },
];
export const visibleProjects = allProjects.filter(project => !project.hidden);

// Group the presentation only: both independent source projects remain intact.
export type ProjectShowcase = { project: Project; members?: { platform: Project; service: Project } };
export const agentSystemShowcase: Project = {
  index: "agent-system", type: "AGENT ENGINEERING / PLATFORM × APPLICATION",
  title: "Agent 工程体系｜通用基座 × 智能客服",
  desc: "面向多场景 Agent 扩展，构建可复用的运行与治理基座；结合智能客服独立实践，展示从业务应用到通用架构的工程能力。",
  tags: [],
};
export function groupProjectShowcases(projects: Project[]): ProjectShowcase[] {
  const platform = projects.find(project => project.index === "01");
  const service = projects.find(project => project.index === "02");
  if (!platform || !service) return projects.map(project => ({ project }));
  return projects.flatMap<ProjectShowcase>(project => project === platform
    ? [{ project: agentSystemShowcase, members: { platform, service } }]
    : project === service ? [] : [{ project }]);
}

export const workflowStages = [
  { id: "N1", label: "项目初始化", detail: "规范落地", icon: "layers" },
  { id: "N2", label: "进入 Feature", detail: "任务难度路由", icon: "route" },
  { id: "N3", label: "并行开发", detail: "多工种 Subagent", icon: "network" },
  { id: "N4", label: "双轮审查", detail: "自审与跨模型验证", icon: "shield" },
  { id: "N5", label: "完成与记忆", detail: "任务标记 · Memory", icon: "memory" },
  { id: "N6", label: "风险 QA", detail: "按风险评分触发", icon: "test" },
  { id: "N7", label: "上下文管理", detail: "清理与重载", icon: "context" },
  { id: "N8", label: "流程完成", detail: "完成确认", icon: "complete" },
];
export const workflowHighlights = [
  { title: "13 个 Skill · 8 节点编排", detail: "构建需求文档、开发规格、规范落地、编码、双轮审查、QA 与文档同步的研发闭环；前端、后端、数据库和契约工种并行执行，QA 按风险评分动态触发。" },
  { title: "基线 / 落地 / 流程", detail: "设计三层规范架构，以设计文档正推新项目规范，解决无代码与无规范的循环依赖；项目副本可独立演化，本地规则允许偏离全局基线。" },
  { title: "上下文成本工程", detail: "定位路径作用域字段误用，重划跨切面常驻规则与领域按需加载规则，消除 Subagent 规范重复加载。10 份规范的常驻上下文由 18,889 降至 2,998 token；全栈加载场景不承诺等幅下降。" },
  { title: "契约分层与真实项目验证", detail: "抽离响应结构、错误码、日志字段和链路透传契约，让 Node / Go 实现层只描述本语言落地方式。在 gin-react-admin 验证中暴露并修复基线照搬问题，确立“规范描述现状、缺口描述目标”的生成原则。" },
];

export const workflowResumeHighlights = [
  { title: "工作流产品化", detail: "将 13 个 Skill、8 节点研发闭环接入中台，覆盖需求拆解、并行开发、双轮审查与动态 QA。" },
  { title: "企业级交付", detail: "构建云端控制面、Go CLI 与 Hook，统一版本、权限、零下载回滚及分级审计。" },
  { title: "低门槛接入", detail: "新人通过 3 条命令完成安装、认证和 Skill 同步，完整流程约 5.6 秒。" },
];

export const experience = [
  ["2026.03 — NOW", "广州瑞昱科技有限公司", "AI 全栈开发", "建设企业级智能客服、RAG 知识库、意图路由与人工接管，以及游戏开放平台。推动 AI 编程工具、上下文规范与代码审查清单在团队落地。"],
  ["2025.05 — 2026.03", "广州优游信息科技有限公司", "AI 全栈工程师", "重构 BI 数据平台、多端 SDK 与开放 API 服务，建设签名验签、幂等、异步补偿和全链路日志，完善 Docker / Nginx / CI/CD 交付流程。"],
  ["2022.07 — 2025.02", "广州云流区块链科技有限公司", showWeb3 ? "Web3 全栈开发" : "Web 全栈开发", showWeb3 ? "负责用户端、运营后台、Go 服务与链上交互，打通钱包连接、交易确认和后台管理闭环。" : "建设用户端、运营后台与 Go / Gin、NestJS 服务，沉淀用户认证、RBAC 权限、业务配置、缓存、数据统计、审计日志和 API 规范。"],
  ["2019.03 — 2022.03", "广州大千文化科技公司", "高级前端开发", "主导多端项目技术规划、架构设计、核心研发和前端工程化，沉淀通用组件与业务模板，承担方案评审与 Code Review。"],
  ["2016.09 — 2019.03", "互联网 / 游戏行业", "Web 前端工程师", "从 Web、H5 与游戏运营后台出发，持续积累组件化、性能优化与跨团队交付经验。"],
];

export const identityRoles = [
  { id: "agent", label: "AI Agent", title: "AI Agent 工程师", icon: "bot", tone: "114, 209, 239", summary: "把模型能力接入真实业务，构建可编排、可追踪、可评测的 Agent 系统。", skills: ["Agent Runtime", "RAG / Tool Calling", "模型微调与评测"] },
  { id: "fullstack", label: "全栈开发", title: "AI 全栈开发工程师", icon: "code", tone: "141, 164, 255", summary: "连接前端交互、后端服务与云原生交付，将复杂业务落成完整产品。", skills: ["React / Next.js", "Go / Gin", "AWS / CI/CD"] },
  { id: "workflow", label: "AI Workflow", title: "AI 研发工作流构建者", icon: "workflow", tone: "192, 148, 250", summary: "自研 ith5 多 Agent 研发工作流，沉淀工程规范、上下文管理、代码审查与 QA。", skills: ["13 个 Skill", "Subagent 并行编排", "规范 / 审查 / QA"] },
];

const careerHighlights: Record<string, { stage: string; contribution: string; skills: string[]; icon: string }> = {
  "2016": { stage: "前端工程", contribution: "围绕 Web、H5 与游戏后台，积累组件化与性能优化实践。", skills: ["Web / H5", "组件化", "性能优化"], icon: "code" },
  "2019": { stage: "前端架构", contribution: "沉淀通用组件与业务模板，承担多端技术规划和方案评审。", skills: ["多端架构", "工程化", "Code Review"], icon: "layers" },
  "2022": { stage: "全栈系统", contribution: "打通用户端、运营后台与 Go / NestJS 服务，沉淀业务通用能力。", skills: ["Go / Gin", "NestJS", "RBAC / API"], icon: "server" },
  "2025": { stage: "可靠交付", contribution: "重构 BI 与开放 API，完善鉴权、异步补偿和全链路日志。", skills: ["开放 API", "幂等 / 补偿", "CI/CD"], icon: "cloud" },
  "2026": { stage: "AI 研发工程", contribution: "建设智能客服与游戏开放平台，推动 AI 编程规范和审查在团队落地。", skills: ["Agent / RAG", "AI 编程", "上下文规范"], icon: "bot" },
};
// Keep original employment records unchanged; present the journey chronologically.
export const careerChapters = [...experience].reverse().map(([period, company, role, detail]) => {
  const year = period.slice(0, 4);
  return { id: `career-${year}`, year, period, company, role, detail, ...careerHighlights[year] };
});
