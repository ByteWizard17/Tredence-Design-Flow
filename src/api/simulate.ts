import { SimulationStep } from '../types/api';
import { WorkflowSnapshot } from '../types/nodes';
import { simulateWorkflowRequest } from './client';
import { simulateWorkflowLocally } from './mockData';

export const simulateWorkflow = async (workflow: WorkflowSnapshot): Promise<SimulationStep[]> => {
  try {
    const response = await simulateWorkflowRequest(workflow);
    return response.executionLog;
  } catch (_error) {
    return simulateWorkflowLocally(workflow).executionLog;
  }
};

export default simulateWorkflow;
