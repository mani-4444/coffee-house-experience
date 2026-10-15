import type { WeekHours } from '../data/site';
import { dayName, formatTime } from './hours';

export type BookingInput = { name: string; date: string; time: string; size: string; note: string };
export type BookingField = 'name' | 'date' | 'time' | 'size';
export type BookingErrors = Partial<Record<BookingField, string>>;

type Rules = { hours: WeekHours; today: string; min: number; max: number };

/** Latest start for a long-table booking, in minutes before closing. */
const LAST_SEATING_BEFORE_CLOSE = 120;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toHHMM = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

/** Weekday (0 = Sunday) of an ISO date string, independent of the host time zone. */
export function isoWeekday(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Today's date in `timeZone` as YYYY-MM-DD. */
export function isoToday(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Bookable start window for a weekday, or null when closed. */
export function seatingWindow(hours: WeekHours, day: number): { first: string; last: string } | null {
  const h = hours[day];
  if (!h) return null;
  return { first: h.open, last: toHHMM(toMinutes(h.close) - LAST_SEATING_BEFORE_CLOSE) };
}

/** Half-hour start options across the whole week, for the time picker. */
export function timeOptions(hours: WeekHours): string[] {
  const windows = hours.map((_, d) => seatingWindow(hours, d)).filter((w) => w !== null);
  const first = Math.min(...windows.map((w) => toMinutes(w.first)));
  const last = Math.max(...windows.map((w) => toMinutes(w.last)));
  const out: string[] = [];
  for (let t = first; t <= last; t += 30) out.push(toHHMM(t));
  return out;
}

export function validateBooking(input: BookingInput, { hours, today, min, max }: Rules): BookingErrors {
  const errors: BookingErrors = {};

  if (input.name.trim().length < 2) errors.name = 'Tell us whose name to put on the table.';

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(input.date);
  if (!validDate) {
    errors.date = 'Pick a date.';
  } else if (input.date < today) {
    errors.date = 'That date has already gone. Pick today or later.';
  } else if (!hours[isoWeekday(input.date)]) {
    errors.date = `We are closed on ${dayName(isoWeekday(input.date))}s. Pick another day.`;
  }

  if (!/^\d{2}:\d{2}$/.test(input.time)) {
    errors.time = 'Pick a time.';
  } else if (validDate && !errors.date) {
    const day = isoWeekday(input.date);
    const w = seatingWindow(hours, day)!;
    const t = toMinutes(input.time);
    if (t < toMinutes(w.first) || t > toMinutes(w.last)) {
      errors.time = `On ${dayName(day)}s the long table can start between ${formatTime(w.first)} and ${formatTime(w.last)}.`;
    }
  }

  const size = Number(input.size);
  if (input.size.trim() === '' || !Number.isInteger(size)) {
    errors.size = `How many of you? The long table seats ${min} to ${max}.`;
  } else if (size < min) {
    errors.size = `The long table seats ${min} to ${max}. For ${size === 1 ? 'one' : 'fewer'}, just walk in.`;
  } else if (size > max) {
    errors.size = `The long table seats ${max} at most. Message us for anything bigger.`;
  }

  return errors;
}

/** "2026-10-11" → "Sunday 11 October 2026" */
export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const month = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'long' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
  // Built from parts: ICU versions disagree on the comma after the weekday.
  return `${dayName(isoWeekday(iso))} ${d} ${month} ${y}`;
}

export function bookingMessage(input: BookingInput, cafe: string): string {
  const lines = [
    `Hello ${cafe}, I would like to request the long table.`,
    `Name: ${input.name.trim()}`,
    `Date: ${formatIsoDate(input.date)}`,
    `Time: ${formatTime(input.time)}`,
    `People: ${Number(input.size)}`,
  ];
  if (input.note.trim()) lines.push(`Note: ${input.note.trim()}`);
  return lines.join('\n');
}

export const whatsappUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
