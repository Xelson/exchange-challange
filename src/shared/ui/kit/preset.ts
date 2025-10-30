import { definePreset } from '@pandacss/dev';
import { recipes, slotRecipes } from './recipes';
import { globalCss } from './global-css';
import { semanticTokens } from './semantic-tokens';

export const preset = definePreset({
	name: 'Exchange app theme',
	globalCss,
	theme: {
		recipes,
		slotRecipes,
		semanticTokens,
	},
});
