import { useEffect, useMemo, useRef, useState } from 'react';
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

function pathDistanceKm(path) {
  return path.slice(1).reduce((total, point, index) => {
    const previous = path[index];
    return total + distanceKm({ lat: previous[0], lng: previous[1] }, { lat: point[0], lng: point[1] });
  }, 0);
}

async function fetchRoadRoute(segment) {
  if (segment.manualPath) {
    const km = pathDistanceKm(segment.manualPath);

    return {
      ...segment,
      distance: formatDistance(km),
      bikeTime: formatBikeTime(km),
      path: segment.manualPath,
      source: '按标注校内路线',
    };
  }

  const query = `${segment.fromPoint.lng},${segment.fromPoint.lat};${segment.toPoint.lng},${segment.toPoint.lat}`;
  const profiles = ['bike', 'driving'];

  for (const profile of profiles) {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${profile}/${query}?overview=full&geometries=geojson`,
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const route = data.routes?.[0];

      if (!route?.geometry?.coordinates?.length) {
        continue;
      }

      const km = route.distance / 1000;

      return {
        ...segment,
        distance: formatDistance(km),
        bikeTime: formatBikeTime(km),
        path: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        source: profile === 'bike' ? '道路骑行路线' : '道路路线估算',
      };
    } catch {
      // Try the next available routing profile.
    }
  }

  return {
    ...segment,
    source: '直线回退估算',
  };
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

function parseScheduleStart(time) {
  const match = time.match(/(\d{1,2}):(\d{2})/);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function getBeijingParts(date) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  return {
    hour: Number(parts.find((part) => part.type === 'hour')?.value || 0),
    minute: Number(parts.find((part) => part.type === 'minute')?.value || 0),
  };
}

function formatBeijingTime(date) {
  const { hour, minute } = getBeijingParts(date);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getClosestScheduleIndex(schedule, date) {
  const beijing = getBeijingParts(date);
  const currentMinutes = beijing.hour * 60 + beijing.minute;
  const indexed = schedule
    .map((item, index) => ({ index, start: parseScheduleStart(item.time) }))
    .filter((item) => item.start !== null);

  if (!indexed.length) {
    return 0;
  }

  return indexed.reduce((closest, item) => {
    const currentDistance = Math.abs(item.start - currentMinutes);
    const closestDistance = Math.abs(closest.start - currentMinutes);
    return currentDistance < closestDistance ? item : closest;
  }).index;
}

function RouteMap({ route }) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const lineLayerRef = useRef(null);
  const scheduleItemRefs = useRef([]);
  const fallbackSegments = useMemo(() => buildSegments(route), [route]);
  const [beijingNow, setBeijingNow] = useState(() => new Date());
  const closestScheduleIndex = useMemo(() => getClosestScheduleIndex(route.schedule, beijingNow), [route.schedule, beijingNow]);
  const [segments, setSegments] = useState(fallbackSegments);
  const [routeStatus, setRouteStatus] = useState('正在计算道路路线');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBeijingNow(new Date());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    scheduleItemRefs.current[closestScheduleIndex]?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  }, [closestScheduleIndex]);

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

    const lineLayer = L.layerGroup().addTo(map);
    lineLayerRef.current = lineLayer;

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

    const initialLine = L.polyline(
      route.points.map((point) => [point.lat, point.lng]),
      {
        color: '#4a9ed8',
        weight: 4,
        opacity: 0.7,
        dashArray: '8 8',
      },
    ).addTo(lineLayer);

    map.fitBounds(initialLine.getBounds(), { padding: [28, 28] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [route]);

  useEffect(() => {
    let ignore = false;

    async function loadRoadRoutes() {
      setSegments(fallbackSegments);
      setRouteStatus('正在计算道路路线');
      const resolved = await Promise.all(fallbackSegments.map((segment) => fetchRoadRoute(segment)));

      if (ignore) {
        return;
      }

      setSegments(resolved);
      const usedRoadRoutes = resolved.some((segment) => segment.path);
      setRouteStatus(usedRoadRoutes ? '已按道路路线计算' : '道路路线不可用，已回退估算');

      if (!mapRef.current || !lineLayerRef.current) {
        return;
      }

      lineLayerRef.current.clearLayers();
      const allLines = resolved.map((segment) =>
        L.polyline(segment.path || [[segment.fromPoint.lat, segment.fromPoint.lng], [segment.toPoint.lat, segment.toPoint.lng]], {
          color: segment.path ? '#4a9ed8' : '#5d7378',
          weight: 4,
          opacity: 0.88,
          dashArray: segment.path ? undefined : '8 8',
        }).addTo(lineLayerRef.current),
      );

      resolved.forEach((segment) => {
        const path = segment.path || [[segment.fromPoint.lat, segment.fromPoint.lng], [segment.toPoint.lat, segment.toPoint.lng]];
        const mid = path[Math.floor(path.length / 2)];
        const label = L.divIcon({
          className: '',
          html: `<div class="route-segment-label">${segment.distance}<br>${segment.bikeTime}</div>`,
          iconSize: [86, 38],
          iconAnchor: [43, 19],
        });

        L.marker(mid, { icon: label, interactive: false }).addTo(lineLayerRef.current);
      });

      const group = L.featureGroup(allLines);
      mapRef.current.fitBounds(group.getBounds(), { padding: [28, 28] });
    }

    loadRoadRoutes();

    return () => {
      ignore = true;
    };
  }, [fallbackSegments]);

  return (
    <section aria-labelledby="route-title">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Schedule & Route</p>
          <h2 id="route-title" className="section-title">拍摄流程与路线</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted">{route.note}</p>
      </div>

      <div className="quiet-card overflow-hidden p-4 sm:p-5">
        <div className="grid gap-5">
          <section aria-labelledby="map-title">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="metadata-label">Map</p>
                <h3 id="map-title" className="text-xl font-semibold text-ink">地图主体</h3>
              </div>
              <p className="inline-flex w-fit rounded-full border border-line bg-white/70 px-3 py-1 text-xs text-muted">
                {routeStatus}
              </p>
            </div>
            <div
              ref={mapElementRef}
              className="h-[430px] overflow-hidden rounded-lg border border-line bg-[#eef6f5] sm:h-[520px]"
              aria-label="拍摄点位 OpenStreetMap 路线地图"
            />
          </section>

          <section className="rounded-lg border border-line bg-white/58 p-4 sm:p-5" aria-labelledby="schedule-title">
            <div className="flex flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="metadata-label">Schedule</p>
                <h3 id="schedule-title" className="mt-1 text-xl font-semibold text-ink">拍摄流程</h3>
                <p className="mt-2 inline-flex rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-semibold text-muted">
                  北京时间 {formatBeijingTime(beijingNow)}
                </p>
              </div>

              <div className="max-w-3xl rounded-md border border-line bg-white/60 p-3">
                <p className="metadata-label">Planning Notes</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {route.assessment.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-5 text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ol className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1 sm:max-h-[360px]">
              {route.schedule.map((item, index) => (
                <li
                  key={`${item.time}-${item.title}`}
                  ref={(node) => {
                    scheduleItemRefs.current[index] = node;
                  }}
                  className={`rounded-md border p-3 transition ${
                    index === closestScheduleIndex
                      ? 'border-clay bg-clay/10 shadow-soft'
                      : 'border-line bg-white/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <time className="shrink-0 rounded-full bg-sage/20 px-2.5 py-1 text-xs font-semibold text-film">
                      {item.time}
                    </time>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-ink">{item.title}</h4>
                        {index === closestScheduleIndex && (
                          <span className="rounded-full bg-clay px-2 py-0.5 text-[10px] font-semibold text-white">
                            当前最接近
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}

export default RouteMap;
