import { WorkflowEdge, WorkflowNode } from '../types/nodes';

export const createSampleWorkflow = (): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  const nodes: WorkflowNode[] = [
    {
      id: 'start_sample',
      type: 'start',
      position: { x: 80, y: 160 },
      data: {
        title: 'Employee joins organization',
        metadata: [
          { id: 'meta_department', key: 'department', value: 'Analytics' },
          { id: 'meta_location', key: 'location', value: 'Bengaluru' },
        ],
      },
    },
    {
      id: 'task_sample',
      type: 'task',
      position: { x: 360, y: 160 },
      data: {
        title: 'Collect onboarding documents',
        description: 'Gather PAN, Aadhaar, address proof, and signed offer letter.',
        assignee: 'HR Ops',
        dueDate: '2026-04-30',
        customFields: [{ id: 'field_priority', key: 'priority', value: 'High' }],
      },
    },
    {
      id: 'approval_sample',
      type: 'approval',
      position: { x: 680, y: 160 },
      data: {
        title: 'Manager approval',
        approverRole: 'Manager',
        autoApproveThreshold: 2,
      },
    },
    {
      id: 'automated_sample',
      type: 'automated',
      position: { x: 980, y: 160 },
      data: {
        title: 'Send welcome email',
        actionId: 'send_email',
        actionLabel: 'Send Email',
        actionParams: {
          to: 'newhire@company.com',
          subject: 'Welcome to Tredence',
        },
      },
    },
    {
      id: 'end_sample',
      type: 'end',
      position: { x: 1270, y: 160 },
      data: {
        endMessage: 'Onboarding workflow completed',
        summaryFlag: true,
      },
    },
  ];

  const edges: WorkflowEdge[] = [
    {
      id: 'edge_start_task',
      source: 'start_sample',
      target: 'task_sample',
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'edge_task_approval',
      source: 'task_sample',
      target: 'approval_sample',
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'edge_approval_automated',
      source: 'approval_sample',
      target: 'automated_sample',
      type: 'smoothstep',
      animated: true,
    },
    {
      id: 'edge_automated_end',
      source: 'automated_sample',
      target: 'end_sample',
      type: 'smoothstep',
      animated: true,
    },
  ];

  return { nodes, edges };
};
