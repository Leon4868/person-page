export type Point3 = { x: number; y: number; z: number };
export type ProjectedPoint = { x: number; y: number; scale: number; depth: number };
export type Skill = { id: string; label: string; icon: string; image?: string; detail?: string; point: Point3 };
export type KnowledgeGroup = {
  id: string; title: string; subtitle: string; color: string; icon: string; point: Point3; skills: Skill[]; hidden?: boolean;
};

export const corePoint: Point3 = { x: 720, y: 450, z: 95 };
export const allKnowledgeGroups: KnowledgeGroup[] = [
  {
    id: "ai", title: "AI / Agent", subtitle: "智能体工程", color: "177, 137, 255", icon: "brain", point: { x: 350, y: 230, z: 48 },
    skills: [
      { id: "runtime", label: "Agent Runtime", icon: "bot", detail: "Mastra / LangChain · 状态机、Checkpoint、异常恢复与人工审批。", point: { x: 125, y: 100, z: 25 } },
      { id: "rag", label: "RAG / Rerank", icon: "search", detail: "数据脱敏、文档分块、Embedding、混合召回、Rerank 与引用生成。", point: { x: 295, y: 60, z: 55 } },
      { id: "qlora", label: "Qwen3 / QLoRA", icon: "sliders", detail: "LLaMA-Factory、QLoRA 4-bit 微调、本地模型部署；Python / FastAPI 服务。", point: { x: 485, y: 115, z: 25 } },
      { id: "tools", label: "Tool Calling", icon: "wrench", detail: "Tool Registry、Schema 校验、权限、幂等、超时与失败重试。", point: { x: 130, y: 265, z: 45 } },
      { id: "mcp", label: "MCP / Memory", icon: "plug", detail: "MCP 工具接入、多轮会话状态、上下文压缩与 Memory 管理。", point: { x: 250, y: 390, z: 12 } },
      { id: "evaluation", label: "Evaluation", icon: "shield", detail: "离线评测、RAG Recall@K、LLM-as-Judge、bad case 归因与 CI 回归门禁。", point: { x: 485, y: 370, z: 35 } },
    ],
  },
  {
    id: "fullstack", title: "Full Stack", subtitle: "全栈开发", color: "101, 186, 255", icon: "code", point: { x: 1090, y: 230, z: 40 },
    skills: [
      { id: "react", label: "React / Next.js", icon: "code", image: "/tech-react.svg", detail: "组件化、状态管理、Monorepo、前端架构与性能优化。", point: { x: 970, y: 70, z: 32 } },
      { id: "testing", label: "自动化测试", icon: "test", detail: "Jest / Vitest、Playwright、BackstopJS；功能测试、E2E 与视觉回归。", point: { x: 1160, y: 75, z: 55 } },
      { id: "typescript", label: "TypeScript", icon: "filecode", detail: "类型化接口、前后端契约、Vite / Webpack 构建与工程化。", point: { x: 1310, y: 165, z: 10 } },
      { id: "go", label: "Go / Gin", icon: "server", image: "/tech-go.svg", detail: "Go API、CLI 与 Hook 二进制；安全鉴权、幂等、异步任务与跨平台交付。", point: { x: 1310, y: 325, z: 30 } },
      { id: "node", label: "Node / NestJS", icon: "server", detail: "NestJS / Fastify、REST API、IoC、ORM 与跨语言后端契约。", point: { x: 1140, y: 410, z: 15 } },
      { id: "postgres", label: "PostgreSQL / Redis", icon: "database", detail: "PostgreSQL / Aurora、MySQL、Redis；原生 SQL、事务、缓存与会话状态。", point: { x: 950, y: 370, z: 30 } },
    ],
  },
  {
    id: "cloud", title: "Cloud Native", subtitle: "云原生交付", color: "101, 222, 201", icon: "cloud", point: { x: 350, y: 655, z: 35 },
    skills: [
      { id: "aws", label: "AWS / Serverless", icon: "cloud", detail: "VPC、Lambda、API Gateway、S3 / CloudFront、RDS / Aurora 与 KMS。", point: { x: 130, y: 575, z: 20 } },
      { id: "docker", label: "Docker / ECS", icon: "container", detail: "ECR、ECS Fargate、Cloud Map 服务发现与容器化 Go 服务。", point: { x: 290, y: 510, z: 22 } },
      { id: "cicd", label: "CI/CD / Preview", icon: "branches", detail: "GitHub Actions、CodeBuild、IAM Role / OIDC；PR 预览环境自动创建与销毁。", point: { x: 485, y: 555, z: 35 } },
      { id: "observability", label: "可观测性", icon: "activity", detail: "OpenTelemetry Trace、CloudWatch Logs、Synthetics、健康检查与监控告警。", point: { x: 485, y: 775, z: 20 } },
      { id: "canary", label: "Canary / 回滚", icon: "rocket", detail: "SAM 灰度发布、失败自动回滚与上线后巡检。", point: { x: 285, y: 825, z: 18 } },
      { id: "queue", label: "SQS / DLQ", icon: "inbox", detail: "异步解耦、指数退避、死信队列、定时补偿与业务幂等。", point: { x: 120, y: 775, z: 28 } },
    ],
  },
  {
    id: "web3", title: "Web3", subtitle: "链上应用开发", color: "231, 162, 255", icon: "blocks", point: { x: 1090, y: 655, z: 48 }, hidden: true,
    skills: [
      { id: "solidity", label: "Solidity", icon: "filecode", point: { x: 950, y: 540, z: 18 } },
      { id: "foundry", label: "Foundry", icon: "hammer", point: { x: 1145, y: 515, z: 40 } },
      { id: "wagmi", label: "wagmi / viem", icon: "wallet", point: { x: 1310, y: 575, z: 12 } },
      { id: "geth", label: "go-ethereum", icon: "hexagon", point: { x: 1320, y: 765, z: 20 } },
      { id: "solana", label: "Solana", icon: "layers", point: { x: 1140, y: 830, z: 22 } },
      { id: "sync", label: "On-chain Sync", icon: "sync", point: { x: 955, y: 800, z: 18 } },
    ],
  },
  {
    id: "workflow", title: "AI Workflow", subtitle: "AI 研发工程", color: "231, 162, 255", icon: "workflow", point: { x: 1090, y: 655, z: 48 },
    skills: [
      { id: "claude", label: "Claude Code", icon: "terminal", detail: "自研 13 个 Skill；以 Skill / Command / Hooks 连接工作流执行和中台分发审计。", point: { x: 950, y: 540, z: 18 } },
      { id: "subagents", label: "Subagent 编排", icon: "network", detail: "N1–N8 自动开发编排；前端、后端、数据库与契约工种并行开发。", point: { x: 1145, y: 515, z: 40 } },
      { id: "standards", label: "三层规范架构", icon: "layers", detail: "基线 / 落地 / 流程分层，设计文档驱动种子规范，项目副本允许本地偏离。", point: { x: 1310, y: 575, z: 12 } },
      { id: "context", label: "上下文工程", icon: "sliders", detail: "按任务范围加载、跨切面与领域规则分档；常驻上下文 18,889 → 2,998 token。", point: { x: 1320, y: 765, z: 20 } },
      { id: "review", label: "双轮审查 / QA", icon: "shield", detail: "自审、跨模型验证、风险评分驱动 QA；通过自动化检查落实工程规范。", point: { x: 1140, y: 830, z: 22 } },
      { id: "contract", label: "契约与文档同步", icon: "filecode", detail: "Node / Go 共用后端契约；README / rules 同步，规范写现状、缺口写目标。", point: { x: 955, y: 800, z: 18 } },
    ],
  },
];

// Web3 is archived, not deleted. Reintroducing its branch also requires assigning a free layout slot.
export const knowledgeGroups = allKnowledgeGroups.filter(group => !group.hidden);

export const knowledgeNodes = [
  { id: "core", point: corePoint },
  ...knowledgeGroups.flatMap(group => [{ id: group.id, point: group.point }, ...group.skills]),
];
export const knowledgeEdges = knowledgeGroups.flatMap(group => [
  { id: `core-${group.id}`, group: group.id, from: "core", to: group.id },
  ...group.skills.map(skill => ({ id: `${group.id}-${skill.id}`, group: group.id, from: group.id, to: skill.id })),
]);

// Nodes and connections share one perspective projection, so depth never detaches a line.
export function projectPoint(point: Point3, yaw = 0, pitch = 0): ProjectedPoint {
  const x = point.x - 720;
  const y = point.y - 450;
  const rotatedX = x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const rotatedZ = -x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const rotatedY = y * Math.cos(pitch) - rotatedZ * Math.sin(pitch);
  const depth = y * Math.sin(pitch) + rotatedZ * Math.cos(pitch);
  const scale = 1100 / (1100 - depth);
  return { x: 720 + rotatedX * scale, y: 450 + rotatedY * scale, scale, depth };
}

export function connectionPath(a: ProjectedPoint, b: ProjectedPoint): string {
  return `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + (b.x > a.x ? 12 : -12)} ${b.x} ${b.y}`;
}
