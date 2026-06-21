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
  const groups = concept.groups || [
    { label: '情绪', items: concept.emotions || [] },
    { label: '色调', items: concept.tones || [] },
  ];

  return (
    <section className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]" aria-labelledby="concept-title">
      <div>
        <p className="section-kicker">Concept</p>
        <h2 id="concept-title" className="section-title">摄影概念</h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted">
          根据当前参考图提炼，用于现场统一情绪、色彩、动作和画面质感。
        </p>
      </div>
      <div className="quiet-card p-6 sm:p-8">
        {concept.theme && (
          <p className="font-serif text-3xl leading-snug text-ink sm:text-4xl">{concept.theme}</p>
        )}
        <div className={concept.theme ? 'mt-8 grid gap-7 sm:grid-cols-2 xl:grid-cols-3' : 'grid gap-7 sm:grid-cols-2 xl:grid-cols-3'}>
          {groups.map((group) => (
            <KeywordList key={group.label} label={group.label} items={group.items} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Concept;
