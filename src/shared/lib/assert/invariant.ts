export function invariant(
	predicate: unknown,
	errorMsgOrErr: string | Error = 'Assertion Failed',
): asserts predicate {
	if (!predicate) {
		throw typeof errorMsgOrErr === 'string'
			? new Error(errorMsgOrErr)
			: errorMsgOrErr;
	}
}
