import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import ts from "typescript";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the completed portfolio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>徐小龙 · AI 全栈 \/ Agent 工程师<\/title>/i);

  for (const copy of [
    "I BUILD DIGITAL",
    "EXPERIENCES.",
    "React",
    "Go",
    "Python",
    "Cloud",
    "Agent",
    "Better",
    "核心能力图谱",
    "职业履历",
  ]) {
    assert.match(html, new RegExp(copy));
  }

  for (const id of ["home", "work", "skills", "experience", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }

  assert.doesNotMatch(html, /id=["']about["']|href=["']#about["']|ABOUT \/ 基础信息/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships local visual assets and an accessible technology list", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /aria-label="核心技术栈"/);
  assert.equal((html.match(/role="listitem"/g) ?? []).length, 5);
  assert.match(html, /href="mailto:ith5cn@163.com"/);
  assert.match(html, /href="#work"/);
  assert.doesNotMatch(html, /class="energy-path"/);
  await Promise.all([
    "hero-environment-v2.png", "tech-react.svg", "tech-go.svg", "tech-python.svg",
  ].map(file => access(new URL(`../public/${file}`, import.meta.url))));
});

test("renders a decorative pointer trail with bounded reusable icon nodes", async () => {
  const html = await (await render()).text();
  const trail = html.match(/<div[^>]*class="pointer-trail"[\s\S]*?<\/div>/)?.[0];
  assert.ok(trail);
  assert.match(trail, /aria-hidden="true"/);
  assert.equal((trail.match(/class="pointer-trail-icon"/g) ?? []).length, 12);

  const source = await readFile(new URL("../app/pointer-trail.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const { trailSamples, TRAIL_SPACING, MAX_TRAIL_SAMPLES } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  assert.deepEqual(trailSamples({ x: 0, y: 0 }, { x: TRAIL_SPACING - 1, y: 0 }), []);
  const samples = trailSamples({ x: 0, y: 0 }, { x: 400, y: 200 });
  assert.equal(samples.length, MAX_TRAIL_SAMPLES);
  assert.deepEqual(samples.at(-1), { x: 400, y: 200 });

  const css = await readFile(new URL("../app/pointer-trail.css", import.meta.url), "utf8");
  for (const copy of ["pointer: coarse", "prefers-reduced-motion", "@media print", "pointer-events: none"]) assert.ok(css.includes(copy), copy);
});

test("keeps complete hero copy accessible before motion starts", async () => {
  const html = await (await render()).text();
  assert.match(html, /<h1[^>]+aria-label="I BUILD DIGITAL EXPERIENCES\."/);
  assert.match(html, /AI FULL-STACK DEVELOPER {2}× {2}AGENT ENGINEER/);
  assert.match(html, /class="copy-sr-only">10\+<\/span>/);
  assert.match(html, /class="copy-sr-only">20\+<\/span>/);
  assert.match(html, /href="#work"[^>]*>查看代表作品/);
  assert.match(html, /href="mailto:ith5cn@163.com"[^>]*>和我聊聊/);
});

test("shows seven independent projects in six showcase cards, with the workflow first", async () => {
  const html = await (await render()).text();
  const work = html.match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0];
  assert.ok(work);
  assert.equal((work.match(/<article[^>]*aria-labelledby="project-/g) ?? []).length, 6);
  for (const title of ["企业 AI Agent 中台", "游戏行业智能客服 Agent", "企业 AI 编码配置中台", "AI 寺庙祈福视频生成平台", "多端 SDK 与开放接口服务", "AWS 云原生部署与自动化交付", "BI 数据系统"]) {
    assert.ok(work.includes(title));
  }
  for (const detail of ["离线评测", "人工接管", "零下载回滚", "PR 预览", "HMAC/RSA", "RBAC"]) {
    assert.ok(work.includes(detail));
  }
  assert.ok(work.includes("架构示意"));
  assert.ok(work.indexOf('aria-labelledby="project-03"') < work.indexOf('aria-labelledby="project-agent-system"'));
  assert.doesNotMatch(work, /Nexora|USDC|Solana|WEB3|NFT 证书/);
  assert.doesNotMatch(work, /<a\s/); // No invented project URLs or placeholder links.
});

test("combines Agent projects visually while preserving their distinct identities and technical stacks", async () => {
  const html = await (await render()).text();
  const card = html.match(/<article[^>]*aria-labelledby="project-agent-system"[\s\S]*?<\/article>/)?.[0];
  assert.ok(card);
  assert.match(card, /class="work-number">02<\/span>/);
  assert.equal((card.match(/data-independent-project=/g) ?? []).length, 2);
  assert.equal((card.match(/<figure\b/g) ?? []).length, 2);
  for (const copy of ["Agent 工程体系｜通用基座 × 智能客服", "独立项目 A · 通用基座", "独立项目 B · 业务实践", "企业 AI Agent 中台", "游戏行业智能客服 Agent", "Agent Runtime", "Checkpoint", "Tool Registry", "离线评测", "Qwen3 + QLoRA", "人工接管", "Redis + PostgreSQL", "Mastra", "LangChain", "Python / FastAPI", "组合展示不代表已完成系统接入"]) assert.ok(card.includes(copy), copy);
  for (const id of ["01", "02"]) assert.equal((html.match(new RegExp(`id="project-${id}"`, "g")) ?? []).length, 1);
  assert.doesNotMatch(card, /<a\s|<details\b|已接入中台|基于该中台上线/);
  const regularCards = [...html.matchAll(/<article[^>]*aria-labelledby="project-(06|07|08|09)"[\s\S]*?<\/article>/g)];
  assert.equal(regularCards.length, 4);
  regularCards.forEach((match, i) => assert.ok(match[0].includes(`class="work-number">0${i + 3}</span>`)));
});

test("presentation grouping keeps original records intact and falls back if either member is absent", async () => {
  const source = await readFile(new URL("../app/portfolio-content.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const { allProjects, visibleProjects, groupProjectShowcases } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  const snapshot = JSON.stringify(allProjects);
  const entries = groupProjectShowcases(visibleProjects);
  assert.equal(entries.length, 6);
  assert.deepEqual(entries.map(entry => entry.project.index), ["03", "agent-system", "06", "07", "08", "09"]);
  assert.equal(entries[1].members.platform, allProjects.find(project => project.index === "01"));
  assert.equal(entries[1].members.service, allProjects.find(project => project.index === "02"));
  for (const absent of ["01", "02"]) {
    const subset = visibleProjects.filter(project => project.index !== absent);
    assert.deepEqual(groupProjectShowcases(subset).map(entry => entry.project), subset);
    assert.ok(groupProjectShowcases(subset).every(entry => !entry.members));
  }
  assert.deepEqual(groupProjectShowcases([]), []);
  assert.equal(groupProjectShowcases(allProjects).length, 8); // Archived Web3 can still be restored.
  assert.equal(JSON.stringify(allProjects), snapshot);
});

const modelSource = await readFile(new URL("../app/knowledge-model.ts", import.meta.url), "utf8");
const modelJs = ts.transpileModule(modelSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { allKnowledgeGroups, knowledgeGroups, knowledgeNodes, knowledgeEdges, projectPoint, connectionPath } = await import(`data:text/javascript;base64,${Buffer.from(modelJs).toString("base64")}`);

test("connects four accessible role hubs to 24 skills including AI engineering", async () => {
  const html = await (await render()).text();
  const skills = html.match(/<section[^>]*id="skills"[\s\S]*?<\/section>/)?.[0];
  assert.ok(skills);
  assert.equal((skills.match(/data-role=/g) ?? []).length, 4);
  assert.equal((skills.match(/data-skill=/g) ?? []).length, 24);
  assert.equal((skills.match(/data-from=/g) ?? []).length, 28);
  assert.equal((skills.match(/aria-pressed="false"/g) ?? []).length, 28);
  for (const group of knowledgeGroups) {
    assert.ok(skills.includes(`aria-labelledby="knowledge-role-${group.id}"`));
    assert.equal(group.skills.length, 6);
    for (const skill of group.skills) {
      assert.ok(skills.includes(`aria-label="${skill.label} · ${group.subtitle}"`));
      assert.ok(skills.includes(`data-from="${group.id}" data-to="${skill.id}"`));
      if (skill.image) await access(new URL(`../public${skill.image}`, import.meta.url));
    }
  }
  assert.doesNotMatch(skills, /capability-group|class="orbit|<a\s/);
  assert.match(skills, /role="status"/);
  assert.ok(skills.includes('data-role="workflow"'));
  for (const label of ["Claude Code", "Subagent 编排", "三层规范架构", "上下文工程", "双轮审查 / QA", "契约与文档同步"]) assert.ok(skills.includes(label));
  assert.doesNotMatch(skills, /Web3|Solidity|Foundry|wagmi|go-ethereum|Solana|On-chain Sync/);
});

test("explains the workflow and downstream distribution without overstating evidence", async () => {
  const html = await (await render()).text();
  for (const copy of ["AI 研发流水线与工程规范体系", "个人项目 · 2026", "N1—N8", "种子模式的端到端验证仍在推进", "Go CLI + Hook", "基于这套工作流，延伸团队分发能力"]) assert.ok(html.includes(copy), copy);
  assert.doesNotMatch(html, /77%|84\.1%|Web3 全栈开发|钱包连接|链上交互/);
  assert.ok(html.includes("广州云流区块链科技有限公司"));
  assert.ok(html.includes("2022.07 — 2025.02"));
});

test("shows the workflow diagram directly, with review feedback and secondary distribution", async () => {
  const html = await (await render()).text();
  const card = html.match(/<article[^>]*aria-labelledby="project-03"[\s\S]*?<\/article>/)?.[0];
  assert.ok(card);
  assert.doesNotMatch(card, /<details\b|<summary\b|查看技术细节|收起技术细节/);
  for (const copy of ["ith5 · AI 自动开发工作流", "13 个 Skill", "/ith5:init", "/ith5:prd", "/ith5:ai", "多 Agent 自动开发", "难度路由", "代码审查门", "质量评估", "记忆闭环", "交付成果", "ALLOW", "BLOCK", "修复后重新审查", "非实时执行状态"]) assert.ok(card.includes(copy), copy);
  assert.equal((card.match(/data-flow-node=/g) ?? []).length, 8);
  assert.equal((card.match(/data-flow-edge=/g) ?? []).length, 16); // Eight tracks plus eight animated signals.
  assert.equal((card.match(/aria-label="N[1-8] /g) ?? []).length, 8);
  assert.match(card, /data-from="review" data-to="auto"/);
  assert.ok(card.indexOf('class="ai-workflow-figure"') < card.indexOf("企业 AI 编码配置中台"));
  for (const copy of ["中台分发", "团队复用", "零下载回滚", "执行审计"]) assert.ok(card.includes(copy));
  assert.doesNotMatch(card, /<img|18,889|5\.6/); // Focus on orchestration, not a poster or unrelated metrics.
});

const flowSource = await readFile(new URL("../app/workflow-graph.ts", import.meta.url), "utf8");
const flowJs = ts.transpileModule(flowSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { workflowEdges, workflowPath } = await import(`data:text/javascript;base64,${Buffer.from(flowJs).toString("base64")}`);

test("routes the workflow between real node ports in wide and narrow layouts", () => {
  assert.equal(workflowEdges.length, 8);
  const ids = ["init", "prd", "auto", "router", "review", "qa", "memory", "delivery"];
  assert.deepEqual(workflowEdges.filter(edge => edge.kind === "return"), [{ from: "review", to: "auto", kind: "return" }]);
  for (const vertical of [false, true]) {
    const width = vertical ? 330 : 1200;
    const height = vertical ? 1900 : 640;
    const boxes = new Map(ids.map((id, i) => [id, vertical
      ? { x: 15, y: 20 + i * 220, width: 275, height: 180 }
      : i < 3 ? { x: 30 + i * 390, y: 20, width: 350, height: 240 }
      : { x: 30 + (i - 3) * 230, y: 350, width: 195, height: 190 }]));
    for (const edge of workflowEdges) {
      const a = boxes.get(edge.from), b = boxes.get(edge.to);
      assert.ok(a && b);
      const path = workflowPath(a, b, edge.kind, vertical, width, height);
      assert.doesNotMatch(path, /NaN|Infinity|undefined/);
      if (edge.kind === "return") {
        assert.ok(path.endsWith(`V ${b.y + b.height / 2} H ${b.x + b.width}`));
        assert.ok(path.includes(`H ${width - 7}`));
        if (!vertical) assert.ok(path.includes(`V ${height - 22}`));
      } else if (vertical || edge.kind === "expand") {
        assert.ok(path.startsWith(`M ${a.x + a.width / 2} ${a.y + a.height}`));
        assert.ok(path.endsWith(vertical ? `${b.x + b.width / 2} ${b.y}` : `V ${b.y}`));
      } else {
        assert.ok(path.startsWith(`M ${a.x + a.width} ${a.y + a.height / 2}`));
        assert.ok(path.endsWith(`${b.x} ${b.y + b.height / 2}`));
      }
    }
  }
});

test("small-screen hero hides only the desktop stack and releases its reserved height", async () => {
  const css = await readFile(new URL("../app/portfolio.css", import.meta.url), "utf8");
  const smallScreen = css.slice(css.indexOf("@media screen and (max-width: 1024px)"));
  assert.match(smallScreen, /\.hero \.tech-scene\s*\{\s*display: none;/);
  assert.match(smallScreen, /height: auto; min-height: 100svh;/);
  assert.match(smallScreen, /\.hero \.hero-copy\s*\{ position: relative;/);
  assert.doesNotMatch(smallScreen, /1200px|1120px|knowledge/);
  const flowCss = await readFile(new URL("../app/ai-workflow.css", import.meta.url), "utf8");
  const flowComponent = await readFile(new URL("../app/AIWorkflow.tsx", import.meta.url), "utf8");
  assert.ok(flowCss.includes("@media (max-width: 1100px)") && flowComponent.includes('(max-width: 1100px)'));
  assert.match(flowCss, /\.ai-flow-entry, \.ai-flow-governance \{ grid-template-columns: minmax\(0, 1fr\)/);
  assert.ok(flowCss.includes("prefers-reduced-motion") && flowCss.includes("var(--work-play, paused)"));
  const html = await (await render()).text();
  assert.equal((html.match(/role="listitem"/g) ?? []).length, 5); // Desktop markup preserved.
});

test("retains Web3 projects and skills in source while excluding them from the page", async () => {
  const source = await readFile(new URL("../app/portfolio-content.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const { allProjects, visibleProjects, showWeb3 } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  assert.equal(showWeb3, false);
  assert.equal(allProjects.length, 9);
  assert.equal(visibleProjects.length, 7);
  assert.deepEqual(allProjects.filter(project => project.hidden).map(project => project.title), ["Nexora 链上学习凭证", "USDC 收款与订阅网关"]);
  const archived = allKnowledgeGroups.find(group => group.id === "web3");
  assert.equal(archived.hidden, true);
  assert.deepEqual(archived.skills.map(skill => skill.label), ["Solidity", "Foundry", "wagmi / viem", "go-ethereum", "Solana", "On-chain Sync"]);
  assert.equal(knowledgeGroups.some(group => group.id === "web3"), false);
});

test("knowledge graph is a complete tree with stable perspective endpoints", () => {
  const nodes = new Map(knowledgeNodes.map(node => [node.id, node]));
  assert.equal(nodes.size, 29);
  assert.equal(knowledgeEdges.length, nodes.size - 1);
  for (const node of knowledgeNodes.filter(node => node.id !== "core")) {
    assert.equal(knowledgeEdges.filter(edge => edge.to === node.id).length, 1);
  }
  for (const yaw of [-.073, 0, .073]) for (const pitch of [-.053, 0, .053]) {
    const positions = new Map(knowledgeNodes.map(node => [node.id, projectPoint(node.point, yaw, pitch)]));
    for (const [id, point] of positions) {
      assert.ok(point.x > 30 && point.x < 1410, `${id}: horizontal bounds`);
      assert.ok(point.y > 10 && point.y < 880, `${id}: vertical bounds`);
      assert.ok(point.scale > .8 && point.scale < 1.2);
    }
    for (const edge of knowledgeEdges) {
      assert.ok(nodes.has(edge.from) && nodes.has(edge.to));
      const a = positions.get(edge.from), b = positions.get(edge.to);
      const path = connectionPath(a, b);
      assert.ok(path.startsWith(`M ${a.x} ${a.y} Q `));
      assert.ok(path.endsWith(` ${b.x} ${b.y}`));
      assert.doesNotMatch(path, /NaN|Infinity/);
    }
  }
});

test("career timeline preserves all employment facts and provides chronological native navigation", async () => {
  const source = await readFile(new URL("../app/portfolio-content.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const { experience, careerChapters } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  assert.deepEqual(careerChapters.map(entry => entry.year), ["2016", "2019", "2022", "2025", "2026"]);
  assert.deepEqual(careerChapters.map(({ period, company, role, detail }) => [period, company, role, detail]), [...experience].reverse());
  const html = await (await render()).text();
  const timeline = html.match(/<section[^>]*id="experience"[\s\S]*?<\/section>/)?.[0];
  assert.ok(timeline);
  assert.equal((timeline.match(/data-career-row=/g) ?? []).length, 5);
  assert.equal((timeline.match(/<article\b/g) ?? []).length, 5);
  assert.equal((timeline.match(/aria-current="step"/g) ?? []).length, 1);
  for (const [i, entry] of careerChapters.entries()) {
    assert.ok(timeline.includes(`href="#${entry.id}"`));
    assert.ok(timeline.includes(`id="${entry.id}"`));
    for (const copy of [entry.period, entry.company, entry.role, entry.detail, entry.contribution]) assert.ok(timeline.includes(copy), copy);
    if (i) assert.ok(timeline.indexOf(`id="${careerChapters[i - 1].id}"`) < timeline.indexOf(`id="${entry.id}"`));
  }
  assert.equal((timeline.match(/当前任职/g) ?? []).length, 1);
  assert.doesNotMatch(timeline, /\shidden(?:=|\s|>)|<details\b/); // Decorative aria-hidden icons do not hide the employment entries.
});

const profileMotionSource = await readFile(new URL("../app/profile-motion.ts", import.meta.url), "utf8");
const profileMotionJs = ts.transpileModule(profileMotionSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { careerFrame } = await import(`data:text/javascript;base64,${Buffer.from(profileMotionJs).toString("base64")}`);

test("career scroll state advances monotonically without hiding or excessively tilting past entries", () => {
  const centers = [200, 650, 1100, 1550, 2000];
  let previousProgress = 0, previousActive = 0;
  for (let anchor = -300; anchor <= 2500; anchor += 25) {
    const frame = careerFrame(centers, anchor, 700);
    assert.ok(frame.progress >= previousProgress && frame.progress >= 0 && frame.progress <= 1);
    assert.ok(frame.active >= previousActive && frame.active < centers.length);
    frame.cards.forEach(pose => {
      assert.ok(pose.opacity >= .68 && pose.opacity <= 1);
      assert.ok(pose.scale >= .94 && pose.scale <= 1);
      assert.ok(Math.abs(pose.rotate) <= 3.5 && pose.depth >= -40 && pose.depth <= 0);
    });
    previousProgress = frame.progress; previousActive = frame.active;
  }
  assert.equal(careerFrame(centers, 1100, 700).active, 2);
  assert.equal(careerFrame(centers, 1100, 700).cards[2].scale, 1);
  assert.deepEqual(careerFrame([], 300, 500), { active: 0, progress: 0, cards: [] });
  assert.equal(careerFrame([200], 400, 0).active, 0);
  assert.equal(careerFrame([200], 400, 0).progress, 0);
});

test("career enhancement retains reduced-motion, mobile, keyboard and print fallbacks", async () => {
  const careerCss = await readFile(new URL("../app/career-timeline.css", import.meta.url), "utf8");
  for (const copy of ["prefers-reduced-motion", "max-width: 900px", "@media print", "focus-visible"]) assert.ok(careerCss.includes(copy), copy);
  assert.ok(careerCss.includes("opacity: 1; will-change: auto;"));
  const pageCss = await readFile(new URL("../app/portfolio.css", import.meta.url), "utf8");
  assert.ok(pageCss.includes("@supports (overflow: clip) { main { overflow: clip; } }"));
  const code = await readFile(new URL("../app/CareerTimeline.tsx", import.meta.url), "utf8");
  assert.ok(code.includes("visibilitychange") && code.includes("document.hidden") && code.includes("disconnect()"));
});
