import { defineRecipe } from '@pandacss/dev';

export const text = defineRecipe({
	className: 'text',
	jsx: ['Heading', 'Text'],
	base: {
		lineHeight: '1.25',
	},
	variants: {
		variant: {
			body: {
				fontWeight: 500,
			},
			heading: {
				fontWeight: 600,
			},
		},
	},
	defaultVariants: {
		variant: 'body',
	},
});
