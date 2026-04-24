import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Canvas from './components/Canvas';
import NodeFormPanel from './components/NodeFormPanel';
import SandboxPanel from './components/SandboxPanel';
import Sidebar from './components/Sidebar';
import './index.css';

const App: React.FC = () => (
  <ReactFlowProvider>
    <div className="app-shell">
      <Sidebar />
      <main className="workspace-shell">
        <section className="canvas-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HR Workflow Designer</p>
              <h1>Prototype sandbox for internal process automation</h1>
            </div>
            <p className="section-copy">
              Drag nodes from the left rail, connect steps on the canvas, then configure and
              simulate the flow from the right side panels.
            </p>
          </div>
          <Canvas />
        </section>
        <aside className="inspector-shell">
          <NodeFormPanel />
          <SandboxPanel />
        </aside>
      </main>
    </div>
  </ReactFlowProvider>
);

export default App;
