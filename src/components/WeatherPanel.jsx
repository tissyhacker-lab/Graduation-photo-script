import { useEffect, useMemo, useState } from 'react';

const weatherCodes = {
  0: '晴',
  1: '大致晴朗',
  2: '局部多云',
  3: '阴',
  45: '有雾',
  48: '雾凇',
  51: '小毛毛雨',
  53: '毛毛雨',
  55: '较强毛毛雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  80: '阵雨',
  81: '较强阵雨',
  82: '强阵雨',
  95: '雷雨',
};

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function summarizeDay(hourly, date, watchHours) {
  const indexes = hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => time.startsWith(date) && watchHours.some((hour) => time.endsWith(hour)));

  if (!indexes.length) {
    return null;
  }

  const values = indexes.map(({ index }) => ({
    temp: hourly.temperature_2m[index],
    apparent: hourly.apparent_temperature[index],
    precipitation: hourly.precipitation_probability[index],
    code: hourly.weather_code[index],
  }));

  const maxTemp = Math.round(Math.max(...values.map((item) => item.temp)));
  const maxApparent = Math.round(Math.max(...values.map((item) => item.apparent)));
  const maxRain = Math.round(Math.max(...values.map((item) => item.precipitation)));
  const mainCode = values[Math.floor(values.length / 2)]?.code;
  const label = weatherCodes[mainCode] || '天气待确认';

  let suggestion = '按原路线推进，注意补水和防晒。';

  if (maxRain >= 40) {
    suggestion = '降雨概率偏高，建议先拍东教、西教、主图等室内或半室内点位。';
  } else if (maxApparent >= 34) {
    suggestion = '体感温度偏高，建议中午先拍室内，室外点位放到下午晚些时候。';
  } else if (maxRain <= 25 && maxApparent < 33) {
    suggestion = '天气窗口较友好，可以按室内到室外的顺序逐步推进。';
  }

  return {
    date,
    label,
    maxTemp,
    maxApparent,
    maxRain,
    suggestion,
  };
}

function WeatherPanel({ plan }) {
  const [forecast, setForecast] = useState([]);
  const [status, setStatus] = useState('loading');

  const query = useMemo(() => {
    const params = new URLSearchParams({
      latitude: String(plan.latitude),
      longitude: String(plan.longitude),
      timezone: 'Asia/Shanghai',
      start_date: plan.shootDates[0],
      end_date: plan.shootDates[plan.shootDates.length - 1],
      hourly: 'temperature_2m,apparent_temperature,precipitation_probability,weather_code',
    });

    return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  }, [plan]);

  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      try {
        setStatus('loading');
        const response = await fetch(query);

        if (!response.ok) {
          throw new Error('Weather request failed');
        }

        const data = await response.json();
        const days = plan.shootDates
          .map((date) => summarizeDay(data.hourly, date, plan.watchHours))
          .filter(Boolean);

        if (!ignore) {
          setForecast(days);
          setStatus(days.length ? 'ready' : 'empty');
        }
      } catch {
        if (!ignore) {
          setStatus('error');
        }
      }
    }

    loadWeather();

    return () => {
      ignore = true;
    };
  }, [plan, query]);

  return (
    <section aria-labelledby="weather-title">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Weather Plan</p>
          <h2 id="weather-title" className="section-title">天气与顺序决策</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted">
          上午妆造、午饭后出发；根据温度和降雨，把东教、西教作为高温或雨天的起拍保险。
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="quiet-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="metadata-label">Forecast</p>
              <h3 className="mt-1 font-serif text-3xl font-semibold text-ink">{plan.location}</h3>
            </div>
            <span className="rounded-full border border-line bg-white/70 px-3 py-1 text-xs text-muted">
              {status === 'ready' ? '已读取预报' : '预报加载中'}
            </span>
          </div>

          {status === 'ready' ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {forecast.map((day) => (
                <article key={day.date} className="rounded-lg border border-line bg-white/55 p-4">
                  <p className="metadata-label">{formatDate(day.date)}</p>
                  <h4 className="mt-2 text-xl font-semibold text-ink">{day.label}</h4>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted">最高</p>
                      <p className="mt-1 font-semibold text-ink">{day.maxTemp}°C</p>
                    </div>
                    <div>
                      <p className="text-muted">体感</p>
                      <p className="mt-1 font-semibold text-ink">{day.maxApparent}°C</p>
                    </div>
                    <div>
                      <p className="text-muted">降雨</p>
                      <p className="mt-1 font-semibold text-ink">{day.maxRain}%</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">{day.suggestion}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-line bg-white/45 p-5">
              <p className="text-sm leading-7 text-muted">
                天气预报会在浏览器联网时自动读取；如果读取失败，现场按右侧规则调整拍摄顺序。
              </p>
            </div>
          )}
        </div>

        <div className="quiet-card p-5 sm:p-6">
          <p className="metadata-label">Decision Rules</p>
          <div className="mt-5 space-y-4">
            {plan.rules.map((rule) => (
              <article key={rule.label} className="border-b border-line pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-base font-semibold text-ink">{rule.label}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{rule.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeatherPanel;
