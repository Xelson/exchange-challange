import {
	abortVar,
	action,
	effect,
	memo,
	noop,
	reatomField,
	reatomForm,
	sleep,
	withLocalStorage,
	wrap,
	type FieldAtom,
} from '@reatom/core';

import { currenciesList, type Currency } from './currency';
import { invariant } from '@/shared/lib/assert/invariant';
import { z } from 'zod/v4-mini';
import { inverseRateResource, rateResource } from './rates';
import { useCache } from './use-cache'; ;

const DEFAULT_FROM_CURRENCY_CODE = 'USD';
const DEFAULT_TO_CURRENCY_CODE = 'EUR';

const defaultFrom = currenciesList.find(currency => currency.code === DEFAULT_FROM_CURRENCY_CODE);
const defaultTo = currenciesList.find(currency => currency.code === DEFAULT_TO_CURRENCY_CODE);

invariant(defaultFrom, `Failed to initialize default currency ${DEFAULT_FROM_CURRENCY_CODE}`);
invariant(defaultTo, `Failed to initialize default currency ${DEFAULT_TO_CURRENCY_CODE}`);

const withAmountFieldPersist = (target: FieldAtom) => {
	return target.extend(withLocalStorage(target.name));
};

const withCurrencyFieldPersist = (target: FieldAtom<Currency>) => {
	return target.extend(withLocalStorage({
		key: target.name,
		toSnapshot: currency => currency.code,
		fromSnapshot: (raw) => {
			if (typeof raw !== 'string') return target.initState();
			return currenciesList.find(currency => currency.code === raw) ?? target.initState();
		},
	}));
};

export const converterForm = reatomForm(name => ({
	amount: reatomField(null, {
		name: `${name}.amount`,
		filter: value => !value || /^[0-9,.]+$/.test(value),
		toState: (value: string) => Number(value),
		fromState: value => value ? value.toString() : '',
	}).extend(withAmountFieldPersist),
	from: reatomField(defaultFrom, `${name}.from`).extend(withCurrencyFieldPersist),
	to: reatomField(defaultTo, `${name}.to`).extend(withCurrencyFieldPersist),
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
	onSubmit: async ({ from, to }, skipDebounce?: boolean) => {
		if (skipDebounce)
			await wrap(sleep(250)); // conditinal async based debounce

		await wrap(Promise.all([
			rateResource(from.code, to.code),
			inverseRateResource(from.code, to.code),
		]));
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
	if (useCache()) return;

	const positiveAmount = memo(() => Number(converterForm.fields.amount()) > 0);
	if (!positiveAmount) return;

	const to = converterForm.fields.to();
	const from = converterForm.fields.from();
	if (to !== from)
		abortVar.spawn(() => converterForm.submit().catch(noop));
}, `${converterForm.submit.name}.autoSubmitEffect`);
