import { rest } from 'msw';
import { SimulateResponse } from '../types/api';
import { WorkflowSnapshot } from '../types/nodes';
import { getTopologicalExecutionOrder } from '../utils/graph';

const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create IT Ticket', params: ['category', 'priority'] },
];

export const handlers = [
  rest.get('/automations', (_req, res, ctx) => res(ctx.delay(200), ctx.json(automations))),
  rest.post('/simulate', async (req, res, ctx) => {
    const workflow = req.body as WorkflowSnapshot;
    const orderedNodes = getTopologicalExecutionOrder(workflow.nodes, workflow.edges);

    const executionLog: SimulateResponse['executionLog'] = orderedNodes.map((node) => {
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
    });

    return res(
      ctx.delay(400),
      ctx.json({
        executionLog,
        success: true,
      })
    );
  }),
];
