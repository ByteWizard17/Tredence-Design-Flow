# Tredence HR Workflow Designer

A React + TypeScript prototype for visually creating and simulating HR workflows such as onboarding, leave approval, and document verification.

## What is implemented

- Drag-and-drop workflow canvas built with React Flow
- Custom node types: Start, Task, Approval, Automated Step, End
- Node inspector panel with type-specific controlled forms
- Dynamic automation configuration driven by mock `GET /automations`
- Sandbox panel that validates graph structure, serializes workflow JSON, and runs mock `POST /simulate`
- Local mock API layer using MSW
- Typed store and reusable workflow utilities for graph updates and validation

## Architecture

Key folders:

- `src/components`
  - `Canvas.tsx`: React Flow canvas, drag/drop, node selection, edge creation
  - `Sidebar.tsx`: draggable node palette
  - `NodeFormPanel.tsx`: dynamic configuration UI for each node type
  - `SandboxPanel.tsx`: validation + simulation sandbox
  - `nodes/*`: custom node renderers
- `src/store`
  - `useWorkflowStore.ts`: Zustand store for nodes, edges, selection, and mutations
- `src/api`
  - API wrappers for automations and simulation
- `src/mocks`
  - MSW handlers for `/automations` and `/simulate`
- `src/types`
  - shared workflow and API types
- `src/utils`
  - graph serialization, execution ordering, and validation helpers

## Design choices

- Kept workflow state centralized in Zustand so the canvas, inspector, and sandbox stay synchronized.
- Used a typed node-data model to make adding future node types straightforward.
- Separated rendering, data fetching, validation, and graph utilities to keep the prototype extensible.
- Used MSW instead of a real backend so the mock API behaves like production network calls without persistence overhead.
- Added stronger validation than the minimum requirement: start/end constraints, disconnected steps, and cycle detection.

## How to run

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## Mock APIs

- `GET /automations`
  - Returns mock automation actions and dynamic parameter definitions
- `POST /simulate`
  - Accepts serialized workflow JSON and returns a step-by-step execution log

## Assumptions

- This is a frontend-only prototype, so workflow persistence and auth are intentionally omitted.
- The simulation is deterministic and topological rather than representing full business logic branching.
- Validation focuses on structural correctness for a time-boxed submission.

## What I would add with more time

- Visual node-level validation badges on the canvas
- Undo/redo
- Import/export workflow JSON
- Playwright coverage for the drag-drop and simulation flow
- Smarter auto-layout and branch handling
