import axios from 'axios';
import { AutomationAction, SimulateResponse } from '../types/api';
import { WorkflowSnapshot } from '../types/nodes';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAutomations = async (): Promise<AutomationAction[]> => {
  const response = await apiClient.get<AutomationAction[]>('/automations');
  return response.data;
};

export const simulateWorkflowRequest = async (
  workflow: WorkflowSnapshot
): Promise<SimulateResponse> => {
  const response = await apiClient.post<SimulateResponse>('/simulate', workflow);
  return response.data;
};

export default apiClient;
