import React, { useMemo, useState } from 'react';
import { simulateWorkflow } from '../api/simulate';
import { SimulationStep } from '../types/api';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { serializeWorkflow } from '../utils/graph';
import { createSampleWorkflow } from '../utils/sampleWorkflow';
import { validateWorkflow } from '../utils/validation';

const SandboxPanel: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, setSelectedNodeId } = useWorkflowStore();
  const [executionLog, setExecutionLog] = useState<SimulationStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const serializedWorkflow = useMemo(() => serializeWorkflow(nodes, edges), [nodes, edges]);
  const validation = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);

  const handleSimulate = async () => {
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

  const loadSampleWorkflow = () => {
    const sampleWorkflow = createSampleWorkflow();
    setNodes(sampleWorkflow.nodes);
    setEdges(sampleWorkflow.edges);
    setSelectedNodeId(null);
    setExecutionLog([]);
    setApiError(null);
  };

  return (
    <section className="panel-card">
      <div className="panel-header">
        <p className="eyebrow">Sandbox</p>
        <h2>Test the workflow</h2>
        <p className="muted-copy">
          Validate the graph, serialize the current state, and walk through a mocked execution log.
        </p>
      </div>

      <div className="panel-body">
        <div className="summary-grid">
          <div>
            <span>Nodes</span>
            <strong>{nodes.length}</strong>
          </div>
          <div>
            <span>Edges</span>
            <strong>{edges.length}</strong>
          </div>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={handleSimulate} type="button" disabled={isRunning}>
            {isRunning ? 'Running simulation...' : 'Simulate workflow'}
          </button>
          <button className="secondary-button" onClick={loadSampleWorkflow} type="button">
            Load sample tasks
          </button>
        </div>

        {!validation.valid ? (
          <div className="validation-card">
            <h3>Validation issues</h3>
            <ul>
              {validation.issues.map((issue) => (
                <li key={issue.code}>{issue.message}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="validation-card validation-card-success">
            <h3>Workflow status</h3>
            <p>Structure looks valid for simulation.</p>
          </div>
        )}

        {apiError ? <div className="validation-card">{apiError}</div> : null}

        <div className="log-card">
          <div className="log-card-header">
            <h3>Execution log</h3>
            <span>{executionLog.length} steps</span>
          </div>
          {executionLog.length === 0 ? (
            <p className="muted-copy">Run the sandbox to see step-by-step execution output.</p>
          ) : (
            <ol className="timeline-list">
              {executionLog.map((step, index) => (
                <li key={`${step.nodeId}_${index}`}>
                  <strong>{step.nodeType}</strong>
                  <p>{step.message}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <details className="json-preview">
          <summary>Serialized workflow JSON</summary>
          <pre>{JSON.stringify(serializedWorkflow, null, 2)}</pre>
        </details>
      </div>
    </section>
  );
};

export default SandboxPanel;
