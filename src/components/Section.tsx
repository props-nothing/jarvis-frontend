import type { ReactNode } from "react";

export default function Section({ id, eyebrow, title, lede, children, pageHeading = false }: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  pageHeading?: boolean;
}) {
  const Heading = pageHeading ? "h1" : "h2";
  return (
    <section className={`section${pageHeading ? " section--page" : ""}`} id={id}>
      <header className="section__head">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <Heading>{title}</Heading>
        {lede ? <p className="lede">{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}
