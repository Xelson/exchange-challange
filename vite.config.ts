import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteAutoIcons } from './vite/auto-icons';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		svgr(),
		viteAutoIcons({
			include: ['./src/shared/ui/kit/icons'],
			outputFile: './src/shared/ui/kit/icons/index.ts',
			extend: {
				imports: ['import { styled, type HTMLStyledProps } from "styled-system/jsx"\nexport type Props = HTMLStyledProps<"svg">;'],
				componentExportExpr: cmpName => `styled(${cmpName});`,
			},
		}),
	],
});
