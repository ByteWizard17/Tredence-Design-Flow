import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { TaskNodeData } from '../../types/nodes';

const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({ data, selected }) => (
  <div className={`flow-node flow-node-task${selected ? ' is-selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <div className="flow-node-chip">Task</div>
    <strong>{data.title}</strong>
    <p>{data.description || 'Human task awaiting completion'}</p>
    <span>{data.assignee ? `Owner: ${data.assignee}` : 'No assignee set'}</span>
    <Handle type="source" position={Position.Right} />
  </div>
);

export default TaskNode;
