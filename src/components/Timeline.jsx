function Timeline({ timeline }) {
  return (
    <section aria-labelledby="timeline-title">
      <div className="mb-9">
        <p className="section-kicker">Timeline</p>
        <h2 id="timeline-title" className="section-title">拍摄流程</h2>
      </div>
      <div className="quiet-card divide-y divide-line overflow-hidden">
        {timeline.map((item) => (
          <article key={`${item.time}-${item.title}`} className="grid gap-4 p-5 sm:grid-cols-[110px_1fr] sm:p-7">
            <time className="font-serif text-3xl font-semibold text-clay">{item.time}</time>
            <div>
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Timeline;
