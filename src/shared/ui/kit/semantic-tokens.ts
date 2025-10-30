import { defineSemanticTokens } from '@pandacss/dev';

export const semanticTokens = defineSemanticTokens({
	borders: {
		default: { value: '1px solid {colors.neutral.300}' },
	},
});
