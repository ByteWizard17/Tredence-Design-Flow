import { useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { createSampleWorkflow } from '../utils/sampleWorkflow';

export const useSampleWorkflow = () => {
  const { nodes, setNodes, setEdges, setSelectedNodeId } = useWorkflowStore();

  const loadSampleWorkflow = () => {
    const sampleWorkflow = createSampleWorkflow();
    setNodes(sampleWorkflow.nodes);
    setEdges(sampleWorkflow.edges);
    setSelectedNodeId(null);
  };

  useEffect(() => {
    if (nodes.length === 0) {
      loadSampleWorkflow();
    }
  }, [nodes.length]);

  return { loadSampleWorkflow };
};
