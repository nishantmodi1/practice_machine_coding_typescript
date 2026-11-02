### Problem Statement: Undo/Redo Canvas with Drag Support
## Difficulty: Hard
# Time Limit: 60 minutes (target), 75 minutes (max for first attempt)
# Category: State History, Immutability, Drag Events, Memento Pattern

🎯 Objective
  - Build a canvas application where users can:

  - Click to create rectangles

  - Drag rectangles to move them

  - Undo and redo every action (create + move)

  - See the current undo/redo stack state

  - Every state change must be reversible and the entire history must be serializable (deep-cloned snapshots).

📚 Background Concepts (Read Before Building)
  - The Memento Pattern
  - The Undo/Redo pattern is a classic software design pattern called Memento. The idea:

## Before every state change, save a snapshot of the current state. To undo, restore the previous snapshot. To redo, restore the snapshot that was undone.

# There are two ways to implement it:

  - Approach	Description	Pros	Cons
  - Snapshot-based	Save full copy of state on every action	Simple, bulletproof	More memory
  - Command-based	Save only the delta (action)	Memory efficient	Complex to reverse-engineer
  - For this problem, use Snapshot-based. It's simpler, safer, and interviewers accept it. Command-based is overkill unless explicitly requested.

# Why Deep Clone Is Critical
  - Consider this trap:

typescript
// WRONG
const past = [...history]; // copies references, not objects
Now when you mutate a rectangle later, you mutate the past history too. Undo breaks. The reason: JavaScript array spread is a shallow copy.

Fix: Use structuredClone() (modern, built-in) or a recursive deep clone.

typescript
// CORRECT
const past = structuredClone(history);
structuredClone handles nested objects, arrays, and dates — but not functions or DOM nodes. For plain data (rectangles), it's perfect.

Why Commit-on-MouseUp Matters
If you call setRects() on every mousemove during a drag, you'll push 100+ history entries per drag — one per pixel moved. Undo becomes unusable.

Fix: Use a local state for the live drag preview, and only commit to history on mouseup.

📋 Functional Requirements
FR-1: Create Rectangles
Clicking on an empty area of the canvas creates a new rectangle

Rectangles are 80×60 px by default

Each rectangle gets a unique ID and a random pastel color

The rectangle is centered on the click position

FR-2: Drag Rectangles
Clicking on an existing rectangle and dragging moves it

The rectangle follows the cursor in real-time

On mouseup, the new position is committed

The cursor changes to move when hovering over a rectangle

FR-3: Undo/Redo
An "Undo" button restores the previous state

A "Redo" button restores the next state

Keyboard shortcuts: Ctrl+Z / Cmd+Z for undo, Ctrl+Y / Cmd+Shift+Z for redo

Buttons are disabled when their respective stacks are empty

Any new action clears the redo stack

FR-4: State Display
Show the total number of rectangles

Show the size of the undo stack (past)

Show the size of the redo stack (future)

Show whether undo/redo is available

FR-5: Persistence (Bonus)
On page refresh, restore the last canvas state (rectangles)

Do NOT persist undo/redo history (only the current state)

🏗️ Technical Requirements
TR-1: TypeScript Strict Mode
All types must be explicit

No any

Generics where applicable

TR-2: Custom Hook — useHistory<T>
You must build a reusable generic hook:

typescript
function useHistory<T>(initialState: T): {
  state: T;
  set: (updater: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pastCount: number;
  futureCount: number;
}
Behavior:

set(updater) — pushes current state to past, clears future, updates state

undo() — moves current state to future, pops top of past as new state

redo() — moves current state to past, pops top of future as new state

canUndo — true when past.length > 0

canRedo — true when future.length > 0

All snapshots must be deep clones

TR-3: Data Structure
typescript
type Rect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};
TR-4: No External Libraries
No immer, lodash, immutable.js

Plain React + TypeScript

Native browser APIs only (structuredClone, crypto.randomUUID)

🚫 Constraints & Edge Cases
Edge Case 1: Empty Undo Stack
Clicking Undo when past is empty should do nothing (not crash)

Button must be disabled visually

Edge Case 2: Redo After New Action
Perform: Add rect → Undo → Add new rect

Redo should be disabled (the old redo is invalidated)

Edge Case 3: Drag Off-Canvas
If a rectangle is dragged off the edge, decide: clamp it back inside OR allow it

Recommended: Clamp so the rectangle stays fully visible

Edge Case 4: Click on Rect ≠ Create New Rect
Clicking on a rectangle should NOT create a new one

Use e.stopPropagation() in the rect's mousedown handler

Edge Case 5: Mouse Leaves Canvas During Drag
If the user drags outside the canvas and releases, the drag must end gracefully

Handle via onMouseLeave or window event listeners

Edge Case 6: Keyboard Shortcuts While Focused on Button
Ctrl+Z while focus is on a button should still trigger undo

Use window.addEventListener("keydown", ...) not input-level handlers

Edge Case 7: Deep Clone of Complex Objects
If a rect has nested objects (e.g., metadata), structuredClone handles it

If it has functions or class instances, it will throw — handle gracefully

Edge Case 8: Rapid Clicking
5 rapid clicks = 5 rectangles + 5 history entries

All undoable individually

📐 UI Structure (Suggested, Not Mandatory)
text
┌──────────────────────────────────────────────────┐
│  [Undo (Ctrl+Z)]  [Redo (Ctrl+Y)]                │
│  Rects: 3  |  Past: 5  |  Future: 2              │
├──────────────────────────────────────────────────┤
│                                                  │
│         ┌─────┐                                  │
│         │  A  │                                  │
│         └─────┘                                  │
│                        ┌─────┐                   │
│                        │  B  │                   │
│                        └─────┘                   │
│                                                  │
│      ┌─────┐                                     │
│      │  C  │                                     │
│      └─────┘                                     │
│                                                  │
└──────────────────────────────────────────────────┘
✅ Acceptance Criteria
A solution is accepted if:

#	Criterion	How to Test
1	Click on canvas creates a rectangle	Click 5 times, see 5 rects
2	Click on a rect does NOT create a new one	Click on an existing rect, count stays same
3	Drag moves a rect smoothly	Drag rect A, it follows cursor
4	Undo reverses a create	Create → Undo → rect disappears
5	Redo restores a create	Undo → Redo → rect reappears
6	Undo reverses a drag	Drag → Undo → rect returns to previous position
7	One drag = one history entry	Drag from A to B, past count increases by 1
8	Undo stack clears after new action	Add → Undo → Add → Redo is disabled
9	Keyboard shortcuts work	Ctrl+Z / Ctrl+Y trigger undo/redo
10	Buttons disabled when stack empty	Fresh load → both disabled
11	Redo stack cleared on new action	Add → Undo → Add → Future count = 0
12	No console errors	Open DevTools, no red
13	useHistory is generic and reusable	Works with Rect[] and could work with other types
14	Deep clone verified	Mutate original rect after undo, past state unaffected
15	Handles 20+ rects smoothly	20 rects, 40+ undo steps, no lag
🧪 Test Scenarios (Write These as Manual Tests)
Scenario 1: Basic Create + Undo/Redo
Load page → 0 rects, both buttons disabled

Click 3 times → 3 rects, Undo enabled, Redo disabled

Click Undo → 2 rects, both buttons enabled

Click Redo → 3 rects, Redo disabled

Click Undo, Undo, Undo → 0 rects, Undo disabled, Redo enabled

Scenario 2: Drag + Undo
Create 2 rects (A, B)

Note A's position

Drag A from (100, 100) to (300, 200)

Past count should increase by exactly 1

Click Undo → A should be back at (100, 100)

Click Redo → A at (300, 200)

Scenario 3: Redo Invalidation
Create rect A

Undo (A is gone, Redo enabled)

Create rect B (at same time — Redo should now be disabled)

Redo button must be disabled

Scenario 4: Rapid Actions
Create 10 rects quickly

Undo 10 times → empty

Redo 10 times → all 10 back

Scenario 5: Drag Off-Canvas
Create rect

Try to drag it off the right edge

Rect should stop at the boundary (clamped)

Scenario 6: Deep Clone Verification
Create rect A

Capture A's initial position in a variable

Drag A 100px right

Undo

The variable should still hold the ORIGINAL position — proving history wasn't mutated

🎁 Bonus Requirements (Optional, Only If Time Permits)
Bonus 1: Rectangle Resize
Add a resize handle at the bottom-right of each rect

Dragging it changes width/height

Resize is undoable

Bonus 2: Delete via Double-Click
Double-clicking a rect deletes it

Deletion is undoable

Bonus 3: Selection
Clicking a rect selects it (outline)

Pressing Delete/Backspace deletes selected rect

Selection change is NOT undoable

Bonus 4: Serialization
Export canvas state to JSON (button)

Import JSON to restore state

Bonus 5: History Branching Display
Show a small visual of past/future counts as a graph

Not required, but nice polish

📁 Suggested File Structure
text
src/problems/undo-redo/
├── App.tsx
├── types.ts
├── hooks/
│   └── useHistory.ts
├── components/
│   ├── Canvas.tsx
│   ├── Rectangle.tsx
│   └── Toolbar.tsx
└── styles.css
🧠 Hints (Read Only If Stuck for 10+ Minutes)
Hint 1: useHistory Implementation Skeleton
typescript
export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = (updater: T | ((prev: T) => T)) => {
    setState(prev => {
      setPast(p => [...p, structuredClone(prev)]);
      setFuture([]);
      return typeof updater === "function"
        ? (updater as (p: T) => T)(prev)
        : updater;
    });
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    setFuture(f => [structuredClone(state), ...f]);
    setPast(newPast);
    setState(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(p => [...p, structuredClone(state)]);
    setFuture(newFuture);
    setState(next);
  };

  return {
    state,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    pastCount: past.length,
    futureCount: future.length,
  };
}
Hint 2: Drag Logic Pattern
typescript
// Local state for live preview (not committed to history)
const [liveRects, setLiveRects] = useState<Rect[] | null>(null);
const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

// On rect mousedown
const onRectMouseDown = (e: React.MouseEvent, rect: Rect) => {
  e.stopPropagation(); // Prevent canvas click from creating a new rect
  const canvasBox = canvasRef.current!.getBoundingClientRect();
  const mouseX = e.clientX - canvasBox.left;
  const mouseY = e.clientY - canvasBox.top;
  setDragging({
    id: rect.id,
    offsetX: mouseX - rect.x,
    offsetY: mouseY - rect.y,
  });
};

// On canvas mousemove
const onCanvasMouseMove = (e: React.MouseEvent) => {
  if (!dragging) return;
  const canvasBox = canvasRef.current!.getBoundingClientRect();
  const mouseX = e.clientX - canvasBox.left;
  const mouseY = e.clientY - canvasBox.top;

  const newX = clamp(mouseX - dragging.offsetX, 0, CANVAS_WIDTH - RECT_WIDTH);
  const newY = clamp(mouseY - dragging.offsetY, 0, CANVAS_HEIGHT - RECT_HEIGHT);

  const base = liveRects ?? state; // Fall back to committed state
  setLiveRects(base.map(r => r.id === dragging.id ? { ...r, x: newX, y: newY } : r));
};

// On canvas mouseup
const onCanvasMouseUp = () => {
  if (dragging && liveRects) {
    set(liveRects); // Commit to history
  }
  setDragging(null);
  setLiveRects(null);
};

// Which rects to render:
const displayRects = liveRects ?? state;
Hint 3: Clamp Helper
typescript
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
🚨 Common Pitfalls (Pre-empted)
Pitfall	Symptom	Fix
Shallow copy in history	Undo restores wrong positions	Use structuredClone
Committing on every mousemove	Undo stack grows 100× per drag	Use local state + commit on mouseup
Event bubbling	Clicking a rect also creates a new rect	e.stopPropagation() in rect mousedown
Mouse leaves canvas mid-drag	Rect sticks to cursor forever	Handle onMouseLeave or use window listeners
Wrong offset calculation	Rect jumps when drag starts	Offset = mouse position − rect position at mousedown
Stale closure in listeners	Drag uses old rect positions	Depend on dragging and liveRects in useEffect deps
Keyboard shortcut conflicts	Ctrl+Z triggers browser undo	e.preventDefault()
Not clearing future on new action	Redo brings back invalid states	Clear future inside set()
Cloning causes performance issues	Lag with 50+ rects	structuredClone is fast; only clone when committing
📊 Scoring Rubric (How an Interviewer Would Grade)
Category	Weight	What They Look For
Correctness	30%	All 15 acceptance criteria pass
Code structure	20%	useHistory is generic, files are separated, types are clean
Edge case handling	20%	All 8 edge cases handled
Performance	15%	Drag is smooth, no memory leaks, history is efficient
Communication	10%	Code is readable, functions are named well
Testing	5%	Manual test scenarios verified
Score of 85+ = hire signal. Score of 70-84 = borderline. Below 70 = reject.

🎯 Time Allocation (60-Minute Target)
Phase	Time	Deliverable
Read problem + clarify	5 min	Understand requirements
Design types + hook skeleton	5 min	types.ts + useHistory.ts skeleton
Implement useHistory	10 min	Working generic hook
Canvas + click-to-create	10 min	Rects appear on click
Drag logic	15 min	Rects move smoothly
Undo/Redo buttons + keyboard	5 min	Wired up
Self-test + edge cases	10 min	Verify all scenarios
Total	60 min	
If you're at 60 min and not done, stop and review. The review is more valuable than pushing to 90 min.

🚀 Next Step
Copy this problem into a file problem.md in your repo. Set a 60-minute timer. Build without looking at the hints.

When done (or timer ends), reply with:

GitHub Gist / CodeSandbox link

Time taken

Which edge case was hardest

One thing you'd do differently next time

I'll review it line-by-line and tell you exactly what an interviewer would flag. 💪

