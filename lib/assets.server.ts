import fs from "node:fs";
import path from "node:path";
import { assets, type AssetId, type ImageAsset, type ResolvedImage } from "./assets";

export type { ResolvedImage };

const cache = new Map<string, boolean>();

function hasLocal(localPath: string): boolean {
  const hit = cache.get(localPath);
  if (hit !== undefined) return hit;
  let exists = false;
  try {
    exists = fs.existsSync(path.join(process.cwd(), "public", localPath));
  } catch {
    exists = false;
  }
  cache.set(localPath, exists);
  return exists;
}

/** Server-only: prefer the self-hosted copy, fall back to the original URL. */
export function resolveAsset(asset: ImageAsset): ResolvedImage {
  return {
    src: hasLocal(asset.local) ? asset.local : asset.remote,
    alt: asset.alt,
    width: asset.width,
    height: asset.height,
  };
}

export function resolveId(id: AssetId): ResolvedImage {
  return resolveAsset(assets[id]);
}

export function resolveIds(ids: readonly AssetId[]): ResolvedImage[] {
  return ids.map(resolveId);
}
