import React from 'react';
import { WorkflowNodeType } from '../types/nodes';

const nodeTypes: Array<{
  id: WorkflowNodeType;
  label: string;
  accent: string;
  description: string;
}> = [
  {
    id: 'start',
    label: 'Start Node',
    accent: 'lime',
    description: 'Declare the entry point for the workflow.',
  },
  {
    id: 'task',
    label: 'Task Node',
    accent: 'amber',
    description: 'Assign human actions like collecting or reviewing documents.',
  },
  {
    id: 'approval',
    label: 'Approval Node',
    accent: 'rose',
    description: 'Route a decision to a manager, HRBP, or director.',
  },
  {
    id: 'automated',
    label: 'Automated Step',
    accent: 'sky',
    description: 'Trigger mocked system actions from the automation catalog.',
  },
  {
    id: 'end',
    label: 'End Node',
    accent: 'slate',
    description: 'Finish the workflow and optionally include a summary.',
  },
];

const Sidebar: React.FC = () => {
  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="eyebrow">Node Library</p>
        <h2>Compose the workflow visually</h2>
        <p>
          Start with a trigger, chain tasks and approvals, then end with an outcome node.
        </p>
      </div>

      <div className="sidebar-node-list">
        {nodeTypes.map((node) => (
          <button
            key={node.id}
            className={`sidebar-node-card accent-${node.accent}`}
            draggable
            onDragStart={(event) => handleDragStart(event, node.id)}
            type="button"
          >
            <span>{node.label}</span>
            <small>{node.description}</small>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
