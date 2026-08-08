import { marketSnapshotData } from '../data/marketSnapshot.js';

export async function getMarketSnapshot() {
  // Simulate network fetch
  await new Promise(resolve => setTimeout(resolve, 50));
  return marketSnapshotData;
}
