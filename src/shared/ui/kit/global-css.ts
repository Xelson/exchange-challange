import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
	'html': {
		colorPalette: 'blue',
		fontStyle: 'Inter Variable',
		height: 'full',
	},
	'body': {
		height: 'full',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	'*': {
		outlineColor: 'colorPalette.200',
	},
});
