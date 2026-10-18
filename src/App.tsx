import { useEffect, type ReactNode } from "react";
import Nav from "./components/Nav";
import { projectLicense } from "./content";
import { DOCS_URL, REPO_URL, SECURITY_URL } from "./config";
import type { PageId } from "./site";

export default function App({ page, children }: { page: PageId; children: ReactNode }) {
  useEffect(() => {
    // The browser may try to resolve a fragment before React has mounted it.
    try {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      target?.scrollIntoView({ behavior: "instant", block: "start" });
    } catch {
      // A malformed external fragment must not prevent the page from rendering.
    }
  }, []);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Nav page={page} />
    <main id="main" tabIndex={-1} className={page === "home" ? "home" : `page page--${page}`}>
      {children}
    </main>
    <footer className="footer">
      <div><a className="footer__brand" href="/">JARVIS</a><p>Your assistant. Open source.</p></div>
      <nav aria-label="Footer">
        <a href="/roadmap" aria-current={page === "roadmap" ? "page" : undefined}>Roadmap</a>
        <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
        <a href={DOCS_URL} target="_blank" rel="noreferrer">Docs</a>
        <a href={SECURITY_URL} target="_blank" rel="noreferrer">Security</a>
        <a href={projectLicense.path} target="_blank" rel="noreferrer">{projectLicense.spdx}</a>
        <a href="/licenses/notice.txt" target="_blank" rel="noreferrer">Notices</a>
      </nav>
    </footer>
  </>;
}
