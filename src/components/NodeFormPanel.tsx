import { useEffect, useMemo, useState } from 'react';
import { getAutomations } from '../api/automations';
import { AutomationAction } from '../types/api';
import {
  ApprovalNodeData,
  AutomatedNodeData,
  createKeyValuePair,
  EndNodeData,
  KeyValuePair,
  StartNodeData,
  TaskNodeData,
} from '../types/nodes';
import { useSelectedNode, useWorkflowStore } from '../store/useWorkflowStore';

const KeyValueEditor = ({
  items,
  label,
  onChange,
}: {
  items: KeyValuePair[];
  label: string;
  onChange: (items: KeyValuePair[]) => void;
}) => (
  <div className="form-stack">
    <label className="field-label">{label}</label>
    {items.length === 0 ? <p className="muted-copy">No custom entries added yet.</p> : null}
    {items.map((item) => (
      <div className="pair-row" key={item.id}>
        <input
          value={item.key}
          onChange={(event) =>
            onChange(items.map((entry) => (entry.id === item.id ? { ...entry, key: event.target.value } : entry)))
          }
          placeholder="Key"
        />
        <input
          value={item.value}
          onChange={(event) =>
            onChange(
              items.map((entry) => (entry.id === item.id ? { ...entry, value: event.target.value } : entry))
            )
          }
          placeholder="Value"
        />
        <button
          className="ghost-button"
          onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
          type="button"
        >
          Remove
        </button>
      </div>
    ))}
    <button className="secondary-button" onClick={() => onChange([...items, createKeyValuePair()])} type="button">
      Add entry
    </button>
  </div>
);

const NodeFormPanel = () => {
  const selectedNode = useSelectedNode();
  const { updateNodeData, deleteNode, setSelectedNodeId } = useWorkflowStore();
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

    return automations.find((automation) => automation.id === (selectedNode.data as AutomatedNodeData).actionId) ?? null;
  }, [automations, selectedNode]);

  if (!selectedNode) {
    return (
      <section className="panel-card">
        <div className="panel-header">
          <p className="eyebrow">Inspector</p>
          <h2>Node configuration</h2>
        </div>
        <p className="muted-copy">
          Select a node on the canvas to edit its configuration and see type-specific fields.
        </p>
      </section>
    );
  }

  const updateSelectedNode = <T extends StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData>(
    data: T
  ) => {
    updateNodeData(selectedNode.id, data);
  };
  const selectedNodeType = selectedNode.type ?? 'node';

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start': {
        const data = selectedNode.data as StartNodeData;
        return (
          <>
            <div className="form-stack">
              <label className="field-label" htmlFor="start-title">
                Start title
              </label>
              <input
                id="start-title"
                value={data.title}
                onChange={(event) => updateSelectedNode({ ...data, title: event.target.value })}
                placeholder="Employee onboarding begins"
              />
            </div>
            <KeyValueEditor
              items={data.metadata}
              label="Metadata"
              onChange={(metadata) => updateSelectedNode({ ...data, metadata })}
            />
          </>
        );
      }
      case 'task': {
        const data = selectedNode.data as TaskNodeData;
        return (
          <>
            <div className="form-grid">
              <div className="form-stack">
                <label className="field-label" htmlFor="task-title">
                  Title
                </label>
                <input
                  id="task-title"
                  value={data.title}
                  onChange={(event) => updateSelectedNode({ ...data, title: event.target.value })}
                />
              </div>
              <div className="form-stack">
                <label className="field-label" htmlFor="task-assignee">
                  Assignee
                </label>
                <input
                  id="task-assignee"
                  value={data.assignee}
                  onChange={(event) => updateSelectedNode({ ...data, assignee: event.target.value })}
                />
              </div>
              <div className="form-stack form-grid-span">
                <label className="field-label" htmlFor="task-description">
                  Description
                </label>
                <textarea
                  id="task-description"
                  value={data.description}
                  onChange={(event) => updateSelectedNode({ ...data, description: event.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-stack">
                <label className="field-label" htmlFor="task-due-date">
                  Due date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={data.dueDate}
                  onChange={(event) => updateSelectedNode({ ...data, dueDate: event.target.value })}
                />
              </div>
            </div>
            <KeyValueEditor
              items={data.customFields}
              label="Custom fields"
              onChange={(customFields) => updateSelectedNode({ ...data, customFields })}
            />
          </>
        );
      }
      case 'approval': {
        const data = selectedNode.data as ApprovalNodeData;
        return (
          <div className="form-grid">
            <div className="form-stack form-grid-span">
              <label className="field-label" htmlFor="approval-title">
                Title
              </label>
              <input
                id="approval-title"
                value={data.title}
                onChange={(event) => updateSelectedNode({ ...data, title: event.target.value })}
              />
            </div>
            <div className="form-stack">
              <label className="field-label" htmlFor="approval-role">
                Approver role
              </label>
              <input
                id="approval-role"
                value={data.approverRole}
                onChange={(event) => updateSelectedNode({ ...data, approverRole: event.target.value })}
              />
            </div>
            <div className="form-stack">
              <label className="field-label" htmlFor="approval-threshold">
                Auto-approve threshold
              </label>
              <input
                id="approval-threshold"
                type="number"
                min={0}
                value={data.autoApproveThreshold}
                onChange={(event) =>
                  updateSelectedNode({ ...data, autoApproveThreshold: Number(event.target.value) || 0 })
                }
              />
            </div>
          </div>
        );
      }
      case 'automated': {
        const data = selectedNode.data as AutomatedNodeData;

        return (
          <>
            <div className="form-grid">
              <div className="form-stack form-grid-span">
                <label className="field-label" htmlFor="automation-title">
                  Title
                </label>
                <input
                  id="automation-title"
                  value={data.title}
                  onChange={(event) => updateSelectedNode({ ...data, title: event.target.value })}
                />
              </div>
              <div className="form-stack form-grid-span">
                <label className="field-label" htmlFor="automation-action">
                  Automation action
                </label>
                <select
                  id="automation-action"
                  value={data.actionId}
                  onChange={(event) => {
                    const nextAutomation = automations.find((action) => action.id === event.target.value);
                    const nextParams =
                      nextAutomation?.params.reduce<Record<string, string>>((result, key) => {
                        result[key] = data.actionParams[key] ?? '';
                        return result;
                      }, {}) ?? {};

                    updateSelectedNode({
                      ...data,
                      actionId: event.target.value,
                      actionLabel: nextAutomation?.label ?? '',
                      actionParams: nextParams,
                    });
                  }}
                >
                  <option value="">{isLoadingAutomations ? 'Loading actions...' : 'Select an action'}</option>
                  {automations.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedAutomation ? (
              <div className="form-stack">
                <label className="field-label">Action parameters</label>
                {selectedAutomation.params.map((parameter) => (
                  <div className="form-stack" key={parameter}>
                    <input
                      value={data.actionParams[parameter] ?? ''}
                      onChange={(event) =>
                        updateSelectedNode({
                          ...data,
                          actionParams: {
                            ...data.actionParams,
                            [parameter]: event.target.value,
                          },
                        })
                      }
                      placeholder={parameter}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </>
        );
      }
      case 'end': {
        const data = selectedNode.data as EndNodeData;
        return (
          <>
            <div className="form-stack">
              <label className="field-label" htmlFor="end-message">
                End message
              </label>
              <input
                id="end-message"
                value={data.endMessage}
                onChange={(event) => updateSelectedNode({ ...data, endMessage: event.target.value })}
              />
            </div>
            <label className="toggle-row" htmlFor="summary-flag">
              <span>Include summary</span>
              <input
                id="summary-flag"
                type="checkbox"
                checked={data.summaryFlag}
                onChange={(event) => updateSelectedNode({ ...data, summaryFlag: event.target.checked })}
              />
            </label>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <section className="panel-card">
      <div className="panel-header">
        <p className="eyebrow">Inspector</p>
        <h2>{selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} node</h2>
        <p className="muted-copy">Node ID: {selectedNode.id}</p>
      </div>

      <div className="panel-body">{renderForm()}</div>

      <div className="panel-actions">
        <button className="ghost-button" onClick={() => setSelectedNodeId(null)} type="button">
          Close
        </button>
        <button
          className="danger-button"
          onClick={() => deleteNode(selectedNode.id)}
          type="button"
        >
          Delete node
        </button>
      </div>
    </section>
  );
};

export default NodeFormPanel;
