export function SectionShell({ id, eyebrow, title, children }) {
  return (
    <section className="content-section" id={id}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
