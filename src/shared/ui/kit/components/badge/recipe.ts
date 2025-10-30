import { defineRecipe } from '@pandacss/dev';

export const badge = defineRecipe({
	className: 'badge',
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		fontWeight: 'semibold',
		userSelect: 'none',
		whiteSpace: 'nowrap',
		lineHeight: '1',
		color: 'colorPalette.700',
		background: 'colorPalette.50',

		height: '1.4375rem',
		rounded: '0.5rem',
		border: '1px solid {colors.colorPalette.200}',
		paddingX: '0.5rem',
		gap: '0.25rem',
		fontSize: '0.75rem',

		_icon: {
			boxSize: '0.75rem',
		},
	},
});
