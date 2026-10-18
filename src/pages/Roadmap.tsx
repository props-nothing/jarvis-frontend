import { ArrowRight } from "lucide-react";
import Section from "../components/Section";
import { roadmap, roadmapReviewedAt } from "../content";
import { REPO_URL, ROADMAP_URL } from "../config";

const summaries = {
  built: "The assistant, everyday tools and project workflows.",
  experimental: "Coding agents and phone providers, with limited verification.",
  next: "More reliable setup, connections and retrieval.",
  planned: "Larger additions, when there is a clear need.",
};

export default function Roadmap() {
  return <>
    <Section pageHeading
      id="roadmap"
      title="Where JARVIS stands."
      lede="What is available, what needs more testing, and what comes later."
    >
      <div className="road__review"><span>Evidence reviewed <time dateTime={roadmapReviewedAt}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${roadmapReviewedAt}T00:00:00Z`))}</time></span><a href={`${REPO_URL}/blob/main/TODO.md`} target="_blank" rel="noreferrer">Acceptance backlog <ArrowRight size={14} aria-hidden /></a></div>
      <div className="road">
        {roadmap.map((col) => (
          <details key={col.status} className={`road__col road__col--${col.status}`} open={col.status === "built"}>
            <summary>
              <h2>
                <span className="road__intro"><span className="road__title"><span className="road__dot" aria-hidden />{col.label}</span><span className="road__summary">{summaries[col.status]}</span></span>
                <span className="road__count">{col.items.length} items</span>
                <span className="road__toggle" aria-hidden />
              </h2>
            </summary>
            <ul>
              {col.items.map((it) => (
                <li key={it.name}>
                  <strong>{it.name}</strong>
                  <span>{it.note}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <p className="more" data-reveal>
        <a href={ROADMAP_URL} target="_blank" rel="noreferrer">
          Full roadmap →
        </a>
      </p>
    </Section>
  </>;
}
