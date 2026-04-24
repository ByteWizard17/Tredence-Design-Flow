import { SimulationStep } from '../types/api';
import { WorkflowEdge, WorkflowNode, WorkflowSnapshot } from '../types/nodes';

export const serializeWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowSnapshot => ({
  nodes,
  edges,
});

export const getWorkflowStartNode = (nodes: WorkflowNode[]): WorkflowNode | undefined =>
  nodes.find((node) => node.type === 'start');

export const getTopologicalExecutionOrder = (nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] => {
  const indegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  nodes.forEach((node) => {
    indegree.set(node.id, 0);
    adjacency.set(node.id, []);
  });

  edges.forEach((edge) => {
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    adjacency.get(edge.source)?.push(edge.target);
  });

  const ordered: WorkflowNode[] = [];
  const queue = nodes
    .filter((node) => (indegree.get(node.id) ?? 0) === 0)
    .sort((a, b) => a.position.x - b.position.x || a.position.y - b.position.y);

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    ordered.push(current);

    for (const neighborId of adjacency.get(current.id) ?? []) {
      const nextCount = (indegree.get(neighborId) ?? 0) - 1;
      indegree.set(neighborId, nextCount);

      if (nextCount === 0) {
        const neighbor = nodeById.get(neighborId);
        if (neighbor) {
          queue.push(neighbor);
        }
      }
    }
  }

  return ordered;
};

export const formatSimulationStep = (step: SimulationStep, index: number): string =>
  `${index + 1}. ${step.message}`;
