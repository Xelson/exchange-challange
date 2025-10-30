import type { Plugin } from 'vite';
import { glob } from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import { pascalCase } from 'change-case';

interface AutoIconsOptions {
	include: string[];
	outputFile: string;
	extend?: {
		imports?: string[];
		componentExportExpr: (componentName: string) => string;
	};
}

export function viteAutoIcons(options: AutoIconsOptions): Plugin {
	const generateIconsFile = async () => {
		const svgFiles: string[] = [];

		for (const dir of options.include) {
			const files = await glob('./*.svg', { cwd: dir });
			svgFiles.push(...files.map(file => path.join(dir, file)));
		}

		const filenameToCmpName = (filename: string) => {
			const basename = path.basename(filename, '.svg');
			return pascalCase(basename);
		};

		const imports = svgFiles.map((file) => {
			const relativePath = path.relative(path.dirname(options.outputFile), file);
			return `import { default as _${filenameToCmpName(file)} } from './${relativePath.replace(/\\/g, '/')}?react';`;
		});

		const { extend } = options;

		if (extend?.imports)
			imports.unshift(...extend.imports, '');

		const exports = svgFiles.map((file) => {
			const cmpName = filenameToCmpName(file);
			const finalExpression = extend?.componentExportExpr
				? extend?.componentExportExpr(`_${cmpName}`)
				: `_${cmpName};`;

			return `export const ${cmpName} = ${finalExpression}`;
		});

		const content = `// This file is auto-generated. Do not edit manually
${imports.join('\n')}

${exports.join('\n')}

export * as Icons from './${path.basename(options.outputFile, '.ts')}';
`;

		fs.writeFileSync(options.outputFile, content);
	};

	const debouncedGenerate = debounce(generateIconsFile, 300);
	const absoluteIncludes = options.include.map(dir => path.resolve(dir));

	return {
		name: 'vite-plugin-auto-icons',
		async buildStart() {
			await generateIconsFile();
		},
		configureServer(server) {
			server.watcher.on('all', async (event, file) => {
				if (event === 'change')
					return;

				if (file.endsWith('.svg') && absoluteIncludes.some(dir => file.startsWith(dir))) {
					await debouncedGenerate();
				}
			});
		},
		async handleHotUpdate({ file }) {
			if (file.endsWith('.svg') && absoluteIncludes.some(dir => file.startsWith(dir))) {
				await debouncedGenerate();
			}
		},
	};
}

function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
	let timeout: NodeJS.Timeout;
	return function (...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	} as T;
}
