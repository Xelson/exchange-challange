import { computed, onLineAtom, withLocalStorage } from '@reatom/core';
import { z } from 'zod/v4-mini';
import { reatomCache } from '../lib/cache';

export const usingRatesCache = computed(() => !onLineAtom(), 'usingRatesCache');

type CacheKey = { from: string; to: string };
type CacheItem = { from: string; to: string; rate: number; inverseRate: number };

const cacheSchema = z.array(
	z.tuple([
		z.string(),
		z.object({
			from: z.string(),
			to: z.string(),
			rate: z.number(),
			inverseRate: z.number(),
			exipreAt: z.number(),
			createdAt: z.number(),
		}),
	]),
);

export const ratesCache = reatomCache<CacheItem, CacheKey>({
	defaultStaleTime: 5_000 * 60,
	toKey: ({ from, to }) => `${from}-${to}`,
}, '_ratesCache').extend(
	withLocalStorage({
		key: 'ratesCache',
		toSnapshot: map => Array.from(map.entries()),
		fromSnapshot: (entries) => {
			const parsed = cacheSchema.safeParse(entries);
			if (!parsed.success) return new Map();

			return new Map(parsed.data);
		},
	}),
);
