const checklistTitles = {
  equipment: '设备',
  wardrobe: '服装',
  props: '道具',
  crew: '人员分工',
};

function Checklist({ checklist }) {
  return (
    <section aria-labelledby="checklist-title">
      <div className="mb-8">
        <p className="section-kicker">Checklist</p>
        <h2 id="checklist-title" className="section-title">执行清单</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(checklist).map(([key, items]) => (
          <article key={key} className="quiet-card p-5">
            <h3 className="font-serif text-2xl font-semibold text-ink">{checklistTitles[key]}</h3>
            <ul className="mt-5 space-y-3">
              {items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Checklist;
