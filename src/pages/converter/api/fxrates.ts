import { z } from 'zod/v4-mini';
import { defineFetchRatesRequest } from './request';

const responseSchema = z.pipe(
	z.discriminatedUnion('success', [
		z.object({
			success: z.literal(true),
			base: z.string(),
			rates: z.record(z.string(), z.number()),

			to: z.string(),
		}),
		z.object({
			success: z.literal(false),
			description: z.string(),
		}),
	]),
	z.transform(input => input.success ? {
		data: {
			from: input.base,
			to: input.to,
			rate: input.rates[input.to],
		},
		error: null,
	} : {
		data: null,
		error: input.description,
	}),
);

export const createFetchRatesRequest = (apiKey: string) =>
	defineFetchRatesRequest(async ({ from, to }, signal) => {
		const response = await fetch(
			`https://api.fxratesapi.com/latest?currencies=${to}&base=${from}&api_key=${apiKey}`,
			{ signal },
		);
		const data = await response.json();
		return responseSchema.parse(Object.assign(data, { to, from }));
	});
