import { rankItem } from '@tanstack/match-sorter-utils';
import type { FilterFn, SortingFn } from '@tanstack/react-table';

/**
 * Fuzzy filter function for TanStack Table
 * Enables intelligent text search across columns
 */
export const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

/**
 * Fuzzy sort function for TanStack Table
 * Sorts results by match quality when filtering
 */
export const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  let dir = 0;

  const rowAMeta = rowA.columnFiltersMeta[columnId];
  const rowBMeta = rowB.columnFiltersMeta[columnId];

  if (rowAMeta && rowBMeta) {
    const rankA = (rowAMeta as { itemRank: { rank: number } }).itemRank?.rank ?? 0;
    const rankB = (rowBMeta as { itemRank: { rank: number } }).itemRank?.rank ?? 0;
    dir = rankA < rankB ? -1 : rankA > rankB ? 1 : 0;
  }

  return dir === 0 ? (rowA.original as { id?: number }).id! - (rowB.original as { id?: number }).id! : dir;
};
