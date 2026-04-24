import { useMemo, useState } from 'react';
import { simulateWorkflow } from '../api/simulate';
import { SimulationStep } from '../types/api';
import { WorkflowEdge, WorkflowNode } from '../types/nodes';
import { serializeWorkflow } from '../utils/graph';
import { validateWorkflow } from '../utils/validation';

export const useWorkflowSimulation = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const [executionLog, setExecutionLog] = useState<SimulationStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const serializedWorkflow = useMemo(() => serializeWorkflow(nodes, edges), [nodes, edges]);
  const validation = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);

  const runSimulation = async () => {
    if (!validation.valid) {
      setExecutionLog([]);
      setApiError(null);
      return;
    }

    setIsRunning(true);
    setApiError(null);

    try {
      const result = await simulateWorkflow(serializedWorkflow);
      setExecutionLog(result);
    } catch (_error) {
      setExecutionLog([]);
      setApiError('Simulation request failed. Please retry.');
    } finally {
      setIsRunning(false);
    }
  };

  const resetSimulationState = () => {
    setExecutionLog([]);
    setApiError(null);
  };

  return {
    executionLog,
    isRunning,
    apiError,
    serializedWorkflow,
    validation,
    runSimulation,
    resetSimulationState,
  };
};
