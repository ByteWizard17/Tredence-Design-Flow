import { Edge, Node } from 'reactflow';

export type KeyValuePair = {
  id: string;
  key: string;
  value: string;
};

export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export type StartNodeData = {
  title: string;
  metadata: KeyValuePair[];
};

export type TaskNodeData = {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
};

export type ApprovalNodeData = {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
};

export type AutomatedNodeData = {
  title: string;
  actionId: string;
  actionLabel?: string;
  actionParams: Record<string, string>;
};

export type EndNodeData = {
  endMessage: string;
  summaryFlag: boolean;
};

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
export type WorkflowEdge = Edge;

export type WorkflowSnapshot = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export const createKeyValuePair = (): KeyValuePair => ({
  id: `kv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  key: '',
  value: '',
});

export const createDefaultNodeData = (type: WorkflowNodeType): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return {
        title: 'Workflow Trigger',
        metadata: [],
      };
    case 'task':
      return {
        title: 'Collect documents',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case 'approval':
      return {
        title: 'Manager approval',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      };
    case 'automated':
      return {
        title: 'Automated action',
        actionId: '',
        actionLabel: '',
        actionParams: {},
      };
    case 'end':
      return {
        endMessage: 'Workflow completed',
        summaryFlag: true,
      };
  }
};
