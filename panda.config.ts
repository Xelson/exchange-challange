import { defineConfig } from '@pandacss/dev';
import { preset } from './src/shared/ui/kit/dev';

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ['./src/**/*.{js,jsx,ts,tsx}'],
	presets: ['@pandacss/preset-panda', preset],

	jsxFramework: 'react',

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {},
	},

	// The output directory for your css system
	outdir: 'styled-system',
});
