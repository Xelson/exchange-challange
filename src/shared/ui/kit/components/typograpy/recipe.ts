import { defineRecipe } from '@pandacss/dev';

export const text = defineRecipe({
	className: 'text',
	jsx: ['Heading', 'Text'],
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
