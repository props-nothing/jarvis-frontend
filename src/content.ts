/** Claims are checked against JARVIS implementation and delivery evidence; see docs/CONTENT-ACCURACY.md. */

export type Feature = { icon: string; title: string; body: string; tag: string };

export const features: Feature[] = [
  {
    icon: "◈",
    tag: "Files",
    title: "Reads your documents",
    body: "Read, search, write, edit and move files in granted folders. Read PDF, Word, spreadsheets and slides; OCR needs Tesseract. File deletion moves one file into recoverable .jarvis-trash, never a permanent purge.",
  },
  {
    icon: "◎",
    tag: "Web",
    title: "Browses and researches",
    body: "Fetch pages and PDFs, search with a configured key, and read JavaScript pages in an isolated browser session. Clicking, typing and uploading ask by default; your permission settings decide.",
  },
  {
    icon: "✉",
    tag: "Google",
    title: "Mail and calendar",
    body: "Connect Google from Settings for mail, drafts, replies, attachments and calendar events. Sending asks first. Mail cleanup moves a message to Gmail Trash; existing accounts need a new sign-in for that scope.",
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
    body: "Time-zone schedules, mail/file/webhook triggers and sub-agents. Eligible recent interrupted requests get one new continuation after restart, not exact replay. Optional container code execution needs Docker and a configured image.",
  },
  {
    icon: "◉",
    tag: "Voice",
    title: "Talk to it",
    body: "Browser push-to-talk, a wake word, interruptible answers and a spoken \u201cJarvis, stop\u201d. Optional ElevenLabs synthesis. Recognition depends on browser support and may use its speech service; this is not offline local voice.",
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
    title: "Connect tools and apps",
    body: "Manage local and remote MCP servers from Settings, with named keys or browser sign-in using a registered provider app. Provider compatibility still needs verification. Opt-in authenticated app access keeps approvals with you.",
  },
  {
    icon: "✈",
    tag: "Telegram",
    title: "Reach it from your phone",
    body: "Configured in Settings, with no tunnel and no public daemon port. Answers and approval decisions travel through Telegram, not an offline local channel.",
  },
  {
    icon: "▤",
    tag: "Documents",
    title: "Creates useful documents",
    body: "Create new Word, PDF, CSV and Excel files. Edit literal cells in an existing XLSX while preserving untouched formatting and formulas. Protected, macro and signed workbooks are refused; formulas are not recalculated.",
  },
  {
    icon: "♙",
    tag: "Contacts",
    title: "Keeps a contact list",
    body: "Save, search, import CSV, find duplicates and merge JARVIS contacts. Imports use a granted folder and preserve do-not-contact suppression. Authorized deletion removes the contact and its suppression together under your permission policy.",
  },
  {
    icon: "⌥",
    tag: "Experimental",
    title: "Delegates coding tasks",
    body: "Run background coding jobs in a permitted folder, with optional Git worktrees, skill bundles and managed previews. Independent checks report separately from task completion. Host processes are not a sandbox; no automatic commit, merge or push.",
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
export const roadmapReviewedAt = "2026-10-16";
export const projectLicense = { spdx: "Apache-2.0", name: "Apache License 2.0", path: "/licenses/jarvis.txt" } as const;

export const roadmap: { status: "built" | "experimental" | "next" | "planned"; label: string; items: RoadmapItem[] }[] = [
  {
    status: "built",
    label: "Available now",
    items: [
      { name: "Console, CLI & Telegram", note: "Text, browser voice, live activity and authenticated app access" },
      { name: "Files & knowledge search", note: "Granted folders, document creation, XLSX cell editing, recoverable file trash and a full-text index" },
      { name: "Google, contacts, web & MCP", note: "Gmail and Calendar, Gmail Trash, contact CSV import and merge, browser tools and managed MCP servers" },
      { name: "Open-source platform & website", note: "Apache-2.0 for original code and docs; third-party notices and prototype restrictions remain separate" },
      { name: "Memory, skills & projects", note: "Owner-approved learning, project journals, digests and budgets" },
      { name: "Triggers & model routing", note: "Time-zone schedules, quiet hours, per-task models and spend guards" },
      { name: "Policy & oversight", note: "Durable approvals, cancellation, audit, usage and evaluation suites" },
    ],
  },
  {
    status: "experimental",
    label: "Experimental",
    items: [
      { name: "ACP coding agents", note: "In-place jobs, optional worktrees, independent checks and managed previews are built. A real Codex dependency-install check passed; full website delivery, console sign-in and real-agent cancellation remain open. Host processes are not a sandbox." },
      { name: "Provider-backed calls", note: "Owner outbound calls reported working. Inbound and third-party configurations still need broader proof." },
    ],
  },
  {
    status: "next",
    label: "Up next",
    items: [
      { name: "Owner-account verification", note: "OCR, fallback provider, push, replies and saved provider changes" },
      { name: "MCP account verification", note: "Named keys and pre-registered OAuth are built; real-provider consent, native acceptance and apply-without-restart remain open" },
      { name: "First-run polish", note: "A clearer first five minutes; clean-machine installation and service handoff checks remain open" },
      { name: "Retrieval & safety evaluation", note: "Measure knowledge-search quality, tool ranking and hostile-page behavior" },
    ],
  },
  {
    status: "planned",
    label: "Later, deliberately",
    items: [
      { name: "Local voice", note: "Browser-independent recognition and synthesis without the cloud" },
      { name: "Desktop client", note: "Tauri is parked until there is a named requirement" },
      { name: "Signed installers and public downloads", note: "License selected. Dependency notices, signing/notarization, release publication and clean-machine verification still needed" },
      { name: "Server profile", note: "PostgreSQL + pgvector; multi-device requires proven ownership semantics" },
      { name: "Multi-step workflow engine", note: "Parked until ordinary runs and schedules cannot express the job" },
    ],
  },
];

export const platforms = [
  { os: "Windows 10/11", state: "Run end to end by a person", level: "verified" as const, service: "Per-user Run entry at login" },
  { os: "Linux x86_64 / aarch64", state: "Ubuntu 24.04 recorded; aarch64 acceptance pending", level: "verified" as const, service: "systemd user unit" },
  { os: "macOS Apple silicon / Intel", state: "Native CI and clean-machine acceptance pending", level: "ci" as const, service: "launchd agent" },
];

