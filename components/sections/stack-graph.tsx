"use client";

import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/components/theme/theme-provider";

type TechData = { label: string; kind: "lang" | "framework" | "ui" | "data" | "ops" };

const COL = 205;
const ROW = 62;

const RAW: [string, string, TechData["kind"], number, number][] = [
  // id, label, kind, column, row
  ["ts", "TypeScript", "lang", 0, 1],
  ["py", "Python", "lang", 0, 4],

  ["react", "React", "framework", 1, 0],
  ["next", "Next.js", "framework", 1, 2],
  ["fastapi", "FastAPI", "framework", 1, 4],
  ["tauri", "Tauri", "framework", 1, 5.2],

  ["tailwind", "Tailwind", "ui", 2, -1],
  ["motion", "Motion", "ui", 2, 0],
  ["three", "Three.js", "ui", 2, 1],
  ["flow", "React Flow", "ui", 2, 2],
  ["blockly", "Blockly", "ui", 2, 3],

  ["prisma", "Prisma", "data", 3, 2],
  ["zod", "Zod", "data", 3, 3.2],
  ["supabase", "Supabase", "data", 3, 4.4],

  ["pg", "PostgreSQL", "ops", 4, 3],
  ["docker", "Docker", "ops", 4, 4.4],
];

const CONNECTIONS: [string, string][] = [
  ["ts", "react"],
  ["ts", "next"],
  ["py", "fastapi"],
  ["ts", "tauri"],
  ["react", "tailwind"],
  ["react", "motion"],
  ["react", "three"],
  ["react", "flow"],
  ["react", "blockly"],
  ["next", "prisma"],
  ["next", "zod"],
  ["next", "supabase"],
  ["prisma", "pg"],
  ["supabase", "pg"],
  ["fastapi", "docker"],
];

const initialNodes: Node<TechData>[] = RAW.map(([id, label, kind, col, row]) => ({
  id,
  type: "tech",
  position: { x: col * COL, y: row * ROW },
  data: { label, kind },
}));

const initialEdges: Edge[] = CONNECTIONS.map(([source, target]) => ({
  id: `${source}-${target}`,
  source,
  target,
  type: "smoothstep",
  animated: false,
  style: { stroke: "var(--border-strong)", strokeWidth: 1.25 },
}));

function TechNode({ data }: NodeProps<Node<TechData>>) {
  const accented = data.kind === "ui" || data.kind === "framework";
  return (
    <div
      className={`rounded-sm border px-3 py-1.5 font-mono text-xs shadow-sm transition-colors ${
        accented
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-1.5 !border-0 !bg-[var(--border-strong)]"
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        className="!size-1.5 !border-0 !bg-[var(--border-strong)]"
      />
    </div>
  );
}

const nodeTypes = { tech: TechNode };

export function StackGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { theme } = useTheme();

  return (
    <div className="h-[26rem] overflow-hidden rounded-lg border border-border bg-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.14 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        edgesFocusable={false}
        // Scrolling the page must not zoom the graph.
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        minZoom={0.5}
        maxZoom={1.6}
        colorMode={theme.mode}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          color="var(--border)"
        />
      </ReactFlow>
    </div>
  );
}
