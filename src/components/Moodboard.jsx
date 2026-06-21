const clothHtyImages = import.meta.glob('../../reference photo/cloth-hty/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const classicPoseImages = import.meta.glob('../../reference photo/classic pose/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function toSortedSources(modules) {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, src]) => src);
}

const imageGroups = {
  clothHty: toSortedSources(clothHtyImages),
  classicPose: toSortedSources(classicPoseImages),
  makeup: [],
};

function Moodboard({ items, onImageOpen }) {
  return (
    <section aria-labelledby="moodboard-title">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Moodboard</p>
          <h2 id="moodboard-title" className="section-title">参考图合集</h2>
        </div>
        <p className="max-w-lg text-sm leading-7 text-muted">
          参考图按用途拆分，现场可以快速对照服装、姿势和妆造方向。
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const images = imageGroups[item.type] || [];
          const cover = images[0];

          return (
            <article key={item.title} className="quiet-card p-4">
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm uppercase text-muted">{item.subtitle}</p>
                </div>
                <p className="text-sm text-muted">{images.length ? `${images.length} 张` : '待补充'}</p>
              </div>

              {cover ? (
                <button
                  type="button"
                  className="group flex aspect-[4/5] w-full cursor-zoom-in items-center justify-center rounded-lg border border-line bg-[#eef6f5] p-2 shadow-soft transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-clay/45"
                  onClick={() =>
                    onImageOpen({
                      images,
                      index: 0,
                      title: item.title,
                      alt: `${item.title} 1`,
                    })
                  }
                >
                  <img
                    src={cover}
                    alt={`${item.title} 封面`}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.015]"
                    loading="lazy"
                  />
                </button>
              ) : (
                <div className="aspect-[4/5] rounded-lg border border-dashed border-line bg-white/45 p-4">
                  <div className="flex h-full items-end border border-white/70 p-4">
                    <span className="font-serif text-5xl font-semibold text-clay/40">01</span>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Moodboard;
