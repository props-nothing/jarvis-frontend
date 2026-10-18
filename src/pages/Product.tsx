import { ArrowRight } from "lucide-react";
import Section from "../components/Section";
import { features } from "../content";

const groups = [
  { id: "everyday", title: "Everyday work", tags: ["Files", "Google", "Documents", "Contacts"] },
  { id: "knowledge", title: "Knowledge & conversation", tags: ["Web", "Memory", "Voice"] },
  { id: "automation", title: "Projects & automation", tags: ["Projects", "Autonomy", "MCP", "Telegram", "Experimental"] },
];

export default function Product() {
  return <Section pageHeading id="product" title="A little help with the everyday." lede="Research, documents and ongoing projects. Choose what you want to hand over.">
    <nav className="page-index" aria-label="Product topics">
      {groups.map((group) => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}
    </nav>
    {groups.map((group) => <section className="feature-group" id={group.id} key={group.id}>
      <header><h2>{group.title}</h2></header>
      <div className="feature-list">
        {group.tags.map((tag) => {
          const feature = features.find((item) => item.tag === tag)!;
          return <article className="feature" key={tag}>
            <h3>{feature.title}</h3>
            {tag === "Experimental" ? <span className="feature__label">Experimental</span> : null}
            <p>{feature.summary}</p>
          </article>;
        })}
      </div>
      <details className="disclosure feature-details">
        <summary>Details and limits<span className="sr-only"> for {group.title.toLowerCase()}</span></summary>
        <dl className="detail-list">{group.tags.map((tag) => {
          const feature = features.find((item) => item.tag === tag)!;
          return <div key={tag}><dt>{feature.title}</dt><dd>{feature.body}</dd></div>;
        })}</dl>
      </details>
    </section>)}
    <div className="page-next"><p>Choose the connections that fit your day.</p><a className="text-link" href="/integrations">Explore integrations <ArrowRight size={16} aria-hidden /></a></div>
  </Section>;
}
