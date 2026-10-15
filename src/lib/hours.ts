import type { WeekHours } from '../data/site';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const dayName = (i: number) => DAY_NAMES[i];

/** Weekday (0 = Sunday) and minutes since midnight for `now` in `timeZone`. */
export function zonedParts(now: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    day: SHORT_DAYS.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "22:00" → "10 pm", "07:30" → "7:30 am", "12:00" → "12 noon". */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (h === 12 && m === 0) return '12 noon';
  const suffix = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export type Status =
  | { open: true; text: string; closes: string }
  | { open: false; text: string; opensDay: number; opens: string };

/** Open/closed status for `now`, evaluated in the café's time zone. */
export function getStatus(now: Date, hours: WeekHours, timeZone: string): Status {
  const { day, minutes } = zonedParts(now, timeZone);
  const today = hours[day];

  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, text: `Open now · until ${formatTime(today.close)}`, closes: today.close };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { open: false, text: `Closed · opens today ${formatTime(today.open)}`, opensDay: day, opens: today.open };
  }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    const h = hours[next];
    if (h) {
      return {
        open: false,
        text: `Closed · opens ${DAY_NAMES[next]} ${formatTime(h.open)}`,
        opensDay: next,
        opens: h.open,
      };
    }
  }
  return { open: false, text: 'Closed', opensDay: -1, opens: '' };
}

/** Monday-first rows for an hours table. */
export function weekRows(hours: WeekHours) {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const h = hours[day];
    return { day, name: DAY_NAMES[day], text: h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed' };
  });
}

/** Compact summary grouping consecutive (Monday-first) days with equal hours: "Tue–Sat 8 am – 10 pm · …". */
export function summariseHours(hours: WeekHours): string {
  const rows = weekRows(hours);
  const groups: { from: number; to: number; text: string }[] = [];
  for (const row of rows) {
    const last = groups.at(-1);
    if (last && last.text === row.text) last.to = row.day;
    else groups.push({ from: row.day, to: row.day, text: row.text });
  }
  return groups
    .map((g) => {
      const days = g.from === g.to ? SHORT_DAYS[g.from] : `${SHORT_DAYS[g.from]}–${SHORT_DAYS[g.to]}`;
      return g.text === 'Closed' ? `${days} closed` : `${days} ${g.text}`;
    })
    .join(' · ');
}
