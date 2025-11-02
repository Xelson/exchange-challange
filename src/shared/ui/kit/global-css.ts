import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
	'html': {
		display: 'flex',
		justifyContent: 'center',
		colorPalette: 'blue',
		fontStyle: 'Inter Variable',
		color: 'neutral.950',
		minHeight: '100vh',
	},
	'body': {
		display: 'flex',
		width: 'full',
		height: 'auto',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	'*': {
		outlineColor: 'colorPalette.200',
	},
});
