// All contact details are fictional — replace before launch (see PROJECT.md).

/** Opening hours for one day, 24h "HH:MM", or null when closed. */
export type DayHours = { open: string; close: string } | null;

/** Indexed like Date#getDay(): 0 = Sunday … 6 = Saturday. */
export type WeekHours = [DayHours, DayHours, DayHours, DayHours, DayHours, DayHours, DayHours];

export const hours: WeekHours = [
  { open: '07:00', close: '22:00' }, // Sunday — early for the book market
  null, // Monday
  { open: '08:00', close: '22:00' },
  { open: '08:00', close: '22:00' },
  { open: '08:00', close: '22:00' },
  { open: '08:00', close: '22:00' },
  { open: '08:00', close: '22:00' },
];

export const site = {
  name: 'One by Two',
  descriptor: 'Coffee House',
  city: 'Hyderabad',
  established: 2025,
  timeZone: 'Asia/Kolkata',
  /** Kept to the city on purpose (client request); add the street when the café is real. */
  address: 'Hyderabad',
  landmark: 'Look for the brown enamel sign above the door.',
  phone: { display: '+91 40 2320 1925', href: 'tel:+914023201925' },
  whatsapp: '919849012025',
  email: 'hello@onebytwo.coffee',
  instagram: { handle: '@onebytwo.coffee', href: 'https://www.instagram.com/onebytwo.coffee/' },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=One+by+Two+Coffee+House%2C+Hyderabad',
  longTable: { min: 6, max: 10 },
} as const;
