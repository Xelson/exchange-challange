import { invariant } from '@/shared/lib/assert/invariant';
import { action, atom, computed, withAsyncData, withCallHook, withLocalStorage, wrap } from '@reatom/core';
import { fetchExchangeRates } from '../api/fetch-rates';
import { converterForm } from './form';
import { reatomCache } from './cache';
import { useCache } from './use-cache';
import { z } from 'zod/v4-mini';

type CacheKey = { from: string; to: string };
type CacheItem = { from: string; to: string; rate: number };

const cacheSchema = z.array(
	z.tuple([
		z.string(),
		z.object({
			from: z.string(),
			to: z.string(),
			rate: z.number(),
		}),
	]),
);

const cache = reatomCache<CacheItem, CacheKey>({
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

export const rateResource = action(async (from: string, to: string) => {
	const { data, error } = await wrap(fetchExchangeRates({ from, to }));
	invariant(error === null, String(error));

	return data;
}, 'rateResource').extend(withAsyncData());

rateResource.onFulfill.extend(
	withCallHook(({ payload }) => {
		cache.write(payload, payload);
		conversionResult.lastUpdatedAt.set(new Date());
	}),
);

export const inverseRateResource = action(async (from: string, to: string) => {
	const { data, error } = await wrap(fetchExchangeRates({ from: to, to: from }));
	invariant(error === null, String(error));

	return data;
}, 'inverseRateResource').extend(withAsyncData());

inverseRateResource.onFulfill.extend(
	withCallHook(({ payload }) => cache.write(payload, payload)),
);

export const conversionResult = computed(() => {
	const data = useCache()
		? cache.get({ from: converterForm.fields.from().code, to: converterForm.fields.to().code })
		: rateResource.data();

	return data ?? null;
}, 'conversionResult').extend(target => ({
	inverse: computed(() => {
		const data = useCache()
			? cache.get({ from: converterForm.fields.to().code, to: converterForm.fields.from().code })
			: inverseRateResource.data();

		return data ?? null;
	}, `${target.name}.inverse`),
	fromAmount: computed(() => {
		const rate = target();
		if (!rate) return null;

		const amount = converterForm.fields.amount();
		if (!amount) return null;

		return amount * rate.rate;
	}, `${target.name}.fromAmount`),
	lastUpdatedAt: atom<Date | null>(null, `${target.name}.lastUpdatedAt`).extend(
		withLocalStorage({
			key: `${target.name}.lastUpdatedAt`,
			toSnapshot: value => value instanceof Date ? value.toISOString() : null,
			fromSnapshot: value => typeof value === 'string'
				? (value ? new Date(value) : null)
				: null,
		}),
	),
}));
