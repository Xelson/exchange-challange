import {
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

import { getCurrencyByCode, type Currency } from './currency';
import { invariant } from '@/shared/lib/assert/invariant';
import { z } from 'zod/v4-mini';
import { rateResource } from './rates';
import { usingRatesCache } from './rates-cache'; ;

const DEFAULT_FROM_CURRENCY_CODE = 'USD';
const DEFAULT_TO_CURRENCY_CODE = 'EUR';

const defaultFrom = getCurrencyByCode(DEFAULT_FROM_CURRENCY_CODE);
const defaultTo = getCurrencyByCode(DEFAULT_TO_CURRENCY_CODE);

invariant(defaultFrom, `Failed to initialize default currency ${DEFAULT_FROM_CURRENCY_CODE}`);
invariant(defaultTo, `Failed to initialize default currency ${DEFAULT_TO_CURRENCY_CODE}`);

const withAmountFieldPersist = <Atom extends FieldAtom>(target: Atom) => {
	return target.extend(withLocalStorage(target.name));
};

const withCurrencyFieldPersist = (target: FieldAtom<Currency>) => {
	return target.extend(withLocalStorage({
		key: target.name,
		toSnapshot: currency => currency.code,
		fromSnapshot: (raw) => {
			if (typeof raw !== 'string') return target.initState();
			return getCurrencyByCode(raw) ?? target.initState();
		},
	}));
};

export const converterForm = reatomForm(name => ({
	amount: reatomField<number | null, string>(null, {
		name: `${name}.amount`,
		filter: value => !value || /^[0-9,.]+$/.test(value),
		toState: (value: string, field) => {
			const parsed = Number(value.replace(',', '.'));
			field.value.set(value);
			return isNaN(parsed) ? field() : parsed;
		},
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
	onSubmit: async ({ from, to }) => {
		await wrap(sleep(250)); // async based debounce
		await wrap(rateResource(from.code, to.code));
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
	if (usingRatesCache()) return;

	const positiveAmount = memo(() => Number(converterForm.fields.amount()) > 0);
	if (!positiveAmount) return;

	const to = converterForm.fields.to();
	const from = converterForm.fields.from();
	if (to !== from)
		converterForm.submit().catch(noop);
}, `${converterForm.submit.name}.autoSubmitEffect`);

effect(() => {
	const to = converterForm.fields.to();
	const from = converterForm.fields.from();
	if (to && from)
		converterForm.submit.error.set(undefined);
}, `${converterForm.submit.name}.resetSubmitError`);
