/** Public document destinations; metadata and sitemap are generated from this catalog. */
export const pages = [
  { id: "home", path: "/", file: "index.html", label: "Home", title: "JARVIS — an assistant that gets things done", description: "Research, code, and handle everyday tasks with JARVIS, an open-source personal AI assistant that remembers you." },
  { id: "product", path: "/product", file: "product.html", label: "Product", title: "Product — JARVIS", description: "Explore what JARVIS can do for everyday work, research, documents and automation, with clear capability limits." },
  { id: "integrations", path: "/integrations", file: "integrations.html", label: "Integrations", title: "Integrations — JARVIS", description: "Connect JARVIS to Google, Telegram, models, voice and MCP tools. See built-in connections, optional adapters and experimental capabilities." },
  { id: "how-it-works", path: "/how-it-works", file: "how-it-works.html", label: "How it works", title: "How it works — JARVIS", description: "Understand how JARVIS handles permissions, approvals, tools and memory through its native Rust control plane." },
  { id: "install", path: "/install", file: "install.html", label: "Install", title: "Install — JARVIS", description: "Install JARVIS on Windows, Linux or macOS. Get the signed prerelease, complete first-run setup and check platform requirements." },
  { id: "roadmap", path: "/roadmap", file: "roadmap.html", label: "Roadmap", title: "Roadmap — JARVIS", description: "See what JARVIS delivers today, what is experimental and what comes next, with dated verification evidence." },
] as const;

export type PageId = typeof pages[number]["id"];

const legacyAnchors: Record<string, string> = {
  "#capabilities": "/product",
  "#trust": "/how-it-works#trust",
  "#architecture": "/how-it-works#architecture",
  "#install": "/install",
  "#roadmap": "/roadmap",
};

export function legacyDestination(hash: string): string | undefined {
  return Object.hasOwn(legacyAnchors, hash) ? legacyAnchors[hash] : undefined;
}
