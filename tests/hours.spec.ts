import { test, expect } from '@playwright/test';
import { hours, site } from '../src/data/site';
import { formatTime, getStatus, summariseHours, weekRows, zonedParts } from '../src/lib/hours';

const at = (iso: string) => getStatus(new Date(iso), hours, site.timeZone).text;

test.describe('open-now status (AC-2)', () => {
  test('Wednesday 10:00 IST is open until 10 pm', () => {
    expect(at('2026-10-07T10:00:00+05:30')).toBe('Open now · until 10 pm');
  });

  test('Monday noon IST is closed, opens Tuesday 8 am', () => {
    expect(at('2026-10-05T12:00:00+05:30')).toBe('Closed · opens Tuesday 8 am');
  });

  test('Sunday 07:05 IST is open (book-market hours)', () => {
    expect(at('2026-10-04T07:05:00+05:30')).toBe('Open now · until 10 pm');
  });

  test('Saturday 23:00 IST is closed, opens Sunday 7 am', () => {
    expect(at('2026-10-03T23:00:00+05:30')).toBe('Closed · opens Sunday 7 am');
  });

  test('Tuesday 07:30 IST is closed, opens today 8 am', () => {
    expect(at('2026-10-06T07:30:00+05:30')).toBe('Closed · opens today 8 am');
  });

  test('closing time is exclusive', () => {
    expect(at('2026-10-07T22:00:00+05:30')).toBe('Closed · opens Thursday 8 am');
    expect(at('2026-10-07T21:59:00+05:30')).toBe('Open now · until 10 pm');
  });

  test('evaluates in IST, not the host zone: 02:00 UTC Wednesday is 07:30 IST', () => {
    expect(at('2026-10-07T02:00:00Z')).toBe('Closed · opens today 8 am');
    expect(zonedParts(new Date('2026-10-06T19:00:00Z'), site.timeZone)).toEqual({ day: 3, minutes: 30 });
  });
});

test.describe('formatting', () => {
  test('formatTime', () => {
    expect(formatTime('22:00')).toBe('10 pm');
    expect(formatTime('07:30')).toBe('7:30 am');
    expect(formatTime('12:00')).toBe('12 noon');
    expect(formatTime('00:15')).toBe('12:15 am');
  });

  test('week rows are Monday-first with 7 entries', () => {
    const rows = weekRows(hours);
    expect(rows).toHaveLength(7);
    expect(rows[0]).toEqual({ day: 1, name: 'Monday', text: 'Closed' });
    expect(rows[6]).toEqual({ day: 0, name: 'Sunday', text: '7 am – 10 pm' });
  });

  test('summary groups consecutive equal days', () => {
    expect(summariseHours(hours)).toBe('Mon closed · Tue–Sat 8 am – 10 pm · Sun 7 am – 10 pm');
  });
});
