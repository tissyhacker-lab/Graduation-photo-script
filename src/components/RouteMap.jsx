function getPoint(points, id) {
  return points.find((point) => point.id === id);
}

function RouteMap({ route }) {
  return (
    <section aria-labelledby="route-title">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Route Map</p>
          <h2 id="route-title" className="section-title">路线地图</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted">{route.note}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="quiet-card overflow-hidden p-4 sm:p-6">
          <div className="relative aspect-[4/3] rounded-lg border border-line bg-[#f2ede5]">
            <svg className="h-full w-full" viewBox="0 0 100 75" role="img" aria-label="拍摄点位路线示意图">
              <defs>
                <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="6" refY="3">
                  <path d="M0,0 L0,6 L7,3 z" fill="#b78d78" />
                </marker>
              </defs>
              <path d="M8 60 C 22 49, 32 56, 43 43 S 63 25, 86 17" fill="none" stroke="#ffffff" strokeWidth="10" opacity="0.5" />
              <path d="M10 18 C 26 22, 43 11, 61 20 S 82 39, 91 30" fill="none" stroke="#ffffff" strokeWidth="8" opacity="0.35" />

              {route.segments.map((segment) => {
                const from = getPoint(route.points, segment.from);
                const to = getPoint(route.points, segment.to);
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;

                return (
                  <g key={`${segment.from}-${segment.to}`}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#b78d78"
                      strokeWidth="1.2"
                      strokeDasharray="3 2"
                      markerEnd="url(#arrow)"
                    />
                    <text x={midX} y={midY - 2} textAnchor="middle" className="fill-muted text-[3px] font-semibold">
                      {segment.bikeTime}
                    </text>
                  </g>
                );
              })}

              {route.points.map((point, index) => (
                <g key={point.id}>
                  <circle cx={point.x} cy={point.y} r="4.8" fill="#fffaf3" stroke="#b78d78" strokeWidth="1" />
                  <text x={point.x} y={point.y + 1.3} textAnchor="middle" className="fill-ink text-[3px] font-bold">
                    {index + 1}
                  </text>
                  <text x={point.x} y={point.y + 8} textAnchor="middle" className="fill-ink text-[3.2px] font-semibold">
                    {point.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="quiet-card p-5 sm:p-6">
          <div className="mb-5 border-b border-line pb-4">
            <p className="metadata-label">Suggested Order</p>
            <h3 className="mt-1 font-serif text-3xl font-semibold text-ink">{route.title}</h3>
          </div>

          <ol className="space-y-4">
            {route.segments.map((segment, index) => {
              const from = getPoint(route.points, segment.from);
              const to = getPoint(route.points, segment.to);

              return (
                <li key={`${segment.from}-${segment.to}`} className="grid grid-cols-[32px_1fr] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {from.name} → {to.name}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {segment.distance} · 骑车 {segment.bikeTime}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default RouteMap;
