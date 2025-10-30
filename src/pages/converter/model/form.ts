import {
	action,
	atom,
	computed,
	effect,
	getCalls,
	isCausedBy,
	noop,
	onLineAtom,
	reatomField,
	reatomForm,
	sleep,
	withCallHook,
	withComputed,
	wrap,
} from '@reatom/core';

import { currenciesList } from './currency';
import { invariant } from '@/shared/lib/assert/invariant';
import { fetchExchangeRates } from '../api/fetch-rates';
import { z } from 'zod/v4-mini';

const DEFAULT_FROM_CURRENCY_CODE = 'USD';
const DEFAULT_TO_CURRENCY_CODE = 'EUR';

const defaultFrom = currenciesList.find(currency => currency.code === DEFAULT_FROM_CURRENCY_CODE);
const defaultTo = currenciesList.find(currency => currency.code === DEFAULT_TO_CURRENCY_CODE);

invariant(defaultFrom, `Failed to initialize default currency ${DEFAULT_FROM_CURRENCY_CODE}`);
invariant(defaultTo, `Failed to initialize default currency ${DEFAULT_TO_CURRENCY_CODE}`);

export const converterForm = reatomForm(name => ({
	amount: reatomField(null, {
		name: `${name}.amount`,
		filter: value => !value || /^[0-9,.]+$/.test(value),
		toState: (value: string) => Number(value),
		fromState: value => value ? value.toString() : '',
	}),
	from: reatomField(defaultFrom, `${name}.from`),
	to: reatomField(defaultTo, `${name}.to`),
}), {
	name: 'converterForm',
	schema: z.object({
		amount: z.number().check(z.positive()),
		from: z.object({ code: z.string() }),
		to: z.object({ code: z.string() }),
	}).check(
		z.superRefine(({ to, from }, ctx) => {
			if (to.code === from.code) {
				ctx.addIssue({
					code: 'custom',
					path: ['from'],
					message: 'Currencies must be different',
				});
			};
		}),
	),
	onSubmit: async ({ from, to }, ...rest) => {
		// @ts-expect-error will come in the next commit of forms
		if (rest[0])
			await wrap(sleep(250)); // conditinal async based debounce

		const { data, error } = await wrap(fetchExchangeRates({ from: from.code, to: to.code }));
		invariant(!error, String(error));

		return data ?? undefined;
	},
}).extend(target => ({
	swapDirections: action(() => {
		const fromValue = target.fields.from();
		const toValue = target.fields.to();

		target.fields.from.set(toValue);
		target.fields.to.set(fromValue);
	}, `${target.name}.swapDirections`),
}));

effect(() => {
	const online = onLineAtom();
	if (!online) return;

	const amount = converterForm.fields.amount();
	if (!amount) return;

	const to = converterForm.fields.to();
	const from = converterForm.fields.from();
	if (to !== from)
		converterForm.submit().catch(noop);
}, `${converterForm.submit.name}.autoSubmitEffect`);

// TODO: replace with converterForm.submit.data
export const dataAtom = atom<{ from: string; to: string; rate: number } | undefined>(
	undefined,
	`${converterForm.submit.name}.data`,
).extend(
	withComputed((state) => {
		getCalls(converterForm.submit.onFulfill).forEach(({ payload }) => {
			state = payload.payload;
		});
		return state;
	}),
);
converterForm.submit.onFulfill.extend(withCallHook(() => dataAtom()));

export const conversionResult = computed(() => {
	const data = dataAtom();
	if (!data) return null;

	const amount = converterForm.fields.amount();
	if (!amount) return null;

	return data.rate * amount;
}, 'conversionResult');
