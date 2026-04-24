import { AutomationAction, SimulateResponse } from '../types/api';
import { WorkflowSnapshot } from '../types/nodes';
import { getTopologicalExecutionOrder } from '../utils/graph';

export const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create IT Ticket', params: ['category', 'priority'] },
];

export const simulateWorkflowLocally = (workflow: WorkflowSnapshot): SimulateResponse => {
  const orderedNodes = getTopologicalExecutionOrder(workflow.nodes, workflow.edges);

  return {
    success: true,
    executionLog: orderedNodes.map((node) => {
      const nodeType = node.type ?? 'unknown';
      const title =
        'title' in node.data
          ? node.data.title
          : 'endMessage' in node.data
            ? node.data.endMessage
            : nodeType;

      return {
        nodeId: node.id,
        nodeType,
        status: 'success',
        message: `${nodeType.toUpperCase()}: ${title}`,
      };
    }),
  };
};
