import { dialogAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@pandacss/dev';

export const dialog = defineSlotRecipe({
	className: 'dialog',
	jsx: ['Dialog.Root'],
	slots: [...dialogAnatomy.keys(), 'footer'],
	base: {
		backdrop: {
			background: 'neutral.700/72',
			height: '100vh',
			left: '0',
			position: 'fixed',
			top: '0',
			width: '100vw',
			zIndex: 'modal',
			_open: {
				animation: 'backdrop-in',
			},
			_closed: {
				animation: 'backdrop-out',
			},
		},
		positioner: {
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			left: '0',
			overflow: 'auto',
			position: 'fixed',
			top: '0',
			width: '100vw',
			height: '100dvh',
			zIndex: 'modal',
		},
		content: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: '1.5rem',
			padding: '2rem',
			margin: '1rem',
			background: 'neutral.0',
			borderRadius: '0.5rem',
			maxW: '26.5rem',
			_focus: {
				outline: 'none',
			},
			width: 'full',
			minW: '10rem',
			position: 'relative',
			_open: {
				animation: 'dialog-in',
			},
			_closed: {
				animation: 'dialog-out',
			},
		},
		title: {
			textStyle: 'h.500',
			textAlign: 'center',
			fontWeight: 'bold',
		},
		description: {
			color: 'neutral.600',
			textStyle: 'p.300',
			fontWeight: 'semibold',
			textAlign: 'center',
		},
		footer: {
			display: 'flex',
			gap: '0.625rem',
			width: 'full',
			marginTop: '1rem',
		},
	},
	variants: {
		scrollOutside: {
			true: {
				positioner: {
					alignItems: 'start',
				},
				content: {
					marginY: '3rem',
				},
			},
		},
		variant: {
			searchResults: {
				positioner: { padding: 0 },
				backdrop: {
					background: 'neutral.0/72',
					backdropFilter: 'blur(1rem)',
				},
				content: {
					size: 'full',
					margin: 0,
					paddingY: '2.5rem',
					_open: {
						animation: 'backdrop-in',
					},
					_closed: {
						animation: 'backdrop-out',
					},
				},
			},
		},
	},
});
