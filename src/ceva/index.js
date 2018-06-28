import Tile from '@/entities/Tile.js';
import {createArrayOf} from '@/assets/arrays';

const createLand = (x, y) => createArrayOf(x, () => createArrayOf(y, () => new Tile()));

export {
  createLand
};
