import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const bootstrap = async () => {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
    } catch (error) {
      console.warn('MSW failed to start, continuing with local fallbacks.', error);
    }
  }

  createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

bootstrap().catch((error) => {
  // Surface startup failures while keeping the app bootstrap simple.
  console.error('Failed to start application', error);
});
