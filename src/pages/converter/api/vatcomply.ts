import { z } from 'zod/v4-mini';
import { defineFetchRatesRequest } from './request';

const responseSchema = z.pipe(
	z.union([
		z.object({
			base: z.string(),
			rates: z.record(z.string(), z.number()),

			to: z.string(),
		}),
		z.object({
			query: z.record(z.string(), z.array(z.string())),
		}),
	]),
	z.transform(input => 'base' in input ? {
		data: {
			from: input.base,
			to: input.to,
			rate: input.rates[input.to],
		},
		error: null,
	} : {
		data: null,
		error: Object.values(input.query)[0][0],
	}),
);

export const fetchRatesRequest = defineFetchRatesRequest(async ({ from, to }, signal) => {
	const response = await fetch(`https://api.vatcomply.com/rates?base=${from}&symbols=${to}`, { signal });
	const data = await response.json();
	return responseSchema.parse(Object.assign(data, { to }));
});
