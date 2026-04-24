import { useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const useAutoLayout = () => {
  const { nodes, setNodes } = useWorkflowStore();

  useEffect(() => {
    if (nodes.length === 0) return;

    const layoutNodes = () => {
      // Simple layout algorithm to position nodes in a grid
      const updatedNodes = nodes.map((node, index) => ({
        ...node,
        position: {
          x: (index % 3) * 200, // 3 nodes per row
          y: Math.floor(index / 3) * 100,
        },
      }));

      setNodes(updatedNodes);
    };

    layoutNodes();
  }, [nodes, setNodes]);
};

export default useAutoLayout;