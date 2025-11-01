import type { Either } from '@/shared/lib/neverthrow';
import { abortVar, wrap } from '@reatom/core';

type FetchExchangeRates = (params: { from: string; to: string }, signal: AbortSignal) => Promise<
	Either<{ from: string; to: string; rate: number; inverseRate: number }, string>
>;

export const defineFetchRatesRequest = (handler: FetchExchangeRates) =>
	async (params: Parameters<typeof handler>[0]) => {
		// manual subcribing to abort variable in async stack so we can cancel the reqest whenever
		// something was aborted in call stack. This should be only implemented in api client like there
		const { controller, unsubscribe } = abortVar.subscribe();

		try {
			return await wrap(handler(params, controller.signal));
		}
		finally {
			unsubscribe();
		}
	};
