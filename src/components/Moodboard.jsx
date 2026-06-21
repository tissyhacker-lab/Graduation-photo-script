const clothPoseImages = import.meta.glob('../../reference photo/cloth and pose/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const imageGroups = {
  clothPose: Object.entries(clothPoseImages)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, src]) => src),
  makeup: [],
};

function Moodboard({ items, onImageOpen }) {
  return (
    <section aria-labelledby="moodboard-title">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Moodboard</p>
          <h2 id="moodboard-title" className="section-title">参考图占位</h2>
        </div>
        <p className="max-w-lg text-sm leading-7 text-muted">
          参考图按用途拆分，现场可以快速对照服装、姿势和妆造方向。
        </p>
      </div>
      <div className="space-y-10">
        {items.map((item) => {
          const images = imageGroups[item.type] || [];

          return (
            <article key={item.title}>
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-3xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm uppercase text-muted">{item.subtitle}</p>
                </div>
                <p className="text-sm text-muted">{images.length ? `${images.length} 张` : '待补充'}</p>
              </div>

              {images.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      className="flex aspect-[4/5] cursor-zoom-in items-center justify-center rounded-lg border border-line bg-[#eef6f5] p-2 shadow-soft transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-clay/45"
                      onClick={() => onImageOpen({ src, alt: `${item.title} ${index + 1}` })}
                    >
                      <img
                        src={src}
                        alt={`${item.title} ${index + 1}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="aspect-[4/5] rounded-lg border border-dashed border-line bg-white/45 p-4"
                    >
                      <div className="flex h-full items-end border border-white/70 p-4">
                        <span className="font-serif text-5xl font-semibold text-clay/40">
                          {String(index).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ))}
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
