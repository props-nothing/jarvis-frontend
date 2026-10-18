import { lazy, Suspense } from "react";
import { ArrowRight, BookOpen, Play } from "lucide-react";
import Film from "../components/Film";
import InstallBox from "../components/InstallBox";
import Section from "../components/Section";
import { film } from "../content";
import { QUICK_START_URL } from "../config";

const JarvisMask = lazy(() => import("../components/JarvisMask"));

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="bg-grid" aria-hidden />
      <div className="hero__visual">
        <div className="hero__mask">
          <Suspense fallback={<div className="mask__loading" aria-hidden /> }>
            <JarvisMask />
          </Suspense>
        </div>
      </div>
      <div className="hero__copy">
        <h1 translate="no">JARVIS<span className="hero__period">.</span></h1>
        <p className="hero__tagline">An assistant that gets things done.</p>
        <p className="hero__lede">
          Research, code, and handle everyday tasks with an assistant that remembers you.
        </p>
        <div className="hero__install">
          <InstallBox compact quick />
        </div>
        <div className="hero__links">
          <a className="hero__film" href={QUICK_START_URL} target="_blank" rel="noreferrer"><BookOpen size={14} aria-hidden /> Read the docs</a>
          <a className="hero__film" href="#film"><Play size={14} aria-hidden /> Watch it work <span>{film.durationSeconds} s</span></a>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return <>
    <Hero />
    <Section id="everyday" eyebrow="Made for everyday work" title="A little less on your list.">
      <div className="use-cases">
        <article>
          <span className="use-cases__number" aria-hidden>01</span>
          <div><h3>Start with a clear picture.</h3><p>Bring research, documents and open questions together in a useful brief.</p></div>
          <p className="use-cases__example">“Summarise this folder and list the open questions.”</p>
        </article>
        <article>
          <span className="use-cases__number" aria-hidden>02</span>
          <div><h3>Make room in your day.</h3><p>Prepare replies, work with your calendar and turn scattered notes into documents.</p></div>
          <p className="use-cases__example">“Draft a reply and find a time for us to meet.”</p>
        </article>
        <article>
          <span className="use-cases__number" aria-hidden>03</span>
          <div><h3>Keep work moving.</h3><p>Give a project a goal, schedule routine work and pick up with a daily digest.</p></div>
          <p className="use-cases__example">“Check this project each morning and send me a digest.”</p>
        </article>
      </div>
      <a className="text-link" href="/product">Explore the product <ArrowRight size={16} aria-hidden /></a>
    </Section>
    <Section id="film" eyebrow="A closer look" title="See a task come together." lede="A short walkthrough of research, tools and an approval.">
      <Film />
    </Section>
    <nav className="explore section" aria-label="Explore JARVIS">
      <a href="/integrations"><div><h2>Works with your tools.</h2><p>Explore the connections you can enable.</p></div><ArrowRight size={22} aria-hidden /></a>
      <a href="/how-it-works"><div><h2>Understand what happens.</h2><p>A clear look at permissions, memory and the core.</p></div><ArrowRight size={22} aria-hidden /></a>
    </nav>
  </>;
}
