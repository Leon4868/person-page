export type FlowRect = { x: number; y: number; width: number; height: number };
export type FlowNodeId = "init" | "prd" | "auto" | "router" | "review" | "qa" | "memory" | "delivery";
export type FlowEdge = { from: FlowNodeId; to: FlowNodeId; kind: "next" | "expand" | "return" };

// A capability overview, not a replacement for the internal N1–N8 execution order.
export const workflowEdges: FlowEdge[] = [
  { from: "init", to: "prd", kind: "next" },
  { from: "prd", to: "auto", kind: "next" },
  { from: "auto", to: "router", kind: "expand" },
  { from: "router", to: "review", kind: "next" },
  { from: "review", to: "qa", kind: "next" },
  { from: "qa", to: "memory", kind: "next" },
  { from: "memory", to: "delivery", kind: "next" },
  { from: "review", to: "auto", kind: "return" },
];

export function workflowPath(a: FlowRect, b: FlowRect, kind: FlowEdge["kind"], vertical: boolean, width: number, height: number) {
  const ax = a.x + a.width / 2, ay = a.y + a.height;
  const bx = b.x + b.width / 2;
  if (kind === "return") {
    const by = b.y + b.height / 2, right = width - 7;
    if (vertical) return `M ${a.x + a.width} ${a.y + a.height / 2} H ${right} V ${by} H ${b.x + b.width}`;
    return `M ${ax} ${ay} V ${height - 22} H ${right} V ${by} H ${b.x + b.width}`;
  }
  if (vertical) return `M ${ax} ${ay} C ${ax} ${(ay + b.y) / 2} ${bx} ${(ay + b.y) / 2} ${bx} ${b.y}`;
  if (kind === "expand") {
    const lane = (ay + b.y) / 2;
    return `M ${ax} ${ay} V ${lane} H ${bx} V ${b.y}`;
  }
  const x = a.x + a.width, y = a.y + a.height / 2, by = b.y + b.height / 2;
  return `M ${x} ${y} C ${(x + b.x) / 2} ${y} ${(x + b.x) / 2} ${by} ${b.x} ${by}`;
}
