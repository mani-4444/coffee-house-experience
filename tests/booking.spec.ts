import { test, expect } from '@playwright/test';
import { hours, site } from '../src/data/site';
import { bookingMessage, isoToday, isoWeekday, timeOptions, validateBooking, whatsappUrl } from '../src/lib/booking';

const rules = { hours, today: '2026-10-06', min: site.longTable.min, max: site.longTable.max };
const valid = { name: 'Asha', date: '2026-10-11', time: '09:30', size: '8', note: '' };

test.describe('long-table booking (R9)', () => {
  test('a complete Sunday-morning request is valid', () => {
    expect(validateBooking(valid, rules)).toEqual({});
  });

  test('empty form reports every required field', () => {
    const e = validateBooking({ name: '', date: '', time: '', size: '', note: '' }, rules);
    expect(Object.keys(e).sort()).toEqual(['date', 'name', 'size', 'time']);
  });

  test('party size outside 6–10 is refused with a reason (AC-10)', () => {
    expect(validateBooking({ ...valid, size: '4' }, rules).size).toMatch(/6 to 10.*walk in/);
    expect(validateBooking({ ...valid, size: '12' }, rules).size).toMatch(/10 at most/);
    expect(validateBooking({ ...valid, size: '6' }, rules).size).toBeUndefined();
    expect(validateBooking({ ...valid, size: '10' }, rules).size).toBeUndefined();
  });

  test('Mondays and past dates are refused', () => {
    expect(validateBooking({ ...valid, date: '2026-10-12' }, rules).date).toMatch(/closed on Mondays/);
    expect(validateBooking({ ...valid, date: '2026-10-05' }, rules).date).toMatch(/already gone/);
  });

  test('time must fall in that day’s seating window', () => {
    expect(validateBooking({ ...valid, date: '2026-10-11', time: '07:00' }, rules).time).toBeUndefined();
    expect(validateBooking({ ...valid, date: '2026-10-13', time: '07:00' }, rules).time).toMatch(
      /Tuesdays.*8 am and 8 pm/,
    );
    expect(validateBooking({ ...valid, date: '2026-10-13', time: '20:30' }, rules).time).toBeDefined();
  });

  test('time options span the week’s seating windows in half hours', () => {
    const opts = timeOptions(hours);
    expect(opts[0]).toBe('07:00');
    expect(opts.at(-1)).toBe('20:00');
    expect(opts).toHaveLength(27);
  });

  test('date helpers are time-zone independent', () => {
    expect(isoWeekday('2026-10-11')).toBe(0);
    expect(isoToday(new Date('2026-10-06T20:00:00Z'), 'Asia/Kolkata')).toBe('2026-10-07');
  });

  test('message and wa.me URL carry the request', () => {
    const msg = bookingMessage({ ...valid, note: 'Book club' }, site.name);
    expect(msg).toContain('Name: Asha');
    expect(msg).toContain('Date: Sunday 11 October 2026');
    expect(msg).toContain('Time: 9:30 am');
    expect(msg).toContain('People: 8');
    expect(msg).toContain('Note: Book club');
    const url = new URL(whatsappUrl(site.whatsapp, msg));
    expect(url.host).toBe('wa.me');
    expect(url.searchParams.get('text')).toBe(msg);
  });
});
