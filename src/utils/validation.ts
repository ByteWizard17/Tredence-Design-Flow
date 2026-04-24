import { WorkflowEdge, WorkflowNode } from '../types/nodes';

export type ValidationIssue = {
  code: string;
  message: string;
  nodeIds?: string[];
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

const buildAdjacency = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  nodes.forEach((node) => {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  });

  edges.forEach((edge) => {
    outgoing.get(edge.source)?.push(edge.target);
    incoming.get(edge.target)?.push(edge.source);
  });

  return { outgoing, incoming };
};

const hasCycle = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const { outgoing } = buildAdjacency(nodes, edges);
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) {
      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visiting.add(nodeId);

    for (const neighbor of outgoing.get(nodeId) ?? []) {
      if (visit(neighbor)) {
        return true;
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };

  return nodes.some((node) => visit(node.id));
};

export const validateWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const startNodes = nodes.filter((node) => node.type === 'start');
  const endNodes = nodes.filter((node) => node.type === 'end');
  const { outgoing, incoming } = buildAdjacency(nodes, edges);

  if (nodes.length === 0) {
    issues.push({
      code: 'EMPTY_WORKFLOW',
      message: 'Add nodes to the canvas before simulating the workflow.',
    });
  }

  if (startNodes.length !== 1) {
    issues.push({
      code: 'START_COUNT',
      message: 'The workflow must contain exactly one Start node.',
      nodeIds: startNodes.map((node) => node.id),
    });
  }

  if (endNodes.length < 1) {
    issues.push({
      code: 'END_COUNT',
      message: 'Add at least one End node to complete the workflow.',
    });
  }

  startNodes.forEach((node) => {
    if ((incoming.get(node.id) ?? []).length > 0) {
      issues.push({
        code: 'START_HAS_INPUT',
        message: 'Start node cannot have incoming connections.',
        nodeIds: [node.id],
      });
    }

    if ((outgoing.get(node.id) ?? []).length === 0) {
      issues.push({
        code: 'START_NOT_CONNECTED',
        message: 'Start node must connect to the next step.',
        nodeIds: [node.id],
      });
    }
  });

  endNodes.forEach((node) => {
    if ((outgoing.get(node.id) ?? []).length > 0) {
      issues.push({
        code: 'END_HAS_OUTPUT',
        message: 'End node cannot have outgoing connections.',
        nodeIds: [node.id],
      });
    }
  });

  nodes
    .filter((node) => node.type !== 'start' && node.type !== 'end')
    .forEach((node) => {
      if ((incoming.get(node.id) ?? []).length === 0 || (outgoing.get(node.id) ?? []).length === 0) {
        const nodeLabel = 'title' in node.data ? node.data.title : node.type;

        issues.push({
          code: 'BROKEN_CHAIN',
          message: `${nodeLabel} must have both an incoming and outgoing connection.`,
          nodeIds: [node.id],
        });
      }
    });

  if (hasCycle(nodes, edges)) {
    issues.push({
      code: 'CYCLE_DETECTED',
      message: 'Cycles are not supported in the sandbox simulation.',
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};
