import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function getPoint(points, id) {
  return points.find((point) => point.id === id);
}

function distanceKm(from, to) {
  const earthRadius = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function formatDistance(km) {
  return `约 ${km.toFixed(1)} km`;
}

function formatBikeTime(km) {
  const minutes = Math.max(2, Math.round((km / 10) * 60));
  return `约 ${minutes} 分钟`;
}

function buildSegments(route) {
  return route.segments.map((segment) => {
    const from = getPoint(route.points, segment.from);
    const to = getPoint(route.points, segment.to);
    const km = distanceKm(from, to);

    return {
      ...segment,
      fromPoint: from,
      toPoint: to,
      distance: segment.distance || formatDistance(km),
      bikeTime: segment.bikeTime || formatBikeTime(km),
    };
  });
}

function RouteMap({ route }) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const segments = useMemo(() => buildSegments(route), [route]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return undefined;
    }

    const center = [
      route.points.reduce((sum, point) => sum + point.lat, 0) / route.points.length,
      route.points.reduce((sum, point) => sum + point.lng, 0) / route.points.length,
    ];

    const map = L.map(mapElementRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(center, 16);

    const imageryLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      },
    ).addTo(map);

    const labelLayer = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Labels &copy; Esri',
      },
    ).addTo(map);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    });

    L.control
      .layers(
        {
          '卫星影像': imageryLayer,
          OpenStreetMap: osmLayer,
        },
        {
          '地名标注': labelLayer,
        },
        {
          collapsed: false,
          position: 'topright',
        },
      )
      .addTo(map);

    const routeLine = L.polyline(
      route.points.map((point) => [point.lat, point.lng]),
      {
        color: '#b78d78',
        weight: 4,
        opacity: 0.88,
        dashArray: '8 8',
      },
    ).addTo(map);

    route.points.forEach((point, index) => {
      const marker = L.divIcon({
        className: '',
        html: `<div class="route-marker">${index + 1}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([point.lat, point.lng], { icon: marker })
        .addTo(map)
        .bindPopup(`<strong>${point.name}</strong><br>${point.subtitle}`);
    });

    segments.forEach((segment) => {
      const lat = (segment.fromPoint.lat + segment.toPoint.lat) / 2;
      const lng = (segment.fromPoint.lng + segment.toPoint.lng) / 2;
      const label = L.divIcon({
        className: '',
        html: `<div class="route-segment-label">${segment.distance}<br>${segment.bikeTime}</div>`,
        iconSize: [86, 38],
        iconAnchor: [43, 19],
      });

      L.marker([lat, lng], { icon: label, interactive: false }).addTo(map);
    });

    map.fitBounds(routeLine.getBounds(), { padding: [28, 28] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [route, segments]);

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
          <div
            ref={mapElementRef}
            className="h-[420px] overflow-hidden rounded-lg border border-line bg-[#f2ede5] sm:h-[520px]"
            aria-label="拍摄点位 OpenStreetMap 路线地图"
          />
        </div>

        <div className="quiet-card p-5 sm:p-6">
          <div className="mb-5 border-b border-line pb-4">
            <p className="metadata-label">Suggested Order</p>
            <h3 className="mt-1 font-serif text-3xl font-semibold text-ink">{route.title}</h3>
          </div>

          <ol className="space-y-4">
            {segments.map((segment, index) => {
              return (
                <li key={`${segment.from}-${segment.to}`} className="grid grid-cols-[32px_1fr] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {segment.fromPoint.name} → {segment.toPoint.name}
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
