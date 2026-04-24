import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { ApprovalNodeData } from '../../types/nodes';

const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = ({ data, selected }) => (
  <div className={`flow-node flow-node-approval${selected ? ' is-selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <div className="flow-node-chip">Approval</div>
    <strong>{data.title}</strong>
    <p>{data.approverRole || 'Approver role pending'}</p>
    <span>Auto-approve at {data.autoApproveThreshold || 0}</span>
    <Handle type="source" position={Position.Right} />
  </div>
);

export default ApprovalNode;
