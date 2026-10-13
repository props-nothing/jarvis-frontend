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
  { step: "Schema", note: "Arguments must match the tool's schema" },
  { step: "Authenticate", note: "Who is asking, over which transport" },
  { step: "Authorize", note: "Is this actor allowed this tool" },
  { step: "Risk", note: "Classify the effect, not the wording" },
  { step: "Approval", note: "Policy decides what you are asked" },
  { step: "Execute", note: "With a timeout, idempotent where it matters" },
  { step: "Audit", note: "Recorded, with sources and outcome" },
];

export type RoadmapItem = { name: string; note: string };

export const roadmap: { status: "built" | "next" | "planned"; label: string; items: RoadmapItem[] }[] = [
  {
    status: "built",
    label: "Working today",
    items: [
      { name: "Daemon and CLI", note: "One program; jarvis daemon is the same file" },
      { name: "Browser console", note: "Holographic head, live mission view, settings" },
      { name: "Approvals and kill switch", note: "Survive a restart; jarvis cancel" },
      { name: "Gmail and Calendar", note: "Sign in from Settings" },
      { name: "Projects, schedules, triggers", note: "Caps, digest, push" },
      { name: "MCP, browser, docs lookup", note: "One-click abilities" },
      { name: "Skills and memory", note: "Proposed by the model, approved by you" },
      { name: "Tool discovery", note: "Selected for the request without making tools unreachable" },
      { name: "Model routing", note: "Per-task models; tokens reported by model" },
      { name: "Telegram", note: "Reach from a phone" },
      { name: "Evals", note: "jarvis eval scores prompt suites against the last run" },
    ],
  },
  {
    status: "next",
    label: "In the queue",
    items: [
      { name: "Coding-agent verification", note: "ACP and Codex tasks are built; console sign-in and cancellation need live proof" },
      { name: "Broader call verification", note: "Owner outbound calls reported working; broader call paths remain unverified" },
      { name: "Setup polish", note: "Fewer questions on first run" },
    ],
  },
  {
    status: "planned",
    label: "Planned",
    items: [
      { name: "Local voice", note: "Browser-independent recognition and synthesis without the cloud" },
      { name: "Desktop client", note: "Tauri app on Windows, macOS and Linux" },
      { name: "Signed installers and public downloads", note: "Blocked on the owner choosing a licence" },
      { name: "Server profile", note: "PostgreSQL + pgvector for multi-device" },
    ],
  },
];

export const platforms = [
  { os: "Windows 10/11", state: "Run end to end by a person", level: "verified" as const, service: "Per-user Run entry at login" },
  { os: "Linux x86_64 / aarch64", state: "Ubuntu 24.04 verified; other targets CI-tested", level: "verified" as const, service: "systemd user unit" },
  { os: "macOS Apple silicon / Intel", state: "Compiles, lints and tests in CI", level: "ci" as const, service: "launchd agent" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Is JARVIS available to download?",
    a: "Not as a public download yet. No licence has been chosen, which blocks distribution. Today you build one program from source with the Rust toolchain; the installer below does that for you. Prebuilt, signed archives arrive after the licence decision.",
  },
  {
    q: "Which models does it work with?",
    a: "Any OpenAI-compatible endpoint: Ollama on your computer or Ollama Cloud, OpenAI, Gemini, Anthropic's compatible endpoint and others. You can add a fallback model at a second provider.",
  },
  {
    q: "What stops it doing something I did not ask for?",
    a: "The model can only request an effect. Deterministic Rust policy decides whether it may happen, every tool call is validated, risk-classified and audited, and effects that matter ask you first. jarvis cancel is a kill switch.",
  },
  {
    q: "Does it send my data to the cloud?",
    a: "Only what you point it at. State lives in SQLite on your machine, keys sit in private files and are never printed or sent to the browser. Your prompts go to the model provider you choose; choose Ollama locally and they stay on the machine.",
  },
  {
    q: "Can I reach it from outside my machine?",
    a: "The console listens on 127.0.0.1 only, on purpose. On a server, use an SSH tunnel. Telegram is the no-tunnel way to reach it from a phone. A TLS remote mode is separate, explicit future work; do not forward the port to the internet.",
  },
  {
    q: "How is it different from other agent frameworks?",
    a: "Frameworks and models are replaceable adapters here. Memory, permissions, approvals, audit and workflow state belong to JARVIS, never to a model or an external runtime.",
  },
];
