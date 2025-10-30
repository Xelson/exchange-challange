import { defineSlotRecipe } from '@pandacss/dev';

export const textField = defineSlotRecipe({
	className: 'textField',
	slots: ['root', 'input', 'element'],
	base: {
		root: {
			display: 'flex',
			alignItems: 'center',
			position: 'relative',
			colorPalette: 'forest',
			transitionDuration: 'normal',
			transitionProperty: 'box-shadow, border-color, background-color, opacity, outline-color, color',
			transitionTimingFunction: 'default',
			border: 'default',
			outline: '2px solid transparent',
			background: 'neutral.50',
			color: 'neutral.500',
			gap: '0.5rem',
			rounded: '0.5rem',

			height: '2.5625rem',
			paddingX: '0.75rem',

			_disabled: {
				cursor: 'not-allowed',
			},
			_hover: {
				borderColor: 'colorPalette.400',
				color: 'neutral.950',
			},
			_focusWithin: {
				borderColor: 'colorPalette.400',
				outlineColor: 'colorPalette.100',
				color: 'neutral.950',
			},
		},
		input: {
			appearance: 'none',
			background: 'none',
			width: '100%',
			outline: 0,
			transition: 'inherit',
			fontSize: '0.875rem',

			_placeholder: {
				color: 'current',
			},

			_disabled: {
				cursor: 'not-allowed',
			},
		},
		element: {
			display: 'flex',
			alignItems: 'center',
			flexShrink: 0,
			gap: '0.375rem',
			transition: 'inherit',
			color: 'current',
			_icon: { boxSize: '1.125rem' },
		},
	},
});
