export type DemoStep = { title: string; detail: string; policy: string; sources: string[]; approval?: boolean };
export type DemoScenario = {
  id: "email" | "research" | "files";
  label: string;
  prompt: string;
  steps: DemoStep[];
  approval?: { ask: string; detail: string };
  result: { title: string; lines: string[] };
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "email", label: "Email", prompt: "Summarize my unread mail and reply to Dana about Thursday's meeting.",
    steps: [
      { title: "Find unread mail", detail: "Four example messages are selected from the inbox. No message is changed.", policy: "Read-only", sources: ["Inbox / 4 example messages"] },
      { title: "Check the context", detail: "Dana's message is compared with the example calendar entry: Thursday at 10:00.", policy: "Read-only", sources: ["Dana / meeting thread", "Calendar / Thursday"] },
      { title: "Prepare the reply", detail: "A reply is drafted for review: Thursday at 10:00 works. Nothing has been sent.", policy: "Draft only", sources: ["Draft / meeting confirmation"] },
      { title: "Send with approval", detail: "Sending reaches another person. This example waits for the owner's decision before the final step.", policy: "Approval required", sources: ["Recipient / dana@example.com"], approval: true },
    ],
    approval: { ask: "Send the meeting confirmation to dana@example.com?", detail: "Subject: Thursday at 10:00. Reply: Thursday at 10:00 works. See you then." },
    result: { title: "Inbox handled. You stayed in control.", lines: ["Four example messages reviewed and summarized.", "The meeting reply would be sent only after your approval.", "The decision and outcome would be recorded in the audit trail."] },
  },
  {
    id: "research", label: "Research", prompt: "Compare local and hosted models for a private notes assistant. Show the trade-offs.",
    steps: [
      { title: "Gather the sources", detail: "The example gathers product documentation and deployment notes rather than treating model memory as a source.", policy: "Read-only", sources: ["Product documentation", "Deployment notes"] },
      { title: "Compare the options", detail: "Local models keep prompts on the machine. Hosted models receive the selected prompt and context. Hardware, connectivity and provider costs differ.", policy: "No external effect", sources: ["Privacy comparison", "Deployment comparison"] },
      { title: "Build the brief", detail: "A source-backed comparison is prepared. No account is connected, no model is changed and no purchase is made.", policy: "Read-only", sources: ["Research brief / model choices"] },
    ],
    result: { title: "A decision brief, not a wall of chat.", lines: ["Local: prompts stay on the machine; hardware sets the limits.", "Hosted: selected context goes to your provider; network and usage costs apply.", "Choose per task. JARVIS keeps the memory and permissions."] },
  },
  {
    id: "files", label: "Files", prompt: "Read my project notes and save a weekly brief with decisions and open questions.",
    steps: [
      { title: "Read the granted folder", detail: "The example reads two notes inside a granted project folder. Access does not extend to the rest of the machine.", policy: "Scoped read", sources: ["notes / roadmap.md", "notes / meeting.md"] },
      { title: "Extract the decisions", detail: "Decisions are separated from unresolved questions and linked to the example notes that support them.", policy: "Read-only", sources: ["Decision list", "Open questions"] },
      { title: "Write the weekly brief", detail: "This example requires approval before writing a new file in the granted folder. The source notes are left unchanged.", policy: "Approval required", sources: ["Destination / notes/weekly-brief.md"], approval: true },
    ],
    approval: { ask: "Create notes/weekly-brief.md?", detail: "A new weekly brief with decisions, open questions and source references. Existing notes would stay unchanged." },
    result: { title: "From scattered notes to a useful brief.", lines: ["A weekly brief would be created in the granted folder.", "Decisions and open questions would retain their source references.", "Original notes would remain unchanged."] },
  },
];

export type DemoStatus = "ready" | "running" | "paused" | "approval" | "completed" | "denied" | "stopped";
export type DemoState = {
  scenarioId: DemoScenario["id"];
  status: DemoStatus;
  step: number;
  decision: "approved" | "denied" | null;
  runId: number;
  viewedStep: number | null;
};
export const initialDemoState: DemoState = { scenarioId: "email", status: "ready", step: 0, decision: null, runId: 0, viewedStep: null };
export type DemoAction =
  | { type: "select"; scenarioId: DemoScenario["id"] }
  | { type: "start" | "pause" | "resume" | "stop" | "approve" | "deny" }
  | { type: "tick"; runId: number; step: number }
  | { type: "inspect"; step: number };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  const scenario = demoScenarios.find((entry) => entry.id === state.scenarioId)!;
  switch (action.type) {
    case "select":
      if (!demoScenarios.some((entry) => entry.id === action.scenarioId)) return state;
      return { ...initialDemoState, scenarioId: action.scenarioId, runId: state.runId + 1 };
    case "start":
      return { ...initialDemoState, scenarioId: state.scenarioId, status: "running", runId: state.runId + 1 };
    case "pause":
      return state.status === "running" ? { ...state, status: "paused" } : state;
    case "resume":
      return state.status === "paused" ? { ...state, status: "running" } : state;
    case "stop":
      return ["running", "paused", "approval"].includes(state.status) ? { ...state, status: "stopped", runId: state.runId + 1 } : state;
    case "approve":
      return state.status === "approval" ? { ...state, status: "running", decision: "approved" } : state;
    case "deny":
      return state.status === "approval" ? { ...state, status: "denied", decision: "denied", runId: state.runId + 1 } : state;
    case "inspect":
      return action.step >= 0 && action.step < scenario.steps.length && action.step <= state.step ? { ...state, viewedStep: action.step } : state;
    case "tick": {
      if (state.status !== "running" || state.runId !== action.runId || state.step !== action.step) return state;
      if (scenario.steps[state.step].approval && state.decision !== "approved") return { ...state, status: "approval" };
      const step = state.step + 1;
      return { ...state, step, status: step === scenario.steps.length ? "completed" : "running" };
    }
  }
}