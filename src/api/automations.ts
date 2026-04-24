import { fetchAutomations } from './client';
import { mockAutomations } from './mockData';

export const getAutomations = async () => {
  try {
    return await fetchAutomations();
  } catch (_error) {
    return mockAutomations;
  }
};

export default getAutomations;
