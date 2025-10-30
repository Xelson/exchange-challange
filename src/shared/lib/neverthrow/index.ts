export const err = <const T>(error: T) => ({ data: null, error });
export const ok = <const T>(data: T) => ({ data, error: null });
export const uncertain = { data: null, error: null };

export type Either<Ok, Err> = { data: Ok; error: null } | { data: null; error: Err };
