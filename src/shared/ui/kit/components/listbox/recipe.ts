import { listboxAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@pandacss/dev';

export const listbox = defineSlotRecipe({
	className: 'listbox',
	slots: listboxAnatomy.keys(),
	base: {
		root: {
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem',
		},
		content: {
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem',
			padding: '0.25rem',
			scrollPadding: '0.25rem',
			borderRadius: '0.75rem',
		},
		item: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: '0.75rem',
			transition: '100ms background-color',
			cursor: 'pointer',

			height: '58px',
			width: 'full',
			rounded: '0.5rem',
			padding: '0.5rem',

			_hover: {
				backgroundColor: 'neutral.50',
			},
			_checked: {
				backgroundColor: 'neutral.100',
				_hover: {
					backgroundColor: 'neutral.100',
				},
			},
			_highlighted: {
				outlineWidth: '2px',
				outlineStyle: 'solid',
				outlineColor: 'colorPalette.500',
			},
		},
		itemIndicator: {
			color: 'colorPalette.500',
			_icon: {
				boxSize: '1.125rem',
			},
		},
	},
});
