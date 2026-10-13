/** Every claim here is sourced from the JARVIS repository docs; see docs/CONTENT-ACCURACY.md. */

export type Feature = { icon: string; title: string; body: string; tag: string };

export const features: Feature[] = [
  {
    icon: "◈",
    tag: "Files",
    title: "Reads your documents",
    body: "Read, search, write, edit and move files in the folders you grant. PDF, Word, spreadsheets and slides. Photos and scans too, when tesseract is installed.",
  },
  {
    icon: "◎",
    tag: "Web",
    title: "Browses and researches",
    body: "Searches, fetches pages and PDFs with sources shown, and drives a private browser window. Clicking, typing and uploading always ask you first.",
  },
  {
    icon: "✉",
    tag: "Google",
    title: "Mail and calendar",
    body: "Sign in once from Settings. It searches and reads mail, drafts, replies, sends with attachments and manages events. Anything that reaches another person asks first.",
  },
  {
    icon: "▣",
    tag: "Projects",
    title: "Long-running work",
    body: "Each project has a goal, standing guidance and a journal, with daily caps on runs and tokens. A daily digest, and an optional push to your phone.",
  },
  {
    icon: "⟳",
    tag: "Autonomy",
    title: "Works while you are away",
    body: "Time-zone schedules, triggers on new mail, files or requests, sub-agents, and resume after a restart. Code runs in a throwaway container.",
  },
  {
    icon: "◉",
    tag: "Voice",
    title: "Talk to it",
    body: "Push-to-talk, a wake word, spoken answers you can interrupt, and a spoken \u201cJarvis, stop\u201d. A neural voice when you add an ElevenLabs key.",
  },
  {
    icon: "❖",
    tag: "Memory",
    title: "Remembers, with your consent",
    body: "It proposes what to remember and you confirm. It can also propose reusable skills from your procedures; you approve each one.",
  },
  {
    icon: "⌘",
    tag: "MCP",
    title: "Plugs into everything",
    body: "Add any MCP server from Settings. Or let Claude Code, Cursor, VS Code or your own scripts use JARVIS with one switch and one key.",
  },
  {
    icon: "✈",
    tag: "Telegram",
    title: "Reach it from your phone",
    body: "Configured in Settings, with no tunnel and no public port. Answers are formatted for chat.",
  },
];

export const pipeline = [
  { step: "Schema", note: "Validate the request", detail: "Tool arguments must match a defined schema. A convincing prompt cannot make an invalid request executable." },
  { step: "Authenticate", note: "Establish identity", detail: "The gateway identifies the caller and transport. Being a model, an app, or a browser tab is not permission to act." },
  { step: "Authorize", note: "Check the grant", detail: "Rust checks the actor's granted tools and scope. A model request cannot widen access to your files, accounts or workspace." },
  { step: "Risk", note: "Classify the effect", detail: "Risk follows what an action does, not how harmless its wording sounds. Reading a draft and sending it are different effects." },
  { step: "Approval", note: "The owner decides", detail: "Policy decides which actions need your approval. You answer yes or no from an authenticated surface; the model cannot approve itself." },
  { step: "Execute", note: "Bound the action", detail: "An authorized tool runs with a timeout and the permitted scope. Idempotency is applied where relevant, not assumed for every external operation." },
  { step: "Audit", note: "Keep the evidence", detail: "The decision and outcome are recorded with sources. A requested action is not the same as a confirmed external result." },
];

export type RoadmapItem = { name: string; note: string };
export const roadmapReviewedAt = "2026-10-13";

export const roadmap: { status: "built" | "experimental" | "next" | "planned"; label: string; items: RoadmapItem[] }[] = [
  {
    status: "built",
    label: "Available now",
    items: [
      { name: "Console, CLI & Telegram", note: "Text, browser voice, live activity and authenticated app access" },
      { name: "Files & knowledge search", note: "Granted folders, documents and a first full-text knowledge index" },
      { name: "Google, web & MCP", note: "Gmail, Calendar, browser tools and managed MCP servers" },
      { name: "Memory, skills & projects", note: "Owner-approved learning, project journals, digests and budgets" },
      { name: "Triggers & model routing", note: "Time-zone schedules, quiet hours, per-task models and spend guards" },
      { name: "Policy & oversight", note: "Durable approvals, cancellation, audit, usage and evaluation suites" },
    ],
  },
  {
    status: "experimental",
    label: "Experimental",
    items: [
      { name: "ACP coding agents", note: "Ordinary and background Codex tasks verified; console sign-in and real-agent cancellation remain open. Worktrees are not a sandbox." },
      { name: "Provider-backed calls", note: "Owner outbound calls reported working. Inbound and third-party configurations still need broader proof." },
    ],
  },
  {
    status: "next",
    label: "Up next",
    items: [
      { name: "Owner-account verification", note: "OCR, fallback provider, push, replies and saved provider changes" },
      { name: "MCP credentials & remote use", note: "Credential-bearing servers, remote servers and apply-without-restart checks" },
      { name: "First-run polish", note: "A clearer first five minutes; licence and clean-machine gates stay explicit" },
      { name: "Retrieval & safety evaluation", note: "Measure knowledge-search quality, tool ranking and hostile-page behavior" },
    ],
  },
  {
    status: "planned",
    label: "Later, deliberately",
    items: [
      { name: "Local voice", note: "Browser-independent recognition and synthesis without the cloud" },
      { name: "Desktop client", note: "Tauri is parked until there is a named requirement" },
      { name: "Signed installers and public downloads", note: "Blocked on the owner choosing a licence" },
      { name: "Server profile", note: "PostgreSQL + pgvector; multi-device requires proven ownership semantics" },
      { name: "Multi-step workflow engine", note: "Parked until ordinary runs and schedules cannot express the job" },
    ],
  },
];

export const platforms = [
  { os: "Windows 10/11", state: "Run end to end by a person", level: "verified" as const, service: "Per-user Run entry at login" },
  { os: "Linux x86_64 / aarch64", state: "Ubuntu 24.04 verified; other targets CI-tested", level: "verified" as const, service: "systemd user unit" },
  { os: "macOS Apple silicon / Intel", state: "Compiles, lints and tests in CI", level: "ci" as const, service: "launchd agent" },
];

