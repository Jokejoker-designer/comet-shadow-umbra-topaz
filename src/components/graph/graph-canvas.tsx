import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type EdgeTypes,
  type NodeTypes,
} from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { LabNode } from "./nodes";
import { SynapseEdge } from "./synapse-edge";
import { buildGraph } from "@/lib/snn/layouts";
import { useLab, viewedFrame } from "@/lib/snn/store";

const nodeTypes = { lab: LabNode } as unknown as NodeTypes;
const edgeTypes = { synapse: SynapseEdge } as unknown as EdgeTypes;

function FlowInner() {
  const screen = useLab((s) => s.screen);
  const frameTick = useLab((s) => s.frame.tick);
  const travel = useLab((s) => s.travelTick);
  const showAll = useLab((s) => s.showAllSynapses);
  const lastPulse = useLab((s) => s.lastPulse);
  const hover = useLab((s) => s.hoverAgent);
  const select = useLab((s) => s.select);
  const setHover = useLab((s) => s.setHover);
  const { fitView } = useReactFlow();
  const frame = viewedFrame();

  const { nodes, edges } = useMemo(
    () => buildGraph(screen, frame, null, showAll, lastPulse, hover),
    [screen, frameTick, travel, frame, showAll, lastPulse, hover],
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fitView({ padding: 0.2, duration: 200 });
    }, 80);
    return () => window.clearTimeout(t);
  }, [screen, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.18}
      maxZoom={1.8}
      proOptions={{ hideAttribution: true }}
      onNodeClick={(_, node) => {
        select(node.id);
        const idx = (node.data as { agentIndex?: number }).agentIndex;
        setHover(idx ?? null);
      }}
      onPaneClick={() => {
        setHover(null);
        select(null);
      }}
      nodesDraggable
      elementsSelectable
      colorMode="dark"
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
      <MiniMap pannable zoomable maskColor="rgb(9 9 11 / 0.72)" nodeColor="var(--color-elevated)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function GraphCanvas() {
  const screen = useLab((s) => s.screen);
  return (
    <ReactFlowProvider key={screen}>
      <div className="h-full w-full">
        <FlowInner />
      </div>
    </ReactFlowProvider>
  );
}
