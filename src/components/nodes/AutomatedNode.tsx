import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { AutomatedNodeData } from '../../types/nodes';

const AutomatedNode: React.FC<NodeProps<AutomatedNodeData>> = ({ data, selected }) => (
  <div className={`flow-node flow-node-automated${selected ? ' is-selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <div className="flow-node-chip">Automation</div>
    <strong>{data.title}</strong>
    <p>{data.actionLabel || 'Select a mocked action'}</p>
    <span>{Object.keys(data.actionParams).length} configured parameters</span>
    <Handle type="source" position={Position.Right} />
  </div>
);

export default AutomatedNode;
