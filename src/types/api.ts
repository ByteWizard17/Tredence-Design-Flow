export type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

export type SimulationStep = {
  nodeId: string;
  nodeType: string;
  status: 'success' | 'warning' | 'error';
  message: string;
};

export type SimulateResponse = {
  executionLog: SimulationStep[];
  success: boolean;
};
