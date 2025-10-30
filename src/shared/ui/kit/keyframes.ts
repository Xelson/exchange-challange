import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
	'fade-in': {
		from: { opacity: '0' },
		to: { opacity: '1' },
	},
	'fade-out': {
		from: { opacity: '1' },
		to: { opacity: '0' },
	},
	'slide-in': {
		'0%': { opacity: '0', transform: 'translateY(32px)' },
		'100%': { opacity: '1', transform: 'translateY(0)' },
	},
	'slide-out': {
		'0%': { opacity: '1', transform: 'translateY(0)' },
		'100%': { opacity: '0', transform: 'translateY(32px)' },
	},
	'collapse-in': {
		'0%': { height: '0' },
		'100%': { height: 'var(--height)' },
	},
	'collapse-out': {
		'0%': { height: 'var(--height)' },
		'100%': { height: '0' },
	},
	'skeleton-pulse': {
		'50%': { opacity: '0.5' },
	},
	'spin': {
		'0%': { transform: 'rotate(0deg)' },
		'100%': { transform: 'rotate(360deg)' },
	},
});
