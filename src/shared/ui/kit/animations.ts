import { defineTokens } from '@pandacss/dev';

export const animations = defineTokens.animations({
	'backdrop-in': {
		value: 'fade-in 200ms {easings.emphasized-in}',
	},
	'backdrop-out': {
		value: 'fade-out 100ms {easings.emphasized-out}',
	},
	'dialog-in': {
		value: 'slide-in 200ms {easings.emphasized-in}',
	},
	'dialog-out': {
		value: 'slide-out 100ms {easings.emphasized-out}',
	},
	'skeleton-pulse': {
		value: 'skeleton-pulse 2s {easings.pulse} infinite',
	},
	'fade-in': {
		value: 'fade-in 400ms {easings.emphasized-in}',
	},
	'spin': {
		value: 'spin 1s linear infinite',
	},
});
