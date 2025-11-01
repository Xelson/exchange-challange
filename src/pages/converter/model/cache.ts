import { action, assign, atom, named } from '@reatom/core';

type BaseCacheItem = Record<string, unknown>;

type CacheArgs<CacheItem extends BaseCacheItem, Key> = {
	defaultItems?: Record<string, CacheItem>;
	defaultStaleTime?: number;
	toKey?: (key: Key) => string;
};

export const reatomCache = <CacheItem extends BaseCacheItem, Key = string>(
	{
		defaultItems = {},
		defaultStaleTime = 5_000,
		toKey = (key: Key) => key as string,
	}: CacheArgs<CacheItem, Key> = {},
	name: string = named('cacheMap'),
) => {
	const toCacheEntry = (entry: CacheItem, expireAt: number) => {
		return { data: entry, expireAt };
	};

	return atom(
		new Map(
			Object.entries(defaultItems)
				.map(([key, value]) => [key, toCacheEntry(value, Date.now())]),
		),
		name,
	).extend(target => ({
		write: action((key: Key, item: CacheItem, staleTime = defaultStaleTime) => {
			const map = target().set(toKey(key), toCacheEntry(item, Date.now() + staleTime));
			target.set(new Map(map));
		}, `${target.name}.write`),

		get: (key: Key) => {
			const entry = target().get(toKey(key));
			if (entry && entry.expireAt > Date.now())
				return entry.data;

			return null;
		},
	}));
};
