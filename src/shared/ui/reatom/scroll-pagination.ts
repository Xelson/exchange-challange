import { atom, effect, onEvent } from '@reatom/core';

export interface ScrollPaginationArgs {
	containerRef?: HTMLElement;
	shouldStop: () => boolean;
	onLoadMore: () => void;
	threshold?: number;
	direction?: 'toTop' | 'toBottom';
}

export const reatomScrollPagination = (args: ScrollPaginationArgs, name: string) => {
	const containerRef = atom(args.containerRef ?? null, `${name}.containerRef`);
	const thresholdAtom = atom(args.threshold ?? 0.9, `${name}.threshold`);
	const directionAtom = atom(args.direction ?? 'toBottom', `${name}.direction`);

	return effect(() => {
		const container = containerRef();
		if (!container) return;

		const shouldStop = args.shouldStop();
		if (shouldStop) return;

		const threshold = thresholdAtom();
		const direction = directionAtom();

		let oldScroll = container.scrollTop;
		const flexDirMod = getComputedStyle(container).flexDirection == 'column-reverse' ? -1.0 : 1.0;

		onEvent(container, 'scroll', () => {
			const scrollTop = container.scrollTop * flexDirMod;

			if (scrollTop == oldScroll) return;

			const curDir = scrollTop > oldScroll ? 'toBottom' : 'toTop';
			oldScroll = scrollTop;

			if (curDir != direction)
				return;

			if (direction == 'toBottom') {
				if ((scrollTop + container.clientHeight) / container.scrollHeight > threshold)
					args.onLoadMore();
			}
			else if (scrollTop / container.scrollHeight < 1.0 - threshold)
				args.onLoadMore();
		});
	}, name).extend(() => ({
		containerRef,
		threshold: thresholdAtom,
		direction: directionAtom,
	}));
};
