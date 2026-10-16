import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { REPO_URL } from "../config";

const sections = [
  ["film", "Watch"], ["capabilities", "Capabilities"], ["trust", "Why JARVIS"],
  ["architecture", "Architecture"], ["install", "Install"], ["roadmap", "Roadmap"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const links = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1021px)");
    const resize = () => {
      setOpen(false);
      if (!desktop.matches && links.current?.contains(document.activeElement)) menuButton.current?.focus({ preventScroll: true });
    };
    desktop.addEventListener("change", resize);
    return () => desktop.removeEventListener("change", resize);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (links.current) links.current.scrollTop = 0;
    links.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      menuButton.current?.focus({ preventScroll: true });
    };
    const outside = (event: Event) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      window.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open]);

  const selectSection = (id: string) => {
    setOpen(false);
    if (!window.matchMedia("(max-width: 1020px)").matches) return;
    const target = document.getElementById(id);
    target?.setAttribute("tabindex", "-1");
    target?.focus({ preventScroll: true });
  };

  return (
    <header ref={header} className={`nav ${scrolled || open ? "nav--solid" : ""}`}>
      <a className="nav__brand" href="#top" aria-label="JARVIS home" onClick={() => selectSection("top")}>
        <span className="nav__mark" aria-hidden /> JARVIS
      </a>
      <nav ref={links} id="site-navigation" className={`nav__links ${open ? "nav__links--open" : ""}`} aria-label="Sections">
        {sections.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => selectSection(id)}>{label}</a>)}
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
