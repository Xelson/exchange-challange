import { dialogAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@pandacss/dev';

export const dialog = defineSlotRecipe({
	className: 'dialog',
	slots: dialogAnatomy.keys(),
	base: {
		backdrop: {
			background: 'black/50',
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
			alignItems: 'start',
			gap: '0.75rem',
			padding: '1rem',
			margin: '1rem',
			background: 'white',
			borderRadius: '0.5rem',
			maxW: '27.5rem',
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
			fontSize: '1rem',
			textAlign: 'start',
			fontWeight: 'semibold',
		},
		description: {
			color: 'neutral.500',
			fontSize: '0.875rem',
			fontWeight: 'medium',
			textAlign: 'start',
		},
	},
});
