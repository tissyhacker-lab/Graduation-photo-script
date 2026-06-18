function KeywordList({ label, items }) {
  return (
    <div>
      <p className="metadata-label">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line bg-white/72 px-4 py-2 text-sm text-ink"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Concept({ concept }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="concept-title">
      <div>
        <p className="section-kicker">Concept</p>
        <h2 id="concept-title" className="section-title">摄影概念</h2>
      </div>
      <div className="quiet-card p-6 sm:p-8">
        {concept.theme && (
          <p className="font-serif text-3xl leading-snug text-ink sm:text-4xl">{concept.theme}</p>
        )}
        <div className={concept.theme ? 'mt-8 grid gap-7 sm:grid-cols-2' : 'grid gap-7 sm:grid-cols-2'}>
          <KeywordList label="Emotions" items={concept.emotions} />
          <KeywordList label="Color Tones" items={concept.tones} />
        </div>
      </div>
    </section>
  );
}

export default Concept;
