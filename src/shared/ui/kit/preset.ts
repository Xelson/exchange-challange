import { definePreset } from '@pandacss/dev';
import { recipes, slotRecipes } from './recipes';
import { globalCss } from './global-css';
import { semanticTokens } from './semantic-tokens';
import { keyframes } from './keyframes';
import { animations } from './animations';
import { easings } from './easings';

export const preset = definePreset({
	name: 'Exchange app theme',
	globalCss,
	theme: {
		recipes,
		slotRecipes,
		extend: {
			semanticTokens,
			keyframes,
			tokens: {
				animations,
				easings,
			},
		},
		breakpoints: {
			tablet: '480px',
			desktop: '1024px',
		},
	},
});
