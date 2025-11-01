import { action, atom, named } from '@reatom/core';

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
	const toCacheEntry = (entry: CacheItem, expireAt: number, createdAt = Date.now()) => {
		return { data: entry, expireAt, createdAt };
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
			const map = target();
			const entry = map.get(toKey(key));
			if (entry) {
				if (entry.expireAt > Date.now())
					return entry;
				else
					map.delete(toKey(key));
			}
			return null;
		},
	}));
};
