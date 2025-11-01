import { z } from 'zod/v4-mini';
import { defineFetchRatesRequest } from './request';
import { invariant } from '@/shared/lib/assert/invariant';

const responseSchema = z.pipe(
	z.discriminatedUnion('success', [
		z.object({
			success: z.literal(true),
			base: z.string(),
			rates: z.record(z.string(), z.number()),

			to: z.string(),
			from: z.string(),
		}).check(
			z.refine(response => !!response.rates[response.to], 'To currency not found in rates'),
			z.refine(response => !!response.rates[response.from], 'From currency not found in rates'),
		),
		z.object({
			success: z.literal(false),
			description: z.string(),
		}),
	]),
	z.transform(input => input.success ? {
		data: {
			from: input.from,
			to: input.to,
			rate: input.rates[input.to] / input.rates[input.from],
			inverseRate: input.rates[input.from] / input.rates[input.to],
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
			`https://api.fxratesapi.com/latest?currencies=${to},${from}&base=EUR&api_key=${apiKey}`,
			{ signal },
		);
		const data = await response.json();
		const result = responseSchema.safeParse(Object.assign(data, { to, from }));
		invariant(result.success, `${result.error?.issues[0].message}`);

		return result.data;
	});
