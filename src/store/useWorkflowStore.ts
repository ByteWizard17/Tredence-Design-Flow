import { create } from 'zustand';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, EdgeChange, NodeChange } from 'reactflow';
import { WorkflowEdge, WorkflowNode, WorkflowNodeData } from '../types/nodes';

type NodeUpdater = WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[]);
type EdgeUpdater = WorkflowEdge[] | ((edges: WorkflowEdge[]) => WorkflowEdge[]);

type WorkflowState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  setNodes: (updater: NodeUpdater) => void;
  setEdges: (updater: EdgeUpdater) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: WorkflowNodeData) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
};

const resolveUpdater = <T>(current: T, updater: T | ((value: T) => T)): T => {
  if (typeof updater === 'function') {
    return (updater as (value: T) => T)(current);
  }

  return updater;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  setNodes: (updater) =>
    set((state) => ({
      nodes: resolveUpdater(state.nodes, updater),
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: resolveUpdater(state.edges, updater),
    })),
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    })),
  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),
  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
        },
        state.edges
      ),
    })),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, data } : node)),
    })),
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),
  deleteEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),
}));

export const useSelectedNode = (): WorkflowNode | null => {
  const { nodes, selectedNodeId } = useWorkflowStore();
  return nodes.find((node) => node.id === selectedNodeId) ?? null;
};
