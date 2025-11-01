import { z } from 'zod/v4-mini';
import { defineFetchRatesRequest } from './request';
import { invariant } from '@/shared/lib/assert/invariant';

const responseSchema = z.pipe(
	z.union([
		z.object({
			base: z.string(),
			rates: z.record(z.string(), z.number()),

			to: z.string(),
			from: z.string(),
		}).check(
			z.refine(response => !!response.rates[response.to], 'To currency not found in rates'),
			z.refine(response => !!response.rates[response.from], 'From currency not found in rates'),
		),
		z.object({
			query: z.record(z.string(), z.array(z.string())),
		}),
	]),
	z.transform(input => 'base' in input ? {
		data: {
			from: input.from,
			to: input.to,
			rate: input.rates[input.to] / input.rates[input.from],
			inverseRate: input.rates[input.from] / input.rates[input.to],
		},
		error: null,
	} : {
		data: null,
		error: Object.values(input.query)[0][0],
	}),
);

export const fetchRatesRequest = defineFetchRatesRequest(async ({ from, to }, signal) => {
	const response = await fetch(`https://api.vatcomply.com/rates?base=EUR&symbols=${to},${from}`, { signal });
	const data = await response.json();
	const result = responseSchema.safeParse(Object.assign(data, { to, from }));
	invariant(result.success, `${result.error?.issues[0].message}`);

	return result.data;
});
