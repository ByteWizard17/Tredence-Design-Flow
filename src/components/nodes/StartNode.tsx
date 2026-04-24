import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { StartNodeData } from '../../types/nodes';

const StartNode: React.FC<NodeProps<StartNodeData>> = ({ data, selected }) => (
  <div className={`flow-node flow-node-start${selected ? ' is-selected' : ''}`}>
    <div className="flow-node-chip">Start</div>
    <strong>{data.title}</strong>
    <p>{data.metadata.length > 0 ? `${data.metadata.length} metadata fields` : 'Entry point'}</p>
    <Handle type="source" position={Position.Right} />
  </div>
);

export default StartNode;
