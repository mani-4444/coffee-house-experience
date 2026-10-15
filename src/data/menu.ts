export type MenuItem = {
  /** Stable slug. A photo at src/assets/drinks/<id>.jpg (or .png/.webp) is picked up automatically. */
  id: string;
  name: string;
  note: string;
  price: number;
  /** Price when ordered "by two" — one pour, two cups. */
  byTwo?: number;
  signature?: boolean;
};

export type MenuSection = { id: string; title: string; items: MenuItem[] };

export const board: MenuSection[] = [
  {
    id: 'kaapi',
    title: 'Kaapi',
    items: [
      {
        id: 'kaapi-by-two',
        name: 'Kaapi, by two',
        note: 'One decoction, two tumblers, poured at your table. With chicory or without.',
        price: 120,
        signature: true,
      },
      { id: 'kaapi-for-one', name: 'Kaapi, for one', note: 'The same, unshared. We will think nothing of it.', price: 80 },
      { id: 'bellam-cortado', name: 'Bellam cortado', note: 'Espresso, steamed milk, a little cane jaggery.', price: 180 },
      { id: 'estate-pour-over', name: 'Estate pour-over', note: 'The day’s single estate, by hand. Ask what’s on.', price: 240 },
      { id: 'monsooned-malabar-cold-brew', name: 'Monsooned Malabar cold brew', note: 'Steeped eighteen hours. Low acid, long finish.', price: 220 },
      { id: 'kokum-tonic', name: 'Kokum tonic', note: 'Decoction over tonic water and kokum syrup.', price: 230 },
    ],
  },
  {
    id: 'chai',
    title: 'Chai & milk',
    items: [
      { id: 'irani-chai', name: 'Irani chai', note: 'Dum-brewed with slow-reduced milk, the old-city way.', price: 60, byTwo: 90 },
      { id: 'sulaimani', name: 'Sulaimani', note: 'Black, lemon, a little sugar. After biryani, or instead of it.', price: 50 },
      { id: 'badam-milk', name: 'Badam milk', note: 'Almond and saffron, warm or cold.', price: 90 },
    ],
  },
  {
    id: 'bakery',
    title: 'From the case',
    items: [
      { id: 'osmania-biscuits-four', name: 'Osmania biscuits, four', note: 'Salt, butter, sugar. Made for dunking.', price: 60 },
      { id: 'bun-maska', name: 'Bun maska', note: 'Soft bun, salted butter, cut thick.', price: 80 },
      { id: 'dil-khush', name: 'Dil khush', note: 'Coconut and tutti-frutti in a sweet bun. No apologies.', price: 90 },
      { id: 'lukhmi', name: 'Lukhmi', note: 'Flaky square of spiced mutton mince. Paneer on Tuesdays.', price: 110 },
    ],
  },
];

export const pourOver = {
  origin: 'Neeli Valley',
  process: 'Natural',
  altitude: '1,050 m',
  notes: 'Dried fig, cocoa nib, jaggery',
};
