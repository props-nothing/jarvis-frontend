import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { REPO_URL } from "../config";

const sections = [
  ["capabilities", "Capabilities"], ["trust", "Why JARVIS"],
  ["architecture", "Architecture"], ["install", "Install"], ["roadmap", "Roadmap"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "nav--solid" : ""}`}>
      <a className="nav__brand" href="#top" aria-label="JARVIS home" onClick={() => setOpen(false)}>
        <span className="nav__mark" aria-hidden /> JARVIS
      </a>
      <nav id="site-navigation" className={`nav__links ${open ? "nav__links--open" : ""}`} aria-label="Sections">
        {sections.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav__actions">
        <button type="button" className="icon-button nav__menu" ref={menuButton}
          aria-label={open ? "Close navigation" : "Open navigation"} title={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
        <a className="btn btn--ghost btn--sm" href={REPO_URL} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden /></a>
      </div>
    </header>
  );
}
