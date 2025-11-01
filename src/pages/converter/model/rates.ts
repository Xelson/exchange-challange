import { invariant } from '@/shared/lib/assert/invariant';
import { action, atom, computed, withAsyncData, withCallHook, withLocalStorage, wrap } from '@reatom/core';
import { fetchExchangeRates } from '../api/fetch-rates';
import { converterForm } from './form';
import { ratesCache, usingRatesCache } from './rates-cache';

export const rateResource = action(async (from: string, to: string) => {
	const { data, error } = await wrap(fetchExchangeRates({ from, to }));
	invariant(error === null, String(error));

	return data;
}, 'rateResource').extend(withAsyncData());

rateResource.onFulfill.extend(
	withCallHook(({ payload }) => {
		ratesCache.write(payload, payload);
		conversionResult.lastUpdatedAt.set(new Date());
	}),
);

export const conversionResult = computed(() => {
	const data = usingRatesCache()
		? ratesCache.get({ from: converterForm.fields.from().code, to: converterForm.fields.to().code })?.data
		: rateResource.data();

	return data ?? null;
}, 'conversionResult').extend(target => ({
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
	currentCacheEntryCreatedAt: computed(() => {
		const { createdAt } = ratesCache.get({
			from: converterForm.fields.from().code,
			to: converterForm.fields.to().code,
		}) ?? {};

		return createdAt ? new Date(createdAt) : null;
	}),
}));
