// Client-supplied drink photography (D9). Build-time only: never import this from a client <script>.
import type { ImageMetadata } from 'astro';
import { board, type MenuItem } from './menu';

const drinkFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/drinks/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const idOf = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '');
const photoById = new Map(Object.entries(drinkFiles).map(([path, mod]) => [idOf(path), mod.default]));

export type PhotographedItem = MenuItem & { photo: ImageMetadata; section: string };

/** Menu items that have a photo, in board order. */
export const photographedItems: PhotographedItem[] = board.flatMap((section) =>
  section.items
    .filter((item) => photoById.has(item.id))
    .map((item) => ({ ...item, photo: photoById.get(item.id)!, section: section.title })),
);

/** Photo files whose name matches no menu item id: reported at build so typos are caught. */
export const orphanPhotos = [...photoById.keys()].filter((id) => !board.some((s) => s.items.some((i) => i.id === id)));
