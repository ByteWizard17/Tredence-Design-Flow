import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { EndNodeData } from '../../types/nodes';

const EndNode: React.FC<NodeProps<EndNodeData>> = ({ data, selected }) => (
  <div className={`flow-node flow-node-end${selected ? ' is-selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <div className="flow-node-chip">End</div>
    <strong>{data.endMessage}</strong>
    <p>{data.summaryFlag ? 'Summary enabled' : 'Summary hidden'}</p>
  </div>
);

export default EndNode;
