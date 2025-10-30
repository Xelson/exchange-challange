import { z } from 'zod/v4-mini';

const envSchema = z.discriminatedUnion('VITE_EXCHANGE_RATES_PROVIDER', [
	z.object({
		VITE_EXCHANGE_RATES_PROVIDER: z.literal('fxrates'),
		VITE_FXRATES_API_KEY: z.string(),
	}),
	z.object({
		VITE_EXCHANGE_RATES_PROVIDER: z.literal('vatcomply'),
	}),
], 'VITE_EXCHANGE_RATES_PROVIDER should be either \'fxrates\' or \'vatcomply\'');

const env = envSchema.parse(import.meta.env);

export const fetchExchangeRates = env.VITE_EXCHANGE_RATES_PROVIDER === 'fxrates'
	? await import('./fxrates').then(m => m.createFetchRatesRequest(env.VITE_FXRATES_API_KEY))
	: await import('./vatcomply').then(m => m.fetchRatesRequest);
