const shotFields = [
  ['景别', 'framing'],
  ['画面描述', 'description'],
  ['人物动作', 'action'],
  ['构图', 'composition'],
  ['光线', 'light'],
  ['道具', 'props'],
  ['备注', 'note'],
];

const locationImageModules = import.meta.glob('../../Shooting location/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const locationImages = Object.entries(locationImageModules).reduce((groups, [path, src]) => {
  const [, folder] = path.match(/Shooting location\/([^/]+)\//) || [];

  if (!folder) {
    return groups;
  }

  return {
    ...groups,
    [folder]: [...(groups[folder] || []), src],
  };
}, {});

function ShotCard({ shot, onImageOpen }) {
  const images = (locationImages[shot.folder] || []).slice(0, 4);

  return (
    <article className="quiet-card flex h-full flex-col p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(45,42,38,0.12)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="metadata-label">{shot.id}</p>
          <h3 className="mt-1 font-serif text-3xl font-semibold leading-tight text-ink">{shot.place}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {shot.mood.map((item) => (
            <span key={item} className="rounded-full bg-sage/20 px-3 py-1 text-xs font-medium text-film">
              {item}
            </span>
          ))}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className="flex aspect-[4/3] cursor-zoom-in items-center justify-center rounded-md border border-line bg-[#f2ede5] p-2 transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-clay/45"
              onClick={() => onImageOpen({ src, alt: `${shot.place} 参考图 ${index + 1}` })}
            >
              <img
                src={src}
                alt={`${shot.place} 参考图 ${index + 1}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {shot.subLocations && (
        <div className="mb-5 rounded-md border border-line bg-white/55 p-4">
          <p className="mb-3 text-xs font-semibold text-clay">细分点位</p>
          <ul className="space-y-2">
            {shot.subLocations.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="grid gap-4">
        {shotFields.map(([label, key]) => (
          <div key={key} className="grid gap-1 sm:grid-cols-[86px_1fr]">
            <dt className="text-xs font-semibold text-clay">{label}</dt>
            <dd className="text-sm leading-6 text-muted">{shot[key]}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default ShotCard;
