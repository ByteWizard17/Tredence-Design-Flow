import { useEffect, useMemo, useState } from 'react';
import { getAutomations } from '../api/automations';
import { AutomationAction } from '../types/api';
import { AutomatedNodeData, WorkflowNode } from '../types/nodes';

export const useAutomations = (selectedNode: WorkflowNode | null) => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [isLoadingAutomations, setIsLoadingAutomations] = useState(false);

  useEffect(() => {
    let active = true;

    const loadAutomations = async () => {
      setIsLoadingAutomations(true);

      try {
        const data = await getAutomations();
        if (active) {
          setAutomations(data);
        }
      } catch (_error) {
        if (active) {
          setAutomations([]);
        }
      } finally {
        if (active) {
          setIsLoadingAutomations(false);
        }
      }
    };

    loadAutomations();

    return () => {
      active = false;
    };
  }, []);

  const selectedAutomation = useMemo(() => {
    if (!selectedNode || selectedNode.type !== 'automated') {
      return null;
    }

    return (
      automations.find(
        (automation) => automation.id === (selectedNode.data as AutomatedNodeData).actionId
      ) ?? null
    );
  }, [automations, selectedNode]);

  return { automations, isLoadingAutomations, selectedAutomation };
};
