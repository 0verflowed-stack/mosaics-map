import { Buffer } from 'node:buffer'
import fs from "node:fs/promises";

import mapDataNoType from '../src/components/MapView/mapData.json';
import { MapData } from '../src/types/mapData';

const mapData = mapDataNoType as unknown as MapData;

type XYZ = { z: number; x: number; y: number };

function lonToTileX(lon: number, z: number): number {
  return Math.floor(((lon + 180) / 360) * 2 ** z);
}

function latToTileY(lat: number, z: number): number {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z);
}

export function* enumerateTiles(
  bounds: [number, number, number, number], // [minLng, minLat, maxLng, maxLat]
  minZoom: number,
  maxZoom: number
): Generator<XYZ> {
  for (let z = minZoom; z <= maxZoom; z++) {
    const x0 = lonToTileX(bounds[0], z);
    const x1 = lonToTileX(bounds[2], z);
    const y0 = latToTileY(bounds[3], z); // note: lat order flips
    const y1 = latToTileY(bounds[1], z);
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        yield { z, x, y };
      }
    }
  }
}

async function downloadAll(
  pattern: string,
  tiles: Iterable<XYZ>,
  concurrency = 6,
  outDir = "./public/tiles"
) {
  const queue = [...tiles];
  const totalItems = queue.length;
  await fs.mkdir(outDir, { recursive: true });

  async function worker() {
    while (queue.length) {
      const { z, x, y } = queue.pop()!;
      const url = pattern.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
      const res = await fetch(url);
      if (res.status === 404 || res.status === 403) continue;
      if (!res.ok) throw new Error(`${res.status} at ${url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(`${outDir}/${z}-${x}-${y}.png`, buf).then(() => {
        console.log(`${z}-${x}-${y}.png Saved`);
        console.log(`${totalItems - queue.length}/${totalItems} Done`)
    });
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

const tiles = [...enumerateTiles(mapData.mapConfig.tile_sets[0].bounds, mapData.mapConfig.tile_sets[0].min_zoom, mapData.mapConfig.tile_sets[0].max_zoom)];
console.log(`Total tiles: ${tiles.length}`);

const tileUrl = `https://tiles.mapgenie.io/games/stalker-2-heart-of-chornobyl/the-zone/jwfil-v3/{z}/{y}/{x}.jpg`;

downloadAll(tileUrl, tiles);